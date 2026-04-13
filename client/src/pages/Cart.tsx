import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Cart({ cart, setCart }: CartProps) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    return sum + (Number(item.selectedVariant.price) * item.qty);
  }, 0);

  const clearCart = () => setCart([]);

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">🛒</div>
      <h2 className="text-2xl font-bold text-[#1A202C] dark:text-gray-100 mb-2">Your Cart is Empty</h2>
      <p className="text-gray-500 dark:text-gray-400">Looks like you haven't added any sweets yet.</p>
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
            <div key={idx} className="flex gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-xl bg-gray-50 dark:bg-slate-700" alt={item.title}/>
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="font-bold text-lg text-[#1A202C] dark:text-gray-100">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.selectedVariant.weight} kg</p>
                
                {item.customMessage && (
                  <p className="text-sm text-[#43766C] mt-1 bg-gray-50 dark:bg-slate-700 p-1.5 rounded">
                    Msg: "{item.customMessage}"
                  </p>
                )}
                {item.customization && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Note: {item.customization}
                  </p>
                )}
                
                <p className="text-[#B19470] font-bold mt-2">₹{item.selectedVariant.price}</p>
              </div>
              <div className="flex items-center px-4 font-bold text-gray-400 bg-gray-50 dark:bg-slate-700 rounded-lg h-10 self-center">
                x{item.qty}
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel - Pure Navigation */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 h-fit">
          <h3 className="text-xl font-bold text-[#1A202C] dark:text-gray-100 mb-6">Order Summary</h3>
          
          <div className="flex justify-between items-center mb-6 pt-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Total</span>
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