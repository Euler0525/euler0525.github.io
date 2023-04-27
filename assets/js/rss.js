(function () {
    "use strict";

    var state = {
        data: null,
        activeFeed: "all",
        query: "",
        selectedArticle: null
    };

    var sourceList = document.getElementById("source-list");
    var feedCount = document.getElementById("feed-count");
    var articleList = document.getElementById("article-list");
    var articleCount = document.getElementById("article-count");
    var articleListTitle = document.getElementById("article-list-title");
    var searchInput = document.getElementById("article-search");
    var updatedAt = document.getElementById("updated-at");
    var emptyState = document.getElementById("empty-state");
    var errorState = document.getElementById("error-state");
    var readingPanel = document.getElementById("reading-panel");
    var readerPlaceholder = document.getElementById("reader-placeholder");
    var readerContent = document.getElementById("reader-content");
    var readerSource = document.getElementById("reader-source");
    var readerTitle = document.getElementById("reader-title");
    var readerMeta = document.getElementById("reader-meta");
    var readerBody = document.getElementById("reader-body");
    var readerOriginal = document.getElementById("reader-original");
    var readerClose = document.getElementById("reader-close");
    var themeToggle = document.getElementById("theme-toggle");
    var sidebarToggle = document.getElementById("sidebar-toggle");
    var sourceBackdrop = document.getElementById("source-backdrop");

    function applyTheme(theme) {
        var isLight = theme === "light";
        document.documentElement.dataset.theme = theme;
        themeToggle.innerHTML = isLight
            ? '<i class="fa fa-moon-o" aria-hidden="true"></i>'
            : '<i class="fa fa-sun-o" aria-hidden="true"></i>';
    }

    function initializeTheme() {
        var savedTheme = localStorage.getItem("theme");
        var preferredTheme = window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        applyTheme(savedTheme || preferredTheme);
    }

    function formatDate(value, includeTime) {
        if (!value) {
            return "日期未知";
        }
        var date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "日期未知";
        }
        return new Intl.DateTimeFormat("zh-CN", includeTime ? {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        } : {
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(date);
    }

    function createSourceButton(id, label, count, initial) {
        var button = document.createElement("button");
        var mark = document.createElement("span");
        var name = document.createElement("span");
        var total = document.createElement("strong");

        button.type = "button";
        button.className = "source-button";
        button.dataset.feed = id;
        if (state.activeFeed === id) {
            button.classList.add("is-active");
        }

        mark.className = "source-mark";
        mark.textContent = initial;
        name.className = "source-name";
        name.textContent = label;
        total.textContent = count;

        button.appendChild(mark);
        button.appendChild(name);
        button.appendChild(total);
        button.addEventListener("click", function () {
            state.activeFeed = id;
            closeSources();
            renderSources();
            renderArticles();
        });
        return button;
    }

    function renderSources() {
        sourceList.innerHTML = "";
        sourceList.appendChild(createSourceButton(
            "all",
            "全部文章",
            state.data.articles.length,
            "全"
        ));

        state.data.feeds.forEach(function (feed) {
            sourceList.appendChild(createSourceButton(
                feed.url,
                feed.title,
                feed.articleCount || 0,
                feed.title.trim().charAt(0).toUpperCase() || "R"
            ));
        });
    }

    function getFilteredArticles() {
        var query = state.query.trim().toLocaleLowerCase();
        return state.data.articles.filter(function (article) {
            var matchesFeed = state.activeFeed === "all" || article.feedUrl === state.activeFeed;
            var haystack = [
                article.title,
                article.feedTitle,
                article.author,
                article.summary
            ].join(" ").toLocaleLowerCase();
            return matchesFeed && (!query || haystack.indexOf(query) !== -1);
        });
    }

    function createArticleItem(article) {
        var button = document.createElement("button");
        var top = document.createElement("div");
        var source = document.createElement("span");
        var date = document.createElement("time");
        var title = document.createElement("h2");
        var summary = document.createElement("p");

        button.type = "button";
        button.className = "article-item";
        button.dataset.id = article.id;
        if (state.selectedArticle && state.selectedArticle.id === article.id) {
            button.classList.add("is-selected");
        }

        top.className = "article-item-top";
        source.textContent = article.feedTitle;
        date.dateTime = article.published || "";
        date.textContent = formatDate(article.published, true);
        top.appendChild(source);
        top.appendChild(date);

        title.textContent = article.title;
        summary.textContent = article.summary || "点击阅读文章内容";

        button.appendChild(top);
        button.appendChild(title);
        button.appendChild(summary);
        button.addEventListener("click", function () {
            selectArticle(article);
        });
        return button;
    }

    function renderArticles() {
        var articles = getFilteredArticles();
        var active = state.data.feeds.find(function (feed) {
            return feed.url === state.activeFeed;
        });

        articleListTitle.textContent = active ? active.title : "全部文章";
        articleCount.textContent = articles.length + " 篇";
        articleList.innerHTML = "";
        articleList.hidden = articles.length === 0;
        emptyState.hidden = articles.length !== 0;

        articles.forEach(function (article) {
            articleList.appendChild(createArticleItem(article));
        });
    }

    function renderArticleBody(text) {
        readerBody.innerHTML = "";
        var paragraphs = (text || "").split(/\n{2,}/).filter(function (paragraph) {
            return paragraph.trim();
        });

        if (!paragraphs.length) {
            var fallback = document.createElement("p");
            fallback.textContent = "此订阅源没有提供文章正文，请点击下方按钮前往原网站阅读。";
            readerBody.appendChild(fallback);
            return;
        }

        paragraphs.forEach(function (paragraph) {
            var element = document.createElement("p");
            element.textContent = paragraph.trim();
            readerBody.appendChild(element);
        });
    }

    function selectArticle(article) {
        state.selectedArticle = article;
        readerPlaceholder.hidden = true;
        readerContent.hidden = false;
        readerSource.textContent = article.feedTitle;
        readerTitle.textContent = article.title;
        readerMeta.textContent = [
            article.author,
            formatDate(article.published, false),
            article.readingMinutes ? article.readingMinutes + " 分钟阅读" : ""
        ].filter(Boolean).join(" · ");
        readerOriginal.href = article.url;
        renderArticleBody(article.content || article.summary);
        readingPanel.scrollTop = 0;
        readingPanel.classList.add("is-open");
        renderArticles();
    }

    function closeReader() {
        readingPanel.classList.remove("is-open");
    }

    function closeSources() {
        document.body.classList.remove("sources-open");
        if (window.matchMedia("(max-width: 820px)").matches) {
            updateSidebarButton(false);
        }
    }

    function updateSidebarButton(expanded) {
        sidebarToggle.setAttribute("aria-expanded", String(expanded));
        sidebarToggle.setAttribute(
            "aria-label",
            expanded ? "折叠订阅源侧栏" : "展开订阅源侧栏"
        );
        sidebarToggle.title = expanded ? "折叠订阅源侧栏" : "展开订阅源侧栏";
        sidebarToggle.innerHTML = expanded
            ? '<i class="fa fa-outdent" aria-hidden="true"></i>'
            : '<i class="fa fa-indent" aria-hidden="true"></i>';
    }

    function toggleSources() {
        if (window.matchMedia("(max-width: 820px)").matches) {
            var willOpen = !document.body.classList.contains("sources-open");
            document.body.classList.toggle("sources-open", willOpen);
            updateSidebarButton(willOpen);
            return;
        }

        var willExpand = document.body.classList.contains("sources-collapsed");
        document.body.classList.toggle("sources-collapsed", !willExpand);
        updateSidebarButton(willExpand);
    }

    function loadArticles() {
        fetch("./data/rss.json?t=" + Date.now(), { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("RSS data not found");
                }
                return response.json();
            })
            .then(function (data) {
                state.data = data;
                feedCount.textContent = data.feeds.length;
                updatedAt.textContent = "更新于 " + formatDate(data.generatedAt, true);
                articleList.setAttribute("aria-busy", "false");
                renderSources();
                renderArticles();
                if (data.articles.length) {
                    selectArticle(data.articles[0]);
                }
            })
            .catch(function () {
                sourceList.innerHTML = "";
                articleList.hidden = true;
                articleList.setAttribute("aria-busy", "false");
                errorState.hidden = false;
                feedCount.textContent = "0";
            });
    }

    themeToggle.addEventListener("click", function () {
        var nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", nextTheme);
        applyTheme(nextTheme);
    });

    searchInput.addEventListener("input", function (event) {
        state.query = event.target.value;
        renderArticles();
    });
    readerClose.addEventListener("click", closeReader);
    sidebarToggle.addEventListener("click", toggleSources);
    sourceBackdrop.addEventListener("click", closeSources);

    initializeTheme();
    updateSidebarButton(!window.matchMedia("(max-width: 820px)").matches);
    loadArticles();
})();
