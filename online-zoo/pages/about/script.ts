interface ICarouselItem {
    readonly id: number;
    readonly name: string;
    readonly commonName: string;
    readonly description: string;
}

type CarouselData = {
    data: Array<ICarouselItem>;
};

const createCardHTML = (item: ICarouselItem, isHidden: boolean = false): string => `
    <div class="pets__card ${isHidden ? 'pets__card--hidden' : ''}" onclick="goToPage('../zoos/index.html')">
        <img src="../../assets/images/koala.png" alt="${item.commonName} Image">
        <span class="pets__card-name">${item.name}</span>
        <h2 class="pets__card-title">${item.commonName}</h2>
        <p class="pets__card-text">${item.description}</p>
        <button class="pets__card-button">VIEW LIVE CAM<span></span></button>
    </div>
`;

async function initInfiniteCarousel(
    trackId: string,
    prevId: string,
    nextId: string,
    apiUrl: string
): Promise<void> {
    const track = document.getElementById(trackId) as HTMLDivElement | null;
    const prevBtn = document.getElementById(prevId) as HTMLButtonElement | null;
    const nextBtn = document.getElementById(nextId) as HTMLButtonElement | null;
    const loader = document.getElementById('pets-loader');

    if (!track) return;

    let arrayOfItems: ICarouselItem[];

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error();

        const data: CarouselData = await response.json();
        arrayOfItems = data.data;
    } catch {
        if (loader) {
            loader.textContent = 'Something went wrong. Please, refresh the page!';
            loader.classList.add('pets__loader--error');
        }
        return;
    }

    loader?.classList.add('pets__loader--hidden');

    const wrappersData: ICarouselItem[][] = [];

    for (let i = 0; i < arrayOfItems.length; i += 2) {
        wrappersData.push(arrayOfItems.slice(i, i + 2));
    }

    const lastWrapper = wrappersData[wrappersData.length - 1];
    const firstWrapper = wrappersData[0];
    const combinedWrappers = [lastWrapper, ...wrappersData, firstWrapper];

    track.innerHTML = combinedWrappers.map(wrapper => `
        <div class="pets__card-wrapper">
            ${createCardHTML(wrapper[0])}
            ${wrapper[1] ? createCardHTML(wrapper[1], true) : ''}
        </div>
    `).join('');

    const wrappers = track.querySelectorAll('.pets__card-wrapper') as NodeListOf<HTMLElement>;
    let step = 0;
    let currentIndex = 1;
    let isTransitioning = false;

    setTimeout(() => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        step = wrappers[0].offsetWidth + gap;
        track.style.transform = `translateX(${-step * currentIndex}px)`;
    }, 0);

    const moveToIndex = (index: number, animate: boolean = true): void => {
        if (isTransitioning && animate) return;

        track.style.transition = animate ? 'transform 0.4s ease-out' : 'none';
        track.style.transform = `translateX(${-step * index}px)`;
        currentIndex = index;
        isTransitioning = animate;
    };

    nextBtn?.addEventListener('click', (): void => moveToIndex(currentIndex + 1));
    prevBtn?.addEventListener('click', (): void => moveToIndex(currentIndex - 1));

    track.addEventListener('transitionend', (): void => {
        isTransitioning = false;
        if (currentIndex === wrappers.length - 1) {
            moveToIndex(1, false);
        } else if (currentIndex === 0) {
            moveToIndex(wrappers.length - 2, false);
        }
    });
}

initInfiniteCarousel('pets-cards', 'pets-prev-btn', 'pets-next-btn', 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets');