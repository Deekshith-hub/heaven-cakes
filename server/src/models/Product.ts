import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  variants: { weight: number; price: number }[]; // New Structure
}

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  variants: [
    {
      weight: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ]
});

export default mongoose.model<IProduct>('Product', ProductSchema);