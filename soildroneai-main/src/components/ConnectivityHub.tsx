import { useState, useRef } from 'react';
import { 
  X, Wifi, Radio, HardDrive, Cpu, CheckCircle, 
  Loader2, Upload, Cloud, FolderOpen, Info, Shield, Zap, Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';


type Tab = 'drone' | 'sdcard';

export default function ConnectivityHub() {
  const { isConnectivityHubOpen, setConnectivityHubOpen } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('drone');
  
  if (!isConnectivityHubOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connectivity Hub</h3>
              <p className="text-xs text-gray-500">Link your hardware to the AI platform</p>
            </div>
          </div>
          <button 
            onClick={() => setConnectivityHubOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-800 bg-gray-900/30">
          <button 
            onClick={() => setActiveTab('drone')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
              activeTab === 'drone' ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Radio className="w-4 h-4" />
            Drone Connection
            {activeTab === 'drone' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('sdcard')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
              activeTab === 'sdcard' ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            SD Card Scan
            {activeTab === 'sdcard' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 rounded-full" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'drone' ? <DroneTab /> : <SDCardTab />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
            <Info className="w-3 h-3" />
            Secure End-to-End Link
          </div>
          <button 
            onClick={() => setConnectivityHubOpen(false)}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DroneTab() {
  const { setActiveDrone, droneIp, setDroneIp } = useApp();
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [port, setPort] = useState('8080');
  const [protocol, setProtocol] = useState<'mavlink' | 'dji' | 'wifi'>('wifi');
  const [isScanningQR, setIsScanningQR] = useState(false);

  const connect = async () => {
    setStatus('connecting');
    // Simulate connection for 1.5s
    setTimeout(() => {
      setStatus('connected');
      // Update global state to make the connection real across the app
      setActiveDrone({
        id: 'ufo-284513',
        name: 'WIFI-UFO-284513',
        status: 'online',
        battery_level: 85,
        signal_strength: 94,
        user_id: 'current-user',
        last_seen: new Date().toISOString()
      } as any);
    }, 1500);
  };

  const scanQRCode = () => {
    setIsScanningQR(true);
    // Simulate camera scan
    setTimeout(() => {
      // Logic to simulate different QR results
      const isCloudRelay = Math.random() > 0.5;
      
      if (isCloudRelay) {
        setProtocol('mavlink');
        setDroneIp('cloud-relay.soilguard.ai');
        setPort('443');
      } else {
        setProtocol('wifi');
        setDroneIp('192.168.1.1');
        setPort('8080');
      }
      
      setIsScanningQR(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Protocol</label>
            <button 
              onClick={scanQRCode}
              className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20 hover:bg-green-500/20 transition-all flex items-center gap-1"
            >
              <Camera className="w-3 h-3" />
              {isScanningQR ? 'Scanning...' : 'Scan QR'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
              {(['mavlink', 'dji', 'wifi'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setProtocol(p)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    protocol === p
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-400'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {protocol === 'wifi' ? 'Network SSID' : 'IP Address'}
              </label>
              <input
                value={protocol === 'wifi' && droneIp === '192.168.1.1' ? 'WIFI-UFO-284513' : droneIp}
                onChange={e => setDroneIp(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-3 text-[13px] text-white font-mono focus:outline-none focus:border-green-500/50"
                placeholder={protocol === 'wifi' ? 'WIFI-UFO-XXXXXX' : '192.168.1.1'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Port</label>
              <input
                value={port}
                onChange={e => setPort(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-green-500/50"
                placeholder="14550"
              />
            </div>
          </div>

          <button
            onClick={status === 'connected' ? () => { setStatus('disconnected'); setActiveDrone(null); } : connect}
            disabled={status === 'connecting'}
            className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all ${
              status === 'connected' 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-green-500 text-gray-950 hover:bg-green-400 shadow-lg shadow-green-500/20'
            }`}
          >
            {status === 'connecting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             status === 'connected' ? <X className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            {status === 'connecting' ? 'Establishing Link...' : 
             status === 'connected' ? 'Terminate Connection' : 'Connect to Drone'}
          </button>
          </div>

        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-5 flex flex-col justify-center text-center">
          <div className="mb-4 flex justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              status === 'connected' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
              status === 'connecting' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 animate-pulse' :
              'bg-gray-800 border-gray-700 text-gray-600'
            }`}>
              <Cpu className="w-8 h-8" />
            </div>
          </div>
          <h4 className="text-white font-bold mb-1">
            {status === 'connected' ? 'Drone Linked' : status === 'connecting' ? 'Connecting...' : 'No Active Link'}
          </h4>
          <p className="text-xs text-gray-500">
            {status === 'connected' ? 'Telemetry data is streaming to the dashboard.' : 'Ready to pair with companion computer.'}
          </p>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
        <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Quick Setup Guide
        </h5>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Hardware Attachment', text: 'Connect a Raspberry Pi or ESP32 to your Flight Controller via UART.' },
            { step: 2, title: 'Network Config', text: 'Ensure both your device and the companion computer are on the same WiFi.' },
            { step: 3, title: 'Initiate Link', text: 'Enter the companion IP and click Connect above.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-xs text-blue-400 font-bold">
                {item.step}
              </div>
              <div>
                <p className="text-xs text-gray-200 font-bold mb-0.5">{item.title}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SDCardTab() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scan = async () => {
    setScanning(true);
    // Simulate scan
    setTimeout(() => {
      setScanResult({
        total_files: 14,
        total_size_mb: '142.5',
        source: 'sd_card'
      });
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl text-center">
            <HardDrive className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-bold mb-1">Direct SD Scan</h4>
            <p className="text-xs text-gray-500 mb-4">Fastest way to import mission media</p>
            <button
              onClick={scan}
              disabled={scanning}
              className="w-full py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-bold hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
            >
              {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
              {scanning ? 'Searching Media...' : 'Scan SD Drive'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
            <div className="relative flex justify-center"><span className="bg-gray-950 px-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">OR</span></div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select Files Manually
          </button>
          <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,video/*" />
        </div>

        <div className="space-y-4">
          {scanResult ? (
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-green-400 mb-4 font-bold text-sm">
                <CheckCircle className="w-4 h-4" /> Media Detected
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-white">{scanResult.total_files}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">New Files</div>
                </div>
                <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-white">{scanResult.total_size_mb} <span className="text-sm">MB</span></div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Volume</div>
                </div>
              </div>
              <button className="w-full mt-4 py-3 bg-green-500 text-gray-950 rounded-xl text-sm font-bold hover:bg-green-400 transition-all flex items-center justify-center gap-2">
                <Cloud className="w-4 h-4" /> Sync to Cloud
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[160px] bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center p-6">
              <HardDrive className="w-8 h-8 text-gray-700 mb-2" />
              <p className="text-xs text-gray-600 font-medium">Connect your SD card reader to view scan results here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
        <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Connection Steps
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-bold flex-shrink-0 mt-0.5">1</div>
            <p className="text-[11px] text-gray-400 leading-relaxed"><strong className="text-gray-300">Eject Card:</strong> Remove the microSD from the drone camera slot.</p>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-bold flex-shrink-0 mt-0.5">2</div>
            <p className="text-[11px] text-gray-400 leading-relaxed"><strong className="text-gray-300">Insert:</strong> Use a card reader or your laptop's SD slot.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
