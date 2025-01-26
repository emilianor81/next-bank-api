import { Request, Response } from 'express';
import { Card } from '../models/Card';
import jwt from 'jsonwebtoken';

export class AuthController {
  static async validateCard(req: Request, res: Response): Promise<void> {
    try {
      const { cardNumber, pin } = req.body;

      const card = await Card.findOne({ cardNumber });
      if (!card) {
        res.status(404).json({ message: 'Tarjeta no encontrada' });
        return
      }
      const isValidPin = await card.verifyPin(pin);
      if (!isValidPin) {
        res.status(401).json({ message: 'PIN incorrecto' });
        return
      }

      if (!card.isActivated) {
        res.status(403).json({ message: 'Tarjeta no activada' });
        return
      }

      const token = jwt.sign(
        { cardId: card._id, accountId: card.account },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error en la autenticación' });
    }
  }
}