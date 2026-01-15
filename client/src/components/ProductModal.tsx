import { useState } from 'react';
import type { Product, Variant } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variant: Variant) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0] || { weight: 0, price: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1A202C]/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content 
          Added 'scrollbar-hide' to the class list below.
      */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col md:flex-row shadow-2xl animate-[fadeIn_0.3s_ease-out]">
        
        {/* Close Button (Sticky on Mobile) */}
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
          <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
            {product.description}
          </p>

          {/* Weight Selection */}
          <div className="mb-8">
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

          {/* Footer Action */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Total Price</span>
              <span className="text-2xl md:text-3xl font-bold text-[#43766C]">
                ₹{selectedVariant.price}
              </span>
            </div>
            
            <button
              onClick={() => {
                onAddToCart(product, selectedVariant);
                onClose();
              }}
              className="bg-[#43766C] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-[#345e55] transition-colors shadow-lg shadow-[#43766C]/20 active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}