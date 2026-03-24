export interface User {
    id: string;
    email: string;
    username: string;
    phone?: string;
    password: string;
    createdAt: string;
    cartId: string;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    image: string;
    platform: 'PC' | 'PS5' | 'Xbox Series X' | 'Nintendo Switch';
    releaseYear: number;
    rating: number;
}

export interface CartItem {
    productId: string;
    quantity: number;
    product?: Product;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    totalPrice: number;
    updatedAt: string;
}

export interface DeliveryInfo {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    totalPrice: number;
    deliveryInfo: DeliveryInfo;
    paymentMethod: 'card' | 'cash';
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
    createdAt: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface QueryParams {
    search?: string;
    category?: string;
    platform?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}