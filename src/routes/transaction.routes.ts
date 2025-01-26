import { Router, RequestHandler } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { cardValidationMiddleware } from '../middleware/card.middleware';

const router = Router();

router.get(
  '/:accountId',
  authMiddleware as RequestHandler,
  TransactionController.getTransactions as RequestHandler
);

router.post(
  '/withdraw',
  authMiddleware as RequestHandler,
  validateRequest({
    body: {
      amount: { type: 'number', required: true, min: 1 },
      atmBank: { type: 'string', required: true }
    }
  }) as RequestHandler,
  TransactionController.withdraw as RequestHandler
);

router.post(
  '/deposit',
  authMiddleware as RequestHandler,
  validateRequest({
    body: {
      amount: { type: 'number', required: true, min: 1 },
      atmBank: { type: 'string', required: true }
    }
  }) as RequestHandler,
  TransactionController.deposit as RequestHandler
);

router.use(authMiddleware as RequestHandler);
router.use(cardValidationMiddleware as RequestHandler);

router.post(
  '/transfer',
  validateRequest({
    body: {
      amount: { type: 'number', required: true, min: 1 },
      destinationIban: { type: 'string', required: true, pattern: '^ES\\d{22}$' }
    }
  }) as RequestHandler,
  TransactionController.transfer as RequestHandler
);

export default router;