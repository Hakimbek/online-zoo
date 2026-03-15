"use strict";
function handleSubmit() {
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if ((form === null || form === void 0 ? void 0 : form.id) === 'contact-form') {
            if (!form.checkValidity()) {
                e.preventDefault();
            }
            else {
                e.preventDefault();
                form.reset();
            }
        }
    });
}
handleSubmit();
