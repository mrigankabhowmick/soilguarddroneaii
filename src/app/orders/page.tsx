"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Truck, CheckCircle, Clock, MapPin, User, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
            return;
        }

        if (status === "authenticated") {
             // Let's fetch the orders. The API doesn't have limit by default anymore since we modified it
            fetch("/api/orders?all=true")
                .then(res => res.json())
                .then(data => {
                    if(data.orders) setOrders(data.orders);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load orders", err);
                    setLoading(false);
                });
        }
    }, [status]);

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order? This cannot be undone.")) return;

        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, action: 'cancel' })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
            } else {
                alert("Failed to cancel: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Cancel order error:", err);
            alert("An error occurred. Please try again.");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Processing': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'Shipped': return <Truck className="w-5 h-5 text-amber-500" />;
            case 'Delivered': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'Cancelled': return <Clock className="w-5 h-5 text-rose-500" />;
            default: return <Package className="w-5 h-5 text-slate-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Shipped': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-16 bg-white border-b border-slate-100 shadow-sm relative z-10">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
                    >
                        Track Your <span className="text-green-600">Orders</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light"
                    >
                        View your full purchase history, track active shipments, and manage your account details.
                    </motion.p>
                </div>
            </section>

            {/* Orders List */}
            <section className="py-20">
                <div className="container mx-auto px-6 lg:px-12 max-w-5xl">

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                            <Package className="w-8 h-8 text-indigo-500" />
                            Order History
                        </h2>
                        <div className="text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-full shadow-sm">
                            {orders.length} Total Orders
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-100 flex flex-col items-center justify-center gap-6"
                        >
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-slate-100">
                                <ShoppingBag className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">No Orders Found</h3>
                            <p className="text-slate-500 max-w-md mx-auto">Looks like you haven't made any purchases yet. Explore our shop to find the best materials for your soil.</p>
                            <Link href="/shop" className="mt-4 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Continue Shopping
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {orders.map((order, index) => (
                                <motion.div 
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-black text-slate-500 tracking-widest uppercase">
                                                    Order #{order._id.substring(order._id.length - 8)}
                                                </span>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <Calendar className="w-4 h-4" />
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-sm font-medium text-slate-500 mb-1">Total Amount</p>
                                            <p className="text-3xl font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Order Details Body */}
                                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        
                                        {/* Items List */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                                                <Package className="w-5 h-5 text-slate-400" />
                                                Order Items
                                            </h4>
                                            <div className="space-y-4">
                                                {order.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shadow-sm">
                                                                {item.quantity}x
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 group-hover:text-green-600 transition-colors leading-tight">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-xs text-slate-400 font-medium">₹{item.price.toFixed(2)} each</p>
                                                            </div>
                                                        </div>
                                                        <div className="font-bold text-slate-700">
                                                            ₹{(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping & Customer Details */}
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Shipping Information</h4>
                                            
                                            <div className="space-y-4">
                                                <div className="flex gap-3">
                                                    <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-bold text-slate-900">{order.customerInfo?.firstName || 'Valued'} {order.customerInfo?.lastName || 'Customer'}</p>
                                                        <p className="text-sm text-slate-600 mt-1">{order.shippingAddress?.address || 'Address not listed'}</p>
                                                        <p className="text-sm text-slate-600">{order.shippingAddress?.city || '-'}, {order.shippingAddress?.state || ''} {order.shippingAddress?.pinCode || ''}</p>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-200 pt-4 space-y-2">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Mail className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600">{order.customerInfo?.email || 'No email provided'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Phone className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600">{order.customerInfo?.phone || 'No phone provided'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Order Actions - New Section */}
                                        <div className="md:col-span-2 border-t border-slate-100 pt-6 flex justify-end gap-4">
                                            {order.status === 'Processing' && (
                                                <button 
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="px-6 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl transition-all border border-rose-100 text-sm"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            <button 
                                                className="px-6 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold rounded-xl transition-all border border-indigo-100 text-sm"
                                                onClick={() => window.print()}
                                            >
                                                Print Invoice
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                </div>
            </section>

            <Footer />
        </div>
    );
}
