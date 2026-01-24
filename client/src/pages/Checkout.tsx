import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { CartItem } from '../types';

// Define the Props expected from App.tsx
interface CheckoutProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Checkout({ cart, setCart }: CheckoutProps) {
  const navigate = useNavigate();
  
  // Calculate Total Amount Locally
  const totalAmount = cart.reduce((sum, item) => {
    // Handle price safely (check variant first, then base price)
    const price = item.selectedVariant ? item.selectedVariant.price : (item as any).price || 0;
    return sum + (Number(price) * item.qty);
  }, 0);

  // Helper to clear cart
  const clearCart = () => setCart([]);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    deliveryDate: '',
    timeSlot: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle empty cart
  if (cart.length === 0) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl text-gray-500 mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#43766C] text-white px-6 py-2 rounded-lg font-bold"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ---------------------------------------------------------
      // ⚠️ DATA TRANSFORMATION (The Fix for your Validation Error)
      // ---------------------------------------------------------
      const formattedItems = cart.map((item: any) => {
        // 1. Get correct price & weight from variant or base
        const finalPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
        const finalWeight = item.selectedVariant ? item.selectedVariant.weight : item.weight;

        // 2. Get correct ID
        const finalId = item._id || item.id || 'unknown_id';

        return {
          productId: finalId,             
          title: item.title || 'Cake',
          price: Number(finalPrice),      
          weight: Number(finalWeight),    
          qty: Number(item.qty),
          customMessage: item.customMessage || '',
          customization: item.customization || ''
        };
      });

      const orderPayload = {
        ...formData,
        items: formattedItems,
        totalAmount: totalAmount
      };

      console.log('✅ PAYLOAD FIXED:', orderPayload);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderPayload);
      
      if (response.status === 201) {
        clearCart();
        alert('Order Placed Successfully!'); 
        navigate('/'); 
      }
    } catch (err: any) {
      console.error('Checkout Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#43766C]">Checkout</h1>
        <button 
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition"
        >
          Reset Cart
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        
        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              required
              type="text" 
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#43766C]/20 outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              required
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#43766C]/20 outline-none"
              placeholder="9876543210"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
          <textarea 
            required
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#43766C]/20 outline-none"
            placeholder="House No, Street, Landmark..."
          />
        </div>

        {/* Delivery Slot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input 
              required
              type="date" 
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Time Slot</label>
            <select 
              required
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white"
            >
              <option value="">Select a slot</option>
              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
              <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#F8FAE5] p-4 rounded-xl mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-bold">{cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-[#43766C] border-t border-[#43766C]/20 pt-2 mt-2">
            <span>Total Amount:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#43766C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#345e55] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {loading ? 'Processing...' : `Confirm Order ₹${totalAmount}`}
        </button>
      </form>
    </div>
  );
}