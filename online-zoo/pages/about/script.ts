function initCarousel(cardsId: string, prevButton: string, nextButton: string, cardSelector: string): void {
    const track = document.getElementById(cardsId);
    const prevBtn = document.getElementById(prevButton);
    const nextBtn = document.getElementById(nextButton);
    const items: NodeListOf<HTMLElement> = document.querySelectorAll(cardSelector);

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function updatePosition(): void {
        const step = items[0].offsetWidth + 20;
        currentTranslate = currentIndex * -step;
        prevTranslate = currentTranslate;

        if (track) {
            track.style.transition = 'transform 0.3s ease-out';
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
    }

    nextBtn?.addEventListener('click', () => {
        if (currentIndex < items.length - 1) currentIndex++;
        updatePosition();
    });

    prevBtn?.addEventListener('click', () => {
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

        if (track) {
            track.style.transform = `translateX(${liveTranslate}px)`;
        }

        currentTranslate = liveTranslate;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;

        if (track) {
            track.style.cursor = 'grab';
        }

        const movedBy = currentTranslate - prevTranslate;


        if (movedBy < -100 && currentIndex < items.length - 1) {
            currentIndex++;
        } else if (movedBy > 100 && currentIndex > 0) {
            currentIndex--;
        }

        updatePosition();
    });
}

initCarousel('pets-cards', 'pets-prev-btn', 'pets-next-btn', '.pets__card');
initCarousel('thoughts-cards', 'thoughts-prev-btn', 'thoughts-next-btn', '.thoughts__card');