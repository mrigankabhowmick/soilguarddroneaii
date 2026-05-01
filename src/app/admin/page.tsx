"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Package, Users, ShoppingCart, IndianRupee, TrendingUp, Bell, CheckCircle, PackageOpen, Plus, X, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', weight: '', price: 0, img: '', stock: 100 });

  // Fetch real users, live orders, and live products on mount
  useEffect(() => {
    if (session?.user?.role === "Admin") {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.users) setUsers(data.users);
        })
        .catch((err) => console.error("Error fetching users:", err));

      fetch("/api/admin/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch((err) => console.error("Error fetching orders:", err));

      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data.products) setProducts(data.products);
        })
        .catch((err) => console.error("Error fetching products:", err));
    }
  }, [session]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic Update
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone and will remove it from the database.")) return;
    
    // Optimistic Update
    setOrders(prev => prev.filter(o => o._id !== orderId));
    
    try {
      const res = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to delete order: " + data.error);
        // Re-fetch orders if failed to keep UI in sync
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  const openModal = (product: any = null) => {
    if(product) {
      setEditingProduct(product);
      setFormData({ name: product.name, weight: product.weight, price: product.price, img: product.img, stock: product.stock || 0 });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', weight: '', price: 0, img: '', stock: 100 });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: any) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success) {
         if(editingProduct) {
             setProducts(prev => prev.map(p => p._id === editingProduct._id ? data.product : p));
         } else {
             setProducts(prev => [data.product, ...prev]);
         }
         setIsModalOpen(false);
      } else {
         alert("Failed to save: " + data.error);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if(!confirm('Are you sure you want to completely delete this product from the database? It will be removed from everywhere.')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;
  }

  // Fallback if not admin (the middleware should ideally catch this too)
  if (!session || session.user?.role !== "Admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h1 className="text-3xl font-black text-slate-900 mb-4">Access Denied</h1>
        <p className="text-slate-500 mb-6 font-medium">You need Administrator privileges to view this page.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Admin Console</h1>
              <p className="text-xs text-slate-500 font-medium">Manage Inventory & Logistics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-10 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Systems
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard title="Total Sales" value={`₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change="+14%" icon={<IndianRupee className="w-5 h-5" />} color="bg-emerald-500" />
          <KPICard title="Active Orders" value={activeOrdersCount.toString()} change="+5%" icon={<ShoppingCart className="w-5 h-5" />} color="bg-blue-500" />
          <KPICard title="Total Users" value={users.length > 0 ? users.length.toString() : "-"} change="+12%" icon={<Users className="w-5 h-5" />} color="bg-indigo-500" />
          <KPICard title="Live Inventory" value={products.length.toString()} change="" icon={<PackageOpen className="w-5 h-5" />} color="bg-rose-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inventory Management */}
          <section className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                Inventory Database
              </h2>
              <button onClick={() => openModal()} className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-sm rounded-lg transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 pr-2">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Price</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Level</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((item) => (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 font-bold text-sm text-slate-900 flex items-center gap-3">
                        <img src={item.img} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-white" />
                        <div>
                           <span>{item.name}</span>
                           <span className="block text-xs text-slate-400 font-medium font-mono">{item.weight}</span>
                        </div>
                      </td>
                      <td className="py-4 font-medium text-sm text-slate-500">₹{item.price}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                          item.stock < 10 ? "bg-rose-100 text-rose-700" :
                          item.stock < 50 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {item.stock} left
                        </span>
                      </td>
                      <td className="py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                             <button onClick={() => openModal(item)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition"><Edit className="w-4 h-4" /></button>
                             <button onClick={() => handleDeleteProduct(item._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Buyers / Logistics */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                Live Buyer Logistics
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {orders.length > 0 ? (
                orders.map((order: any, i) => (
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} key={order._id} className="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                      <div className="flex gap-2">
                         <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full flex items-center ${order.status === 'Processing' ? 'bg-indigo-100 text-indigo-700' : order.status === 'Shipped' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                           {order.status}
                         </span>
                         <select 
                           value={order.status} 
                           onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                           className="text-[10px] uppercase font-black bg-white border border-slate-200 text-slate-600 rounded-md px-1 py-0.5 focus:outline-none cursor-pointer hover:bg-slate-50"
                         >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-1 px-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        {order.customerInfo ? (
                          <>
                            <p className="font-bold text-slate-900 text-sm">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                            <p className="text-xs text-slate-500 mt-1">{order.customerInfo.email} • {order.customerInfo.phone}</p>
                            <p className="text-xs font-medium text-slate-400 mt-1 max-w-[200px] truncate">{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                          </>
                        ) : (
                          <p className="font-bold text-slate-900 text-sm">{order.user?.name || 'Guest User'}</p>
                        )}
                        <p className="text-xs font-bold text-slate-700 mt-3 p-1.5 bg-slate-100 rounded-md inline-block">{order.items[0]?.name || 'Misc Item'} {order.items.length > 1 && `+${order.items.length - 1}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 text-sm">₹{order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                 <div className="text-center py-10 text-slate-400 font-medium text-sm">No active live orders</div>
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Product Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
               <div className="flex justify-between items-center p-6 border-b border-slate-100">
                  <h3 className="text-xl font-black text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5" /></button>
               </div>
               <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="e.g., Premium Neem Cake" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weight / Vol</label>
                      <input required type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="500 g" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
                      <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="99.99" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Level</label>
                      <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="100" />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
                       <input required type="url" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="https://unsplash.com/..." />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-slate-100">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
                     <button type="submit" className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 rounded-xl transition">
                        {editingProduct ? 'Save Changes' : 'Create Product'}
                     </button>
                  </div>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// KPI Dashboard Helper Widget
function KPICard({ title, value, change, icon, color, isNegative }: any) {
  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${color} shadow-sm`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isNegative ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600'}`}>
          {change}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-400">{title}</h3>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

// Needed icon explicitly
function ShieldCheck(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
}
