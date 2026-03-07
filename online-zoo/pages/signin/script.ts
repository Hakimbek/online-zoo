const validateLogin = (login: string): boolean => {
    const loginRegex = /^[a-zA-Z][a-zA-Z]{2,}$/;
    return loginRegex.test(login);
};

const validatePassword = (password: string): boolean => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>|]/.test(password);
    return password.length >= 6 && hasSpecialChar;
};

interface IFormElements {
    loginInput: HTMLInputElement;
    passInput: HTMLInputElement;
    submitBtn: HTMLButtonElement;
}

function initFormValidation({ loginInput, passInput, submitBtn }: IFormElements): void {
    const validateForm = (): void => {
        const isLoginValid = validateLogin(loginInput.value);
        const isPassValid = validatePassword(passInput.value);
        submitBtn.disabled = !(isLoginValid && isPassValid);
    };

    const setError = (input: HTMLInputElement, message: string, isValid: boolean): void => {
        const wrapper = input.parentElement;
        const errorText = wrapper?.querySelector('.error-text');

        if (!isValid) {
            input.classList.add('input--error');
            if (errorText) {
                errorText.textContent = message;
                errorText.classList.add('active');
            }
        } else {
            resetError(input);
        }
    };

    const resetError = (input: HTMLInputElement): void => {
        const wrapper = input.parentElement;
        const errorText = wrapper?.querySelector('.error-text');
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

const login = document.getElementById("login") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;

initFormValidation({ loginInput: login, passInput: password, submitBtn: submitBtn });

interface IAuthResponse {
    readonly data?: {
        "access_token": string;
    };
    readonly message?: string;
}

async function handleSignIn(e: Event, loginInput: HTMLInputElement, passInput: HTMLInputElement): Promise<void> {
    e.preventDefault();

    const login = loginInput.value;
    const password = passInput.value;
    const globalError = document.getElementById('signin-error');

    try {
        const response = await fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/login\n', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });

        const { message, data }: IAuthResponse = await response.json();

        if (response.ok && data?.access_token) {
            localStorage.setItem('access_token', data.access_token);
            window.location.href = '../about/index.html';
        } else {
            if (globalError) {
                globalError.textContent = message || 'Invalid login or password';
                globalError.classList.add('active');
            }
        }
    } catch (error) {
        console.error("Connection error:", error);
        if (globalError) {
            globalError.textContent = 'Server is currently unavailable. Please try again later.';
            globalError.classList.add('active');
        }
    }
}

submitBtn.onclick = (e) => handleSignIn(e, login, password);