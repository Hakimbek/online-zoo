"use strict";
function initMobileMenu() {
    const burgerBtn = document.querySelector('.header__burger-btn');
    const closeBtn = document.querySelector('.header__close-btn');
    const mobileNav = document.querySelector('.header__mobile-nav');
    const activeClass = 'header__mobile-nav--active';
    if (!burgerBtn || !mobileNav)
        return;
    const openMenu = () => mobileNav.classList.add(activeClass);
    const closeMenu = () => mobileNav.classList.remove(activeClass);
    burgerBtn.addEventListener('click', openMenu);
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', closeMenu);
}
initMobileMenu();
