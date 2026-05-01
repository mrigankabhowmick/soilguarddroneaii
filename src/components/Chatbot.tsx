"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Sprout, Globe, ChevronDown, Paperclip, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: 'Hello! I am Krishi Sathi, your AI agricultural expert. I can communicate in any language and assist you with anything from soil health to crop yields. How can I help? (नमस्ते / வணக்கம் / నమస్కారం / নমস্কার)' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const languages = ["English", "Hindi (हिंदी)", "Bengali (বাংলা)", "Tamil (தமிழ்)", "Telugu (తెలుగు)", "Marathi (मराठी)"];
    
    const [attachments, setAttachments] = useState<{name: string, data: string}[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.type !== 'application/pdf') {
                    alert('Only PDF reports are supported.');
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                   const base64 = (reader.result as string).split(',')[1];
                   setAttachments(prev => [...prev, { name: file.name, data: base64 }]);
                };
            });
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        
        const userInput = input;
        const currentAttachments = [...attachments];
        
        let userMessageUI = userInput;
        if (currentAttachments.length > 0) {
            userMessageUI += ` [Attached ${currentAttachments.length} PDF(s)]`;
        }
        
        setMessages(prev => [...prev, { role: 'user', text: userMessageUI }]);
        setInput("");
        setAttachments([]);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userInput, language: selectedLanguage, pdfDataArray: currentAttachments })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.reply || "Sorry, I couldn't understand that." }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: "Network error. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

                {/* Chat Window */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-[360px] max-w-[calc(100vw-48px)] h-[550px] max-h-[70vh] flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 text-green-600 rounded-full shadow-sm flex items-center justify-center">
                                        <Sprout className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Krishi Sathi</h3>
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                                            <p className="text-xs text-green-100">Online | Smart Agriculture Expert</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Language Selector */}
                            <div className="relative border-b border-slate-100 shrink-0">
                                <button
                                    onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-3 h-3 text-green-500" />
                                        Language: {selectedLanguage}
                                    </div>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {languageMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-xl z-20 flex flex-col py-1"
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => { setSelectedLanguage(lang); setLanguageMenuOpen(false); }}
                                                    className="px-4 py-2 text-xs text-left text-slate-600 hover:bg-green-50 hover:text-green-700 w-full transition-colors flex items-center justify-between"
                                                >
                                                    {lang}
                                                    {selectedLanguage === lang && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3.5 text-sm ${msg.role === 'user'
                                                ? 'bg-slate-900 text-white rounded-2xl rounded-br-sm shadow-md'
                                                : 'bg-white border-slate-200 border text-slate-800 rounded-2xl rounded-bl-sm shadow-sm'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border-slate-200 border text-slate-800 rounded-2xl rounded-bl-sm shadow-sm p-3.5 text-sm flex gap-1 items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t border-slate-200 bg-white shrink-0">
                                {/* Attachments preview */}
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {attachments.map((a, i) => (
                                            <div key={i} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md border border-green-200">
                                                <FileText className="w-3 h-3 shrink-0" />
                                                <span className="truncate max-w-[120px]">{a.name}</span>
                                                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500 shrink-0"><X className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden focus-within:ring-2 ring-green-500/50 focus-within:bg-white transition-all shadow-sm">
                                    <input 
                                       type="file" 
                                       id="file-upload" 
                                       accept="application/pdf" 
                                       multiple 
                                       className="hidden" 
                                       onChange={handleFileUpload} 
                                    />
                                    <label htmlFor="file-upload" className="p-2.5 ml-1 cursor-pointer text-slate-400 hover:text-green-600 transition-colors">
                                        <Paperclip className="w-4 h-4" />
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ask or attach PDF reports..."
                                        className="w-full bg-transparent px-2 py-3 text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                                        disabled={loading}
                                    />
                                    <button
                                        disabled={(!input.trim() && attachments.length === 0) || loading}
                                        onClick={handleSend}
                                        className={`p-2.5 mr-1 rounded-full flex items-center justify-center transition-all ${(input.trim() || attachments.length > 0) && !loading ? 'bg-green-500 text-white shadow-md hover:scale-105' : 'bg-transparent text-slate-300'
                                            }`}
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-500 text-white p-4 justify-center items-center shadow-2xl rounded-full flex z-50 transition-colors relative"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Sprout className="w-7 h-7" />}

                    {/* Sparkles decoration for AI */}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 text-base drop-shadow-md">✨</span>
                    )}
                </motion.button>
            </div>
        </>
    );
}
