interface Window {
    previewImage: (buttonElement: HTMLButtonElement) => void;
}

window.previewImage = (buttonElement: HTMLButtonElement): void => {
    const mainPreview = document.getElementById('main-preview') as HTMLImageElement | null;

    const smallImg = buttonElement.querySelector('img') as HTMLImageElement | null;

    if (mainPreview && smallImg) {
        mainPreview.src = smallImg.src;
    }
}

interface IPetDetails {
    readonly id: number;
    readonly commonName: string;
    readonly scientificName: string;
    readonly type: string;
    readonly size: string;
    readonly diet: string;
    readonly habitat: string;
    readonly range: string;
    readonly latitude: string;
    readonly longitude: string;
    readonly description: string;
    readonly detailedDescription: string;
}

interface ICarouselItem {
    readonly id: string;
    readonly petId: string;
    readonly text: string;
}

interface ICarouselData {
    data: ICarouselItem[];
}

interface IPetData {
    data: IPetDetails;
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
            <div class="side-bar__card" data-id="${item.petId}">
                <img src="../../assets/icons/${item.petId}.svg" alt="${item.text}">
                <p class="side-bar-text">${item.text}</p>
            </div>
        `).join('');

        updateCarouselButtons();
        initSidebarToggle();

        const cards = container.querySelectorAll('.side-bar__card');

        cards.forEach(card => {
            const htmlCard = card as HTMLElement;
            const petId = htmlCard.dataset.id || '';

            htmlCard.addEventListener('click', () => handleCardClick(htmlCard, petId));
        });

        if (cards.length > 0) {
            const firstCard = cards[0] as HTMLElement;
            const firstPetId = firstCard.dataset.id || '';

            handleCardClick(firstCard, firstPetId);
        }
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

        const funFact = document.getElementById('animal-fun-fact') as HTMLElement;
        const animalDescription = document.getElementById('animal-description') as HTMLElement;
        const animalCharacteristics = document.getElementById('animal-characteristics') as HTMLElement;
        const gallery = document.getElementById('gallery') as HTMLElement;

        funFact.innerHTML = `<p>Something went wrong. Please, refresh the page</p>`;
        animalDescription.innerHTML = ``;
        animalCharacteristics.innerHTML = ``;
        gallery.innerHTML = ``;
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

async function handleCardClick(cardElement: HTMLElement, petId: string): Promise<void> {
    const allCards = document.querySelectorAll('.side-bar__card');
    allCards.forEach(card => card.classList.remove('side-bar__card--selected'));

    cardElement.classList.add('side-bar__card--selected');

    try {
        const response = await fetch(`https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets/${petId}`);
        if (!response.ok) throw new Error("Failed to fetch pet details");

        const petData: IPetData = await response.json();

        renderPetDetails(petData.data);
    } catch (error) {
        console.error("Error loading pet:", error);

        const funFact = document.getElementById('animal-fun-fact') as HTMLElement;
        const animalDescription = document.getElementById('animal-description') as HTMLElement;
        const animalCharacteristics = document.getElementById('animal-characteristics') as HTMLElement;
        const gallery = document.getElementById('gallery') as HTMLElement;

        funFact.innerHTML = `<p>Something went wrong. Please, refresh the page</p>`;
        animalDescription.innerHTML = ``;
        animalCharacteristics.innerHTML = ``;
        gallery.innerHTML = ``;
    }
}

function renderPetDetails(pet: IPetDetails): void {
    const funFact = document.getElementById('animal-fun-fact') as HTMLElement;
    const animalDescription = document.getElementById('animal-description') as HTMLElement;
    const animalCharacteristics = document.getElementById('animal-characteristics') as HTMLElement;
    const gallery = document.getElementById('gallery') as HTMLElement;

    gallery.innerHTML = `
        <div class="gallery__main">
            <img id="main-preview" src="../../assets/images/${pet.id}-cam-1.png" alt="Gallery main image">
        </div>
        <p class="gallery-title">MORE LIVE VIEWS</p>
        <div class="gallery__thumbs">
            <button class="thumb-btn" onclick="previewImage(this)">
                <img src="../../assets/images/${pet.id}-cam-1.png" alt="Gallery image 1">
            </button>
            <button class="thumb-btn" onclick="previewImage(this)">
                <img src="../../assets/images/${pet.id}-cam-2.png" alt="Gallery image 2">
            </button>
            <button class="thumb-btn" onclick="previewImage(this)">
                <img src="../../assets/images/${pet.id}-cam-3.png" alt="Gallery image 3">
            </button>
        </div>
        <button class="animal__gallery-button">
            DONATE NOW
            <img src="../../assets/icons/arrow-right.svg" alt="Right Arrow icon">
        </button>
    `;

    funFact.innerHTML = `
        <h2 class="animal__name">did you know?</h2>
        <p>${pet.description}</p>
    `;

    animalCharacteristics.innerHTML = `
        <img src="../../assets/images/sleeping-panda.png" alt="Sleeping panda">
        <div>
            <div>
                <p>Common name:</p>
                <p>${pet.commonName}</p>
            </div>
            <div>
                <p>Scientific name:</p>
                <p>${pet.scientificName}</p>
            </div>
            <div>
                <p>Type:</p>
                <p>${pet.type}</p>
            </div>
            <div>
                <p>Size:</p>
                <p>${pet.size}</p>
            </div>
            <div>
                <p>Diet:</p>
                <p>${pet.diet}</p>
            </div>
            <div>
                <p>Habitat:</p>
                <p>${pet.habitat}</p>
            </div>
            <div>
                <p>Range:</p>
                <p>${pet.range}</p>
                <button onclick="goToPage('../map/index.html')">VIEW MAP<span></span></button>
            </div>
        </div>
    `;

    animalDescription.innerHTML = `<p>${pet.detailedDescription}</p>`;
}