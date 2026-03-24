import fs from 'fs/promises';
import path from 'path';
import { Cart, CartItem } from '../types';
import { ProductModel } from './ProductModel';

const CARTS_FILE = path.join(__dirname, '../data/carts.json');

export class CartModel {
    private static async readCarts(): Promise<Cart[]> {
        try {
            const data = await fs.readFile(CARTS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    private static async writeCarts(carts: Cart[]): Promise<void> {
        await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
    }

    static async create(id: string, userId: string): Promise<Cart> {
        const carts = await this.readCarts();
        const newCart: Cart = {
            id,
            userId,
            items: [],
            totalPrice: 0,
            updatedAt: new Date().toISOString()
        };
        carts.push(newCart);
        await this.writeCarts(carts);
        return newCart;
    }

    static async findByUserId(userId: string): Promise<Cart | undefined> {
        const carts = await this.readCarts();
        const cart = carts.find(c => c.userId === userId);
        
        if (cart) {
            for (const item of cart.items) {
                const product = await ProductModel.findById(item.productId);
                if (product) {
                    item.product = product;
                }
            }
        }
        
        return cart;
    }

    static async update(userId: string, items: CartItem[]): Promise<Cart | null> {
        const carts = await this.readCarts();
        const index = carts.findIndex(c => c.userId === userId);
        
        if (index === -1) return null;
        
        let totalPrice = 0;
        for (const item of items) {
            const product = await ProductModel.findById(item.productId);
            if (product && product.inStock) {
                totalPrice += product.price * item.quantity;
            }
        }
        
        carts[index] = {
            ...carts[index],
            items,
            totalPrice,
            updatedAt: new Date().toISOString()
        };
        
        await this.writeCarts(carts);
        return carts[index];
    }

    static async clear(userId: string): Promise<Cart | null> {
        return this.update(userId, []);
    }
}