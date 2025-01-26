import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface ICard extends Document {
  cardNumber: string;
  pin: string;
  type: 'debit' | 'credit';
  isActivated: boolean;
  withdrawLimit: number;
  creditLimit?: number;
  account: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  verifyPin: (pin: string) => Promise<boolean>;
}

const CardSchema = new Schema<ICard>({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  withdrawLimit: {
    type: Number,
    default: 500,
    min: 500,
    max: 6000,
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

CardSchema.pre('save', async function(next) {
  if (this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

CardSchema.methods.verifyPin = async function(pin: string): Promise<boolean> {
  return await bcrypt.compare(pin, this.pin);
};

export const Card = mongoose.model<ICard>('Card', CardSchema);