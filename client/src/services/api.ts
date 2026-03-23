import { ApiResponse, Product, Cart, Order, User, QueryParams } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(${API_BASE_URL}${endpoint}, {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    async getProducts(params?: QueryParams): Promise<ApiResponse<Product[]>> {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return this.request<Product[]>(/products${queryString});
    }

    async getProduct(id: string): Promise<ApiResponse<Product>> {
        return this.request<Product>(/products/${id});
    }

    async register(data: { email: string; password: string; username: string; phone?: string }): Promise<ApiResponse<{ userId: string; username: string }>> {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async login(data: { email: string; password: string }): Promise<ApiResponse<{ userId: string; username: string }>> {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async logout(): Promise<ApiResponse> {
        return this.request('/auth/logout', { method: 'POST' });
    }

    async getCurrentUser(): Promise<ApiResponse<User>> {
        return this.request('/auth/me');
    }

    async getCart(): Promise<ApiResponse<Cart>> {
        return this.request('/cart');
    }

    async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse<Cart>> {
        return this.request('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }

    async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<Cart>> {
        return this.request('/cart/update', {
            method: 'PUT',
            body: JSON.stringify({ productId, quantity })
        });
    }

    async removeFromCart(productId: string): Promise<ApiResponse<Cart>> {
        return this.request('/cart/remove', {
            method: 'DELETE',
            body: JSON.stringify({ productId })
        });
    }

    async createOrder(deliveryInfo: any, paymentMethod: string): Promise<ApiResponse<Order>> {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify({ deliveryInfo, paymentMethod })
        });
    }

    async getOrders(): Promise<ApiResponse<Order[]>> {
        return this.request('/orders');
    }
}

export const api = new ApiService();