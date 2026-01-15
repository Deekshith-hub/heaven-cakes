import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'super-admin' | 'admin';
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super-admin', 'admin'], default: 'admin' }
});

export default mongoose.model<IUser>('User', UserSchema);