document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.innerHTML = '<i class="fa fa-moon-o"></i>';
    toggleBtn.title = "Toggle Dark Mode";

    // Find the place to insert the button
    // Trying to insert it into the user-info-menu
    const menu = document.querySelector('.user-info-menu');
    if (menu) {
        const li = document.createElement('li');
        li.appendChild(toggleBtn);
        menu.insertBefore(li, menu.firstChild);
    } else {
        // Fallback if menu not found
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '20px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.zIndex = '9999';
        document.body.appendChild(toggleBtn);
    }

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