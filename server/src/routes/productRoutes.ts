import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuthMiddleware, ProductController.getAllProducts);
router.get('/:id', optionalAuthMiddleware, ProductController.getProductById);

export default router;