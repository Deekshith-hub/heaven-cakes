import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: Date; // New
  timeSlot: string;   // New
  items: Array<{
    productId: string;
    title: string;
    weight: number;
    price: number;
    qty: number;
    customMessage?: string;
    customization?: string;
  }>;
  totalAmount: number;
  status: 'Pending' | 'Baking' | 'Out for Delivery' | 'Completed' | 'Cancelled'; // Expanded Status
  createdAt: Date;
}

const OrderSchema = new Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      weight: { type: Number, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
      customMessage: { type: String },
      customization: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Baking', 'Out for Delivery', 'Completed', 'Cancelled'],
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', OrderSchema);