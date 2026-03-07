function previewImage(buttonElement: HTMLButtonElement): void {
    const mainPreview = document.getElementById('main-preview') as HTMLImageElement | null;

    const smallImg = buttonElement.querySelector('img') as HTMLImageElement | null;

    if (mainPreview && smallImg) {
        mainPreview.src = smallImg.src;
    }
}