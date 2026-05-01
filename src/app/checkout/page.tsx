"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, CreditCard, Lock, ShieldCheck, QrCode } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("upi"); // or 'card'
    const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [shipping, setShipping] = useState({ address: "", city: "", state: "Andhra Pradesh", pinCode: "" });

    const handlePay = async () => {
        if (!mounted || cart.length === 0) return;
        setLoading(true);
        
        try {
            const formData = {
                items: cart,
                totalAmount: cartTotal,
                customerInfo: customer,
                shippingAddress: shipping
            };
            
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            if(!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to checkout. Ensure you are logged in!");
                setLoading(false);
                return;
            }

            setLoading(false);
            setStep(2);
            clearCart();
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Network error processing order!");
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">

            {/* Header */}
            <header className="bg-white border-b border-slate-100 py-6">
                <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img src="/logo.png" alt="SoilGuard" className="w-16 h-16 group-hover:scale-105 transition-transform" />
                        <span className="text-3xl font-bold tracking-tight">SoilGuard</span>
                    </Link>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Lock className="w-4 h-4" /> Secure Checkout
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 lg:px-12 py-12 max-w-5xl">
                <AnimatePresence mode="wait">

                    {/* Checkout Form */}
                    {step === 1 && (
                        <motion.div
                            key="checkout"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            <div className="lg:col-span-7 flex flex-col gap-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm shadow-sm">1</span>
                                        Shipping Information
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="First Name" className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors" value={customer.firstName} onChange={e => setCustomer({...customer, firstName: e.target.value})} />
                                        <input type="text" placeholder="Last Name" className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors" value={customer.lastName} onChange={e => setCustomer({...customer, lastName: e.target.value})} />
                                        <input type="email" placeholder="Email Address" className="col-span-2 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} />
                                        <input type="text" placeholder="Mobile Number (+91)" className="col-span-2 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
                                        <input type="text" placeholder="Address" className="col-span-2 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
                                        <input type="text" placeholder="City" className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />

                                        <select value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors appearance-none">
                                            <optgroup label="States">
                                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                                <option value="Assam">Assam</option>
                                                <option value="Bihar">Bihar</option>
                                                <option value="Chhattisgarh">Chhattisgarh</option>
                                                <option value="Goa">Goa</option>
                                                <option value="Gujarat">Gujarat</option>
                                                <option value="Haryana">Haryana</option>
                                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                <option value="Jharkhand">Jharkhand</option>
                                                <option value="Karnataka">Karnataka</option>
                                                <option value="Kerala">Kerala</option>
                                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Manipur">Manipur</option>
                                                <option value="Meghalaya">Meghalaya</option>
                                                <option value="Mizoram">Mizoram</option>
                                                <option value="Nagaland">Nagaland</option>
                                                <option value="Odisha">Odisha</option>
                                                <option value="Punjab">Punjab</option>
                                                <option value="Rajasthan">Rajasthan</option>
                                                <option value="Sikkim">Sikkim</option>
                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                <option value="Telangana">Telangana</option>
                                                <option value="Tripura">Tripura</option>
                                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                <option value="Uttarakhand">Uttarakhand</option>
                                                <option value="West Bengal">West Bengal</option>
                                            </optgroup>
                                            <optgroup label="Union Territories">
                                                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                                <option value="Chandigarh">Chandigarh</option>
                                                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra & Nagar Haveli and Daman & Diu</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                                <option value="Ladakh">Ladakh</option>
                                                <option value="Lakshadweep">Lakshadweep</option>
                                                <option value="Puducherry">Puducherry</option>
                                            </optgroup>
                                        </select>

                                        <input type="text" placeholder="PIN Code" className="col-span-2 md:col-span-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 focus:bg-white transition-colors" value={shipping.pinCode} onChange={e => setShipping({...shipping, pinCode: e.target.value})} />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                <div>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm shadow-sm">2</span>
                                        Payment Method
                                    </h2>

                                    <div className="flex gap-4 mb-6">
                                        <button
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`flex-1 py-4 border rounded-xl font-bold flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-white'}`}
                                        >
                                            <QrCode className="w-6 h-6" /> UPI / QR Code
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`flex-1 py-4 border rounded-xl font-bold flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-white'}`}
                                        >
                                            <CreditCard className="w-6 h-6" /> Cards / RuPay
                                        </button>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
                                            <div className="space-y-4">
                                                <input type="text" placeholder="Card Number (RuPay/Visa/MasterCard)" className="border border-slate-300 rounded-xl px-4 py-3 w-full focus:outline-none font-mono focus:ring-2 ring-green-500/50" defaultValue="**** **** **** 4242" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input type="text" placeholder="MM/YY" className="border border-slate-300 rounded-xl px-4 py-3 w-full focus:outline-none font-mono focus:ring-2 ring-green-500/50" defaultValue="12/26" />
                                                    <input type="text" placeholder="CVV" className="border border-slate-300 rounded-xl px-4 py-3 w-full focus:outline-none font-mono focus:ring-2 ring-green-500/50" defaultValue="***" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'upi' && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                                            <div className="w-32 h-32 mx-auto bg-white border border-slate-200 rounded-xl mb-4 flex items-center justify-center">
                                                <QrCode className="w-20 h-20 text-slate-400" />
                                            </div>
                                            <p className="font-bold text-slate-800 mb-2">Scan with any UPI App</p>
                                            <p className="text-sm text-slate-500 mb-4">PhonePe, Google Pay, Paytm, BHIM</p>
                                            <div className="relative max-w-xs mx-auto">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">UPI ID</span>
                                                <input type="text" placeholder="Enter UPI ID" className="border border-slate-300 rounded-xl py-3 w-full focus:outline-none focus:ring-2 ring-green-500/50 pl-20 pr-4 bg-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handlePay}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-3 mt-4"
                                >
                                    {loading ? <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span> : <>Pay ₹{mounted ? cartTotal : 499} <ArrowLeft className="w-5 h-5 rotate-180" /></>}
                                </button>
                                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                                    <ShieldCheck className="w-4 h-4 text-green-500" /> 100% Secure & encrypted by Razorpay
                                </div>
                            </div>

                            {/* Order Summary Summary */}
                            <div className="lg:col-span-5 relative">
                                <div className="sticky top-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                    <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                                    {!mounted || cart.length === 0 ? (
                                        <div className="text-center py-10 font-medium text-slate-500">Your cart is empty.</div>
                                    ) : (
                                        <>
                                            <div className="max-h-[300px] overflow-y-auto pr-2">
                                                {cart.map(item => (
                                                    <div key={item.id} className="flex items-center gap-6 mb-6">
                                                        <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                                                            <img src={item.img || "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop"} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 line-clamp-2">{item.name}</h4>
                                                            <p className="text-slate-500 text-sm mt-1">Qty: {item.quantity}</p>
                                                            <p className="font-bold text-lg mt-2">₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <hr className="border-slate-200 mb-6 mt-2" />

                                            <div className="space-y-3 text-slate-600 mb-6 font-medium">
                                                <div className="flex justify-between"><span>Subtotal (Excl. GST)</span><span>₹{(cartTotal * 0.82).toFixed(2)}</span></div>
                                                <div className="flex justify-between"><span>GST @ 18%</span><span>₹{(cartTotal * 0.18).toFixed(2)}</span></div>
                                                <div className="flex justify-between"><span>Shipping (Pan India)</span><span className="text-green-600 font-bold">FREE</span></div>
                                            </div>

                                            <hr className="border-slate-200 mb-6" />

                                            <div className="flex justify-between text-3xl font-black text-slate-900 mb-8">
                                                <span>Total</span>
                                                <span>₹{cartTotal}</span>
                                            </div>
                                        </>
                                    )}

                                    <div className="bg-green-50 text-green-800 p-4 rounded-xl flex gap-3 items-start border border-green-100">
                                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium">Includes 30-day money back guarantee and 1-year hardware warranty across India.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Success Screen */}
                    {step === 2 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                            className="flex flex-col items-center justify-center bg-white p-16 rounded-[3rem] shadow-sm max-w-2xl mx-auto text-center border border-slate-100 mt-10"
                        >
                            <div className="w-24 h-24 bg-green-50 text-green-500 border border-green-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    <CheckCircle className="w-12 h-12" />
                                </motion.div>
                            </div>
                            <h2 className="text-4xl font-black mb-4">Order Confirmed!</h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Your SoilGuard Bio Soil Kit is on its way. Expect delivery via Delhivery in 3-5 business days. We&apos;ve sent the order confirmation to <strong>{customer.email || "your email"}</strong>{customer.phone && <> and WhatsApp <strong>+91 {customer.phone}</strong></>}.
                            </p>

                            <div className="bg-slate-50 w-full p-6 rounded-2xl mb-10 border border-slate-200 shadow-sm flex items-center justify-between">
                                <div className="text-left">
                                    <h4 className="font-bold text-slate-800 mb-1">Order #SG-9824-IND</h4>
                                    <p className="text-sm text-slate-500">Placed on Oct 24</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Processing</span>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full">
                                <Link href="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full transition-colors w-full shadow-lg">Go to Dashboard</Link>
                                <Link href="/" className="bg-white hover:bg-slate-50 text-slate-800 font-bold py-4 px-8 rounded-full transition-colors w-full border border-slate-200">Back Home</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
