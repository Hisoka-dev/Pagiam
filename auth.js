class GolfaAuth {
    static login(username, password) {
        // Validación básica (en producción usar backend)
        if(username === 'ADMIN' && password === 'GOLFA123') {
            localStorage.setItem('golfa-auth', this.encryptData({
                user: username,
                session: Date.now(),
                expires: Date.now() + (8 * 60 * 60 * 1000) // 8 horas
            }));
            return true;
        }
        return false;
    }

    static checkAuth() {
        try {
            const data = this.decryptData(localStorage.getItem('golfa-auth'));
            return data && data.expires > Date.now();
        } catch {
            return false;
        }
    }

    static encryptData(data) {
        return btoa(encodeURIComponent(JSON.stringify(data)));
    }

    static decryptData(encrypted) {
        return JSON.parse(decodeURIComponent(atob(encrypted)));
    }

    static logout() {
        localStorage.removeItem('golfa-auth');
    }
}

// Para desarrollo (acceso rápido)
window.debugAuth = () => {
    GolfaAuth.login('ADMIN', 'GOLFA123');
    window.location.reload();
};