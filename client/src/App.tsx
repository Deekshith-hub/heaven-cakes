import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, type JSX } from 'react';
import type { CartItem, Product, Variant } from './types';

// Components & Pages
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
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant: Variant) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id && item.selectedVariant.weight === variant.weight);
      if (existing) {
        return prev.map(item => 
          item._id === product._id && item.selectedVariant.weight === variant.weight
            ? { ...item, qty: item.qty + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedVariant: variant, qty: 1 }];
    });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar cartCount={cart.reduce((a, c) => a + c.qty, 0)} />
          
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: { background: '#1A202C', color: '#fff', borderRadius: '12px' },
              success: { iconTheme: { primary: '#43766C', secondary: '#fff' } }
            }} 
          />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} />} />
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