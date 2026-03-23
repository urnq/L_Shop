client/src/store/cartStore.ts
import { api } from '../services/api';
import { Cart, CartItem } from '../types';
import { authStore } from './authStore';

interface CartState {
    cart: Cart | null;
    items: CartItem[];
    totalPrice: number;
    loading: boolean;
}

type Listener = () => void;

class CartStore {
    private state: CartState = {
        cart: null,
        items: [],
        totalPrice: 0,
        loading: false
    };
    private listeners: Listener[] = [];

    constructor() {
        authStore.subscribe(() => {
            if (authStore.getState().isAuthenticated) {
                this.loadCart();
            } else {
                this.clearCart();
            }
        });
    }

    subscribe(listener: Listener): void {
        this.listeners.push(listener);
    }

    private notify(): void {
        this.listeners.forEach(listener => listener());
    }

    getState(): CartState {
        return { ...this.state };
    }

    async loadCart(): Promise<void> {
        if (!authStore.getState().isAuthenticated) return;
        
        this.state.loading = true;
        this.notify();

        const response = await api.getCart();
        
        if (response.success && response.data) {
            this.state.cart = response.data;
            this.state.items = response.data.items;
            this.state.totalPrice = response.data.totalPrice;
        }
        
        this.state.loading = false;
        this.notify();
    }

    async addToCart(productId: string, quantity: number = 1): Promise<void> {
        if (!authStore.getState().isAuthenticated) {
            window.location.href = '/auth';
            return;
        }

        this.state.loading = true;
        this.notify();

        const response = await api.addToCart(productId, quantity);
        
        if (response.success && response.data) {
            this.state.cart = response.data;
            this.state.items = response.data.items;
            this.state.totalPrice = response.data.totalPrice;
        }
        
        this.state.loading = false;
        this.notify();
    }

    async updateQuantity(productId: string, quantity: number): Promise<void> {
        this.state.loading = true;
        this.notify();

        const response = await api.updateCartItem(productId, quantity);
        
        if (response.success && response.data) {
            this.state.cart = response.data;
            this.state.items = response.data.items;
            this.state.totalPrice = response.data.totalPrice;
        }
        
        this.state.loading = false;
        this.notify();
    }

    async removeFromCart(productId: string): Promise<void> {
        this.state.loading = true;
        this.notify();

        const response = await api.removeFromCart(productId);
        
        if (response.success && response.data) {
            this.state.cart = response.data;
            this.state.items = response.data.items;
            this.state.totalPrice = response.data.totalPrice;
        }
        
        this.state.loading = false;
        this.notify();
    }

    clearCart(): void {
        this.state.cart = null;
        this.state.items = [];
        this.state.totalPrice = 0;
        this.notify();
    }
}

export const cartStore = new CartStore();