import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { Product, Variant } from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

interface HomeProps {
  addToCart: (p: Product, v: Variant, msg?: string, cust?: string) => void;
  searchTerm: string;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-3 border border-gray-100 h-full flex flex-col">
    <div className="h-48 bg-gray-100 rounded-xl animate-pulse mb-4"></div>
    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 animate-pulse"></div>
    <div className="h-3 bg-gray-100 rounded w-full mb-4 animate-pulse"></div>
    <div className="mt-auto flex justify-between pt-3 border-t border-gray-50">
      <div className="h-5 bg-gray-100 rounded w-1/3 animate-pulse"></div>
      <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse"></div>
    </div>
  </div>
);

export default function Home({ addToCart, searchTerm }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => { toast.error("Could not load products"); setLoading(false); });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyNow = (product: Product, variant: Variant, msg?: string, cust?: string) => {
    addToCart(product, variant, msg, cust);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden w-full max-w-[100vw]">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-[#43766C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[20rem] md:w-[35rem] h-[20rem] md:h-[35rem] bg-[#F8FAE5] rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-[#F8FAE5] pt-24 pb-16 px-6 text-center mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#43766C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto animate-slide-up">
            <span className="inline-block py-1 px-3 rounded-full bg-[#B19470]/20 text-[#B19470] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
                Fresh From the Kitchen
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold text-[#43766C] mb-4 tracking-tight leading-tight">
            Happiness is <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#43766C] to-[#B19470]">Homemade.</span>
            </h1>
            <p className="text-gray-600 text-base md:text-xl max-w-lg mx-auto leading-relaxed mb-8">
                We bake all kind of cakes for every occasion with love and the finest ingredients.
            </p>
            <button onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#43766C] text-white px-8 py-3.5 rounded-full font-bold text-base md:text-lg shadow-lg shadow-[#43766C]/30 active:scale-95 transition-transform">
            Order Now ↓
            </button>
        </div>
      </div>

      {/* Shop Section */}
      <div id="shop-section" className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C]">Our Collection</h2>
            <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto max-w-full w-full md:w-auto scrollbar-hide">
                {['All', 'Ice Cake', 'Bento', 'Cupcake'].map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-[#43766C] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>{cat}</button>
                ))}
            </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
             {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
           </div>
        ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400">No cakes found.</p>
                <button onClick={() => window.location.reload()} className="text-[#43766C] font-bold mt-2 text-sm">Clear Filters</button>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
            {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
            </div>
        )}
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={(p, v, m, c) => { addToCart(p, v, m, c); toast.success(`Added ${p.title} to cart!`); }} onBuyNow={handleBuyNow} />}
    </div>
  );
}