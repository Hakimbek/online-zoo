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
function fetchUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem('access_token');
        if (!token) {
            renderUserUI(null);
            return;
        }
        try {
            const response = yield fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const userData = yield response.json();
                renderUserUI(userData);
            }
            else {
                if (response.status === 401) {
                    localStorage.removeItem('access_token');
                }
                renderUserUI(null);
            }
        }
        catch (error) {
            console.error("Failed to fetch user profile:", error);
            renderUserUI(null);
        }
    });
}
function renderUserUI(user) {
    var _a;
    const nameDisplay = document.getElementById('user-name');
    const popup = document.getElementById('auth-popup');
    if (!nameDisplay || !popup)
        return;
    if (user) {
        nameDisplay.textContent = user.data.name;
        nameDisplay.style.display = 'block';
        popup.innerHTML = `
      <p>Welcome, ${user.data.name} | ${user.data.email}</p>
      <button id="logout-btn">Log Out</button>
    `;
        (_a = document.getElementById('logout-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            localStorage.removeItem('access_token');
            location.reload();
        });
    }
    else {
        nameDisplay.style.display = 'none';
        popup.innerHTML = `
      <button onclick="goToPage('../signin/index.html')">Sign In</button>
      <button onclick="goToPage('../signup/index.html')">Registration</button>
    `;
    }
}
function initAuthEvents() {
    const userIconBtn = document.getElementById('user__icon-btn');
    const authPopup = document.getElementById('auth-popup');
    const authPopupOverlay = document.getElementById('auth-popup__overlay');
    if (!userIconBtn || !authPopup || !authPopupOverlay)
        return;
    userIconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        authPopup.classList.toggle('active');
        authPopupOverlay.classList.toggle('active');
    });
    authPopup.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    window.addEventListener('click', () => {
        if (authPopup.classList.contains('active')) {
            authPopup.classList.remove('active');
        }
        if (authPopupOverlay.classList.contains('active')) {
            authPopupOverlay.classList.remove('active');
        }
    });
}
fetchUser();
initAuthEvents();
