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
const validateLogin = (login) => {
    const loginRegex = /^[a-zA-Z][a-zA-Z]{2,}$/;
    return loginRegex.test(login);
};
const validatePassword = (password) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>|]/.test(password);
    return password.length >= 6 && hasSpecialChar;
};
function initFormValidation({ loginInput, passInput, submitBtn }) {
    const validateForm = () => {
        const isLoginValid = validateLogin(loginInput.value);
        const isPassValid = validatePassword(passInput.value);
        submitBtn.disabled = !(isLoginValid && isPassValid);
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
        setError(loginInput, "3+ English letters, starting with a letter", validateLogin(loginInput.value));
    });
    passInput.addEventListener('blur', () => {
        setError(passInput, "6+ chars with at least 1 special character", validatePassword(passInput.value));
    });
    [loginInput, passInput].forEach(input => {
        input.addEventListener('focus', () => resetError(input));
    });
    [loginInput, passInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });
}
initFormValidation({
    loginInput: document.getElementById("login"),
    passInput: document.getElementById("password"),
    submitBtn: document.getElementById("submit-btn")
});
function handleSignIn(e, loginInput, passInput) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const login = loginInput.value;
        const password = passInput.value;
        const globalError = document.getElementById('signin-error');
        try {
            const response = yield fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            });
            const { message, data } = yield response.json();
            if (response.ok && (data === null || data === void 0 ? void 0 : data.access_token)) {
                localStorage.setItem('access_token', data.access_token);
                window.location.href = '../about/index.html';
            }
            else {
                if (globalError) {
                    globalError.textContent = message || 'Invalid login or password';
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
    handleSignIn(e, document.getElementById("login"), document.getElementById("password"));
};
