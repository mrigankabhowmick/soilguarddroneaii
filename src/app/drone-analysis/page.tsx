"use client";

import React, { useState } from 'react';
import { Upload, AlertCircle, Activity, Loader2, Download } from 'lucide-react';
import { analyzeFieldImage } from './geminiService';
import { AgriAnalysis } from './types';
import Dashboard from './Dashboard';
import Link from 'next/link';

export default function DroneAnalysisPage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AgriAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFieldImage(image);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Please try again or check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // @ts-ignore
      const domtoimage = (await import('dom-to-image-more')).default;
      
      const jsPDFModule = await import('jspdf');
      const JsPDF = jsPDFModule.default || (jsPDFModule as any).jsPDF;
      
      const element = document.getElementById('report-container');
      if (!element) {
          setIsDownloading(false);
          return;
      }
      
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="padding: 20px; text-align: center; border-bottom: 2px solid #10b981; margin-bottom: 20px; font-family: sans-serif;">
          <h1 style="color: #064e3b; margin: 0; font-size: 24px;">SoilGuard Professional Analysis Report</h1>
          <p style="color: #64748b; margin: 5px 0 0 0;">Report Generated: ${new Date().toLocaleString()} | Location: Drone Coverage Area Alpha</p>
        </div>
      `;
      element.insertBefore(header, element.firstChild);

      try {
        const imgData = await domtoimage.toPng(element, { bgcolor: '#f8fafc' });
        const pdf = new JsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        // Assume default dashboard ratio makes it around 1.3 to 1.5 w/h ratio,
        // Calculate dynamic height (or just scale image directly)
        
        const img = new Image();
        img.src = imgData;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const pdfHeight = (img.height * pdfWidth) / img.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('SoilGuard_Analysis_Report.pdf');
      } finally {
        element.removeChild(header);
      }
    } catch (err: any) {
      console.error("PDF Generate Error", err);
      alert("Failed to generate PDF: " + (err?.message || err));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        
        {/* Intro / Upload Section */}
        {!analysis && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Precision Field Analysis Dashboard</h2>
              <p className="text-slate-600 text-lg">Upload your drone imagery to receive comprehensive health metrics, weed detection, and actionable agricultural insights right here inside SoilGuard.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {!previewUrl ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="bg-emerald-50 p-4 rounded-full mb-4">
                    <Upload className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload Drone Image</h3>
                  <p className="text-sm text-slate-500">Supports JPG, PNG (Max 10MB)</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-xl overflow-hidden shadow-inner bg-slate-100 aspect-video flex items-center justify-center">
                    <img src={previewUrl} alt="Field Preview" className="max-h-full max-w-full object-contain" />
                    {loading && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 className="h-10 w-10 animate-spin mb-3" />
                        <p className="font-medium">Analyzing Field Data...</p>
                        <p className="text-sm text-white/80">Detecting crop health, weeds, and moisture levels.</p>
                      </div>
                    )}
                  </div>
                  
                  {!loading && (
                    <div className="flex gap-4">
                      <button 
                        onClick={handleAnalyze}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Activity className="h-5 w-5" />
                        Run Analysis
                      </button>
                      <button 
                        onClick={handleReset}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {analysis && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Analysis Report</h2>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                  >
                    {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {isDownloading ? "Generating PDF..." : "Download PDF Report"}
                  </button>
                  <button 
                    onClick={handleReset}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Upload className="h-4 w-4" />
                    Analyze New Image
                  </button>
                </div>
             </div>
             <div id="report-container" className="p-4 bg-slate-50">
               <Dashboard data={analysis} imagePreview={previewUrl} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
