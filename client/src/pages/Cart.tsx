import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Cart({ cart, setCart }: CartProps) {
  const navigate = useNavigate();

  // Calculate total safely
  const total = cart.reduce((sum, item) => {
    // FIX: Use (item as any) to bypass TypeScript error if 'price' is missing on type
    const price = item.selectedVariant 
      ? item.selectedVariant.price 
      : (item as any).price || 0;
    return sum + (Number(price) * item.qty);
  }, 0);

  const clearCart = () => setCart([]);

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">🛒</div>
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
          {cart.map((item, idx) => {
             // FIX: Safe access using casting
             const displayPrice = item.selectedVariant 
                ? item.selectedVariant.price 
                : (item as any).price || 0;
                
             const displayWeight = item.selectedVariant 
                ? item.selectedVariant.weight 
                : (item as any).weight || 0;

             return (
              <div key={idx} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-xl bg-gray-50" alt={item.title}/>
                <div className="flex-grow flex flex-col justify-center">
                  <h3 className="font-bold text-lg text-[#1A202C]">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{displayWeight} kg</p>
                  
                  {item.customMessage && (
                    <p className="text-sm text-[#43766C] mt-1 bg-gray-50 p-1.5 rounded">
                      Msg: "{item.customMessage}"
                    </p>
                  )}
                  {item.customization && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Note: {item.customization}
                    </p>
                  )}
                  
                  <p className="text-[#B19470] font-bold mt-2">₹{displayPrice}</p>
                </div>
                <div className="flex items-center px-4 font-bold text-gray-400 bg-gray-50 rounded-lg h-10 self-center">
                  x{item.qty}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Panel - Pure Navigation */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit">
          <h3 className="text-xl font-bold text-[#1A202C] mb-6">Order Summary</h3>
          
          <div className="flex justify-between items-center mb-6 pt-2">
            <span className="text-gray-500 font-medium">Total</span>
            <span className="text-3xl font-bold text-[#43766C]">₹{total}</span>
          </div>

          <button 
            onClick={() => navigate('/checkout')} 
            className="w-full bg-[#43766C] text-white py-4 rounded-xl font-bold hover:bg-[#345e55] transition shadow-lg shadow-[#43766C]/20 active:scale-95"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}