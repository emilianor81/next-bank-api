import { Account } from '../../src/models/Account';

describe('Account Model Test', () => {
  it('should validate account creation', () => {
    const accountData = {
      accountNumber: '1234567890',
      iban: 'ES9121000418450200051332',
      balance: 1000,
      bank: 'TEST_BANK',
      user: '507f1f77bcf86cd799439012'
    };

    const account = new Account(accountData);
    expect(account).toHaveProperty('accountNumber', accountData.accountNumber);
    expect(account).toHaveProperty('balance', accountData.balance);
  });

  it('should not allow negative balance', () => {
    const account = new Account({
      accountNumber: '1234567890',
      iban: 'ES9121000418450200051332',
      balance: -100,
      bank: 'TEST_BANK',
      user: '507f1f77bcf86cd799439012'
    });

    const validationError = account.validateSync();
    expect(validationError).toBeTruthy();
  });
});