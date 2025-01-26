import { Request, Response, NextFunction } from 'express';
import { Card } from '../models/Card';

export const cardValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.user!;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    if (!card.isActivated) {
      return res.status(403).json({ 
        message: 'Tarjeta no activada. Por favor, active su tarjeta primero' 
      });
    }

    // Añadir la información de la tarjeta a la request
    req.card = card;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error en la validación de la tarjeta' });
  }
};