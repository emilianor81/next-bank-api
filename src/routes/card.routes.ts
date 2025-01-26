import { RequestHandler, Router } from 'express';
import { CardController } from '../controllers/card.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

router.post(
  '/activate',
  validateRequest({
    body: {
      cardNumber: { type: 'string', required: true },
      initialPin: { type: 'string', required: true }
    }
  }) as RequestHandler,
  CardController.activateCard as RequestHandler
);

router.put(
  '/change-pin',
  authMiddleware as RequestHandler,
  validateRequest({
    body: {
      currentPin: { type: 'string', required: true },
      newPin: { type: 'string', required: true }
    }
  }) as RequestHandler,
  CardController.changePin as RequestHandler
);

router.put(
  '/withdraw-limit',
  authMiddleware as RequestHandler,
  validateRequest({
    body: {
      newLimit: { type: 'number', required: true, min: 500, max: 6000 }
    }
  }) as RequestHandler,
  CardController.updateWithdrawLimit as RequestHandler
);

router.post(
  '/',
  validateRequest({
    body: {
      cardNumber: { type: 'string', required: true },
      pin: { type: 'string', required: true },
      type: { type: 'string', required: true, pattern: '^(debit|credit)$' },
      account: { type: 'string', required: true },
      user: { type: 'string', required: true }
    }
  }) as RequestHandler,
  CardController.createCard as RequestHandler
);
export default router;