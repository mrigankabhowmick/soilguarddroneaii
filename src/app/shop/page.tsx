"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, Leaf, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

import { useEffect } from "react";

export default function Shop() {
    const { addToCart } = useCart();
    const [addedIds, setAddedIds] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                if(data.products) setProducts(data.products);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (p: any) => {
        addToCart({ id: p._id, name: p.name, price: p.price, quantity: 1, img: p.img });
        setAddedIds(prev => [...prev, p._id]);
        setTimeout(() => {
            setAddedIds(prev => prev.filter(id => id !== p._id));
        }, 2000);
    };

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
                        SoilGuard <span className="text-green-600">Store</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light"
                    >
                        Premium organic fertilizers, meals, and soil regeneration essentials formulated to maximize your crop yield.
                    </motion.p>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-20">
                <div className="container mx-auto px-6 lg:px-12">

                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                            <Leaf className="w-8 h-8 text-green-500" />
                            Regeneration Supplies
                        </h2>
                        <div className="text-sm font-bold text-green-700 bg-green-100 border border-green-200 px-4 py-2 rounded-full shadow-sm">
                            {products.length} Items Available
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {loading && <div className="col-span-4 text-center py-12 text-slate-500 font-bold">Loading Live Catalog...</div>}
                        {!loading && products.map((p, i) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                                className="group border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-slate-300 transition-all duration-500 flex flex-col relative"
                            >
                                {/* Image */}
                                <div className="w-full h-56 bg-white relative overflow-hidden group-hover:bg-slate-50 transition-colors">
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out mix-blend-multiply" />
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-slate-800 shadow-md border border-slate-200">
                                        {p.weight}
                                    </div>
                                    <button onClick={() => handleAddToCart(p)} className="absolute bottom-4 right-4 bg-green-500 text-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10 cursor-pointer hover:bg-green-600 hover:scale-110">
                                        <ShoppingCart className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1 bg-white relative z-20">
                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="text-xs text-slate-400 font-medium ml-1">4.9</span>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight group-hover:text-green-600 transition-colors">{p.name}</h3>
                                    <div className="text-sm text-slate-500 mb-6 font-medium">{p.weight} Premium Pack</div>

                                    <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Price</span>
                                            <span className="text-3xl font-black text-slate-900">₹{p.price}</span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(p)}
                                            className="text-sm font-bold text-green-600 hover:text-green-700 hover:underline flex items-center gap-1 group/btn cursor-pointer"
                                        >
                                            {addedIds.includes(p._id) ? "Added!" : "Add to Cart"}
                                            {!addedIds.includes(p._id) && <span className="group-hover/btn:translate-x-1 transition-transform">→</span>}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}
