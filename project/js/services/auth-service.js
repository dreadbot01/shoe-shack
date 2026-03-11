/* ============================================
   SHOE SACK — Auth Service (Class-based)
   Extends StorageService for session management
   ============================================ */

import { StorageService } from '../core/StorageService.js';

class AuthService extends StorageService {
    constructor() {
        super('shoesack_session');
        this._usersKey = 'shoesack_users';
    }

    /** Simple password hash */
    _hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return 'h_' + Math.abs(hash).toString(36);
    }

    /** Get all users from storage */
    _getUsers() {
        try { return JSON.parse(localStorage.getItem(this._usersKey)) || []; }
        catch { return []; }
    }

    /** Save users array */
    _saveUsers(users) {
        localStorage.setItem(this._usersKey, JSON.stringify(users));
    }

    /** Create a new account */
    signup({ name, email, phone, password, role = 'USER' }) {
        const users = this._getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email is already registered.' };
        }

        const user = {
            id: StorageService.generateId('u'),
            name, email, phone,
            role: role.toUpperCase(),
            createdAt: new Date().toISOString(),
            avatar: null
        };

        users.push({ ...user, passwordHash: this._hash(password) });
        this._saveUsers(users);
        this._set(user);
        return { success: true, user };
    }

    /** Login with email + password */
    login(email, password, role = 'USER') {
        const match = this._getUsers().find(
            u => u.email === email && u.passwordHash === this._hash(password) && u.role === role.toUpperCase()
        );
        if (!match) return { success: false, message: 'Invalid email, password, or role.' };

        const { passwordHash, ...user } = match;
        this._set(user);
        return { success: true, user };
    }

    /** Simulated Google login */
    loginWithGoogle(role = 'USER') {
        return this._socialLogin('user@gmail.com', 'Google User', 'g', role);
    }

    /** Simulated Phone login */
    loginWithPhone(phone, role = 'USER') {
        const email = `${phone.replace(/\D/g, '')}@phone.user`;
        return this._socialLogin(email, 'Phone User', 'p', role, phone);
    }

    /** Internal: social/phone login helper */
    _socialLogin(email, name, prefix, role, phone = '') {
        const users = this._getUsers();
        let match = users.find(u => u.email === email && u.role === role.toUpperCase());

        if (!match) {
            const user = {
                id: StorageService.generateId(`u_${prefix}`),
                name, email, phone,
                role: role.toUpperCase(),
                createdAt: new Date().toISOString(),
                avatar: null
            };
            users.push({ ...user, passwordHash: this._hash(`${prefix}_${Date.now()}`) });
            this._saveUsers(users);
            match = user;
        } else {
            const { passwordHash, ...u } = match;
            match = u;
        }

        this._set(match);
        return { success: true, user: match };
    }

    /** Logout current user */
    logout() { this._remove(); }

    /** Get current logged-in user */
    getCurrentUser() { return this._get(null); }

    /** Check if user is logged in */
    isLoggedIn() { return this.getCurrentUser() !== null; }

    /** Get all users (without password hashes) */
    getAllUsers() {
        return this._getUsers().map(({ passwordHash, ...u }) => u);
    }
}

// Singleton export
const authService = new AuthService();
export default authService;

// Named exports for backward compatibility
export const signup = (data) => authService.signup(data);
export const login = (e, p, r) => authService.login(e, p, r);
export const loginWithGoogle = (r) => authService.loginWithGoogle(r);
export const loginWithPhone = (ph, r) => authService.loginWithPhone(ph, r);
export const logout = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();
export const isLoggedIn = () => authService.isLoggedIn();
export const getAllUsers = () => authService.getAllUsers();
