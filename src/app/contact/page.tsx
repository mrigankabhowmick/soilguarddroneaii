"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Leaf, Handshake, Sprout, Send } from "lucide-react";

export default function Contact() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden flex flex-col">
            <Navbar />

            {/* Header section */}
            <section className="pt-32 pb-16 bg-white relative border-b border-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-white to-white pointer-events-none"></div>
                <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm uppercase tracking-widest"
                    >
                        <Leaf className="w-4 h-4" />
                        Get in Touch
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6"
                    >
                        Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">SoilGuard</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto font-medium"
                    >
                        We’re here to support farmers, partners, and organizations committed to sustainable agriculture and soil restoration.
                    </motion.p>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-20 flex-grow relative z-10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left Column: Direct Contact Info & Partnerships */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            {/* Primary Contact Card */}
                            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl">
                                <h3 className="text-2xl font-black mb-8 text-slate-900">Direct Contact</h3>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100 group-hover:bg-green-100 transition-colors">
                                            <MapPin className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-1">Office Location</p>
                                            <p className="font-medium text-slate-800 text-lg">Salt Lake Sector 2<br />Kolkata, West Bengal, India</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-100 transition-colors">
                                            <Phone className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-1">Phone</p>
                                            <a href="tel:+916295784383" className="font-bold text-slate-800 text-xl hover:text-blue-600 transition-colors">+91 6295784383</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-100 transition-colors">
                                            <Mail className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-1">Email</p>
                                            <a href="mailto:soilguard8@gmail.com" className="font-bold text-slate-800 text-xl hover:text-amber-600 transition-colors break-all">soilguard8@gmail.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Partnerships Card */}
                            <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                                <div className="flex items-start gap-4 mb-4">
                                    <Handshake className="w-8 h-8 text-green-400 shrink-0" />
                                    <h3 className="text-xl font-black">For Partnerships & CSR</h3>
                                </div>
                                <p className="text-slate-300 font-medium leading-relaxed pl-12">
                                    We collaborate with NGOs, CSR initiatives, agricultural communities, and sustainability-focused organizations. Reach out to explore partnership opportunities.
                                </p>
                            </div>
                        </motion.div>

                        {/* Right Column: Contact Form & Farmer Support */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Farmer Support Notice */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-[2rem] p-8 shadow-lg flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md">
                                    <Sprout className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black mb-2">Farmer Support</h3>
                                    <p className="text-green-50 font-medium leading-relaxed text-sm">
                                        Need help with soil testing, bio-soil kits, or smart sensor guidance? Our team and AI advisory system are ready to assist you.
                                    </p>
                                </div>
                            </div>

                            {/* Message Form Placeholder */}
                            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl">
                                <h3 className="text-2xl font-black mb-6 text-slate-900">Send a Message</h3>
                                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                                            <input type="text" placeholder="nomoskar ami gram panchayat..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-600 ml-1">Phone Number</label>
                                            <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                                        <input type="email" placeholder="panchayatexample.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-600 ml-1">How can we help you?</label>
                                        <textarea rows={4} placeholder="ami kotha bolte chai..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-medium resize-none"></textarea>
                                    </div>
                                    <button type="button" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-4">
                                        Send Message <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>

                        </motion.div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
