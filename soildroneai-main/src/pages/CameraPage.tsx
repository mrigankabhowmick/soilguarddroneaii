import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera, Sun,
  RotateCcw,
  Download, Wifi, Monitor,
  Loader2, CheckCircle, X, Upload, Cpu, Brain, Activity, Droplets, Leaf as LeafIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeAgriculturalImage, type AnalysisResult } from '../lib/gemini';
import { useApp } from '../context/AppContext';

type VisionMode = 'normal' | 'thermal' | 'night' | 'ndvi';
type FeedSource = 'laptop' | 'ufo';


function FeedOverlay({ mode, tick }: { mode: VisionMode; tick: number }) {
  if (mode === 'thermal') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-orange-700/40 to-yellow-600/30" />
        <div className="absolute top-4 left-4 bg-black/50 rounded px-2 py-1 text-xs text-orange-300 font-mono">THERMAL</div>
        <div className="absolute bottom-4 right-4 flex gap-1 items-center bg-black/50 rounded px-2 py-1 text-xs text-orange-300">
          <span>Min: 18°C</span><span className="mx-1">|</span><span>Max: 34°C</span>
        </div>
        <div className="absolute top-1/3 left-1/4 w-16 h-12 bg-red-500/30 rounded-full blur-md" style={{ transform: `scale(${1 + Math.sin(tick * 0.5) * 0.1})` }} />
        <div className="absolute top-1/2 right-1/3 w-12 h-10 bg-orange-500/30 rounded-full blur-md" />
      </div>
    );
  }
  if (mode === 'night') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gray-900/70" />
        <div className="absolute top-4 left-4 bg-black/50 rounded px-2 py-1 text-xs text-green-300 font-mono">NIGHT VISION</div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.08),transparent_70%)]" />
      </div>
    );
  }
  if (mode === 'ndvi') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 via-lime-700/30 to-yellow-600/20" />
        <div className="absolute top-4 left-4 bg-black/50 rounded px-2 py-1 text-xs text-lime-300 font-mono">NDVI ANALYSIS</div>
        <div className="absolute bottom-4 left-4 flex gap-1.5 bg-black/50 rounded px-2 py-1">
          {[['#ef4444','Low'],['#f97316','Med'],['#84cc16','Good'],['#22c55e','High']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-0.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
              <span className="text-[9px] text-gray-300">{l}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function LaptopCameraFeed({ visionMode, tick, onSnapshot }: { visionMode: VisionMode; tick: number; onSnapshot: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStatus, setCameraStatus] = useState<'off' | 'requesting' | 'on' | 'error'>('off');
  const [errorMsg, setErrorMsg] = useState('');
  const [facingMode] = useState<'user' | 'environment'>('user');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraStatus('off');
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    setCameraStatus('requesting');
    setErrorMsg('');
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (!deviceId && videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }

      setCameraStatus('on');
    } catch (err) {
      setCameraStatus('error');
      const name = (err as DOMException).name;
      if (name === 'NotAllowedError') {
        setErrorMsg('Camera permission denied. Click the camera icon in your browser address bar to allow access.');
      } else if (name === 'NotFoundError') {
        setErrorMsg('No camera found. Make sure a webcam is connected.');
      } else if (name === 'NotReadableError') {
        setErrorMsg('Camera is in use by another application. Close other apps using the camera.');
      } else {
        // Absolute fallback
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = fallbackStream;
          setCameraStatus('on');
        } catch (finalErr) {
          setErrorMsg(`Camera access failed. Ensure no other app is using the camera.`);
          setCameraStatus('error');
        }
      }
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (cameraStatus === 'on' && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.onloadedmetadata = () => {
        video.play().catch(e => console.error("Play failed:", e));
      };
      // For some browsers, we need to call play manually again
      video.play().catch(() => {});
    }
  }, [cameraStatus]);

  const switchDevice = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    await startCamera(deviceId);
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSnapshot(dataUrl);
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const videoFilter = visionMode === 'night'
    ? 'grayscale(1) brightness(0.4) hue-rotate(90deg)'
    : visionMode === 'thermal'
    ? 'saturate(2) hue-rotate(180deg)'
    : 'none';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {cameraStatus === 'on' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
            >
              <X className="w-3 h-3" />
              Stop Camera
            </button>
            <button
              onClick={() => startCamera(selectedDevice || undefined)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Feed
            </button>
          </div>
        ) : (
          <button
            onClick={() => startCamera(selectedDevice || undefined)}
            disabled={cameraStatus === 'requesting'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all disabled:opacity-50"
          >
            {cameraStatus === 'requesting' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Monitor className="w-3 h-3" />}
            {cameraStatus === 'requesting' ? 'Connecting...' : 'Start Camera'}
          </button>
        )}

        {cameraStatus === 'on' && (
          <>
            <button
              onClick={takeSnapshot}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
            >
              <Camera className="w-3 h-3" />
              Snapshot
            </button>
            {devices.length > 1 && (
              <select
                value={selectedDevice}
                onChange={e => switchDevice(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-2 py-2 text-xs text-gray-300 focus:outline-none focus:border-green-500/50"
              >
                {devices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Camera ${devices.indexOf(d) + 1}`}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>

      <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden">
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          {cameraStatus === 'on' ? (
            <>
              <video
                id="laptop-camera-feed-video"
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: videoFilter }}
              />
              <FeedOverlay mode={visionMode} tick={tick} />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-lg px-2.5 py-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-white font-mono">LIVE</span>
                <span className="text-xs text-gray-400 font-mono ml-1">Camera</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 font-mono">
                {new Date().toLocaleTimeString()}
              </div>
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-1/2 w-px h-4 bg-white/30 -translate-x-1/2" />
                  <div className="absolute bottom-0 left-1/2 w-px h-4 bg-white/30 -translate-x-1/2" />
                  <div className="absolute left-0 top-1/2 h-px w-4 bg-white/30 -translate-y-1/2" />
                  <div className="absolute right-0 top-1/2 h-px w-4 bg-white/30 -translate-y-1/2" />
                  <div className="absolute inset-1/4 border border-white/20 rounded-sm" />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              {cameraStatus === 'error' ? (
                <div className="text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-sm text-red-400 mb-1">Camera Error</p>
                  <p className="text-xs text-gray-500 max-w-xs">{errorMsg || 'SoilGuard AI Platform'}</p>
                </div>
              ) : cameraStatus === 'requesting' ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-green-400 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Requesting camera access...</p>
                  <p className="text-xs text-gray-600 mt-1">Click "Allow" in the browser prompt</p>
                </div>
              ) : (
                <div className="text-center px-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                    <Cpu className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-sm text-gray-300 mb-1 font-bold">SoilGuard <span className="text-green-400">AI</span></p>
                  <p className="text-xs text-gray-500 max-w-xs">Click "Start Camera" to connect your webcam. You can take snapshots and apply AI vision filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

function UfoCameraFeed({ visionMode, tick }: { visionMode: VisionMode; tick: number }) {
  const { droneIp, setDroneIp } = useApp();
  const streamUrl = `http://${droneIp}:8080/?action=stream`;
  const [error, setError] = useState(false);

  const videoFilter = visionMode === 'night'
    ? 'grayscale(1) brightness(0.4) hue-rotate(90deg)'
    : visionMode === 'thermal'
    ? 'saturate(2) hue-rotate(180deg)'
    : 'none';

  const [loading, setLoading] = useState(true);
  const [presetsOpen, setPresetsOpen] = useState(false);

  const streamPresets = [
    { name: 'Standard (8080)', url: `http://${droneIp}:8080/?action=stream` },
    { name: 'Alternate (81)', url: `http://${droneIp}:81/stream` },
    { name: 'Direct (80)', url: `http://${droneIp}/stream` },
    { name: 'MJPEG Path', url: `http://${droneIp}:8080/mjpeg` },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
          <Wifi className="w-3 h-3 text-green-400" />
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Linked: {droneIp === '192.168.1.100' ? 'UFO-284513' : 'Remote Drone'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase font-bold">IP:</span>
          <input 
            type="text" 
            value={droneIp} 
            onChange={(e) => setDroneIp(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-[10px] text-white font-mono w-28 focus:outline-none focus:border-green-500/50"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setPresetsOpen(!presetsOpen)}
            className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            Presets
          </button>
          {presetsOpen && (
            <div className="absolute top-8 left-0 z-50 bg-gray-900 border border-gray-800 rounded-xl p-2 shadow-2xl min-w-[120px] space-y-1">
              {streamPresets.map(p => (
                <button 
                  key={p.name}
                  onClick={() => {
                    // Logic to handle preset selection if needed
                    setPresetsOpen(false);
                    setError(false);
                    setLoading(true);
                  }}
                  className="w-full text-left text-[9px] text-gray-400 hover:text-white hover:bg-gray-800 px-2 py-1 rounded transition-all"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {loading && !error && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20">
            <Loader2 className="w-3 h-3 text-yellow-400 animate-spin" />
            <span className="text-[9px] text-yellow-400 font-bold">PROBING...</span>
          </div>
        )}
      </div>
      
      <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          {!error ? (
            <>
              <img 
                src={streamUrl} 
                alt="UFO Camera Stream"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                style={{ filter: videoFilter }}
                onLoad={() => setLoading(false)}
                onError={() => { setError(true); setLoading(false); }}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 text-green-400 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Handshaking with {droneIp}...</p>
                  </div>
                </div>
              )}
              <FeedOverlay mode={visionMode} tick={tick} />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-lg px-2.5 py-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-white font-mono uppercase">RC UFO LIVE</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 font-mono">
                {new Date().toLocaleTimeString()}
              </div>
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-32 h-32 border border-white/20 rounded-full" />
                <div className="absolute w-px h-10 bg-white/40" />
                <div className="absolute w-10 h-px bg-white/40" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-center p-8">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <Wifi className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-white font-bold mb-2">No Stream Detected</h4>
              <p className="text-xs text-gray-500 max-w-sm">
                Ensure your device is connected to the <span className="text-white font-mono">WIFI-UFO-284513</span> hotspot and the drone is powered on.
              </p>
              <button 
                onClick={() => setError(false)}
                className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Retry Connection
              </button>
              <button 
                onClick={async () => {
                  try {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                    setError(false);
                  } catch (e) {
                    alert("Camera access denied or device not found.");
                  }
                }}
                className="mt-2 px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-bold rounded-xl transition-all border border-blue-500/30"
              >
                Request Permissions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SnapshotGallery({ snapshots, onDismiss, onAnalyze }: { snapshots: string[]; onDismiss: (i: number) => void; onAnalyze: (i: number) => void }) {
  const [saving, setSaving] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState<number | null>(null);
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const saveToCloud = async (index: number) => {
    setSaving(index);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Simulation mode
        await new Promise(r => setTimeout(r, 1500));
        setSaved(prev => new Set(prev).add(index));
        return;
      }

      const res = await fetch(snapshots[index]);
      const blob = await res.blob();
      const file = new File([blob], `snapshot-${Date.now()}.jpg`, { type: 'image/jpeg' });

      const filePath = `${user.id}/${Date.now()}-snapshot.jpg`;
      const { error } = await supabase.storage
        .from('drone-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      await supabase.from('media_files').insert({
        user_id: user.id,
        file_name: file.name,
        file_url: supabase.storage.from('drone-media').getPublicUrl(filePath).data.publicUrl,
        file_type: 'image',
        file_size_mb: +(blob.size / 1024 / 1024).toFixed(2),
        ai_tags: [],
      });

      setSaved(prev => new Set(prev).add(index));
    } catch {
    } finally {
      setSaving(null);
    }
  };

  const download = (index: number) => {
    const a = document.createElement('a');
    a.href = snapshots[index];
    a.download = `soilguard-snapshot-${index + 1}.jpg`;
    a.click();
  };

  if (snapshots.length === 0) return null;

  return (
    <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium text-white">Captured Snapshots</span>
        <span className="text-xs text-gray-500 ml-auto">{snapshots.length} captured</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {snapshots.map((snap, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-800/50">
            <img src={snap} alt={`Snapshot ${i + 1}`} className="w-full aspect-video object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => download(i)}
                className="w-8 h-8 bg-green-500/80 rounded-lg flex items-center justify-center text-white hover:bg-green-500 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => saveToCloud(i)}
                disabled={saving === i || saved.has(i)}
                className="w-8 h-8 bg-blue-500/80 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                title="Save to cloud"
              >
                {saving === i ? <Loader2 className="w-4 h-4 animate-spin" /> :
                 saved.has(i) ? <CheckCircle className="w-4 h-4" /> :
                 <Upload className="w-4 h-4" />}
              </button>
              <button
                onClick={async () => {
                  setAnalyzing(i);
                  await onAnalyze(i);
                  setAnalyzing(null);
                }}
                disabled={analyzing === i}
                className="w-8 h-8 bg-purple-500/80 rounded-lg flex items-center justify-center text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
                title="AI Analysis"
              >
                {analyzing === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onDismiss(i)}
                className="w-8 h-8 bg-red-500/80 rounded-lg flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {saved.has(i) && (
              <div className="absolute top-1.5 right-1.5 bg-green-500 rounded-full p-0.5">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CameraPage() {
  const [feedSource, setFeedSource] = useState<FeedSource>('laptop');
  const [visionMode, setVisionMode] = useState<VisionMode>('normal');
  const [fullscreen] = useState(false);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [analysisReport, setAnalysisReport] = useState<{ result: AnalysisResult; image: string } | null>(null);
  const { droneIp } = useApp();

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);



  const handleSnapshot = (dataUrl: string) => {
    setSnapshots(prev => [dataUrl, ...prev]);
  };

  const dismissSnapshot = (index: number) => {
    setSnapshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async (index: number) => {
    try {
      const result = await analyzeAgriculturalImage(snapshots[index]);
      setAnalysisReport({ result, image: snapshots[index] });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  return (
    <div className="space-y-4">
      {analysisReport && (
        <AiReportModal
          report={analysisReport.result}
          image={analysisReport.image}
          onClose={() => setAnalysisReport(null)}
        />
      )}
      <title>SoilGuard AI — Advanced Drone Analysis Platform</title>
      <div className="flex gap-2">
        <button
          onClick={() => setFeedSource('laptop')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            feedSource === 'laptop'
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'border-gray-700/50 text-gray-500 hover:text-gray-300'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Camera
        </button>
        <button
          onClick={() => setFeedSource('ufo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            feedSource === 'ufo'
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              : 'border-gray-700/50 text-gray-500 hover:text-gray-300'
          }`}
        >
          <Cpu className="w-4 h-4" />
          UFO Direct
        </button>
      </div>

      <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-black flex flex-col p-4 gap-4' : ''}`}>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 space-y-4">
            {feedSource === 'laptop' ? (
              <LaptopCameraFeed visionMode={visionMode} tick={tick} onSnapshot={handleSnapshot} />
            ) : (
              <UfoCameraFeed visionMode={visionMode} tick={tick} />
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-1.5">
                {(['normal', 'thermal', 'night', 'ndvi'] as VisionMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setVisionMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      visionMode === m
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'text-gray-500 hover:text-gray-300 border border-gray-700/50'
                    }`}
                  >
                    {m === 'ndvi' ? 'NDVI' : m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
            </div>

            <SnapshotGallery snapshots={snapshots} onDismiss={dismissSnapshot} onAnalyze={handleAnalyze} />
          </div>

          <div className="w-full lg:w-64 space-y-4">
            {feedSource === 'laptop' && (
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Camera</span>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <p>Connect your camera to get a live feed.</p>
                  <p>Take snapshots and save them directly to your cloud gallery.</p>
                  <p className="text-gray-600">Vision filters (Thermal, Night, NDVI) apply in real-time to the camera feed.</p>
                </div>
              </div>
            )}

            {feedSource === 'ufo' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wifi className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">UFO Direct Stream</span>
                </div>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>Streaming from <span className="text-white font-mono">{droneIp}:8080</span>.</p>
                  <p>This protocol bypasses the cloud for ultra-low latency diagnostics.</p>
                  <p className="text-blue-300 font-bold">Compatible with boingdv.rcufo hardware.</p>
                </div>
              </div>
            )}

            <TorchPanel />


            <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4">
              <div className="text-sm font-medium text-white mb-3">AI Features</div>
              <div className="space-y-2">
                {[
                  { label: 'Image Stabilization', active: true },
                  { label: 'Object Tracking', active: true },
                  { label: 'Motion Detection', active: false },
                  { label: 'Auto Exposure', active: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <div className={`w-7 h-4 rounded-full transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-700'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white m-0.5 transition-transform ${item.active ? 'translate-x-3' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiReportModal({ report, image, onClose }: { report: AnalysisResult; image: string; onClose: () => void }) {
  const statusColors = {
    Excellent: 'text-green-400',
    Good: 'text-emerald-400',
    Moderate: 'text-yellow-400',
    Poor: 'text-red-400'
  };

  const healthWidth = {
    Excellent: '100%',
    Good: '75%',
    Moderate: '50%',
    Poor: '25%'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-gray-950 border border-gray-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Professional Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50 bg-gray-900/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Expert Agricultural Diagnostic Report</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono">SoilGuard AI Analysis Engine</span>
                <div className="w-1 h-1 rounded-full bg-gray-700" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Confidence:</span>
                  <span className={`text-[10px] font-bold font-mono ${report.confidenceLevel === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {report.confidenceLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-800 rounded-2xl transition-all border border-transparent hover:border-gray-700">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Top Section: Overview & Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border-2 border-gray-800 shadow-inner group">
                <img src={image} alt="Analyzed area" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Health Status</span>
                  <span className={`text-sm font-black italic uppercase ${statusColors[report.healthStatus.rating]}`}>
                    {report.healthStatus.rating}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700/30">
                  <div 
                    className={`h-full transition-all duration-1000 bg-gradient-to-r ${
                      report.healthStatus.rating === 'Excellent' ? 'from-green-600 to-green-400' :
                      report.healthStatus.rating === 'Good' ? 'from-emerald-600 to-emerald-400' :
                      report.healthStatus.rating === 'Moderate' ? 'from-yellow-600 to-yellow-400' : 'from-red-600 to-red-400'
                    }`}
                    style={{ width: healthWidth[report.healthStatus.rating] }}
                  />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-medium italic">"{report.healthStatus.explanation}"</p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-20 h-20 text-purple-400" />
                </div>
                <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-3">1. Overall Diagnosis</h4>
                <p className="text-lg text-gray-200 font-medium leading-relaxed">
                  {report.overallDiagnosis}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-5">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Problems Identified</h4>
                  <ul className="space-y-2">
                    {report.problems.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-5">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Preventive Measures</h4>
                  <ul className="space-y-2">
                    {report.preventiveMeasures.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-blue-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">2. Detailed Field Analysis</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Soil Condition', val: report.detailedAnalysis.soilCondition, icon: Droplets, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { label: 'Plant Health', val: report.detailedAnalysis.plantHealth, icon: LeafIcon, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: 'Pests & Diseases', val: report.detailedAnalysis.pestsDiseases, icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10' },
                { label: 'Water Status', val: report.detailedAnalysis.waterAvailability, icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Nutrients', val: report.detailedAnalysis.nutrientCondition, icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              ].map(item => (
                <div key={item.label} className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4 transition-all hover:bg-gray-800/50 group">
                  <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">{item.label}</span>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-medium">{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment & Recommendations */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">3. Professional Treatment Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6 hover:bg-green-500/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xs font-black text-green-400">NPK</div>
                  <h5 className="text-sm font-bold text-white">Fertilizer Advice</h5>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{report.recommendations.fertilizer}</p>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-6 hover:bg-blue-500/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400"><Droplets className="w-5 h-5" /></div>
                  <h5 className="text-sm font-bold text-white">Irrigation Strategy</h5>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{report.recommendations.irrigation}</p>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/20 rounded-3xl p-6 hover:bg-orange-500/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xs font-black text-orange-400"><LeafIcon className="w-5 h-5" /></div>
                  <h5 className="text-sm font-bold text-white">Soil Improvement</h5>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{report.recommendations.soilImprovement}</p>
              </div>

              {report.recommendations.pestControl && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 hover:bg-red-500/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xs font-black text-red-400"><Activity className="w-5 h-5" /></div>
                    <h5 className="text-sm font-bold text-white">Pest & Disease Control</h5>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">{report.recommendations.pestControl}</p>
                </div>
              )}

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-3xl p-6 hover:bg-gray-800/50 transition-colors sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-700/30 flex items-center justify-center text-xs font-black text-gray-400"><Sun className="w-5 h-5" /></div>
                  <h5 className="text-sm font-bold text-white">Crop Management Tips</h5>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{report.recommendations.cropManagement}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Branding */}
        <div className="p-6 border-t border-gray-800/50 bg-gray-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 font-mono">SoilGuard AI v2.4 Platform | Expert Protocol Active</span>
          </div>
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-green-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-[0_10px_20px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95"
          >
            Acknowledge Report
          </button>
        </div>
      </div>
    </div>
  );
}

function TorchPanel() {
  const [on, setOn] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [sos, setSos] = useState(false);

  return (
    <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-4 h-4 ${on ? 'text-yellow-400' : 'text-gray-600'} transition-colors`}>
          <Sun className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-white">Torch Control</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { setOn(!on); if (sos) setSos(false); }}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
            on ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'border-gray-700 text-gray-500 hover:text-gray-300'
          }`}
        >
          {on ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => { setSos(!sos); if (!sos) setOn(true); }}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
            sos ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'border-gray-700 text-gray-500 hover:text-gray-300'
          }`}
        >
          SOS
        </button>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Brightness</span>
          <span>{brightness}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={brightness}
          onChange={e => setBrightness(+e.target.value)}
          disabled={!on}
          className="w-full accent-yellow-400 disabled:opacity-40"
        />
      </div>
    </div>
  );
}
