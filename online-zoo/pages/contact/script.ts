function handleSubmit(): void {
    document.addEventListener('submit', (e) => {
        const form = e.target as HTMLFormElement | null;

        if (form?.id === 'contact-form') {
            if (!form.checkValidity()) {
                e.preventDefault();
            } else {
                e.preventDefault();
                form.reset();
            }
        }
    });
}

handleSubmit();