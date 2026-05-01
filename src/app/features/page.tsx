"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Cpu, MessageSquare, Microscope, Plane, Leaf, Smartphone,
    CheckCircle, Activity, Droplets, Thermometer, Box, Target,
    TrendingUp, Globe
} from "lucide-react";
import Link from "next/link";

export default function Features() {
    // Fake live data for Dashboard Preview
    const [metrics, setMetrics] = useState({
        moisture: 65,
        temp: 24.5,
        n: 140,
        p: 45,
        k: 180,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                moisture: Math.min(100, Math.max(0, prev.moisture + (Math.random() * 4 - 2))),
                temp: prev.temp + (Math.random() * 1 - 0.5),
                n: Math.max(0, prev.n + (Math.random() * 10 - 5)),
                p: Math.max(0, prev.p + (Math.random() * 4 - 2)),
                k: Math.max(0, prev.k + (Math.random() * 8 - 4)),
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const featureCards = [
        {
            icon: Cpu,
            title: "Smart Sensor",
            subtitle: "Real-Time Soil Monitoring",
            desc: "Monitor soil moisture, temperature, humidity, NPK levels, and EC instantly using our smart IoT soil sensor.",
            points: ["Prevent overwatering", "Avoid nutrient imbalance", "Improve yield", "Reduce chemical dependency"],
            color: "bg-blue-500",
            bgLight: "bg-blue-50"
        },
        {
            icon: MessageSquare,
            title: "AI Chatbot",
            subtitle: "SoilGuard AI Assistant",
            desc: "Instant agronomy support via WhatsApp. The farmer-friendly interface requires no app download and speaks your language.",
            points: ["Multilingual support", "No app required", "Simple interface", "Voice-ready (Future upgrade)"],
            color: "bg-green-500",
            bgLight: "bg-green-50"
        },
        {
            icon: Microscope,
            title: "Bio Soil Kit",
            subtitle: "Affordable Soil Testing",
            desc: "Accessible ₹50–₹100 soil testing tailored for small & marginal farmers. Receive personalized, actionable soil reports.",
            points: ["Ultra-affordable pricing", "Small farmer focused", "Personalized reports", "Regenerative recommendations"],
            color: "bg-amber-500",
            bgLight: "bg-amber-50"
        },
        {
            icon: Plane,
            title: "Drone Monitoring",
            subtitle: "Precision Crop Insights",
            desc: "Deploy drones for high-resolution thermal and multi-spectral imaging to detect issues before they destroy yields.",
            points: ["High-resolution imaging", "Disease & pest detection", "Crop stress analysis", "Irrigation insights"],
            color: "bg-purple-500",
            bgLight: "bg-purple-50"
        },
        {
            icon: Leaf,
            title: "Regenerative Advisory",
            subtitle: "Sustainable Farming Guidance",
            desc: "Transition to natural, compost-based inputs for long-term soil restoration, better carbon retention, and higher fertility.",
            points: ["Compost-based inputs", "Natural soil restoration", "Carbon retention", "Long-term fertility"],
            color: "bg-emerald-500",
            bgLight: "bg-emerald-50"
        },
        {
            icon: Smartphone,
            title: "Mobile App",
            subtitle: "Coming Soon",
            desc: "A dedicated mobile experience for advanced farm management, historical data tracking, and offline rural access.",
            points: ["Offline access mode", "Alerts & reminders", "Soil health history", "Detailed crop planning"],
            color: "bg-rose-500",
            bgLight: "bg-rose-50"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Navbar />

            {/* Section 1: Hero */}
            <section className="pt-32 pb-20 bg-white relative border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-white to-white pointer-events-none"></div>
                <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-8 shadow-sm"
                    >
                        <Activity className="w-4 h-4" />
                        Ecosystem Architecture
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6 max-w-5xl mx-auto"
                    >
                        Technology That <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Protects Your Soil</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto font-medium"
                    >
                        Farmer-first innovation powered by rigorous soil science and long-term sustainability.
                    </motion.p>
                </div>
            </section>

            {/* Section 2: Feature Cards (Grid Layout) */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featureCards.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-white/70 backdrop-blur-xl border border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] p-8 group relative overflow-hidden"
                            >
                                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-transform duration-700 group-hover:scale-150 ${feat.color}`}></div>

                                <div className={`w-16 h-16 rounded-2xl ${feat.bgLight} border border-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <feat.icon className={`w-8 h-8 ${feat.color.replace('bg-', 'text-')}`} />
                                </div>

                                <div className="mb-2 uppercase tracking-widest text-xs font-bold text-slate-400">{feat.title}</div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{feat.subtitle}</h3>
                                <p className="text-slate-600 leading-relaxed mb-6 font-medium">{feat.desc}</p>

                                <ul className="space-y-3 mb-8">
                                    {feat.points.map((pt, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                                            <CheckCircle className={`w-5 h-5 shrink-0 ${feat.color.replace('bg-', 'text-')}`} />
                                            {pt}
                                        </li>
                                    ))}
                                </ul>

                                {feat.title === "Bio Soil Kit" && (
                                    <Link href="/shop" className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md group/btn">
                                        Order Now <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Live Demo Preview & Drone Dashboard */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-green-500/10 blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-lg">Mission Control, Anywhere.</h2>
                        <p className="text-xl text-slate-400 font-light">Watch your farm's vital signs fluctuate in real-time. Unprecedented transparency directly from the root zone to your screen.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Live Data Dashboard */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                                    <span className="font-mono text-sm tracking-widest text-slate-400">LIVE FEED • SEC-4A</span>
                                </div>
                                <Thermometer className="w-5 h-5 text-slate-500" />
                            </div>

                            <div className="space-y-8">
                                {/* Moisture Block */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="flex items-center gap-2 text-blue-400 font-bold"><Droplets className="w-4 h-4" /> Volumetric Moisture</span>
                                        <span className="text-3xl font-black font-mono">{metrics.moisture.toFixed(1)}<span className="text-lg text-slate-500">%</span></span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-500 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${metrics.moisture}%` }}
                                            transition={{ type: "spring", bounce: 0, duration: 1 }}
                                        />
                                    </div>
                                </div>

                                {/* Temp Block */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-slate-400 font-bold mb-1 uppercase tracking-wider text-xs">Soil Temperature</h4>
                                        <div className="text-4xl font-black font-mono text-amber-400">{metrics.temp.toFixed(2)}°C</div>
                                    </div>
                                    <div className="h-16 w-32 flex items-end justify-between gap-1 opacity-60">
                                        {[40, 60, 45, 80, 50, 70, 90, 60].map((h, i) => (
                                            <div key={i} className="w-full bg-amber-500/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        ))}
                                        <motion.div className="w-full bg-amber-400 rounded-t-sm" animate={{ height: [`${40 + Math.random() * 20}%`, `${50 + Math.random() * 30}%`, `${40 + Math.random() * 20}%`] }} transition={{ repeat: Infinity, duration: 2 }} />
                                    </div>
                                </div>

                                {/* NPK Bars */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Nitrogen', val: metrics.n, max: 200, color: 'bg-emerald-500' },
                                        { label: 'Phosphorus', val: metrics.p, max: 100, color: 'bg-emerald-400' },
                                        { label: 'Potassium', val: metrics.k, max: 300, color: 'bg-emerald-300' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
                                            <span className="text-xs font-bold text-slate-500 mb-2 uppercase">{item.label}</span>
                                            <span className="text-xl font-black font-mono mb-3">{item.val.toFixed(0)}</span>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${item.color}`}
                                                    animate={{ width: `${(item.val / item.max) * 100}%` }}
                                                    transition={{ type: "spring", duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Drone Monitoring Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-full min-h-[400px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group"
                        >
                            <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a4b86?q=80&w=1000&auto=format&fit=crop" alt="Drone Grid" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[50%] group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

                            {/* Animated HUD Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 border-l-2 border-t-2 border-green-500 opacity-50"></div>
                                    <div className="w-16 h-16 border-r-2 border-t-2 border-green-500 opacity-50"></div>
                                </div>

                                <div className="text-center">
                                    <motion.div
                                        className="w-[300px] h-[100px] border border-green-500/30 bg-green-500/10 mx-auto rounded-lg backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute top-0 left-0 h-full w-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)]"
                                            animate={{ x: [0, 300, 0] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        />
                                        <Plane className="w-8 h-8 text-green-400 opacity-80" />
                                    </motion.div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="w-16 h-16 border-l-2 border-b-2 border-green-500 opacity-50"></div>
                                    <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700">
                                        <span className="text-xs font-mono text-green-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Analyzing Grid
                                        </span>
                                    </div>
                                    <div className="w-16 h-16 border-r-2 border-b-2 border-green-500 opacity-50"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 4: Impact Metrics */}
            <section className="py-24 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-16">The Core Problem We Are Solving</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { num: "50%", label: "Land Degradation Problem", icon: Globe, highlight: "text-rose-500" },
                            { num: "140M", label: "Target Farmers & Communities", icon: Target, highlight: "text-amber-500" },
                            { num: "30+", label: "Trees Revived Per Acre", icon: Leaf, highlight: "text-green-500" },
                            { num: "11%", label: "Bio-Input Market Growth", icon: TrendingUp, highlight: "text-blue-500" },
                        ].map((metric, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className={`w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 border border-slate-100 ${metric.highlight}`}>
                                    <metric.icon className="w-8 h-8" />
                                </div>
                                <h3 className={`text-5xl font-black mb-3 ${metric.highlight}`}>{metric.num}</h3>
                                <p className="text-slate-700 font-bold text-lg">{metric.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
