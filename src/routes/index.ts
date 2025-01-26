import { Router } from 'express';
import authRoutes from './auth.routes';
import cardRoutes from './card.routes';
import transactionRoutes from './transaction.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cards', cardRoutes);
router.use('/transactions', transactionRoutes);

export { router as routes };