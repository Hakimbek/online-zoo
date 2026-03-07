"use strict";
function previewImage(buttonElement) {
    const mainPreview = document.getElementById('main-preview');
    const smallImg = buttonElement.querySelector('img');
    if (mainPreview && smallImg) {
        mainPreview.src = smallImg.src;
    }
}
