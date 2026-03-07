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
const PETS_API_URL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets';
const createPetsCardHTML = (item, isHidden = false) => `
    <div class="pets__card ${isHidden ? 'pets__card--hidden' : ''}" onclick="goToPage('../zoos/index.html')">
        <img src="../../assets/images/koala.png" alt="${item.commonName} Image">
        <span class="pets__card-name">${item.name}</span>
        <h2 class="pets__card-title">${item.commonName}</h2>
        <p class="pets__card-text">${item.description}</p>
        <button class="pets__card-button">VIEW LIVE CAM<span></span></button>
    </div>
`;
function initInfinitePetsCarousel(trackId, prevId, nextId, apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const loader = document.getElementById('pets-loader');
        if (!track)
            return;
        let arrayOfItems;
        try {
            const response = yield fetch(apiUrl);
            if (!response.ok)
                throw new Error();
            const data = yield response.json();
            arrayOfItems = data.data;
        }
        catch (_a) {
            if (loader) {
                loader.textContent = 'Something went wrong. Please, refresh the page!';
                loader.classList.add('pets__loader--error');
            }
            return;
        }
        loader === null || loader === void 0 ? void 0 : loader.classList.add('pets__loader--hidden');
        const wrappersData = [];
        for (let i = 0; i < arrayOfItems.length; i += 2) {
            wrappersData.push(arrayOfItems.slice(i, i + 2));
        }
        const lastWrapper = wrappersData[wrappersData.length - 1];
        const firstWrapper = wrappersData[0];
        const combinedWrappers = [lastWrapper, ...wrappersData, firstWrapper];
        track.innerHTML = combinedWrappers.map(wrapper => `
        <div class="pets__card-wrapper">
            ${createPetsCardHTML(wrapper[0])}
            ${wrapper[1] ? createPetsCardHTML(wrapper[1], true) : ''}
        </div>
    `).join('');
        const wrappers = track.querySelectorAll('.pets__card-wrapper');
        let step = 0;
        let currentIndex = 1;
        let isTransitioning = false;
        setTimeout(() => {
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
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
initInfinitePetsCarousel('pets-cards', 'pets-prev-btn', 'pets-next-btn', PETS_API_URL);
