import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  type: 'withdrawal' | 'deposit' | 'transfer' | 'commission';
  amount: number;
  account: Schema.Types.ObjectId;
  toAccount?: Schema.Types.ObjectId;
  atmBank: string;
  commission: number;
  description?: string;
}

const TransactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ['withdrawal', 'deposit', 'transfer', 'commission'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  toAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  atmBank: {
    type: String,
    required: true,
  },
  commission: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);