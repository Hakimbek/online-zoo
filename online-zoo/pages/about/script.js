"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function initCarousel(cardsId, prevButton, nextButton, cardSelector) {
    const track = document.getElementById(cardsId);
    const prevBtn = document.getElementById(prevButton);
    const nextBtn = document.getElementById(nextButton);
    const items = document.querySelectorAll(cardSelector);
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    function updatePosition() {
        const step = items[0].offsetWidth + 20;
        currentTranslate = currentIndex * -step;
        prevTranslate = currentTranslate;
        if (track) {
            track.style.transition = 'transform 0.3s ease-out';
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
    }
    nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener('click', () => {
        if (currentIndex < items.length - 1)
            currentIndex++;
        updatePosition();
    });
    prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener('click', () => {
        if (currentIndex > 0)
            currentIndex--;
        updatePosition();
    });
    track === null || track === void 0 ? void 0 : track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPos = e.pageX;
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging)
            return;
        const currentPosition = e.pageX;
        const diff = currentPosition - startPos;
        const liveTranslate = prevTranslate + diff;
        if (track) {
            track.style.transform = `translateX(${liveTranslate}px)`;
        }
        currentTranslate = liveTranslate;
    });
    window.addEventListener('mouseup', () => {
        if (!isDragging)
            return;
        isDragging = false;
        if (track) {
            track.style.cursor = 'grab';
        }
        const movedBy = currentTranslate - prevTranslate;
        if (movedBy < -100 && currentIndex < items.length - 1) {
            currentIndex++;
        }
        else if (movedBy > 100 && currentIndex > 0) {
            currentIndex--;
        }
        updatePosition();
    });
}
const createCardHTML = (item, isHidden = false) => `
    <div class="pets__card ${isHidden ? 'pets__card--hidden' : ''}" onclick="goToPage('../zoos/index.html')">
        <img src="../../assets/images/koala.png" alt="${item.commonName} Image">
        <span class="pets__card-name">${item.name}</span>
        <h2 class="pets__card-title">${item.commonName}</h2>
        <p class="pets__card-text">${item.description}</p>
        <button class="pets__card-button">VIEW LIVE CAM<span></span></button>
    </div>
`;
function initInfiniteCarousel(trackId, prevId, nextId, apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        if (!track)
            return;
        const response = yield fetch(apiUrl);
        const data = yield response.json();
        const arrayOfItems = data.data;
        const wrappersData = [];
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
        const wrappers = track.querySelectorAll('.pets__card-wrapper');
        const gap = 20;
        let step = 0;
        let currentIndex = 1;
        let isTransitioning = false;
        setTimeout(() => {
            step = wrappers[0].offsetWidth + gap;
            track.style.transform = `translateX(${-step * currentIndex}px)`;
        }, 0);
        const moveToIndex = (index, animate = true) => {
            if (isTransitioning && animate)
                return;
            track.style.transition = animate ? 'transform 0.4s ease-out' : 'none';
            track.style.transform = `translateX(${-step * index}px)`;
            currentIndex = index;
            isTransitioning = animate;
        };
        nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener('click', () => moveToIndex(currentIndex + 1));
        prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener('click', () => moveToIndex(currentIndex - 1));
        track.addEventListener('transitionend', () => {
            isTransitioning = false;
            if (currentIndex === wrappers.length - 1) {
                moveToIndex(1, false);
            }
            else if (currentIndex === 0) {
                moveToIndex(wrappers.length - 2, false);
            }
        });
    });
}
initInfiniteCarousel('pets-cards', 'pets-prev-btn', 'pets-next-btn', 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets');
