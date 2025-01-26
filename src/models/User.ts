import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  accounts: Schema.Types.ObjectId[];
  cards: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  accounts: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }],
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Card'
  }]
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
