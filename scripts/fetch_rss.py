#!/usr/bin/env python3
"""Fetch RSS/Atom feeds from the site's OPML file and build static article data."""

from __future__ import annotations

import hashlib
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
OPML_PATH = ROOT / "Fluent_Reader_Export.opml"
OUTPUT_PATH = ROOT / "data" / "rss.json"
ARTICLES_PER_FEED = 30
MAX_ARTICLES = 300
MAX_CONTENT_LENGTH = 20_000
USER_AGENT = "Euler0525 RSS Reader/1.0 (+https://nav.euler0525.cn/)"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].lower()


def direct_child(element: ET.Element, *names: str) -> ET.Element | None:
    wanted = {name.lower() for name in names}
    for child in element:
        if local_name(child.tag) in wanted:
            return child
    return None


def child_text(element: ET.Element, *names: str) -> str:
    child = direct_child(element, *names)
    if child is None:
        return ""
    return "".join(child.itertext()).strip()


def raw_child_content(element: ET.Element, *names: str) -> str:
    child = direct_child(element, *names)
    if child is None:
        return ""
    if len(child):
        return ET.tostring(child, encoding="unicode", method="html")
    return child.text or ""


class TextExtractor(HTMLParser):
    BLOCK_TAGS = {
        "address", "article", "aside", "blockquote", "br", "div", "figcaption",
        "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header",
        "hr", "li", "main", "nav", "ol", "p", "pre", "section", "table",
        "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
    }
    SKIP_TAGS = {"script", "style", "noscript", "template"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in self.SKIP_TAGS:
            self.skip_depth += 1
        elif tag in self.BLOCK_TAGS and not self.skip_depth:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in self.SKIP_TAGS and self.skip_depth:
            self.skip_depth -= 1
        elif tag in self.BLOCK_TAGS and not self.skip_depth:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.parts.append(data)

    def text(self) -> str:
        value = html.unescape("".join(self.parts)).replace("\xa0", " ")
        value = re.sub(r"[ \t\r\f\v]+", " ", value)
        value = re.sub(r" *\n *", "\n", value)
        value = re.sub(r"\n{3,}", "\n\n", value)
        return value.strip()


def clean_content(value: str) -> str:
    if not value:
        return ""
    parser = TextExtractor()
    try:
        parser.feed(value)
        parser.close()
        return parser.text()
    except Exception:
        return re.sub(r"\s+", " ", value).strip()


def summarize(value: str, limit: int = 280) -> str:
    compact = re.sub(r"\s+", " ", value).strip()
    if len(compact) <= limit:
        return compact
    return compact[: limit - 1].rstrip() + "…"


def parse_date(value: str) -> str:
    if not value:
        return ""
    try:
        date = parsedate_to_datetime(value)
    except (TypeError, ValueError, OverflowError):
        try:
            date = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return ""
    if date.tzinfo is None:
        date = date.replace(tzinfo=timezone.utc)
    return date.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def atom_link(element: ET.Element) -> str:
    fallback = ""
    for child in element:
        if local_name(child.tag) != "link":
            continue
        href = (child.get("href") or "").strip()
        if not href:
            continue
        if child.get("rel", "alternate") == "alternate":
            return href
        fallback = fallback or href
    return fallback


def article_id(url: str, title: str, published: str) -> str:
    identity = url or f"{title}|{published}"
    return hashlib.sha256(identity.encode("utf-8")).hexdigest()[:16]


def reading_minutes(value: str) -> int:
    latin_words = len(re.findall(r"\b[\w'-]+\b", value))
    cjk_chars = len(re.findall(r"[\u3400-\u9fff]", value))
    return max(1, round(latin_words / 220 + cjk_chars / 450))


def parse_sitemap(root: ET.Element, feed: dict[str, str]) -> tuple[str, list[dict[str, Any]]]:
    path_filter = feed.get("pathFilter", "")
    articles: list[dict[str, Any]] = []
    site_url = ""

    for entry in root:
        if local_name(entry.tag) != "url":
            continue
        url = child_text(entry, "loc")
        if not url or (path_filter and path_filter not in urlparse(url).path):
            continue
        path = urlparse(url).path.rstrip("/")
        slug = unquote(path.rsplit("/", 1)[-1]).replace("-", " ").strip()
        if not slug:
            continue
        published = parse_date(child_text(entry, "lastmod"))
        title = slug[0].upper() + slug[1:]
        site_url = site_url or f"{urlparse(url).scheme}://{urlparse(url).netloc}"
        articles.append({
            "id": article_id(url, title, published),
            "feedTitle": feed["title"],
            "feedUrl": feed["url"],
            "category": feed.get("category", "其他"),
            "title": title,
            "url": url,
            "published": published,
            "author": feed["title"].split(" · ", 1)[0],
            "summary": f"{feed['title'].split(' · ', 1)[0]} 官方发布，点击前往原网站阅读完整内容。",
            "content": "",
            "readingMinutes": 0,
        })

    articles.sort(key=sort_key, reverse=True)
    return site_url, articles[:ARTICLES_PER_FEED]


def parse_feed(xml_bytes: bytes, feed: dict[str, str]) -> tuple[str, list[dict[str, Any]]]:
    root = ET.fromstring(xml_bytes)
    if local_name(root.tag) == "urlset":
        return parse_sitemap(root, feed)
    is_atom = local_name(root.tag) == "feed"
    channel = direct_child(root, "channel")
    container = root if is_atom or channel is None else channel
    site_url = atom_link(container) if is_atom else child_text(container, "link")
    entry_name = "entry" if is_atom else "item"
    entries = [element for element in container if local_name(element.tag) == entry_name]
    articles: list[dict[str, Any]] = []

    for entry in entries[:ARTICLES_PER_FEED]:
        title = clean_content(child_text(entry, "title")) or "未命名文章"
        url = atom_link(entry) if is_atom else child_text(entry, "link")
        published = parse_date(child_text(entry, "published", "updated", "pubdate", "date"))
        author = child_text(entry, "creator")
        if not author:
            author_node = direct_child(entry, "author")
            author = child_text(author_node, "name") if author_node is not None else ""

        summary_html = raw_child_content(entry, "summary", "description")
        content_html = raw_child_content(entry, "content", "encoded")
        summary_text = clean_content(summary_html)
        content_text = clean_content(content_html) or summary_text
        if not url:
            url = child_text(entry, "guid", "id")

        articles.append({
            "id": article_id(url, title, published),
            "feedTitle": feed["title"],
            "feedUrl": feed["url"],
            "category": feed.get("category", "其他"),
            "title": title,
            "url": url or site_url or feed["url"],
            "published": published,
            "author": author,
            "summary": summarize(summary_text or content_text),
            "content": content_text[:MAX_CONTENT_LENGTH],
            "readingMinutes": reading_minutes(content_text),
        })

    return site_url, articles


def load_subscriptions() -> list[dict[str, str]]:
    root = ET.parse(OPML_PATH).getroot()
    body = direct_child(root, "body")
    subscriptions: list[dict[str, str]] = []

    def visit(outline: ET.Element, parent_category: str = "其他") -> None:
        url = (outline.get("xmlUrl") or "").strip()
        if url:
            subscriptions.append({
                "title": outline.get("title") or outline.get("text") or "未命名订阅",
                "url": url,
                "pathFilter": outline.get("pathFilter") or "",
                "category": outline.get("category") or parent_category,
            })
            return

        category = outline.get("title") or outline.get("text") or parent_category
        for child in outline:
            if local_name(child.tag) == "outline":
                visit(child, category)

    if body is not None:
        for outline in body:
            if local_name(outline.tag) == "outline":
                visit(outline)
    return subscriptions


def load_previous_articles() -> dict[str, list[dict[str, Any]]]:
    if not OUTPUT_PATH.exists():
        return {}
    try:
        data = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    previous: dict[str, list[dict[str, Any]]] = {}
    for article in data.get("articles", []):
        previous.setdefault(article.get("feedUrl", ""), []).append(article)
    return previous


def fetch_feed(url: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/atom+xml, application/rss+xml, application/xml, text/xml, */*",
        },
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read()


def sort_key(article: dict[str, Any]) -> str:
    return article.get("published") or ""


def prune_articles(
    articles: list[dict[str, Any]],
    limit: int = MAX_ARTICLES,
) -> tuple[list[dict[str, Any]], int]:
    unique_articles: dict[str, dict[str, Any]] = {}
    for article in sorted(articles, key=sort_key, reverse=True):
        unique_articles.setdefault(article["id"], article)
    ordered_articles = list(unique_articles.values())
    return ordered_articles[:limit], max(0, len(ordered_articles) - limit)


def main() -> int:
    subscriptions = load_subscriptions()
    previous = load_previous_articles()
    feeds: list[dict[str, Any]] = []
    articles: list[dict[str, Any]] = []

    def fetch_subscription(
        subscription: dict[str, str],
    ) -> tuple[str, list[dict[str, Any]], str]:
        error = ""
        site_url = ""
        try:
            xml_bytes = fetch_feed(subscription["url"])
            site_url, feed_articles = parse_feed(xml_bytes, subscription)
        except Exception as exc:
            error = str(exc)
            feed_articles = previous.get(subscription["url"], [])
        return site_url, feed_articles, error

    results: list[tuple[str, list[dict[str, Any]], str] | None] = [
        None for _ in subscriptions
    ]
    with ThreadPoolExecutor(max_workers=min(8, len(subscriptions))) as executor:
        futures = {
            executor.submit(fetch_subscription, subscription): index
            for index, subscription in enumerate(subscriptions)
        }
        for future in as_completed(futures):
            results[futures[future]] = future.result()

    for subscription, result in zip(subscriptions, results):
        if result is None:
            continue
        site_url, feed_articles, error = result
        if error:
            print(f"Failed {subscription['title']}: {error}", file=sys.stderr)
        else:
            print(f"Fetched {subscription['title']}: {len(feed_articles)} articles")
        for article in feed_articles:
            article["category"] = subscription["category"]
        articles.extend(feed_articles)
        feeds.append({
            "title": subscription["title"],
            "url": subscription["url"],
            "category": subscription["category"],
            "siteUrl": site_url,
            "articleCount": len(feed_articles),
            "error": error,
        })

    articles, removed_count = prune_articles(articles)
    if removed_count:
        print(f"Removed {removed_count} oldest articles (limit: {MAX_ARTICLES})")
    article_counts: dict[str, int] = {}
    for article in articles:
        article_counts[article["feedUrl"]] = article_counts.get(article["feedUrl"], 0) + 1
    for feed in feeds:
        feed["articleCount"] = article_counts.get(feed["url"], 0)

    generated_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    if OUTPUT_PATH.exists():
        try:
            old_payload = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
            if old_payload.get("feeds") == feeds and old_payload.get("articles") == articles:
                generated_at = old_payload.get("generatedAt", generated_at)
        except (OSError, json.JSONDecodeError):
            pass

    payload = {
        "generatedAt": generated_at,
        "maxArticles": MAX_ARTICLES,
        "feeds": feeds,
        "articles": articles,
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8", newline="\n") as output:
        output.write(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(articles)} articles to {OUTPUT_PATH.relative_to(ROOT)}")
    return 0 if articles else 1


if __name__ == "__main__":
    raise SystemExit(main())
