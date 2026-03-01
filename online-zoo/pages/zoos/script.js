function goToPage(path) {
    window.location.href = path;
}

function previewImage(buttonElement) {
    const mainPreview = document.getElementById('main-preview');

    const smallImg = buttonElement.querySelector('img');

    mainPreview.src = smallImg.src;

    mainPreview.style.opacity = 0;
    setTimeout(() => {
        mainPreview.style.opacity = 1;
    }, 50);
}