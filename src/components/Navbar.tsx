"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Leaf, Menu, X, ShieldCheck, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { data: session, status } = useSession();
    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="SoilGuard" className="w-16 h-16 group-hover:scale-105 transition-transform" />
                    <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        SoilGuard
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400' : 'text-white hover:text-green-400 drop-shadow-sm'}`}>Home</Link>
                    <Link href="/shop" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400' : 'text-white hover:text-green-400 drop-shadow-sm'}`}>Shop</Link>
                    <Link href="/drone-analysis" className={`text-sm font-bold transition-colors ${isScrolled ? 'text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400' : 'text-white hover:text-green-400 drop-shadow-sm'}`}>Analysis</Link>
                    {status === 'authenticated' && <Link href="/orders" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400' : 'text-white hover:text-green-400 drop-shadow-sm'}`}>Orders</Link>}
                    <Link href="/features" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400' : 'text-white hover:text-green-400 drop-shadow-sm'}`}>Features</Link>
                    <Link href="/about" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400' : 'text-white hover:text-green-400 drop-shadow-sm'}`}>About</Link>
                    <Link href="/contact" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400' : 'text-white hover:text-green-400 drop-shadow-sm'}`}>Contact</Link>
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-5">
                    <div className="relative group">
                        <Search className="w-5 h-5 text-slate-500 group-hover:text-green-600 transition-colors cursor-pointer" />
                    </div>
                    <Link href="/checkout" className="relative group cursor-pointer">
                        <ShoppingCart className="w-5 h-5 text-slate-500 group-hover:text-green-600 transition-colors" />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    {status === 'authenticated' ? (
                        <div className="flex items-center gap-3">
                            {session.user?.role === "Admin" && (
                                <Link href="/admin" className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Admin Panel</span>
                                </Link>
                            )}
                            <Link href="/dashboard" className="flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
                                <User className="w-4 h-4" />
                                <span>{session.user?.name || "Dashboard"}</span>
                            </Link>
                            <button onClick={() => signOut()} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md">
                            <User className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-700 dark:text-slate-300"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-xl border-t border-slate-100 dark:border-slate-800 p-6 md:hidden flex flex-col gap-4"
                    >
                        <Link href="/" className="text-base font-medium text-slate-700">Home</Link>
                        <Link href="/shop" className="text-base font-medium text-slate-700">Shop</Link>
                        <Link href="/drone-analysis" className="text-base font-bold text-emerald-600">Drone AI</Link>
                        {status === 'authenticated' && <Link href="/orders" className="text-base font-medium text-slate-700">Orders</Link>}
                        <Link href="/features" className="text-base font-medium text-slate-700">Features</Link>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Search className="w-5 h-5 text-slate-500" />
                            <Link href="/checkout" className="relative cursor-pointer">
                                <ShoppingCart className="w-5 h-5 text-slate-500" />
                                {mounted && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            {status === 'authenticated' ? (
                                <div className="ml-auto flex items-center gap-2">
                                    <Link href="/dashboard" className="flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-2 rounded-full text-sm font-medium">
                                        <User className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                    <button onClick={() => signOut()} className="text-slate-400 p-2">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="ml-auto flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    <User className="w-4 h-4" />
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
