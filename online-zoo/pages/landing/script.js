const mobileBurgerBtn = document.querySelector('.header__burger-btn');
const mobileCloseBtn = document.querySelector('.header__close-btn');
const mobileNav = document.querySelector('.header__mobile-nav');

mobileBurgerBtn.addEventListener('click', () => {
    mobileNav.classList.add('header__mobile-nav--active');
});

mobileCloseBtn.addEventListener('click', () => {
    mobileNav.classList.remove('header__mobile-nav--active');
});