import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/UserModel';
import { CartModel } from '../models/CartModel';

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, username, phone } = req.body;

            if (!email || !password || !username) {
                res.status(400).json({ success: false, error: 'Email, password and username are required' });
                return;
            }

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ success: false, error: 'User already exists' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = uuidv4();
            const cartId = uuidv4();
            
            const newUser = {
                id: userId,
                email,
                username,
                phone: phone || '',
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                cartId
            };

            await UserModel.create(newUser);
            await CartModel.create(cartId, userId);

            res.cookie('session', userId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 10 * 60 * 1000,
                sameSite: 'strict'
            });

            res.status(201).json({ success: true, data: { userId: newUser.id, username: newUser.username } });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ success: false, error: 'Email and password are required' });
                return;
            }

            const user = await UserModel.findByEmail(email);
            if (!user) {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
                return;
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
                return;
            }

            res.cookie('session', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 10 * 60 * 1000,
                sameSite: 'strict'
            });

            res.json({ success: true, data: { userId: user.id, username: user.username } });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('session');
        res.json({ success: true });
    }

    static async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Not authenticated' });
                return;
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: 'User not found' });
                return;
            }

            res.json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    phone: user.phone
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}