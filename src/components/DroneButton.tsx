"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function DroneButton() {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <Link href="/drone-analysis">
                <motion.div
                    whileHover={{ y: -10, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border border-white/50 dark:border-slate-800 rounded-full px-6 py-3 flex items-center gap-3 cursor-pointer"
                >
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full relative overflow-hidden">
                        <span className="text-xl leading-none">🚁</span>
                        <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Drone Scan</span>
                        <span className="text-[10px] text-green-600 font-medium">Activate AI Mapping</span>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
