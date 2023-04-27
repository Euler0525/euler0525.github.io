document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.innerHTML = '<i class="fa fa-moon-o"></i>';
    toggleBtn.title = "Toggle Dark Mode";

    const sidebarToggleBtn = document.createElement('button');
    sidebarToggleBtn.className = 'sidebar-toggle-btn';
    sidebarToggleBtn.innerHTML = '<i class="fa fa-outdent"></i>';
    sidebarToggleBtn.title = "折叠侧边栏";
    sidebarToggleBtn.setAttribute('aria-label', '折叠侧边栏');
    sidebarToggleBtn.setAttribute('aria-expanded', 'true');

    // Find the place to insert the button
    // Trying to insert it into the user-info-menu
    const menu = document.querySelector('.user-info-menu');
    if (menu) {
        const themeLi = document.createElement('li');
        const sidebarLi = document.createElement('li');
        themeLi.appendChild(toggleBtn);
        sidebarLi.appendChild(sidebarToggleBtn);
        menu.insertBefore(themeLi, menu.firstChild);
        menu.insertBefore(sidebarLi, themeLi);
    } else {
        // Fallback if menu not found
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '20px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.zIndex = '9999';
        sidebarToggleBtn.style.position = 'fixed';
        sidebarToggleBtn.style.bottom = '20px';
        sidebarToggleBtn.style.right = '68px';
        sidebarToggleBtn.style.zIndex = '9999';
        document.body.appendChild(sidebarToggleBtn);
        document.body.appendChild(toggleBtn);
    }

    function updateSidebarButton(expanded) {
        sidebarToggleBtn.setAttribute('aria-expanded', String(expanded));
        sidebarToggleBtn.setAttribute('aria-label', expanded ? '折叠侧边栏' : '展开侧边栏');
        sidebarToggleBtn.title = expanded ? '折叠侧边栏' : '展开侧边栏';
        sidebarToggleBtn.innerHTML = expanded
            ? '<i class="fa fa-outdent"></i>'
            : '<i class="fa fa-indent"></i>';
    }

    if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
        updateSidebarButton(false);
    }

    sidebarToggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const isMobile = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const mainMenu = document.querySelector('.main-menu');

        if (isMobile && mainMenu) {
            const expanded = mainMenu.classList.toggle('mobile-is-visible');
            updateSidebarButton(expanded);
        } else if (sidebarMenu) {
            sidebarMenu.classList.toggle('collapsed');
            const expanded = !sidebarMenu.classList.contains('collapsed');
            updateSidebarButton(expanded);

            if (expanded && typeof window.ps_init === 'function') {
                window.ps_init();
            } else if (!expanded && typeof window.ps_destroy === 'function') {
                window.ps_destroy();
            }

            if (window.jQuery) {
                window.jQuery(window).trigger('xenon.resize');
            }
        }
    });

    // Check local storage and system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let isDark = true; // Default fallback

    if (savedTheme === 'light') {
        isDark = false;
    } else if (savedTheme === 'dark') {
        isDark = true;
    } else {
        // No user preference found, use system preference
        isDark = systemPrefersDark;
    }

    // Apply theme
    if (isDark) {
        document.body.classList.add('dark-mode');
        toggleBtn.innerHTML = '<i class="fa fa-sun-o"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        toggleBtn.innerHTML = '<i class="fa fa-moon-o"></i>';
    }

    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only follow system if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                    toggleBtn.innerHTML = '<i class="fa fa-sun-o"></i>';
                } else {
                    document.body.classList.remove('dark-mode');
                    toggleBtn.innerHTML = '<i class="fa fa-moon-o"></i>';
                }
            }
        });
    }

    toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            toggleBtn.innerHTML = '<i class="fa fa-sun-o"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            toggleBtn.innerHTML = '<i class="fa fa-moon-o"></i>';
        }
    });
});
