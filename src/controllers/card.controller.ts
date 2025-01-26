import { Request, Response } from 'express';
import { Card } from '../models/Card';

interface AuthRequest extends Request {
  user: {
    _id: string;
    cardId: string;
    accountId: string;
  }
}

export class CardController {
  static async activateCard(req: Request, res: Response) {
    try {
      const { cardNumber, initialPin } = req.body;
      
      const card = await Card.findOne({ cardNumber });
      if (!card) {
        res.status(404).json({ message: 'Tarjeta no encontrada' });
        return
      }
      
      if (card.isActivated) {
        res.status(400).json({ message: 'Tarjeta ya activada' });
        return
      }
      
      card.pin = initialPin;
      card.isActivated = true;
      await card.save();
      
      res.status(200).json({ message: 'Tarjeta activada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al activar la tarjeta' });
    }
  }

  static async changePin(req: AuthRequest, res: Response) {
    try {
      const { currentPin, newPin } = req.body;
      const cardId = req.user.cardId; // Viene del middleware de auth
      
      const card = await Card.findById(cardId);
      if (!card) {
        res.status(404).json({ message: 'Tarjeta no encontrada' });
        return
      }
      
      const isValidPin = await card.verifyPin(currentPin);
      if (!isValidPin) {
        res.status(401).json({ message: 'PIN actual incorrecto' });
        return
      }
      
      card.pin = newPin;
      await card.save();
      
      res.status(200).json({ message: 'PIN actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar el PIN' });
    }
  }

  static async updateWithdrawLimit(req: AuthRequest, res: Response) {
    try {
      const { newLimit } = req.body;
      const cardId = req.user.cardId;
      if (newLimit < 500 || newLimit > 6000) {
        res.status(400).json({ 
          message: 'El límite debe estar entre 500 y 6000 euros' 
        });
        return
      }

      const card = await Card.findById(cardId);
      if (!card) {
        res.status(404).json({ message: 'Tarjeta no encontrada' });
        return
      }

      card.withdrawLimit = newLimit;
      await card.save();

      res.status(200).json({ 
        message: 'Límite de retiro actualizado',
        newLimit 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el límite' });
    }
  }

  static async createCard(req: Request, res: Response): Promise<void> {
    try {
      const card = await Card.create(req.body);
      res.status(201).json({ card });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la tarjeta' });
    }
  }
}