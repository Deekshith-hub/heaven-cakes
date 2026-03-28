import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  cartCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Navbar({ cartCount, searchTerm, setSearchTerm }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm border-b border-white/40 dark:border-slate-700/60 transition-colors duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center gap-4">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-12 h-12 rounded-full shadow-inner group-hover:shadow-lg transition-all duration-500 overflow-hidden border border-[#43766C]/10">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[#43766C] leading-none group-hover:text-[#345e55]">
                Heaven Cakes
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#B19470] uppercase mt-0.5">
                Fresh & Delicious Cakes..
              </span>
            </div>
          </Link>
          
          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative group">
            <input 
              type="text"
              placeholder="Search for cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F7FAFC] dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 border border-gray-200 dark:border-slate-600 pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:border-[#43766C] focus:ring-1 focus:ring-[#43766C] transition-all"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-[#43766C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center flex-shrink-0">
            <Link to="/" className="hover:text-[#43766C] transition text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 dark:hover:text-[#43766C]">Shop</Link>
            <Link to="/cart" className="relative hover:text-[#43766C] transition group flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 dark:hover:text-[#43766C]">
              Cart
              {cartCount > 0 && (
                <span className="bg-[#B19470] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/admin" className="px-5 py-2 rounded-full bg-[#43766C] text-white hover:bg-[#345e55] transition text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#43766C]/20">
              Admin
            </Link>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle between light and dark theme"
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile: Theme Toggle + Menu Btn */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle between light and dark theme"
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-[#43766C]" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 dark:border-slate-700 flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
            <input 
              type="text"
              placeholder="Search cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F7FAFC] dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 border border-gray-200 dark:border-slate-600 p-3 rounded-xl text-sm focus:border-[#43766C] outline-none"
            />
            <Link to="/" onClick={() => setIsOpen(false)} className="py-2 font-bold text-gray-600 dark:text-gray-300 text-center">SHOP</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="py-2 font-bold text-gray-600 dark:text-gray-300 text-center flex justify-center gap-2">
              CART {cartCount > 0 && <span className="bg-[#B19470] text-white px-2 rounded-full text-xs">{cartCount}</span>}
            </Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="py-3 font-bold text-[#43766C] bg-[#F8FAE5] dark:bg-slate-700 dark:text-[#43766C] text-center rounded-xl">ADMIN ACCESS</Link>
          </div>
        )}
      </div>
    </nav>
  );
}