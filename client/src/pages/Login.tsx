import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password });
      login(res.data.token, res.data.role);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (e) {
      toast.error('Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAE5] p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-white/50 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#F8FAE5] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-[#43766C]/20">
            👑
          </div>
          <h1 className="text-3xl font-bold text-[#43766C]">Admin Access</h1>
          <p className="text-gray-400 mt-2">Secure entry for bakery staff.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
            <input 
              type="text" 
              className="w-full mt-1 bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#43766C] focus:ring-1 focus:ring-[#43766C] transition"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#43766C] focus:ring-1 focus:ring-[#43766C] transition"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 rounded-xl text-white font-bold text-lg bg-[#43766C] hover:bg-[#345e55] shadow-lg shadow-[#43766C]/30 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}