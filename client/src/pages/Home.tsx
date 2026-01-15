import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Product, Variant } from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function Home({ addToCart }: { addToCart: (p: Product, v: Variant) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Could not load products");
        setLoading(false);
      });
  }, []);

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#43766C] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#43766C] font-bold animate-pulse">Preheating the ovens...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      
      {/* --- DECORATIVE BACKGROUND BLOBS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#43766C]/5 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-[#B19470]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[35rem] h-[35rem] bg-[#F8FAE5] rounded-full blur-3xl" />
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative bg-[#F8FAE5] pt-24 pb-20 px-6 text-center mb-16 overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#43766C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-[#B19470]/20 text-[#B19470] text-xs font-bold uppercase tracking-widest mb-6">
                Fresh From the Kitchen
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#43766C] mb-6 tracking-tight leading-tight">
            Happiness is <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#43766C] to-[#B19470]">Homemade.</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Indulge in our premium selection of Bento cakes, Ice cakes, and artisanal Cupcakes. Baked fresh daily just for you.
            </p>
            <button 
                onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#43766C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#43766C]/30 hover:bg-[#345e55] hover:scale-105 transition-all active:scale-95"
            >
            Order Now ↓
            </button>
        </div>
      </div>

      {/* --- SHOP SECTION --- */}
      <div id="shop-section" className="container mx-auto px-6">
        
        {/* Category Filter Pills */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-3xl font-bold text-[#1A202C]">Our Collection</h2>
            
            <div className="flex gap-2 p-1.5 bg-white rounded-full shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                {['All', 'Ice Cake', 'Bento', 'Cupcake'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
                    ${filter === cat 
                        ? 'bg-[#43766C] text-white shadow-md' 
                        : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-[#43766C]'}`}
                >
                    {cat}
                </button>
                ))}
            </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-lg">No cakes found in this category yet.</p>
                <button onClick={() => setFilter('All')} className="text-[#43766C] font-bold mt-2 hover:underline">View All Cakes</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
                <ProductCard 
                key={product._id} 
                product={product} 
                onClick={() => setSelectedProduct(product)} 
                />
            ))}
            </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={(p, v) => {
            addToCart(p, v);
            toast.success(`Added ${p.title} to cart!`);
          }}
        />
      )}
    </div>
  );
}