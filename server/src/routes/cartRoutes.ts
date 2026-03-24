import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, CartController.getCart);
router.post('/add', authMiddleware, CartController.addToCart);
router.put('/update', authMiddleware, CartController.updateCartItem);
router.delete('/remove', authMiddleware, CartController.removeFromCart);

export default router;