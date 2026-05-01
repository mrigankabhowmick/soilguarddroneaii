"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { ArrowRight, Star, CheckCircle, BarChart3, Wifi, Droplets, Shield, Leaf, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const testimonials = [
  {
    name: "Ratan Mondal",
    location: "Nadia, West Bengal",
    quote: "আগে আমি আন্দাজে সার দিতাম। মাটির আসল সমস্যাটা বুঝতাম না। SoilGuard-এর টেস্ট করানোর পর জানতে পারলাম আমার জমিতে পটাশের ঘাটতি ছিল। এখন সঠিক পরামর্শ মেনে চাষ করছি, ফলন আগের থেকে অনেক ভালো হয়েছে।",
    initials: "RM"
  },
  {
    name: "Biplab Sardar",
    location: "Murshidabad, West Bengal",
    quote: "SoilGuard-এর WhatsApp চ্যাটবট আমার খুব উপকার করেছে। ফোনেই রিপোর্ট পাই, সহজ ভাষায় বুঝিয়ে দেয় কী করতে হবে। এখন অযথা বেশি রাসায়নিক ব্যবহার করতে হয় না।",
    initials: "BS"
  },
  {
    name: "Subhashis Halder",
    location: "Hooghly, West Bengal",
    quote: "আমাদের এলাকায় মাটির গুণগত মান কমে যাচ্ছিল। SoilGuard-এর বায়ো-সয়েল কিট ব্যবহার করার পর জমির অবস্থার উন্নতি হয়েছে। খরচও কম, আর ফলনও ভালো।",
    initials: "SH"
  }
];

