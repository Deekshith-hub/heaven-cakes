import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Order } from '../types';

export default function Admin() {
  const { role, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'cakes' | 'orders' | 'users'>('orders');
  
  // Order Management
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);

  // Cake Upload
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([{ weight: 0.5, price: 0 }]);
  const [cakeForm, setCakeForm] = useState({ title: '', description: '', category: 'Ice Cake' });
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to clear file input

  // User Management
  const [users, setUsers] = useState<any[]>([]);
  const [newUserForm, setNewUserForm] = useState({ username: '', password: '', role: 'admin' });

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users' && role === 'super-admin') fetchUsers();
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrderLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (e) { toast.error('Failed to load orders'); }
    finally { setOrderLoading(false); }
  };

  const fetchUsers = async () => {
    try {
        const res = await api.get('/users');
        setUsers(res.data);
    } catch (e) { toast.error('Failed to load users'); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}`, { status });
      toast.success('Status Updated');
      fetchOrders(); // Refresh to see changes
    } catch (e) { toast.error('Update failed'); }
  };

  const handleUploadCake = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) return toast.error("Image required");
    setLoading(true);
    const formData = new FormData();
    Object.entries(cakeForm).forEach(([k, v]) => formData.append(k, v));
    formData.append('variants', JSON.stringify(variants));
    formData.append('image', file);
    
    try { 
        await api.post('/products', formData); 
        toast.success('Cake Uploaded Successfully! 🎂'); 
        
        // --- CLEAR FORM ---
        setCakeForm({ title: '', description: '', category: 'Ice Cake' });
        setVariants([{ weight: 0.5, price: 0 }]);
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; 
    } 
    catch (e) { toast.error('Upload failed'); } 
    finally { setLoading(false); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
        await api.post('/users', newUserForm); 
        toast.success('User Created'); 
        setNewUserForm({ username: '', password: '', role: 'admin' }); // Clear Form
        fetchUsers(); 
    }
    catch (e) { toast.error('Failed'); }
  };

  const handleDeleteUser = async (id: string) => {
      if(confirm('Delete user?')) {
          try { await api.delete(`/users/${id}`); toast.success('User Deleted'); fetchUsers(); }
          catch (e) { toast.error('Failed'); }
      }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
          case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
          case 'Out for Delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
          default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#43766C]">Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back, {role === 'super-admin' ? 'Boss' : 'Baker'}</p>
        </div>
        <div className="flex gap-3 items-center self-end md:self-auto">
            <span className="text-xs font-bold bg-[#F8FAE5] text-[#43766C] px-3 py-1.5 rounded-full uppercase border border-[#43766C]/10 tracking-wider">{role}</span>
            <button onClick={logout} className="text-red-500 text-sm font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Logout</button>
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
        <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-[#43766C] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>Orders</button>
        <button onClick={() => setActiveTab('cakes')} className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'cakes' ? 'bg-[#43766C] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>Upload Cake</button>
        {role === 'super-admin' && (
             <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-[#43766C] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>Users</button>
        )}
      </div>

      {/* --- ORDER MANAGEMENT --- */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
            {orderLoading && <div className="text-center py-10 text-gray-400">Loading orders...</div>}
            
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="p-4">Details</th>
                        <th className="p-4">Delivery Slot</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4">
                            <p className="font-bold text-[#1A202C]">{order.customerName}</p>
                            <p className="text-xs text-gray-400">{order.phone}</p>
                        </td>
                        <td className="p-4">
                            <p className="text-sm font-medium">{new Date(order.deliveryDate).toDateString()}</p>
                            <p className="text-xs text-[#B19470] font-bold">{order.timeSlot}</p>
                        </td>
                        <td className="p-4">
                            <div className="text-sm font-medium">{order.items.length} Items</div>
                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{order.items.map(i => `${i.title} (${i.weight}kg)`).join(', ')}</div>
                        </td>
                        <td className="p-4 font-bold text-[#43766C]">₹{order.totalAmount}</td>
                        <td className="p-4">
                            <select 
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer outline-none appearance-none ${getStatusColor(order.status)}`}
                            >
                            <option>Pending</option><option>Baking</option><option>Out for Delivery</option><option>Completed</option><option>Cancelled</option>
                            </select>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View (Hidden on Desktop) */}
            <div className="md:hidden space-y-4">
                {orders.map(order => (
                    <div key={order._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-[#1A202C]">{order.customerName}</h3>
                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="font-bold text-[#43766C] text-lg">₹{order.totalAmount}</span>
                        </div>
                        
                        <div className="bg-[#F7FAFC] p-3 rounded-xl mb-3 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Date:</span>
                                <span className="font-medium">{new Date(order.deliveryDate).toDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Time:</span>
                                <span className="font-bold text-[#B19470]">{order.timeSlot}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Items</p>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-700 flex justify-between">
                                    <span>{item.qty}x {item.title}</span>
                                    <span className="text-gray-400 text-xs">{item.weight}kg</span>
                                </div>
                            ))}
                        </div>

                        <select 
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className={`w-full text-sm font-bold px-4 py-3 rounded-xl border appearance-none text-center ${getStatusColor(order.status)}`}
                        >
                            <option>Pending</option><option>Baking</option><option>Out for Delivery</option><option>Completed</option><option>Cancelled</option>
                        </select>
                    </div>
                ))}
            </div>

            {!orderLoading && orders.length === 0 && <div className="p-10 text-center text-gray-400 bg-white rounded-3xl border border-dashed">No orders received yet.</div>}
        </div>
      )}

      {/* --- CAKE UPLOAD --- */}
      {activeTab === 'cakes' && (
        <form onSubmit={handleUploadCake} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto animate-slide-up">
          <h2 className="text-xl font-bold mb-6 text-[#1A202C]">Upload New Cake</h2>
          <div className="space-y-5">
             <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cake Title</label>
                <input placeholder="e.g. Chocolate Truffle" required className="w-full bg-[#F7FAFC] p-3 rounded-xl border border-gray-100 focus:border-[#43766C] outline-none transition mt-1" value={cakeForm.title} onChange={e => setCakeForm({...cakeForm, title: e.target.value})} />
             </div>
             
             <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description</label>
                <textarea placeholder="Describe the taste..." required rows={3} className="w-full bg-[#F7FAFC] p-3 rounded-xl border border-gray-100 focus:border-[#43766C] outline-none transition mt-1 resize-none" value={cakeForm.description} onChange={e => setCakeForm({...cakeForm, description: e.target.value})} />
             </div>

             <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category</label>
                <select className="w-full bg-[#F7FAFC] p-3 rounded-xl border border-gray-100 focus:border-[#43766C] outline-none mt-1" value={cakeForm.category} onChange={e => setCakeForm({...cakeForm, category: e.target.value})}>
                    <option>Ice Cake</option><option>Bento</option><option>Cupcake</option>
                </select>
             </div>

             <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Price Options</label>
                {variants.map((v, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <input type="number" placeholder="Kg" className="bg-[#F7FAFC] p-3 rounded-xl border border-gray-100 w-1/3 text-center" value={v.weight} onChange={e => {const n = [...variants]; (n[i] as any).weight = e.target.value; setVariants(n)}} />
                    <input type="number" placeholder="₹ Price" className="bg-[#F7FAFC] p-3 rounded-xl border border-gray-100 w-1/3 text-center" value={v.price} onChange={e => {const n = [...variants]; (n[i] as any).price = e.target.value; setVariants(n)}} />
                    {i > 0 && <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="text-red-400 px-2 font-bold">×</button>}
                  </div>
                ))}
                <button type="button" onClick={() => setVariants([...variants, {weight:0, price:0}])} className="text-xs bg-[#43766C]/10 text-[#43766C] px-3 py-1.5 rounded-lg font-bold hover:bg-[#43766C]/20 transition mt-1">+ Add Size Variant</button>
             </div>

             {/* Redesigned File Upload */}
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">Cake Image</label>
                 <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition cursor-pointer group">
                    <input 
                        type="file" 
                        required 
                        ref={fileInputRef}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        onChange={e => setFile(e.target.files?.[0] || null)} 
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <div className={`p-3 rounded-full ${file ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:text-[#43766C]'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            {file ? <span className="text-green-600">{file.name}</span> : "Tap to upload image"}
                        </span>
                    </div>
                 </div>
             </div>

             <button disabled={loading} className="w-full bg-[#43766C] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#43766C]/20 active:scale-95 transition disabled:opacity-50 disabled:scale-100">
                 {loading ? 'Uploading...' : 'Publish Cake'}
             </button>
          </div>
        </form>
      )}

      {/* --- USERS (Super Admin) --- */}
      {activeTab === 'users' && role === 'super-admin' && (
        <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-4 text-[#1A202C]">Create New User</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <input placeholder="Username" required className="w-full bg-[#F7FAFC] p-3 rounded-xl border-none outline-none focus:ring-1 focus:ring-[#43766C]" value={newUserForm.username} onChange={e => setNewUserForm({...newUserForm, username: e.target.value})} />
                    <input type="password" required placeholder="Password" className="w-full bg-[#F7FAFC] p-3 rounded-xl border-none outline-none focus:ring-1 focus:ring-[#43766C]" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} />
                    <select className="w-full bg-[#F7FAFC] p-3 rounded-xl border-none outline-none" value={newUserForm.role} onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}><option value="admin">Admin</option><option value="super-admin">Super Admin</option></select>
                    <button className="w-full bg-[#43766C] text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition">Create User</button>
                </form>
            </div>
            <div className="space-y-3">
                {users.map(u => (
                    <div key={u._id} className="flex justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 items-center">
                        <div>
                            <p className="font-bold text-[#1A202C]">{u.username}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">{u.role}</p>
                        </div>
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition">Delete</button>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}