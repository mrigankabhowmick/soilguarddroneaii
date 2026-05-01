"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-6">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl"
            >
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="SoilGuard" className="w-16 h-16" />
                </div>

                <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Welcome to SoilGuard</h2>
                <p className="text-center text-slate-500 text-sm mb-8">Access your smart farm dashboard</p>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-3 h-12"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Sign In with Google
                </button>
            </motion.div>

            <div className="mt-8 text-center text-slate-500 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secured by Google Authentication
            </div>
        </div>
    );
}
