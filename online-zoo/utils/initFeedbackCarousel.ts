const FEEDBACK_API_URL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback';

interface IFeedbackItem {
    readonly id: number;
    readonly city: string;
    readonly month: string;
    readonly year: string;
    readonly text: string;
    readonly name: string;
}

type FeedbackCarouselData = {
    data: Array<IFeedbackItem>;
};

const createFeedbackCardHTML = (item: IFeedbackItem): string => `
    <div class="thoughts__card">
        <div>
            <img class="thoughts__quote" src="../../assets/icons/quote.svg" alt="Quote Icon">
            <h3 class="thoughts__card-title">${item.city}, ${item.month} ${item.year}</h3>
        </div>
        <p class="thoughts__card-text">${item.text}</p>
        <p class="thoughts__card-author">${item.name}</p>
    </div>
`;

async function initInfiniteFeedbackCarousel(
    trackId: string,
    prevId: string,
    nextId: string,
    apiUrl: string,
): Promise<void> {
    const track = document.getElementById(trackId) as HTMLDivElement | null;
    const prevBtn = document.getElementById(prevId) as HTMLButtonElement | null;
    const nextBtn = document.getElementById(nextId) as HTMLButtonElement | null;
    const loader = document.getElementById('thoughts-loader');

    if (!track) return;

    let arrayOfItems: IFeedbackItem[];

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error();

        const data: FeedbackCarouselData = await response.json();
        arrayOfItems = data.data;
    } catch {
        if (loader) {
            loader.textContent = 'Something went wrong. Please, refresh the page!';
            loader.classList.add('thoughts__loader--error');
        }
        return;
    }

    loader?.classList.add('thoughts__loader--hidden');

    const wrappersData: IFeedbackItem[][] = [];

    for (let i = 0; i < arrayOfItems.length; i += 2) {
        wrappersData.push(arrayOfItems.slice(i, i + 2));
    }

    const lastWrapper = wrappersData[wrappersData.length - 1];
    const firstWrapper = wrappersData[0];
    const combinedWrappers = [lastWrapper, ...wrappersData, firstWrapper];

    track.innerHTML = combinedWrappers.map(wrapper => `
        <div class="thoughts__card-wrapper">
            ${createFeedbackCardHTML(wrapper[0])}
            ${createFeedbackCardHTML(wrapper[1])}
        </div>
    `).join('');

    const wrappers = track.querySelectorAll('.thoughts__card-wrapper') as NodeListOf<HTMLElement>;
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

initInfiniteFeedbackCarousel('thoughts-cards', 'thoughts-prev-btn', 'thoughts-next-btn', FEEDBACK_API_URL);