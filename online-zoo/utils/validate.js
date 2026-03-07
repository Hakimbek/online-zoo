export const validateLogin = (login) => {
    const loginRegex = /^[a-zA-Z][a-zA-Z]{2,}$/;
    return loginRegex.test(login);
};
export const validatePassword = (password) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>|]/.test(password);
    return password.length >= 6 && hasSpecialChar;
};
export const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(name.trim());
};
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
};
