function initMobileMenu(): void {
    const burgerBtn = document.querySelector('.header__burger-btn');
    const closeBtn = document.querySelector('.header__close-btn');
    const mobileNav = document.querySelector('.header__mobile-nav');
    const activeClass = 'header__mobile-nav--active';

    if (!burgerBtn || !mobileNav) return;

    const openMenu = (): void => mobileNav.classList.add(activeClass);
    const closeMenu = (): void => mobileNav.classList.remove(activeClass);

    burgerBtn.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
}

initMobileMenu();