interface IUser {
    readonly data: {
        readonly login: string;
        readonly name: string;
        readonly email: string;
    }
}

async function fetchUser(): Promise<void> {
    const token: string | null = localStorage.getItem('access_token');

    if (!token) {
        renderUserUI(null);
        return;
    }

    try {
        const response = await fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData: IUser = await response.json();
            renderUserUI(userData);
        } else {
            if (response.status === 401) {
                localStorage.removeItem('access_token');
            }
            renderUserUI(null);
        }
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        renderUserUI(null);
    }
}

function renderUserUI(user: IUser | null): void {
    const nameDisplay = document.getElementById('user-name') as HTMLSpanElement | null;
    const popup = document.getElementById('auth-popup') as HTMLDivElement | null;

    if (!nameDisplay || !popup) return;

    if (user) {
        nameDisplay.textContent = user.data.name;
        nameDisplay.style.display = 'block';

        popup.innerHTML = `
      <p>Welcome, ${user.data.name} | ${user.data.email}</p>
      <button id="logout-btn">Log Out</button>
    `;

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            localStorage.removeItem('access_token');
            location.reload();
        });
    } else {
        nameDisplay.style.display = 'none';
        popup.innerHTML = `
      <button onclick="goToPage('../signin/index.html')">Sign In</button>
      <button onclick="goToPage('../signup/index.html')">Registration</button>
    `;
    }
}


function initAuthEvents(): void {
    const userIconBtn = document.getElementById('user__icon-btn');
    const authPopup = document.getElementById('auth-popup');
    const authPopupOverlay = document.getElementById('auth-popup__overlay');

    if (!userIconBtn || !authPopup || !authPopupOverlay) return;

    userIconBtn.addEventListener('click', (e: MouseEvent): void => {
        e.stopPropagation();
        authPopup.classList.toggle('active');
        authPopupOverlay.classList.toggle('active');
    });

    authPopup.addEventListener('click', (e: MouseEvent): void => {
        e.stopPropagation();
    });

    window.addEventListener('click', (): void => {
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