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
function previewImage(buttonElement) {
    const mainPreview = document.getElementById('main-preview');
    const smallImg = buttonElement.querySelector('img');
    if (mainPreview && smallImg) {
        mainPreview.src = smallImg.src;
    }
}
let verticalIndex = 0;
let totalItems = 0;
function initVerticalCarousel(containerId, apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById(containerId);
        if (!container)
            return;
        container.innerHTML = `
        <div class="status-container">
            <div class="loader"></div>
            <p style="color: white; margin-top: 10px;">Loading cameras...</p>
        </div>
    `;
        try {
            const response = yield fetch(apiUrl);
            const items = yield response.json();
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
                const htmlCard = card;
                const petId = htmlCard.dataset.id || '';
                htmlCard.addEventListener('click', () => handleCardClick(htmlCard, petId));
            });
            if (cards.length > 0) {
                const firstCard = cards[0];
                const firstPetId = firstCard.dataset.id || '';
                handleCardClick(firstCard, firstPetId);
            }
        }
        catch (error) {
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
    });
}
function moveVertical(direction, containerId) {
    const container = document.getElementById(containerId);
    if (!container || totalItems === 0)
        return;
    const firstItem = container.firstElementChild;
    const itemHeight = firstItem.offsetHeight;
    if (direction === 'down' && verticalIndex < totalItems - 1) {
        verticalIndex++;
    }
    else if (direction === 'up' && verticalIndex > 0) {
        verticalIndex--;
    }
    const offset = verticalIndex * itemHeight;
    container.style.transform = `translateY(-${offset}px)`;
    container.style.transition = "transform 0.5s ease-in-out";
    updateCarouselButtons();
}
function updateCarouselButtons() {
    const upBtn = document.getElementById('sidebar-up');
    const downBtn = document.getElementById('sidebar-down');
    if (upBtn)
        upBtn.disabled = (verticalIndex === 0);
    if (downBtn)
        downBtn.disabled = (verticalIndex >= totalItems - 1);
}
function initSidebarToggle() {
    const sidebar = document.querySelector('.side-bar');
    const sidebarText = document.querySelectorAll('.side-bar-text');
    const expandBtn = document.getElementById('sidebar-expand-btn');
    if (!sidebar || !expandBtn)
        return;
    expandBtn.addEventListener('click', () => {
        sidebar.classList.toggle('side-bar--expanded');
        expandBtn.classList.toggle('expand-btn--rotate');
        sidebarText === null || sidebarText === void 0 ? void 0 : sidebarText.forEach(item => item.classList.toggle('show-sidebar-text'));
    });
}
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b;
    initVerticalCarousel("side-bar__cards", "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/cameras");
    (_a = document.getElementById('sidebar-up')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => moveVertical('up', 'side-bar__cards'));
    (_b = document.getElementById('sidebar-down')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => moveVertical('down', 'side-bar__cards'));
});
function handleCardClick(cardElement, petId) {
    return __awaiter(this, void 0, void 0, function* () {
        const allCards = document.querySelectorAll('.side-bar__card');
        allCards.forEach(card => card.classList.remove('side-bar__card--selected'));
        cardElement.classList.add('side-bar__card--selected');
        try {
            const response = yield fetch(`https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets/${petId}`);
            if (!response.ok)
                throw new Error("Failed to fetch pet details");
            const petData = yield response.json();
            renderPetDetails(petData.data);
        }
        catch (error) {
            console.error("Error loading pet:", error);
        }
    });
}
function renderPetDetails(pet) {
    // const mainTitle = document.getElementById('main-title');
    // if (mainTitle) mainTitle.textContent = pet.commonName;
}
