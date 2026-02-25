document.addEventListener('submit', (e) => {
    const form = e.target;

    if (form.id === 'contact-form') {
        if (!form.checkValidity()) {
            e.preventDefault();
        } else {
            e.preventDefault();
            form.reset();
        }
    }
});