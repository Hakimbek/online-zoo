const burgerBtn = document.querySelector('.header__burger-button');
const closeBtn = document.querySelector('.header__close-button');
const menu = document.querySelector('.header__menu');

burgerBtn.addEventListener('click', () => {
    console.log('click');
    menu.classList.add('header__menu--active');
});

closeBtn.addEventListener('click', () => {
    menu.classList.remove('header__menu--active');
});