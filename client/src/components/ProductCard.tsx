import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const startPrice = product.variants && product.variants.length > 0 
    ? Math.min(...product.variants.map(v => v.price)) 
    : 0;

  // Fake rating generation for UI demo (random 4.0 to 5.0)
  const rating = product.rating || (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer h-full flex flex-col"
    >
      <div className="relative h-56 w-full rounded-xl overflow-hidden mb-4 bg-gray-50">
        <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#43766C] shadow-sm uppercase tracking-wider">
            {product.category}
        </div>
      </div>
      
      <div className="px-2 pb-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-[#1A202C] group-hover:text-[#43766C] transition-colors leading-tight">
            {product.title}
            </h3>
            {/* Star Rating */}
            <div className="flex items-center gap-1 bg-[#F8FAE5] px-1.5 py-0.5 rounded-md">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold text-[#43766C]">{rating}</span>
            </div>
        </div>
        
        <p className="text-gray-400 text-xs mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Starts from</span>
            <span className="text-[#43766C] font-bold text-lg">₹{startPrice}</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#F8FAE5] flex items-center justify-center text-[#43766C] group-hover:bg-[#43766C] group-hover:text-white transition-all shadow-sm">
            +
          </button>
        </div>
      </div>
    </div>
  );
}