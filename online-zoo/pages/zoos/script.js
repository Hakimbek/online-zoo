function goToPage(path) {
    window.location.href = path;
}

function initMobileMenu() {
    const burgerBtn = document.querySelector('.header__burger-btn');
    const closeBtn = document.querySelector('.header__close-btn');
    const mobileNav = document.querySelector('.header__mobile-nav');
    const activeClass = 'header__mobile-nav--active';

    if (!burgerBtn || !mobileNav) return;

    burgerBtn.addEventListener('click', () => mobileNav.classList.add(activeClass));
    closeBtn?.addEventListener('click', () => mobileNav.classList.remove(activeClass));
}

function previewImage(buttonElement) {
    const mainPreview = document.getElementById('main-preview');

    const smallImg = buttonElement.querySelector('img');

    mainPreview.src = smallImg.src;

    mainPreview.style.opacity = 0;
    setTimeout(() => {
        mainPreview.style.opacity = 1;
    }, 50);
}

initMobileMenu();