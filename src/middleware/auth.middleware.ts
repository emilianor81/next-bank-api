import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Card } from '../models/Card';

interface JWTPayload {
  _id: string;// Id del usuario 
  cardId: string;// Id de la tarjeta
  accountId: string;// Id de la cuenta
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Token no proporcionado' });
      return 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = decoded;

    // Cargar la tarjeta
    const card = await Card.findById(decoded.cardId);
    if (!card) {
      res.status(404).json({ message: 'Tarjeta no encontrada' });
      return;
    }
    req.card = card;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
    return
  }
};