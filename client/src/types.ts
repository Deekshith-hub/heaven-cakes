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
}

export interface CartItem extends Product {
  selectedVariant: Variant;
  qty: number;
}