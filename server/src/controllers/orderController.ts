import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OrderModel } from '../models/OrderModel';
import { CartModel } from '../models/CartModel';
import { DeliveryInfo } from '../types';

export class OrderController {
    static async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const { deliveryInfo, paymentMethod } = req.body;

            if (!deliveryInfo || !paymentMethod) {
                res.status(400).json({ success: false, error: 'Delivery info and payment method required' });
                return;
            }

            const cart = await CartModel.findByUserId(userId);
            if (!cart || cart.items.length === 0) {
                res.status(400).json({ success: false, error: 'Cart is empty' });
                return;
            }

            const orderId = uuidv4();
            const order = await OrderModel.create(
                orderId,
                userId,
                cart.items,
                deliveryInfo as DeliveryInfo,
                paymentMethod
            );

            await CartModel.clear(userId);

            res.status(201).json({ success: true, data: order });
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({ success: false, error: 'Failed to create order' });
        }
    }

    static async getOrders(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const orders = await OrderModel.findByUserId(userId);
            res.json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch orders' });
        }
    }
}