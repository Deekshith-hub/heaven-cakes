import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect, type JSX } from 'react';
import type { CartItem, Product, Variant } from './types';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  // 1. Persistent Cart Logic: Initialize from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('heaven_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Search State (Lifted Up)
  const [searchTerm, setSearchTerm] = useState('');

  // Save Cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('heaven_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, variant: Variant, customMessage?: string, customization?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item._id === product._id && 
        item.selectedVariant.weight === variant.weight &&
        item.customMessage === customMessage &&
        item.customization === customization
      );

      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, selectedVariant: variant, qty: 1, customMessage, customization }];
    });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans text-[#1A202C] bg-[#F7FAFC]">
          {/* Pass Search Props to Navbar */}
          <Navbar 
            cartCount={cart.reduce((a, c) => a + c.qty, 0)} 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: { background: '#1A202C', color: '#fff', borderRadius: '12px' },
              success: { iconTheme: { primary: '#43766C', secondary: '#fff' } }
            }} 
          />

          <main className="flex-grow">
            <Routes>
              {/* Pass Search Term to Home */}
              <Route path="/" element={<Home addToCart={addToCart} searchTerm={searchTerm} />} />
              <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}