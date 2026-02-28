const track = document.getElementById('pets-cards');
const prevBtn = document.getElementById('pets-prev-btn');
const nextBtn = document.getElementById('pets-next-btn');
const items = document.querySelectorAll('.pets__card');

let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function updatePosition() {
    const step = items[0].offsetWidth + 20;
    currentTranslate = currentIndex * -step;
    prevTranslate = currentTranslate;
    track.style.transition = 'transform 0.3s ease-out';
    track.style.transform = `translateX(${currentTranslate}px)`;
}

nextBtn.addEventListener('click', () => {
    if (currentIndex < items.length - 1) currentIndex++;
    updatePosition();
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex--;
    updatePosition();
});

track?.addEventListener('mousedown', (e) => {
    isDragging = true;
    startPos = e.pageX;
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.pageX;
    const diff = currentPosition - startPos;
    const liveTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${liveTranslate}px)`;
    currentTranslate = liveTranslate;
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';

    const movedBy = currentTranslate - prevTranslate;


    if (movedBy < -100 && currentIndex < items.length - 1) {
        currentIndex++;
    } else if (movedBy > 100 && currentIndex > 0) {
        currentIndex--;
    }

    updatePosition();
});

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

initMobileMenu();