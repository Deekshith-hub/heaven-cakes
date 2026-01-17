export interface Variant {
  weight: number;
  price: number;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  variants: Variant[];
  rating?: number;
}

export interface CartItem extends Product {
  selectedVariant: Variant;
  qty: number;
  customMessage?: string;
  customization?: string;
}

export interface Order {
  _id: string;
  customerName: string;
  phone: string;  // Added this missing field
  totalAmount: number;
  status: 'Pending' | 'Baking' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  items: Array<{
    title: string;
    qty: number;
    weight: number;
  }>;
  deliveryDate: string;
  timeSlot: string;
  createdAt: string;
}