import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  // Find lowest price for "From $X" display
  const startPrice = product.variants && product.variants.length > 0 
    ? Math.min(...product.variants.map(v => v.price)) 
    : 0;

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
        <h3 className="text-lg font-bold text-[#1A202C] mb-1 group-hover:text-[#43766C] transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-[#43766C] font-bold">
            From ₹{startPrice}
          </span>
          <span className="w-8 h-8 rounded-full bg-[#F8FAE5] flex items-center justify-center text-[#43766C] group-hover:bg-[#43766C] group-hover:text-white transition-all">
            +
          </span>
        </div>
      </div>
    </div>
  );
}