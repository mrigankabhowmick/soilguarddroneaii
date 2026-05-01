"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, Target, ShieldCheck, Mail, MapPin, Phone, CheckCircle, Sprout } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Navbar />

            {/* Hero Header */}
            <section className="pt-32 pb-20 bg-white relative border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-50 via-white to-white pointer-events-none"></div>
                <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-8 shadow-sm uppercase tracking-widest"
                    >
                        <Leaf className="w-4 h-4" />
                        About SoilGuard
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6 max-w-5xl mx-auto"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Reviving Soil.</span> <br /> Empowering Farmers.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto font-medium"
                    >
                        SoilGuard was founded with a simple but powerful belief — healthy soil is the foundation of sustainable farming and farmer prosperity.
                    </motion.p>
                </div>
            </section>

            {/* The Problem / Mission */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-black mb-6">The Crisis & Our Response</h2>
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                                <p>
                                    In India, over <strong className="text-rose-500">50% of farmland is affected by soil degradation</strong> due to excessive chemical use, monocropping, and lack of personalized soil insights. Small and marginal farmers often receive delayed or generic soil reports that do not truly help them improve yield or restore land health.
                                </p>
                                <p>
                                    SoilGuard exists to change that. We combine bio-soil testing, smart IoT monitoring, AI-powered advisory systems, and regenerative farming practices to deliver affordable, real-time, and farmer-friendly soil solutions.
                                </p>
                                <p className="border-l-4 border-green-500 pl-6 text-slate-800 italic font-bold">
                                    "SoilGuard is not just an agri-tech initiative — it is a movement toward soil restoration and farmer empowerment."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Target className="w-8 h-8 text-green-500" /> Our Mission</h3>
                            <ul className="space-y-5">
                                {[
                                    "Replace harmful chemical dependency with eco-friendly regenerative inputs",
                                    "Make soil technology accessible to small and marginal farmers",
                                    "Provide ultra-affordable soil testing (₹50–₹100)",
                                    "Deliver multilingual AI support through WhatsApp",
                                    "Restore biodiversity and improve long-term soil fertility"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-300 font-medium leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <p className="text-green-400 font-bold">Building a climate-smart agricultural ecosystem protecting both farmers and the environment.</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900">What Makes SoilGuard Different</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[
                            { title: "Affordable bio-soil testing", icon: Sprout },
                            { title: "Smart Soil Sensor (NPK, Moisture, Temp, EC)", icon: ShieldCheck },
                            { title: "AI WhatsApp Chatbot – No app required", icon: Target },
                            { title: "Personalized soil health reports", icon: Leaf },
                            { title: "Focus on regenerative & sustainable farming", icon: CheckCircle }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center hover:shadow-lg transition-transform hover:-translate-y-2 flex flex-col items-center"
                            >
                                <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <f.icon className="w-8 h-8 text-green-600" />
                                </div>
                                <h4 className="font-bold text-slate-800 leading-snug">{f.title}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder & Contact Details */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Founder Profile */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 md:p-14 shadow-xl flex flex-col md:flex-row gap-10 items-center md:items-start"
                        >
                            <div className="shrink-0 w-48 h-48 md:w-56 md:h-56 rounded-full p-2 border-4 border-green-100 bg-white shadow-lg mx-auto md:mx-0">
                                {/* PLACEHOLDER PORTRAIT TO BE REPLACED */}
                                <img
                                    src="ceo.jpg"
                                    alt="Sankhacheta Pain"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div>
                                <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-2 block">Founder & CEO</span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Sankhacheta & Team</h2>
                                <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                                    <p>
                                        Sankhacheta founded SoilGuard with the vision of bridging the gap between science, technology, and rural agriculture. Her mission is to make soil health solutions affordable, accessible, and understandable for every farmer — especially small and marginal communities.
                                    </p>
                                    <p>Under her leadership, SoilGuard has:</p>
                                    <ul className="mb-4 space-y-2">
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Launched affordable Bio Soil Kits</li>
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Developing all types of soil testing kits</li>
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Built a digital platform for farmer support</li>
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Revived 300+ trees through bio-soil care initiatives</li>
                                    </ul>
                                    <p className="font-bold text-slate-800">
                                        Mriganka Bhowmick and Hrishikesh Jha are also working specially in product development and perfection to make SoilGuard a success.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Details & Vision */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 shadow-xl"
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <MapPin className="text-green-500 w-6 h-6" /> Our Location
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-300">Salt Lake Sector 2</p>
                                            <p className="text-slate-400">Kolkata, West Bengal, India</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-300">Call Us</p>
                                            <p className="text-slate-400">+91 6295784383</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-300">Email Us</p>
                                            <p className="text-slate-400">soilguard8@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute -bottom-10 -right-10 opacity-20"><Leaf className="w-40 h-40" /></div>
                                <h3 className="text-2xl font-black mb-4 relative z-10">Our Vision</h3>
                                <p className="text-green-50 font-medium leading-relaxed relative z-10 mb-6 font-serif italic text-lg shadow-sm">
                                    "We envision a future where every farmer has access to real-time soil intelligence, sustainable solutions, and affordable regenerative practices."
                                </p>
                                <div className="relative z-10 space-y-2 uppercase tracking-widest text-xs font-black">
                                    <p>Because when soil thrives, farmers thrive.</p>
                                    <p>And when farmers thrive, the nation grows.</p>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
