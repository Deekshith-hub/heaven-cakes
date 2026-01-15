import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// Define User Interface
interface User {
  _id: string;
  username: string;
  role: string;
}

export default function Admin() {
  const { role, logout, token } = useAuth(); // Get role to toggle views

  // --- STATE FOR CAKE UPLOAD (Normal Admin) ---
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([{ weight: 0.5, price: 0 }]);
  const [cakeForm, setCakeForm] = useState({ title: '', description: '', category: 'Ice Cake' });

  // --- STATE FOR USER MANAGEMENT (Super Admin) ---
  const [users, setUsers] = useState<User[]>([]);
  const [newUserForm, setNewUserForm] = useState({ username: '', password: '', role: 'admin' });
  const [userLoading, setUserLoading] = useState(false);

  // --- HELPERS ---
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  // --- EFFECTS ---
  useEffect(() => {
    if (role === 'super-admin') {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  // --- HANDLERS: USER MANAGEMENT (Super Admin) ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      await api.post('/users', newUserForm);
      toast.success('User Created Successfully');
      setNewUserForm({ username: '', password: '', role: 'admin' });
      fetchUsers(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if(!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User Deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // --- HANDLERS: CAKE UPLOAD (Normal Admin) ---
  const addVariant = () => setVariants([...variants, { weight: 0.5, price: 0 }]);
  
  const updateVariant = (idx: number, field: string, val: number) => {
    const v = [...variants];
    (v[idx] as any)[field] = val;
    setVariants(v);
  };

  const handleUploadCake = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) return toast.error("Image is required");
    
    setLoading(true);
    const formData = new FormData();
    Object.entries(cakeForm).forEach(([k, v]) => formData.append(k, v));
    formData.append('variants', JSON.stringify(variants));
    formData.append('image', file);

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Cake Uploaded!');
      setCakeForm({ title: '', description: '', category: 'Ice Cake' });
      setVariants([{ weight: 0.5, price: 0 }]);
      setFile(null);
    } catch (e) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW: SUPER ADMIN (User Management) ---
  if (role === 'super-admin') {
    return (
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#43766C]">Super Admin Panel</h1>
          <button onClick={logout} className="text-red-500 font-bold hover:underline">Logout</button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT: Create User Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-[#1A202C] mb-4">Add New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input 
                placeholder="Username" 
                required
                className="w-full bg-[#F7FAFC] p-3 rounded-xl border border-gray-200 outline-none focus:border-[#43766C]"
                value={newUserForm.username}
                onChange={e => setNewUserForm({...newUserForm, username: e.target.value})}
              />
              <input 
                type="password"
                placeholder="Password" 
                required
                className="w-full bg-[#F7FAFC] p-3 rounded-xl border border-gray-200 outline-none focus:border-[#43766C]"
                value={newUserForm.password}
                onChange={e => setNewUserForm({...newUserForm, password: e.target.value})}
              />
              <select 
                className="w-full bg-[#F7FAFC] p-3 rounded-xl border border-gray-200 outline-none focus:border-[#43766C]"
                value={newUserForm.role}
                onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}
              >
                <option value="admin">Normal Admin (Can Upload Cakes)</option>
                <option value="super-admin">Super Admin (Manage Users)</option>
              </select>
              <button disabled={userLoading} className="w-full bg-[#43766C] text-white py-3 rounded-xl font-bold hover:bg-[#345e55] transition">
                {userLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>

          {/* RIGHT: User List */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1A202C] mb-4">Manage Users</h2>
            <div className="space-y-3">
              {users.length === 0 && <p className="text-gray-400">No users found.</p>}
              {users.map(user => (
                <div key={user._id} className="flex justify-between items-center p-4 bg-[#F7FAFC] rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${user.role === 'super-admin' ? 'bg-[#B19470] text-white' : 'bg-[#43766C] text-white'}`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A202C]">{user.username}</p>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{user.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-400 hover:text-red-600 font-bold text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: NORMAL ADMIN (Cake Upload) ---
  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#43766C]">Cake Management</h1>
        <div className="flex gap-4 items-center">
             <span className="text-sm text-gray-500 font-medium">Logged in as {role}</span>
            <button onClick={logout} className="text-red-500 font-bold hover:underline">Logout</button>
        </div>
      </div>

      <form onSubmit={handleUploadCake} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1A202C] mb-6">Upload New Cake</h2>
        
        <div className="space-y-6">
          <input 
            placeholder="Cake Title" 
            required
            className="w-full bg-[#F7FAFC] p-4 rounded-xl border border-gray-200 outline-none focus:border-[#43766C]"
            value={cakeForm.title}
            onChange={e => setCakeForm({...cakeForm, title: e.target.value})}
          />
          
          <textarea 
            placeholder="Description" 
            rows={3}
            required
            className="w-full bg-[#F7FAFC] p-4 rounded-xl border border-gray-200 outline-none focus:border-[#43766C] resize-none"
            value={cakeForm.description}
            onChange={e => setCakeForm({...cakeForm, description: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-6">
            <select 
              className="bg-[#F7FAFC] p-4 rounded-xl border border-gray-200 outline-none focus:border-[#43766C]"
              value={cakeForm.category}
              onChange={e => setCakeForm({...cakeForm, category: e.target.value})}
            >
              <option>Ice Cake</option>
              <option>Bento</option>
              <option>Cupcake</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Pricing Options</label>
            {variants.map((v, i) => (
              <div key={i} className="flex gap-4 mb-2">
                <input type="number" placeholder="Kg" required className="w-1/3 bg-[#F7FAFC] p-3 rounded-xl border border-gray-200" value={v.weight} onChange={e => updateVariant(i, 'weight', parseFloat(e.target.value))}/>
                <input type="number" placeholder="₹ Price" required className="w-1/3 bg-[#F7FAFC] p-3 rounded-xl border border-gray-200" value={v.price} onChange={e => updateVariant(i, 'price', parseFloat(e.target.value))}/>
              </div>
            ))}
            <button type="button" onClick={addVariant} className="text-[#43766C] text-sm font-bold hover:underline">+ Add Variant</button>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-[#F8FAE5] transition cursor-pointer relative">
            <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} />
            <span className="text-gray-400 font-medium">{file ? file.name : "Drag & Drop or Click to Upload Image"}</span>
          </div>

          <button disabled={loading} className="w-full bg-[#43766C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#345e55] transition shadow-lg shadow-[#43766C]/20">
            {loading ? 'Uploading...' : 'Publish Cake'}
          </button>
        </div>
      </form>
    </div>
  );
}