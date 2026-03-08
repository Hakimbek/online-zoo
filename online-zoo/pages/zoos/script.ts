function previewImage(buttonElement: HTMLButtonElement): void {
    const mainPreview = document.getElementById('main-preview') as HTMLImageElement | null;

    const smallImg = buttonElement.querySelector('img') as HTMLImageElement | null;

    if (mainPreview && smallImg) {
        mainPreview.src = smallImg.src;
    }
}

interface ICarouselItem {
    readonly id: string;
    readonly petId: string;
    readonly text: string;
}

interface ICarouselData {
    data: ICarouselItem[];
}

let verticalIndex: number = 0;
let totalItems: number = 0;

async function initVerticalCarousel(containerId: string, apiUrl: string): Promise<void> {
    const container = document.getElementById(containerId) as HTMLDivElement | null;

    if (!container) return;

    container.innerHTML = `
        <div class="status-container">
            <div class="loader"></div>
            <p style="color: white; margin-top: 10px;">Loading cameras...</p>
        </div>
    `;

    try {
        const response = await fetch(apiUrl);
        const items: ICarouselData = await response.json();
        const data = items.data;
        totalItems = data.length;

        container.innerHTML = data.map(item => `
            <div class="side-bar__card">
                <img src="../../assets/icons/${item.petId}.svg" alt="${item.text}">
                <p class="side-bar-text">${item.text}</p>
            </div>
        `).join('');

        updateCarouselButtons();
        initSidebarToggle();
    } catch (error) {
        console.error("Carousel fetch failed:", error);
        container.innerHTML = `
            <div class="status-container">
                <div class="error-notice">
                    Something went wrong. <br> 
                    <strong>Please, refresh the page</strong>
                </div>
            </div>
        `;
    }
}

function moveVertical(direction: 'up' | 'down', containerId: string): void {
    const container = document.getElementById(containerId);

    if (!container || totalItems === 0) return;

    const firstItem = container.firstElementChild as HTMLElement;
    const itemHeight = firstItem.offsetHeight;

    if (direction === 'down' && verticalIndex < totalItems - 1) {
        verticalIndex++;
    } else if (direction === 'up' && verticalIndex > 0) {
        verticalIndex--;
    }

    const offset = verticalIndex * itemHeight;
    container.style.transform = `translateY(-${offset}px)`;
    container.style.transition = "transform 0.5s ease-in-out";

    updateCarouselButtons();
}

function updateCarouselButtons(): void {
    const upBtn = document.getElementById('sidebar-up') as HTMLButtonElement | null;
    const downBtn = document.getElementById('sidebar-down') as HTMLButtonElement | null;

    if (upBtn) upBtn.disabled = (verticalIndex === 0);
    if (downBtn) downBtn.disabled = (verticalIndex >= totalItems - 1);
}

function initSidebarToggle(): void {
    const sidebar = document.querySelector('.side-bar') as HTMLElement | null;
    const sidebarText = document.querySelectorAll('.side-bar-text') as NodeListOf<HTMLParagraphElement>;
    const expandBtn = document.getElementById('sidebar-expand-btn') as HTMLButtonElement | null;

    if (!sidebar || !expandBtn) return;

    expandBtn.addEventListener('click', (): void => {
        sidebar.classList.toggle('side-bar--expanded');
        expandBtn.classList.toggle('expand-btn--rotate');
        sidebarText?.forEach(item => item.classList.toggle('show-sidebar-text'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initVerticalCarousel("side-bar__cards", "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/cameras");

    document.getElementById('sidebar-up')?.addEventListener('click', () =>
        moveVertical('up', 'side-bar__cards')
    );

    document.getElementById('sidebar-down')?.addEventListener('click', () =>
        moveVertical('down', 'side-bar__cards')
    );
});