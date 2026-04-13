import { useMemo } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const startPrice = product.variants && product.variants.length > 0 
    ? Math.min(...product.variants.map(v => v.price)) 
    : 0;

  // Generate a stable display rating from product ID to avoid impure Math.random in render
  const rating = useMemo(() => {
    if (product.rating) return product.rating.toFixed(1);
    const hash = product._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (4.0 + (hash % 10) / 10).toFixed(1);
  }, [product._id, product.rating]);

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm hover:shadow-xl dark:hover:shadow-slate-700/50 transition-all duration-300 border border-gray-100 dark:border-slate-700 cursor-pointer h-full flex flex-col"
    >
      <div className="relative h-56 w-full rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-slate-700 p-4">
        <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#43766C] shadow-sm uppercase tracking-wider">
            {product.category}
        </div>
      </div>
      
      <div className="px-2 pb-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-[#1A202C] dark:text-gray-100 group-hover:text-[#43766C] transition-colors leading-tight">
            {product.title}
            </h3>
            {/* Star Rating */}
            <div className="flex items-center gap-1 bg-[#F8FAE5] dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold text-[#43766C]">{rating}</span>
            </div>
        </div>
        
        <p className="text-gray-400 dark:text-gray-400 text-xs mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Starts from</span>
            <span className="text-[#43766C] font-bold text-lg">₹{startPrice}</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#F8FAE5] dark:bg-slate-700 flex items-center justify-center text-[#43766C] group-hover:bg-[#43766C] group-hover:text-white transition-all shadow-sm">
            +
          </button>
        </div>
      </div>
    </div>
  );
}