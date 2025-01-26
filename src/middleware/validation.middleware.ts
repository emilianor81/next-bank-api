import { Request, Response, NextFunction } from 'express';
import { ICard } from '../models/Card';

declare global {
  namespace Express {
    interface Request {
      card?: ICard;
    }
  }
}

interface ValidationSchema {
  body?: Record<string, {
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  }>;
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schema.body) {
      for (const [key, rules] of Object.entries(schema.body)) {
        const value = req.body[key];
        
        if (rules.required && !value) {
          return res.status(400).json({ message: `${key} es requerido` });
        }
        
        if (value) {
          if (rules.type === 'number' && typeof value !== 'number') {
            return res.status(400).json({ message: `${key} debe ser un número` });
          }
          
          if (rules.min !== undefined && value < rules.min) {
            return res.status(400).json({ message: `${key} debe ser mayor o igual a ${rules.min}` });
          }

          if (rules.max !== undefined && value > rules.max) {
            return res.status(400).json({ message: `${key} debe ser menor o igual a ${rules.max}` });
          }
          
          if (rules.pattern && typeof value === 'string' && !new RegExp(rules.pattern).test(value)) {
            return res.status(400).json({ message: `${key} no tiene un formato válido` });
          }
        }
      }
    }
    return next();
  };
};

export const validateOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount } = req.body;

    if (!req.card) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    if (!req.card.isActivated) {
      return res.status(403).json({
        message: 'La tarjeta debe ser activada antes de realizar operaciones'
      });
    }

    // Validar límites de operación
    if (amount > req.card.withdrawLimit) {
      return res.status(400).json({
        message: `La operación excede el límite permitido de ${req.card.withdrawLimit}€`
      });
    }

    // Validar horario de operación (ejemplo: 6:00 - 23:59)
    const currentHour = new Date().getHours();
    if (currentHour < 6) {
      return res.status(403).json({
        message: 'Operaciones no disponibles en este horario'
      });
    }

    return next();
  } catch (error) {
    res.status(500).json({ message: 'Error en la validación de la operación' });
  }
};