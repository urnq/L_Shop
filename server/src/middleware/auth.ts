import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/UserModel';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sessionId = req.cookies?.session;
        
        if (!sessionId) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        const user = await UserModel.findById(sessionId);
        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid session' });
            return;
        }

        (req as any).userId = user.id;
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, error: 'Authentication error' });
    }
};

export const optionalAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sessionId = req.cookies?.session;
        
        if (sessionId) {
            const user = await UserModel.findById(sessionId);
            if (user) {
                (req as any).userId = user.id;
                (req as any).user = user;
            }
        }
        next();
    } catch {
        next();
    }
};