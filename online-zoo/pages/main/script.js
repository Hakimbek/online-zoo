function initMobileMenu() {
    const burgerBtn = document.querySelector('.header__burger-btn');
    const closeBtn = document.querySelector('.header__close-btn');
    const mobileNav = document.querySelector('.header__mobile-nav');
    const activeClass = 'header__mobile-nav--active';

    if (!burgerBtn || !mobileNav) return;

    const openMenu = () => mobileNav.classList.add(activeClass);
    const closeMenu = () => mobileNav.classList.remove(activeClass);

    burgerBtn.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
}

function initNavigation() {
    const mainContent = document.getElementById('main');
    const navLinks = document.querySelectorAll('[data-page]');
    const mobileNav = document.querySelector('.header__mobile-nav');

    const pages = {
        about: "../about/index.html",
        map: "../map/index.html",
        zoos: "../zoos/index.html",
        contact: "../contact/index.html"
    };

    async function loadPage(pageKey) {
        const url = pages[pageKey];

        if (!url) return;

        try {
            const response = await fetch(url);
            mainContent.innerHTML = await response.text();

            navLinks.forEach(link => {
                link.classList.toggle('header__link--active', link.dataset.page === pageKey);
            });
        } catch (err) {
            mainContent.innerHTML = "<p>Error loading content.</p>";
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage(link.dataset.page);

            mobileNav?.classList.remove('header__mobile-nav--active');
        });
    });

    loadPage('about');
}

initMobileMenu();
initNavigation();