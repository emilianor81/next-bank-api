import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  accountNumber: string;
  iban: string;
  balance: number;
  bank: string;
  user: Schema.Types.ObjectId;
}

const AccountSchema = new Schema<IAccount>({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  iban: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  bank: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export const Account = mongoose.model<IAccount>('Account', AccountSchema);