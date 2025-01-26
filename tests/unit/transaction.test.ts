import { Transaction } from '../../src/models/Transaction';

describe('Transaction Model Test', () => {
  it('should create a valid transaction', () => {
    const transactionData = {
      type: 'withdrawal',
      amount: 100,
      fromAccount: '507f1f77bcf86cd799439011',
      atmBank: 'TEST_BANK',
      commission: 0
    };

    const transaction = new Transaction(transactionData);
    expect(transaction).toHaveProperty('type', transactionData.type);
    expect(transaction).toHaveProperty('amount', transactionData.amount);
  });

  it('should validate transaction amount', () => {
    const transaction = new Transaction({
      type: 'withdrawal',
      amount: -100,
      fromAccount: '507f1f77bcf86cd799439011',
      atmBank: 'TEST_BANK'
    });

    const validationError = transaction.validateSync();
    expect(validationError).toBeTruthy();
  });
});