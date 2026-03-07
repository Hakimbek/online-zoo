const validateRegistrationLogin = (login: string): boolean => {
    const loginRegex = /^[a-zA-Z][a-zA-Z]{2,}$/;
    return loginRegex.test(login);
};

const validateRegistrationPassword = (password: string): boolean => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>|]/.test(password);
    return password.length >= 6 && hasSpecialChar;
};

const validateRegistrationName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(name.trim());
};

const validateRegistrationEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
};

const confirmPassword = (pass1: string, pass2: string) => {
    return pass1 === pass2;
}


interface ISignUpElements {
    nameInput: HTMLInputElement;
    emailInput: HTMLInputElement;
    loginInput: HTMLInputElement;
    passInput: HTMLInputElement;
    confirmPassInput: HTMLInputElement;
    submitBtn: HTMLButtonElement;
}

function initRegistrationValidation(elements: ISignUpElements): void {
    const {nameInput, emailInput, loginInput, passInput, confirmPassInput, submitBtn} = elements;

    const validateForm = (): void => {
        const isNameValid = validateRegistrationName(nameInput.value);
        const isEmailValid = validateRegistrationEmail(emailInput.value);
        const isLoginValid = validateRegistrationLogin(loginInput.value);
        const isPassValid = validateRegistrationPassword(passInput.value);

        submitBtn.disabled = !(isNameValid && isEmailValid && isLoginValid && isPassValid);
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
        setError(loginInput, "3+ English letters, starting with a letter", validateRegistrationLogin(loginInput.value));
    });

    passInput.addEventListener('blur', () => {
        setError(passInput, "6+ chars with at least 1 special character", validateRegistrationPassword(passInput.value));
    });

    confirmPassInput.addEventListener('blur', () => {
        setError(confirmPassInput, "Passwords are not equal", confirmPassword(passInput.value, confirmPassInput.value));
    });

    nameInput.addEventListener('blur', () =>
        setError(nameInput, "3+ letters required", validateRegistrationName(nameInput.value)));

    emailInput.addEventListener('blur', () =>
        setError(emailInput, "Enter a valid email address", validateRegistrationEmail(emailInput.value)));

    [nameInput, emailInput, loginInput, passInput, confirmPassInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('input--error');
            const error = input.parentElement?.querySelector('.error-text');
            if (error) error.textContent = '';
        });

        input.addEventListener('input', validateForm);
    });
}

initRegistrationValidation({
    loginInput: document.getElementById("login") as HTMLInputElement,
    emailInput: document.getElementById("email") as HTMLInputElement,
    nameInput: document.getElementById("name") as HTMLInputElement,
    passInput: document.getElementById("password") as HTMLInputElement,
    confirmPassInput: document.getElementById("confirmPassword") as HTMLInputElement,
    submitBtn: document.getElementById("submit-btn") as HTMLButtonElement,
});

interface IAuthResponse {
    readonly data?: {
        "access_token": string;
    };
    readonly message?: string;
}

async function handleSignUp(e: Event, loginInput: HTMLInputElement, passInput: HTMLInputElement, nameInput: HTMLInputElement, emailInput: HTMLInputElement): Promise<void> {
    e.preventDefault();

    const login = loginInput.value;
    const password = passInput.value;
    const name = nameInput.value;
    const email = emailInput.value;
    const globalError = document.getElementById('signup-error');

    try {
        const response = await fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login, password, name, email})
        });

        const {message, data}: IAuthResponse = await response.json();

        if (response.ok && data?.access_token) {
            localStorage.setItem('access_token', data.access_token);
            window.location.href = '../about/index.html';
        } else {
            if (globalError) {
                globalError.textContent = message || 'Error, Please try again.';
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

(document.getElementById("submit-btn") as HTMLButtonElement).onclick = (e) => handleSignUp(
    e,
    document.getElementById("login") as HTMLInputElement,
    document.getElementById("password") as HTMLInputElement,
    document.getElementById("name") as HTMLInputElement,
    document.getElementById("email") as HTMLInputElement,
);