import { api } from '../services/api';
import { User } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}

type Listener = () => void;

class AuthStore {
    private state: AuthState = {
        user: null,
        isAuthenticated: false,
        loading: false
    };
    private listeners: Listener[] = [];

    constructor() {
        this.checkAuth();
    }

    subscribe(listener: Listener): void {
        this.listeners.push(listener);
    }

    private notify(): void {
        this.listeners.forEach(listener => listener());
    }

    getState(): AuthState {
        return { ...this.state };
    }

    async checkAuth(): Promise<void> {
        this.state.loading = true;
        this.notify();

        const response = await api.getCurrentUser();
        
        if (response.success && response.data) {
            this.state.user = response.data;
            this.state.isAuthenticated = true;
        } else {
            this.state.user = null;
            this.state.isAuthenticated = false;
        }
        
        this.state.loading = false;
        this.notify();
    }

    async login(email: string, password: string): Promise<boolean> {
        this.state.loading = true;
        this.notify();

        const response = await api.login({ email, password });
        
        if (response.success && response.data) {
            await this.checkAuth();
            this.state.loading = false;
            this.notify();
            return true;
        }
        
        this.state.loading = false;
        this.notify();
        return false;
    }

    async register(username: string, email: string, password: string, phone?: string): Promise<boolean> {
        this.state.loading = true;
        this.notify();

        const response = await api.register({ username, email, password, phone });
        
        if (response.success && response.data) {
            await this.checkAuth();
            this.state.loading = false;
            this.notify();
            return true;
        }
        
        this.state.loading = false;
        this.notify();
        return false;
    }

    async logout(): Promise<void> {
        await api.logout();
        this.state.user = null;
        this.state.isAuthenticated = false;
        this.notify();
    }
}

export const authStore = new AuthStore();