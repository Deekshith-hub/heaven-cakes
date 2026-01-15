import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ cartCount }: { cartCount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg shadow-sm border-b border-white/40 transition-all duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            
            {/* Logo Container - FIXED */}
            <div className="w-14 h-14 rounded-full shadow-inner group-hover:shadow-lg transition-all duration-500 overflow-hidden border border-[#43766C]/10">
               <img 
                 src="/logo.png" 
                 alt="Logo" 
                 className="w-full h-full object-cover" 
               />
            </div>

            {/* Text Brand */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-[#43766C] leading-none group-hover:text-[#345e55] transition-colors">
                Heaven Cakes
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#B19470] uppercase mt-1">
                Artisan Bakery
              </span>
            </div>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 font-medium text-gray-500 items-center">
            <Link to="/" className="hover:text-[#43766C] transition-colors text-sm font-semibold uppercase tracking-wide">Shop</Link>
            
            <Link to="/cart" className="relative hover:text-[#43766C] transition-colors group flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
              Cart
              {cartCount > 0 && (
                <span className="bg-[#B19470] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md group-hover:bg-[#43766C] transition-colors">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link to="/admin" className="px-5 py-2.5 rounded-full border-2 border-[#43766C]/20 hover:border-[#43766C] hover:bg-[#43766C] hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
              Admin Area
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden text-[#43766C] focus:outline-none p-2 rounded-lg hover:bg-[#F8FAE5] transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 flex flex-col gap-4 text-center animate-[fadeIn_0.2s_ease-out]">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="py-3 text-gray-600 font-bold hover:text-[#43766C] hover:bg-[#F8FAE5] rounded-xl transition"
            >
              SHOP
            </Link>
            <Link 
              to="/cart" 
              onClick={() => setIsOpen(false)}
              className="py-3 text-gray-600 font-bold hover:text-[#43766C] hover:bg-[#F8FAE5] rounded-xl flex items-center justify-center gap-2 transition"
            >
              CART
              {cartCount > 0 && (
                <span className="bg-[#B19470] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setIsOpen(false)}
              className="py-3 text-[#43766C] font-bold bg-[#F8FAE5] rounded-xl"
            >
              ADMIN ACCESS
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}