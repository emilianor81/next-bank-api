import { Card } from '../../src/models/Card';
import bcrypt from 'bcrypt';

describe('Card Model Test', () => {
  it('should hash PIN before saving', async () => {
    const cardData = {
      cardNumber: '4532000000001234',
      pin: '1234',
      type: 'debit',
      account: '507f1f77bcf86cd799439011',
      user: '507f1f77bcf86cd799439012'
    };

    const card = new Card(cardData);
    await card.save();

    // Verificar que el PIN está hasheado
    expect(card.pin).not.toBe('1234');
    expect(await bcrypt.compare('1234', card.pin)).toBe(true);
  });

  it('should validate withdraw limits', () => {
    const card = new Card({
      withdrawLimit: 1000,
      type: 'debit'
    });

    expect(card.withdrawLimit).toBeLessThanOrEqual(6000);
    expect(card.withdrawLimit).toBeGreaterThanOrEqual(500);
  });
});