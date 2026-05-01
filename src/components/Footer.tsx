import Link from "next/link";
import { Leaf, ShieldCheck, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900 mt-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0 opacity-10 blur-3xl rounded-full bg-green-500 w-[500px] h-[500px] -bottom-40 left-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 group mb-6">
                            <img src="/logo.png" alt="SoilGuard" className="w-16 h-16 group-hover:scale-105 transition-transform" />
                            <span className="text-3xl font-bold tracking-tight text-white">
                                SoilGuard
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-6 max-w-sm">
                            AI Powered Smart Soil Intelligence for Modern Farmers. Revolutionizing agriculture with data-driven insights.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://www.instagram.com/soil_guard" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
                            <a href="https://www.linkedin.com/in/soil-guard-166878386/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-sm hover:text-green-500 transition-colors">Home</Link></li>
                            <li><Link href="/shop" className="text-sm hover:text-green-500 transition-colors">Shop</Link></li>
                            <li><Link href="/features" className="text-sm hover:text-green-500 transition-colors">Features</Link></li>
                            <li><Link href="/about" className="text-sm hover:text-green-500 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Products</h4>
                        <ul className="space-y-3">
                            <li><Link href="/shop" className="text-sm hover:text-green-500 transition-colors">Bio Soil Kit</Link></li>
                            <li><Link href="/shop" className="text-sm hover:text-green-500 transition-colors">Extra Probes</Link></li>
                            <li><Link href="/shop" className="text-sm hover:text-green-500 transition-colors">Drone Module</Link></li>
                            <li><Link href="/dashboard" className="text-sm hover:text-green-500 transition-colors">App Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>+91 6295784383</li>
                            <li>soilguard8@gmail.com</li>
                            <li>Salt Lake Sector 2, Kolkata</li>
                        </ul>
                        <div className="mt-6 flex flex-col gap-3">
                            <input type="email" placeholder="Subscribe to newsletter" className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 w-full" />
                            <button className="bg-green-600 hover:bg-green-500 text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors w-full">Subscribe</button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} You know who made this. hrishikesh jha  </p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
