import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { Card } from '../models/Card';
import { FeeCalculator } from '../utils/fees';
import { Validators } from '../utils/validators';
//import mongoose from 'mongoose';

export class TransactionController {
  // Consultar movimientos de una cuenta
  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { accountId } = req.params;

      const transactions = await Transaction.find().lean();
      const filteredTransactions = transactions.filter(t => 
        t.account.toString() === accountId ||
        (t.toAccount && t.toAccount.toString() === accountId)
      );
      
      res.json(filteredTransactions);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener movimientos' });
    }
  }

  // Realizar un retiro
  static async withdraw(req: Request, res: Response) : Promise<void> {
    try {
      const { amount, atmBank } = req.body;

      const { card, user } = req;
    
      if (!card) {
        res.status(404).json({ message: 'Tarjeta no encontrada' });
        return
      }

      if (!user) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      const account = await Account.findById(card.account);

      if (!account) {
        res.status(404).json({ message: 'Cuenta no encontrada' });
        return 
      }

      // Calcular comisión
      const fee = FeeCalculator.calculateWithdrawalFee(amount, account.bank, atmBank);
      const totalAmount = amount + fee;

      // Validaciones específicas según tipo de tarjeta
      if (card.type === 'debit') {
        if (account.balance < totalAmount) {
          res.status(400).json({ 
            message: 'Saldo insuficiente',
            required: totalAmount,
            available: account.balance
          });
          return 
        }
      } else { // Tarjeta de crédito
        if (totalAmount > card.creditLimit!) {
          res.status(400).json({ 
            message: 'Excede el límite de crédito',
            required: totalAmount,
            available: card.creditLimit
          });
          return 
        }
      }

      // Crear transacción
      const transaction = new Transaction({
        type: 'withdrawal',
        amount,
        account: account._id,  // Este es el nombre correcto según el modelo
        atmBank,
        commission: fee,
      });
      // Actualizar saldo
      await Promise.all([
        transaction.save(),
        Account.findByIdAndUpdate(
          account._id,
          { $inc: { balance: -totalAmount } },
          { new: true }
        )
      ]);

      res.json({
        message: 'Retiro exitoso',
        transaction,
        newBalance: account.balance,
        fee
      });
    } catch (error) {
      console.error('Error completo:', error);  // Agregar este log detallado
      res.status(500).json({ message: 'Error al procesar el retiro' });
    }
  }

  // Realizar un depósito
  static async deposit(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;
      const { cardId, accountId } = req.user!;
      const atmBank = req.body.atmBank;

      const card = await Card.findById(cardId);
      const account = await Account.findById(accountId);

      if (!card || !account) {
        res.status(404).json({ message: 'Tarjeta o cuenta no encontrada' });
        return
      }

      // Solo permitir depósitos en cajeros del mismo banco
      if (atmBank !== account.bank) {
        res.status(400).json({ 
          message: 'Solo se pueden realizar depósitos en cajeros del mismo banco' 
        });
        return
      }

      const transaction = new Transaction({
        type: 'deposit',
        amount,
        account: accountId,
        atmBank,
        commission: 0
      });

      account.balance += amount;

      await Promise.all([
        transaction.save(),
        Account.findByIdAndUpdate(
          account._id,
          { $inc: { balance: amount } },
          { new: true }
        )
      ]);

      res.json({
        message: 'Depósito exitoso',
        transaction,
        newBalance: account.balance
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al procesar el depósito' });
    }
  }

  // Realizar una transferencia
    static async transfer(req: Request, res: Response): Promise<void> {
      try {


        const { amount, destinationIban, description } = req.body;
        const { accountId } = req.user!;
        const card = req.card; // Viene del middleware de validación
  
        if (!card) {
          res.status(404).json({ message: 'Tarjeta no encontrada' });
          return;
        }
        // Validar IBAN
        if (!Validators.isValidIBAN(destinationIban)) {
          res.status(400).json({ message: 'IBAN inválido' });
          return
        }
  
        const sourceAccount = await Account.findById(accountId);
        const destinationAccount = await Account.findOne({ iban: destinationIban });
  
        if (!sourceAccount || !destinationAccount) {
          res.status(404).json({ message: 'Cuenta no encontrada' });
          return
        }
  
        // Calcular comisión
        const commission = Validators.calculateCommission(
          amount,
          sourceAccount.bank,
          destinationAccount.bank
        );
        const totalAmount = amount + commission;
        if (sourceAccount.balance < totalAmount) {
          res.status(400).json({ message: 'Saldo insuficiente' });
          return
        }
        // Crear transacción con comisión
        const transaction = new Transaction({
          type: 'transfer',
          amount,
          account: sourceAccount._id,
          toAccount: destinationAccount._id,
          atmBank: sourceAccount.bank,
          commission,
          description: description
        });
        await Promise.all([
          transaction.save(),
          Account.findByIdAndUpdate(
            sourceAccount._id,
            { $inc: { balance: -(amount + commission) } },
            { new: true }
          ),
          Account.findByIdAndUpdate(
            destinationAccount._id,
            { $inc: { balance: amount } },
            { new: true }
          )
        ]);

        res.json({
          message: 'Transferencia exitosa',
          transaction,
          newBalance: sourceAccount.balance - totalAmount,
          commission
        });

      } catch (error) {
        res.status(500).json({ message: 'Error al procesar la transferencia', error: error });
      }
    }
}