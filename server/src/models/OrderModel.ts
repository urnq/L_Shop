import fs from 'fs/promises';
import path from 'path';
import { Order, CartItem, DeliveryInfo } from '../types';
import { ProductModel } from './ProductModel';

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

export class OrderModel {
    private static async readOrders(): Promise<Order[]> {
        try {
            const data = await fs.readFile(ORDERS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    private static async writeOrders(orders: Order[]): Promise<void> {
        await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    }

    static async create(
        id: string,
        userId: string,
        items: CartItem[],
        deliveryInfo: DeliveryInfo,
        paymentMethod: 'card' | 'cash'
    ): Promise<Order> {
        const orders = await this.readOrders();
        
        let totalPrice = 0;
        for (const item of items) {
            const product = await ProductModel.findById(item.productId);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        }
        
        const newOrder: Order = {
            id,
            userId,
            items,
            totalPrice,
            deliveryInfo,
            paymentMethod,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        await this.writeOrders(orders);
        return newOrder;
    }

    static async findByUserId(userId: string): Promise<Order[]> {
        const orders = await this.readOrders();
        const userOrders = orders.filter(o => o.userId === userId);
        
        for (const order of userOrders) {
            for (const item of order.items) {
                const product = await ProductModel.findById(item.productId);
                if (product) {
                    item.product = product;
                }
            }
        }
        
        return userOrders.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
}