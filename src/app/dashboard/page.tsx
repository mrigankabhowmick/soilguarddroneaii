"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Filler, Legend
} from 'chart.js';
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, LogOut, Bell, RefreshCw, Activity, Droplets, Leaf, Shield, CheckCircle, Sparkles, Truck, ShoppingBag, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import Chatbot from "@/components/Chatbot";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function Dashboard() {
    const [mounted, setMounted] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);

    // Core telemetry
    const [data, setData] = useState({
        temp: 24.5, humidity: 62, n: 140, p: 45, k: 80, moisture: 38, isError: false, grade: 'A+'
    });

    const [lastUpdated, setLastUpdated] = useState<string>("");

    // Real-time Graphs Data
    const [chartData, setChartData] = useState<number[]>([22, 23, 23, 24, 24.5, 24.6, 24.5]);
    const [moistChartData, setMoistChartData] = useState<number[]>([40, 42, 39, 38, 38.5, 37.8, 38.0]);

    // AI Summary State
    const [aiSummary, setAiSummary] = useState<string>("Initializing Gemini AI...");
    const [generating, setGenerating] = useState(true);

    const generateAISummary = async (currentData: any) => {
        setGenerating(true);
        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentData)
            });
            const result = await res.json();
            setAiSummary(result.summary || "No response generated.");
        } catch (e) {
            setAiSummary("Failed to fetch AI analysis. System remains nominal.");
        }
        setGenerating(false);
    };

    useEffect(() => {
        setMounted(true);
        setLastUpdated(new Date().toLocaleTimeString());
        generateAISummary(data);

        // Simulate real-time updates every 10s
        const interval = setInterval(() => {
            setData(prev => {
                const newTemp = prev.temp + (Math.random() - 0.5) * 0.5;
                const newMoist = prev.moisture + (Math.random() - 0.5);
                const hasError = Math.random() > 0.98;

                setChartData(cData => [...cData.slice(1), newTemp]);
                setMoistChartData(m => [...m.slice(1), newMoist]);

                return {
                    ...prev,
                    temp: parseFloat(newTemp.toFixed(1)),
                    moisture: parseFloat(newMoist.toFixed(1)),
                    isError: hasError,
                    grade: newTemp > 30 || newMoist < 20 ? 'B-' : 'A+'
                };
            });
            setLastUpdated(new Date().toLocaleTimeString());
        }, 10000);

        // Fetch user personal orders
        fetch('/api/orders?limit=5')
            .then(res => res.json())
            .then(data => {
                if (data.orders) setOrders(data.orders);
            }).catch(e => console.error("Error fetching orders:", e));

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        setLastUpdated(new Date().toLocaleTimeString());
        await generateAISummary(data);
        setRefreshing(false);
    };

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            // @ts-ignore
            const domtoimage = (await import('dom-to-image-more')).default;
            
            const jsPDFModule = await import('jspdf');
            const JsPDF = jsPDFModule.default || (jsPDFModule as any).jsPDF;

            const element = document.getElementById('main-dashboard-report');
            if (!element) {
                setIsDownloading(false);
                return;
            }
            
            const header = document.createElement('div');
            header.innerHTML = `
              <div style="padding: 20px; text-align: center; border-bottom: 2px solid #10b981; margin-bottom: 20px; font-family: sans-serif;">
                <h1 style="color: #064e3b; margin: 0; font-size: 24px;">SoilGuard Professional Dashboard Report</h1>
                <p style="color: #64748b; margin: 5px 0 0 0;">Report Generated: ${new Date().toLocaleString()} | Context: Alpha Zone</p>
              </div>
            `;
            element.insertBefore(header, element.firstChild);

            // Temporarily hide the download button to prevent it from appearing in the PDF
            const btn = document.getElementById('download-pdf-btn');
            if (btn) btn.style.display = 'none';

            try {
              const imgData = await domtoimage.toPng(element, { bgcolor: '#f8fafc' });
              const pdf = new JsPDF('p', 'mm', 'a4');
              const pdfWidth = pdf.internal.pageSize.getWidth();
              
              const img = new Image();
              img.src = imgData;
              
              await new Promise((resolve) => {
                img.onload = resolve;
              });

              const pdfHeight = (img.height * pdfWidth) / img.width;
              
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
              pdf.save('SoilGuard_Dashboard_Report.pdf');
            } finally {
              element.removeChild(header);
              if (btn) btn.style.display = 'flex';
            }
        } catch (err: any) {
            console.error("PDF Generate Error", err);
            alert("Failed to generate PDF: " + (err?.message || err));
        } finally {
            setIsDownloading(false);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-slate-50"></div>;

    // Chart Configuration Objects
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false } },
        scales: { x: { display: false }, y: { display: false, min: 15, max: 35 } },
        elements: { line: { tension: 0.4 }, point: { radius: 0 } }
    };

    const moistOptions = {
        ...chartOptions,
        scales: { x: { display: false }, y: { display: false, min: 20, max: 60 } }
    }

    const tempChartObj = {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
            fill: true, data: chartData,
            borderColor: 'rgb(245, 158, 11)', // Amber-500
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
        }],
    };

    const moistChartObj = {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
            fill: true, data: moistChartData,
            borderColor: 'rgb(59, 130, 246)', // Blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
        }],
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-500/30 selection:text-green-900 transition-colors duration-300 pb-20 overflow-hidden">

            {/* Top App Bar */}
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-md shadow-green-500/20">
                            <Leaf className="w-4 h-4" />
                        </div>
                        <span className="text-slate-900">SoilGuard <span className="text-slate-400 font-normal">Dashboard</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button onClick={handleRefresh} className={`p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors ${refreshing ? 'animate-spin text-green-500' : ''}`}>
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <div className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">
                            <Bell className="w-5 h-5 text-slate-500" />
                            {data.isError && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>}
                        </div>
                        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-500 transition-colors ml-4 bg-slate-100 px-4 py-2 rounded-full shadow-sm">
                            <LogOut className="w-4 h-4" /> Exit
                        </Link>
                    </div>
                </div>
            </header>

            {/* Global Decorational Glows */}
            <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-green-400/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Content */}
            <main id="main-dashboard-report" className="container mx-auto px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full text-xs shadow-sm shadow-slate-200 mb-3">
                            <Shield className="w-3.5 h-3.5 text-green-500" /> Alpha Zone
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Mission Control</h1>
                        <p className="text-slate-500 text-sm font-medium flex items-center gap-3">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            Active Sync • Last recorded: <strong className="text-slate-700">{lastUpdated}</strong>
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <button 
                            id="download-pdf-btn"
                            disabled={isDownloading}
                            onClick={handleDownloadPdf}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                        >
                            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {isDownloading ? "Generating PDF..." : "Download PDF Report"}
                        </button>
                        <AnimatePresence>
                            {data.isError && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span className="text-sm font-bold">Probe Disconnected: Sensor 4</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* AI Gemini Summarization Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-1 mb-10 shadow-xl shadow-green-500/20"
                >
                    <div className="bg-white rounded-[1.4rem] p-6 lg:p-8 flex items-start gap-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-green-50 rounded-bl-full pointer-events-none"></div>

                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
                            <Sparkles className="text-white w-8 h-8" />
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-xl font-black text-slate-900">Gemini AI Summary</h2>
                                {generating && <span className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>}
                            </div>
                            <p className="text-slate-700 text-lg leading-relaxed font-medium">
                                {aiSummary}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Data Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Col 1: System Core Status */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Fertility Index</h3>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">System Health</p>
                            </div>
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-green-200 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Optimal
                            </div>
                        </div>
                        <div className="mt-8 flex justify-between items-end">
                            <div className="text-7xl font-black tracking-tighter text-slate-900">{data.grade}</div>
                            <Leaf className="w-12 h-12 text-green-500 opacity-20" />
                        </div>
                    </div>

                    {/* Col 2: High/Low Ranges (Double Graph) */}
                    <div className="flex flex-col gap-6">
                        {/* Temperature Graph */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100 flex flex-col h-48 relative overflow-hidden group">
                            <div className="absolute -right-5 -top-5 w-20 h-20 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><Activity className="w-5 h-5" /></div>
                                    <h3 className="font-bold text-slate-800">Soil Temp Axis</h3>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{data.temp}°</div>
                            </div>
                            <div className="flex-1 w-full relative -mx-2 bg-gradient-to-b from-transparent to-white"><Line data={tempChartObj} options={chartOptions} /></div>
                        </div>

                        {/* Moisture Graph */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100 flex flex-col h-48 relative overflow-hidden group">
                            <div className="absolute -right-5 -top-5 w-20 h-20 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Droplets className="w-5 h-5" /></div>
                                    <h3 className="font-bold text-slate-800">Moisture Trend</h3>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{data.moisture}%</div>
                            </div>
                            <div className="flex-1 w-full relative -mx-2 bg-gradient-to-b from-transparent to-white"><Line data={moistChartObj} options={moistOptions} /></div>
                        </div>
                    </div>

                    {/* Col 3: Real NPK & Air Humidity Levels */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between h-full">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 mb-8 border-b border-slate-100 pb-4">Realtime NPK Yield</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Nitrogen (N) - Growth Target', val: data.n, max: 200, color: 'bg-green-500' },
                                    { label: 'Phosphorus (P) - Root Yield', val: data.p, max: 100, color: 'bg-emerald-500' },
                                    { label: 'Potassium (K) - Health Index', val: data.k, max: 150, color: 'bg-teal-500' },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-bold text-slate-600">{item.label}</span>
                                            <span className="font-black text-slate-900">{item.val} <span className="text-xs text-slate-400 font-bold uppercase">mg/kg</span></span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                className={`h-full ${item.color} rounded-full`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.val / item.max) * 100}%` }}
                                                transition={{ type: "spring", stiffness: 40 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 font-mono tracking-tighter">O2</div>
                                    <span className="font-bold text-slate-700">Air Humidity</span>
                                </div>
                                <span className="font-black text-2xl text-slate-900">{data.humidity}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                                <motion.div className="h-full bg-slate-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${data.humidity}%` }} />
                            </div>
                        </div>

                    </div>

                </div>

                {/* E-Commerce Order Tracking Section */}
                <div className="mt-8 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6 text-indigo-500" />
                            Recent Purchases & Active Shipments
                        </h3>
                        {orders.length > 0 && (
                            <div className="flex items-center gap-3">
                                <Link href="/shop" className="text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors bg-slate-100 px-4 py-2 rounded-full">Shop</Link>
                                <Link href="/orders" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full">Track Orders →</Link>
                            </div>
                        )}
                    </div>

                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                <Truck className="w-8 h-8 opacity-50" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 mb-2">No active orders found</h4>
                            <p className="text-slate-500 max-w-sm font-medium mb-6">You haven't purchased any smart farming products or fertilizers yet.</p>
                            <Link href="/shop" className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-full transition-colors shadow-lg shadow-slate-900/20">
                                Visit the Store
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {orders.map((order, i) => (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={order._id} className="flex gap-6 items-center p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 hover:shadow-sm transition-all shadow-slate-200/30">
                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                        <Truck className={`w-8 h-8 ${order.status === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Order #{order._id.substring(order._id.length - 6)}</span>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 truncate">{order.items[0]?.name} {order.items.length > 1 && `+${order.items.length - 1} more`}</h4>
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="text-xs font-medium text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </main>

            <Chatbot />
        </div>
    );
}
