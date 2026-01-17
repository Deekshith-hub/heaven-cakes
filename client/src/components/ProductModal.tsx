import { useState } from 'react';
import type { Product, Variant } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variant: Variant, msg?: string, cust?: string) => void;
  onBuyNow: (product: Product, variant: Variant, msg?: string, cust?: string) => void; // New Prop
}

export default function ProductModal({ product, onClose, onAddToCart, onBuyNow }: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0] || { weight: 0, price: 0 }
  );

  const [customMessage, setCustomMessage] = useState('');
  const [customization, setCustomization] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1A202C]/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col md:flex-row shadow-2xl animate-[fadeIn_0.3s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition shadow-sm backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 h-48 md:h-auto flex-shrink-0 bg-[#F8FAE5] relative">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <span className="text-[#B19470] font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
            {product.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-3 md:mb-4 leading-tight">
            {product.title}
          </h2>
          <p className="text-gray-500 mb-6 text-sm md:text-base leading-relaxed">
            {product.description}
          </p>

          {/* Weight Selection */}
          <div className="mb-6">
            <label className="block text-xs md:text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">
              Select Size
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all border-2
                    ${selectedVariant.weight === v.weight 
                      ? 'border-[#43766C] bg-[#F8FAE5] text-[#43766C]' 
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  {v.weight} kg
                </button>
              ))}
            </div>
          </div>

          {/* Customization Inputs */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                Message on Cake (Optional)
              </label>
              <input 
                type="text"
                placeholder="e.g. Happy Birthday John!"
                className="w-full bg-[#F7FAFC] border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#43766C] transition text-sm text-[#1A202C]"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                maxLength={40}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                Flavor / Special Requests (Optional)
              </label>
              <textarea 
                rows={2}
                placeholder="e.g. Less cream, Chocolate flavor..."
                className="w-full bg-[#F7FAFC] border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#43766C] transition text-sm resize-none text-[#1A202C]"
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions (Price + Buttons) */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-400 font-bold uppercase">Total Price</span>
              <span className="text-3xl font-bold text-[#43766C]">
                ₹{selectedVariant.price}
              </span>
            </div>
            
            <div className="flex gap-3">
              {/* Add To Cart Button (Outline) */}
              <button
                onClick={() => {
                  onAddToCart(product, selectedVariant, customMessage, customization);
                  onClose();
                }}
                className="flex-1 border-2 border-[#43766C] text-[#43766C] bg-white px-4 py-3 rounded-xl font-bold text-base hover:bg-[#F8FAE5] transition-colors active:scale-95"
              >
                Add to Cart
              </button>

              {/* Buy Now Button (Solid) */}
              <button
                onClick={() => {
                  onBuyNow(product, selectedVariant, customMessage, customization);
                  onClose();
                }}
                className="flex-1 bg-[#43766C] text-white px-4 py-3 rounded-xl font-bold text-base hover:bg-[#345e55] transition-colors shadow-lg shadow-[#43766C]/20 active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}