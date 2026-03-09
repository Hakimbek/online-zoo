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
const validateRegistrationLogin = (login) => {
    const loginRegex = /^[a-zA-Z][a-zA-Z]{2,}$/;
    return loginRegex.test(login);
};
const validateRegistrationPassword = (password) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>|]/.test(password);
    return password.length >= 6 && hasSpecialChar;
};
const validateRegistrationName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(name.trim());
};
const validateRegistrationEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
};
const confirmPassword = (pass1, pass2) => {
    return pass1 === pass2;
};
function initRegistrationValidation(elements) {
    const { nameInput, emailInput, loginInput, passInput, confirmPassInput, submitBtn } = elements;
    const validateForm = () => {
        const isNameValid = validateRegistrationName(nameInput.value);
        const isEmailValid = validateRegistrationEmail(emailInput.value);
        const isLoginValid = validateRegistrationLogin(loginInput.value);
        const isPassValid = validateRegistrationPassword(passInput.value);
        submitBtn.disabled = !(isNameValid && isEmailValid && isLoginValid && isPassValid);
    };
    const setError = (input, message, isValid) => {
        const wrapper = input.parentElement;
        const errorText = wrapper === null || wrapper === void 0 ? void 0 : wrapper.querySelector('.error-text');
        if (!isValid) {
            input.classList.add('input--error');
            if (errorText) {
                errorText.textContent = message;
                errorText.classList.add('active');
            }
        }
        else {
            resetError(input);
        }
    };
    const resetError = (input) => {
        const wrapper = input.parentElement;
        const errorText = wrapper === null || wrapper === void 0 ? void 0 : wrapper.querySelector('.error-text');
        input.classList.remove('input--error');
        if (errorText) {
            errorText.textContent = '';
            errorText.classList.remove('active');
        }
    };
    loginInput.addEventListener('blur', () => {
        setError(loginInput, "3+ English letters, starting with a letter", validateRegistrationLogin(loginInput.value));
    });
    passInput.addEventListener('blur', () => {
        setError(passInput, "6+ chars with at least 1 special character", validateRegistrationPassword(passInput.value));
    });
    confirmPassInput.addEventListener('blur', () => {
        setError(confirmPassInput, "Passwords are not equal", confirmPassword(passInput.value, confirmPassInput.value));
    });
    nameInput.addEventListener('blur', () => setError(nameInput, "3+ letters required", validateRegistrationName(nameInput.value)));
    emailInput.addEventListener('blur', () => setError(emailInput, "Enter a valid email address", validateRegistrationEmail(emailInput.value)));
    [nameInput, emailInput, loginInput, passInput, confirmPassInput].forEach(input => {
        input.addEventListener('focus', () => {
            var _a;
            input.classList.remove('input--error');
            const error = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.error-text');
            if (error)
                error.textContent = '';
        });
        input.addEventListener('input', validateForm);
    });
}
initRegistrationValidation({
    loginInput: document.getElementById("login"),
    emailInput: document.getElementById("email"),
    nameInput: document.getElementById("name"),
    passInput: document.getElementById("password"),
    confirmPassInput: document.getElementById("confirmPassword"),
    submitBtn: document.getElementById("submit-btn"),
});
function handleSignUp(e, loginInput, passInput, nameInput, emailInput) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const login = loginInput.value;
        const password = passInput.value;
        const name = nameInput.value;
        const email = emailInput.value;
        const globalError = document.getElementById('signup-error');
        try {
            const response = yield fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password, name, email })
            });
            const { message, data } = yield response.json();
            if (response.ok && (data === null || data === void 0 ? void 0 : data.access_token)) {
                localStorage.setItem('access_token', data.access_token);
                window.location.href = '../about/index.html';
            }
            else {
                if (globalError) {
                    globalError.textContent = message || 'Error, Please try again.';
                    globalError.classList.add('active');
                }
            }
        }
        catch (error) {
            console.error("Connection error:", error);
            if (globalError) {
                globalError.textContent = 'Server is currently unavailable. Please try again later.';
                globalError.classList.add('active');
            }
        }
    });
}
document.getElementById("submit-btn").onclick = (e) => {
    handleSignUp(e, document.getElementById("login"), document.getElementById("password"), document.getElementById("name"), document.getElementById("email"));
};
