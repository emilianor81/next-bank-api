import { RequestHandler, Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

router.post(
  '/validate-card',
  validateRequest({
    body: {
      cardNumber: { type: 'string', required: true },
      pin: { type: 'string', required: true }
    }
  }) as RequestHandler,
  AuthController.validateCard as RequestHandler
);

export default router;