export default function Home() {
  const [activeImage, setActiveImage] = useState("/biokit1.jpeg");
  const kitImages = [
    "/biokit1.jpeg",
    "/biokit2.jpeg",
    "/biokit3.jpeg"
  ];
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ id: "bio-soil-kit", name: "SoilGuard Premium Bio Soil Kit", price: 499, quantity: qty, img: kitImages[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fadeIn: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <video
          src="/bg-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        ></video>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md pointer-events-none"></div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-6 lg:px-12 flex flex-col items-center justify-center text-center pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-white tracking-tight leading-tight max-w-4xl drop-shadow-lg"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" }}
          >
            Soil Guard
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl font-bold text-white/95 mt-4 tracking-[0.2em] uppercase drop-shadow-md"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
          >
            Nature's Ally Farmer's Friend
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 mt-6 max-w-3xl font-medium leading-relaxed drop-shadow-md"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
          >
            Empowering farmers and nature lovers with premium soil solutions. From sustainable farming to lush gardens, we&apos;re your trusted partner in nurturing the earth. AI-powered recommendations, quality tested, delivered to your doorstep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            <Link href="/checkout" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-slate-900/20 flex items-center gap-2">
              Buy Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Product Showcase (Minimal Apple Style) */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Product Image Gallery */}
            <div className="relative group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 p-8 flex flex-col items-center justify-center">
              <img
                src={activeImage}
                alt="SoilGuard Kit"
                className="w-full h-auto object-cover rounded-xl transition-transform duration-700 max-h-[500px]"
              />
              <div className="flex gap-4 mt-6 z-10 relative">
                {kitImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumbnail ${i}`}
                    className={`w-20 h-20 rounded-xl object-cover cursor-pointer hover:shadow-lg transition-all border-2 ${activeImage === img ? 'border-green-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    onClick={() => setActiveImage(img)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <span className="text-green-600 font-bold tracking-widest text-sm uppercase mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4" /> SoilGuard AI
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                Bio Soil Kit
              </h2>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-amber-500" />)}
                </div>
                <span className="text-slate-600 text-sm hover:underline cursor-pointer">4.9 (1,280 reviews)</span>
              </div>

              <div className="text-5xl font-bold text-slate-900 mb-3">
                ₹499
              </div>

              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Premium organic fertilizer mix containing essential nutrients to dramatically improve your soil health and crop yields. 100% natural, tested for purity, and completely eco-friendly. Rejuvenate your garden or farm.
              </p>

              <div className="space-y-4 mb-10">
                {['Rich in essential NPK and organic carbon', 'Boosts root development & plant immunity', 'Sustainably sourced and organically packed'].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-slate-200 rounded-full bg-white px-4 py-3 shadow-sm select-none">
                  <span onClick={() => setQty(Math.max(1, qty - 1))} className="text-slate-400 cursor-pointer hover:text-green-600 font-bold px-3">-</span>
                  <span className="font-bold text-slate-800 px-3 w-8 text-center">{qty}</span>
                  <span onClick={() => setQty(qty + 1)} className="text-slate-400 cursor-pointer hover:text-green-600 font-bold px-3">+</span>
                </div>
                <button
                  onClick={handleAdd}
                  className={`flex-1 font-bold py-4 rounded-full shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${added ? "bg-green-500 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                >
                  {added ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white overflow-hidden relative border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Smart Inside. Beautiful Outside.</h2>
            <p className="text-lg text-slate-600">Powered by enterprise-grade sensors, streamlined into an elegant hardware design.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, t: "Real-time Soil Monitoring", d: "Sub-second data latency for temperature, moisture, and pH levels." },
              { icon: Cpu, t: "AI Fertility Grade", d: "Machine learning algorithms assign a dynamic A/B/C fertility score." },
              { icon: Droplets, t: "NPK Detection", d: "Accurate Nitrogen, Phosphorus, and Potassium balance checking." },
              { icon: Shield, t: "Sensor Error Detection", d: "Self-diagnostic alerts you automatically via the companion app." },
              { icon: Wifi, t: "IoT Dashboard Sync", d: "Seamless 5G & Jio/Airtel IoT connectivity to sync wherever you are." },
              { icon: Leaf, t: "Drone Mapping Ready", d: "Integrate area scan grids directly from standard agriculture drones." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }
                } as any}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.t}</h3>
                <p className="text-slate-600 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 text-center text-slate-900">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6">Your Farmland, at a Glance.</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">Access rich analytics with Apple Health-inspired UI. Track multi-zone fertility parameters simultaneously.</p>
            <Link href="/dashboard" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-slate-800 transition-transform inline-block">
              Explore Dashboard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto max-w-5xl rounded-[2.5rem] bg-white p-4 sm:p-6 shadow-2xl border border-slate-200"
          >
            {/* Mock Dashboard UI inside */}
            <div className="w-full bg-[#f8fafc] rounded-[2rem] overflow-hidden p-6 flex flex-col gap-6 text-left relative">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">Farm Zone Alpha</h4>
                  <p className="text-sm text-slate-500">Live Sync • 2s ago</p>
                </div>
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400 text-xs">IMG</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Temperature', 'Humidity', 'Moisture', 'Nitrogen (N)'].map((l, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="text-sm font-semibold text-slate-500 mb-2">{l}</div>
                    <div className="text-3xl font-black text-slate-800">{[24, 65, 82, 140][i]}<span className="text-base text-slate-400 font-normal ml-1">{['°C', '%', '%', 'ppm'][i]}</span></div>
                    <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 ${['bg-red-500', 'bg-blue-500', 'bg-cyan-500', 'bg-green-500'][i]}`}></div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1 shadow-sm">AI Fertility Grade</h3>
                  <p className="text-green-50 font-medium">Your soil health is excellent.</p>
                </div>
                <div className="text-6xl font-black italic drop-shadow-md">A+</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 mb-16">Trusted by leading agronomists.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-500 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-500" />)}
                  </div>
                  <p className="text-slate-700 italic mb-6 leading-relaxed">
                    &quot;{t.quote}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-slate-500 border border-slate-200 shadow-sm">{t.initials}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
