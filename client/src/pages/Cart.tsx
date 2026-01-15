import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Cart({ cart, setCart }: CartProps) {
  const total = cart.reduce((sum, item) => sum + (item.selectedVariant.price * item.qty), 0);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const clearCart = () => setCart([]);

  const placeOrder = async () => {
    if(!form.name || !form.phone || !form.address) return toast.error("Please fill all details");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: cart,
        totalAmount: total
      });
      toast.success('Order Placed Successfully!');
      clearCart();
    } catch (e) {
      toast.error('Order Failed');
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">🛒</div>
      <h2 className="text-2xl font-bold text-[#1A202C] mb-2">Your Cart is Empty</h2>
      <p className="text-gray-500">Looks like you haven't added any sweets yet.</p>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#43766C]">Your Cart</h1>
        <button onClick={clearCart} className="text-red-500 text-sm font-bold hover:underline">Clear Cart</button>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Cart List */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div key={idx} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-xl bg-gray-50" alt={item.title}/>
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="font-bold text-lg text-[#1A202C]">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.selectedVariant.weight} kg</p>
                <p className="text-[#B19470] font-bold mt-1">₹{item.selectedVariant.price}</p>
              </div>
              <div className="flex items-center px-4 font-bold text-gray-400 bg-gray-50 rounded-lg h-10 self-center">
                x{item.qty}
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Panel */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit">
          <h3 className="text-xl font-bold text-[#1A202C] mb-6">Delivery Details</h3>
          <div className="space-y-4 mb-8">
            <input 
              placeholder="Full Name" 
              className="w-full bg-[#F7FAFC] border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#43766C] transition"
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <input 
              placeholder="Phone Number" 
              className="w-full bg-[#F7FAFC] border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#43766C] transition"
              onChange={e => setForm({...form, phone: e.target.value})}
            />
            <textarea 
              placeholder="Address" 
              rows={3}
              className="w-full bg-[#F7FAFC] border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#43766C] transition resize-none"
              onChange={e => setForm({...form, address: e.target.value})}
            />
          </div>

          <div className="flex justify-between items-center mb-6 pt-6 border-t border-gray-100">
            <span className="text-gray-500 font-medium">Total (COD)</span>
            <span className="text-3xl font-bold text-[#43766C]">₹{total}</span>
          </div>

          <button 
            onClick={placeOrder}
            className="w-full bg-[#43766C] text-white py-4 rounded-xl font-bold hover:bg-[#345e55] transition shadow-lg shadow-[#43766C]/20 active:scale-95"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}