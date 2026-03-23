import { Request, Response } from 'express';
import { CartModel } from '../models/CartModel';
import { ProductModel } from '../models/ProductModel';

export class CartController {
    static async getCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const cart = await CartModel.findByUserId(userId);
            
            if (!cart) {
                res.status(404).json({ success: false, error: 'Cart not found' });
                return;
            }

            res.json({ success: true, data: cart });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch cart' });
        }
    }

    static async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const { productId, quantity = 1 } = req.body;

            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ success: false, error: 'Product not found' });
                return;
            }

            if (!product.inStock) {
                res.status(400).json({ success: false, error: 'Product out of stock' });
                return;
            }

            const cart = await CartModel.findByUserId(userId);
            if (!cart) {
                res.status(404).json({ success: false, error: 'Cart not found' });
                return;
            }

            const existingItem = cart.items.find(i => i.productId === productId);
            let newItems = [...cart.items];

            if (existingItem) {
                newItems = newItems.map(i =>
                    i.productId === productId
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            } else {
                newItems.push({ productId, quantity });
            }

            const updatedCart = await CartModel.update(userId, newItems);
            res.json({ success: true, data: updatedCart });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to add to cart' });
        }
    }

    static async updateCartItem(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const { productId, quantity } = req.body;

            if (quantity < 0) {
                res.status(400).json({ success: false, error: 'Invalid quantity' });
                return;
            }

            const cart = await CartModel.findByUserId(userId);
            if (!cart) {
                res.status(404).json({ success: false, error: 'Cart not found' });
                return;
            }

            let newItems = [...cart.items];

            if (quantity === 0) {
                newItems = newItems.filter(i => i.productId !== productId);
            } else {
                newItems = newItems.map(i =>
                    i.productId === productId
                        ? { ...i, quantity }
                        : i
                );
            }

            const updatedCart = await CartModel.update(userId, newItems);
            res.json({ success: true, data: updatedCart });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to update cart' });
        }
    }

    static async removeFromCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const { productId } = req.body;

            const cart = await CartModel.findByUserId(userId);
            if (!cart) {
                res.status(404).json({ success: false, error: 'Cart not found' });
                return;
            }

            const newItems = cart.items.filter(i => i.productId !== productId);
            const updatedCart = await CartModel.update(userId, newItems);
            res.json({ success: true, data: updatedCart });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to remove from cart' });
        }
    }
}