interface Window {
    goToPage: (url: string) => void;
}

window.goToPage = (url: string): void => {
    window.location.href = url;
};