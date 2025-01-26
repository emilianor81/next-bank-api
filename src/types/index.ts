export interface IUser {
  id: string;
  name: string;
  email: string;
  accounts: string[];
  cards: string[];
}

export interface ICard {
  id: string;
  cardNumber: string;
  pin: string;
  type: 'debit' | 'credit';
  isActivated: boolean;
  withdrawLimit: number;
  creditLimit?: number;
  accountId: string;
  userId: string;
}

export interface IAccount {
  id: string;
  accountNumber: string;
  iban: string;
  balance: number;
  userId: string;
  bank: string;
}

export interface ITransaction {
  id: string;
  type: 'withdrawal' | 'deposit' | 'transfer' | 'commission';
  amount: number;
  fromAccountId: string;
  toAccountId?: string;
  atmBank: string;
  commission: number;
  timestamp: Date;
} 