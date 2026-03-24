import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, OrderController.createOrder);
router.get('/', authMiddleware, OrderController.getOrders);

export default router;