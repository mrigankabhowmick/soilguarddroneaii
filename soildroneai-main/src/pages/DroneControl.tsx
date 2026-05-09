import { useState, useEffect } from 'react';
import {
  Cpu, Battery, Wifi, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Home, AlertTriangle, MapPin, Gauge, RotateCcw, Play, Square,
  Clock, WifiOff, Usb, Radio, CheckCircle, Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';


function GaugeCircle({ value, max, label, unit, color }: { value: number; max: number; label: string; unit: string; color: string }) {
  const pct = value / max;
  const circumference = 2 * Math.PI * 36;
  const strokeDash = circumference * pct;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#1f2937" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-white">{value}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

type ConnStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

function DroneConnectionPanel() {
  const { droneIp, setDroneIp } = useApp();
  const [status, setStatus] = useState<ConnStatus>('disconnected');
  const [port, setPort] = useState('14550');
  const [protocol, setProtocol] = useState<'mavlink' | 'dji' | 'wifi'>('mavlink');
  const [showPanel, setShowPanel] = useState(true);
  const [connInfo, setConnInfo] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const connect = async () => {
    setStatus('connecting');
    setError('');
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/drone-connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          action: 'connect',
          ip: droneIp,
          port: parseInt(port),
          protocol,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setStatus('error');
        setError(data.error);
      } else {
        setStatus('connected');
        setConnInfo(data);
      }
    } catch {
      setStatus('error');
      setError('Network error — check your connection');
    }
  };

  const disconnect = async () => {
    try {
      await fetch(`${supabaseUrl}/functions/v1/drone-connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ action: 'disconnect' }),
      });
    } catch { /* ignore */ }
    setStatus('disconnected');
    setConnInfo(null);
  };

  const statusColors: Record<ConnStatus, string> = {
    disconnected: 'text-gray-500',
    connecting: 'text-yellow-400',
    connected: 'text-green-400',
    error: 'text-red-400',
  };

  const statusDots: Record<ConnStatus, string> = {
    disconnected: 'bg-gray-600',
    connecting: 'bg-yellow-400 animate-pulse',
    connected: 'bg-green-400',
    error: 'bg-red-400',
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">Drone Connection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusDots[status]}`} />
          <span className={`text-xs capitalize ${statusColors[status]}`}>{status}</span>
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700/50 px-2 py-1 rounded-lg transition-colors"
          >
            {showPanel ? 'Hide' : 'Setup'}
          </button>
        </div>
      </div>

      {showPanel && (
        <div className="space-y-4 border-t border-gray-800/50 pt-4">
          {/* Protocol selector */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Protocol</label>
            <div className="flex gap-2">
              {(['mavlink', 'dji', 'wifi'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setProtocol(p)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    protocol === p
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'border-gray-700/50 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {p === 'mavlink' ? 'MAVLink' : p === 'dji' ? 'DJI SDK' : 'WiFi Direct'}
                </button>
              ))}
            </div>
          </div>

          {/* IP and Port */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Drone IP</label>
              <input
                value={droneIp}
                onChange={e => setDroneIp(e.target.value)}
                className="w-full bg-gray-800/70 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-green-500/50"
                placeholder="192.168.1.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Port</label>
              <input
                value={port}
                onChange={e => setPort(e.target.value)}
                className="w-full bg-gray-800/70 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-green-500/50"
                placeholder="14550"
              />
            </div>
          </div>

          {/* Connect / Disconnect */}
          <div className="flex gap-2">
            {status === 'connected' ? (
              <button
                onClick={disconnect}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <WifiOff className="w-4 h-4" />
                Disconnect
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={status === 'connecting'}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'connecting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                {status === 'connecting' ? 'Connecting...' : 'Connect'}
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-400">{error}</div>
          )}

          {/* Connection info */}
          {connInfo && status === 'connected' && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Connection established</span>
              </div>
              {Array.isArray((connInfo.connection as Record<string, string>)?.instructions) && (
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-medium">Setup Instructions:</span>
                  {((connInfo.connection as Record<string, string[]>).instructions as string[]).map((inst, i) => (
                    <p key={i} className="text-xs text-gray-500 leading-relaxed">{inst}</p>
                  ))}
                </div>
              )}
              {Array.isArray((connInfo.connection as Record<string, string[]>)?.hardware_required) && (
                <div className="space-y-1 mt-2">
                  <span className="text-xs text-gray-400 font-medium">Hardware Required:</span>
                  {((connInfo.connection as Record<string, string[]>).hardware_required as string[]).map((hw, i) => (
                    <p key={i} className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Usb className="w-3 h-3 flex-shrink-0" />{hw}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hardware guide */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <span className="text-xs text-blue-400 font-semibold block mb-3">How to Connect Your Real Drone</span>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-xs text-blue-400 font-bold">1</div>
                <div>
                  <p className="text-xs text-gray-300 font-medium">Attach a companion computer to your drone</p>
                  <p className="text-xs text-gray-500 mt-0.5">Mount a Raspberry Pi Zero 2W or ESP32 on the drone. Connect it to the flight controller via UART/serial (MAVLink) or USB.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-xs text-blue-400 font-bold">2</div>
                <div>
                  <p className="text-xs text-gray-300 font-medium">Set up WiFi or 4G connectivity</p>
                  <p className="text-xs text-gray-500 mt-0.5">The companion computer needs network access. Use a WiFi dongle, a 4G/LTE HAT, or connect to the drone's own WiFi hotspot.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-xs text-blue-400 font-bold">3</div>
                <div>
                  <p className="text-xs text-gray-300 font-medium">Run MAVLink router on the companion computer</p>
                  <p className="text-xs text-gray-500 mt-0.5">Install <code className="text-blue-300 bg-blue-500/10 px-1 rounded">mavlink-router</code> or <code className="text-blue-300 bg-blue-500/10 px-1 rounded">MAVProxy</code> to forward telemetry from the flight controller to your device over UDP port 14550.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-xs text-blue-400 font-bold">4</div>
                <div>
                  <p className="text-xs text-gray-300 font-medium">Enter the drone's IP and click Connect</p>
                  <p className="text-xs text-gray-500 mt-0.5">Make sure your computer/phone is on the same network as the drone. Enter the companion computer's IP address (e.g. 192.168.1.1) and port 14550 above.</p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-500/10 space-y-1.5">
              <p className="text-xs text-gray-500"><strong className="text-gray-400">MAVLink (ArduPilot/PX4):</strong> Most common. Works with any ArduPilot or PX4 flight controller.</p>
              <p className="text-xs text-gray-500"><strong className="text-gray-400">DJI SDK:</strong> For DJI drones. Requires DJI Mobile SDK bridge app on an Android device connected to the remote.</p>
              <p className="text-xs text-gray-500"><strong className="text-gray-400">WiFi Direct:</strong> Some drones create their own WiFi network. Connect your device directly to it.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DroneControl() {
  const [tick, setTick] = useState(0);
  const [flying, setFlying] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [geofenceActive, setGeofenceActive] = useState(true);
  const [emergency, setEmergency] = useState(false);
  const [controlMode, setControlMode] = useState<'standard' | 'ufo'>('ufo');

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 800);
    return () => clearInterval(id);
  }, []);

  const battery = Math.max(0, 78 - tick * 0.05);
  const altitude = flying ? +(45 + Math.sin(tick * 0.3) * 3).toFixed(1) : 0;
  const speed = flying ? +(3.2 + Math.cos(tick * 0.4) * 0.5).toFixed(1) : 0;
  const signal = Math.min(100, 92 + Math.sin(tick * 0.2) * 5);

  const flightLog = [
    { time: '10:32 AM', event: 'Mission started – Zone A survey', type: 'info' },
    { time: '10:45 AM', event: 'Waypoint 1 reached at 48m altitude', type: 'success' },
    { time: '11:02 AM', event: 'Low moisture alert – Zone A detected', type: 'warning' },
    { time: '11:15 AM', event: 'Waypoint 2 reached – image captured', type: 'success' },
    { time: '11:28 AM', event: 'Battery below 50% – continuing flight', type: 'warning' },
    { time: '11:44 AM', event: 'Return-to-home triggered manually', type: 'info' },
  ];

  const waypoints = [
    { id: 1, lat: '28.6139°N', lng: '77.2090°E', alt: 50, status: 'done' },
    { id: 2, lat: '28.6155°N', lng: '77.2110°E', alt: 45, status: 'done' },
    { id: 3, lat: '28.6170°N', lng: '77.2095°E', alt: 55, status: 'active' },
    { id: 4, lat: '28.6150°N', lng: '77.2075°E', alt: 50, status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Control Mode Switcher */}
      <div className="flex items-center justify-between bg-gray-900/40 p-2 rounded-2xl border border-gray-800/50">
        <div className="flex gap-1">
          <button 
            onClick={() => setControlMode('standard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${controlMode === 'standard' ? 'bg-green-500 text-gray-950' : 'text-gray-500 hover:text-gray-300'}`}
          >
            STANDARD GCS
          </button>
          <button 
            onClick={() => setControlMode('ufo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${controlMode === 'ufo' ? 'bg-green-500 text-gray-950' : 'text-gray-500 hover:text-gray-300'}`}
          >
            RC UFO APP MODE
          </button>
        </div>
        <div className="px-3 text-[10px] font-bold text-green-400 uppercase tracking-widest animate-pulse">
          Direct UFO Link Active
        </div>
      </div>

      {controlMode === 'ufo' && (
        <div className="bg-black/40 border border-gray-800/50 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-50" />
          
          {/* Virtual Mobile Screen */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {/* Left Joystick (Throttle/Yaw) */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full bg-gray-900/80 border-4 border-gray-800 flex items-center justify-center relative shadow-2xl">
                <div className="absolute inset-4 rounded-full border border-gray-700/30" />
                <div className="w-16 h-16 rounded-full bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center cursor-move active:scale-95 transition-transform">
                  <div className="w-8 h-8 rounded-full border-2 border-white/20" />
                </div>
                <div className="absolute top-2 text-[10px] text-gray-600 font-bold uppercase">Throttle</div>
                <div className="absolute bottom-2 text-[10px] text-gray-600 font-bold uppercase">Yaw</div>
              </div>
            </div>

            {/* Center HUD */}
            <div className="flex flex-col items-center justify-center gap-6 py-4">
              <div className="w-48 h-24 bg-gray-900/90 border border-green-500/30 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-400/70 font-bold uppercase tracking-[0.2em] mb-1">Live Telemetry</span>
                <div className="text-3xl font-mono font-bold text-white tracking-tighter">
                  {altitude.toFixed(1)}<span className="text-sm text-gray-500 ml-1">m</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-white">{battery.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] text-white">{signal.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-[200px]">
                <button className="py-3 bg-red-500 text-white text-[10px] font-black rounded-xl shadow-lg shadow-red-500/20 active:translate-y-0.5 transition-all">EMERGENCY</button>
                <button className="py-3 bg-green-500 text-gray-950 text-[10px] font-black rounded-xl shadow-lg shadow-green-500/20 active:translate-y-0.5 transition-all">ONE-KEY TAKE OFF</button>
              </div>
            </div>

            {/* Right Joystick (Pitch/Roll) */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full bg-gray-900/80 border-4 border-gray-800 flex items-center justify-center relative shadow-2xl">
                <div className="absolute inset-4 rounded-full border border-gray-700/30" />
                <div className="w-16 h-16 rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center cursor-move active:scale-95 transition-transform">
                  <div className="w-8 h-8 rounded-full border-2 border-white/20" />
                </div>
                <div className="absolute top-2 text-[10px] text-gray-600 font-bold uppercase">Pitch</div>
                <div className="absolute bottom-2 text-[10px] text-gray-600 font-bold uppercase">Roll</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6">
            {['FLIP 360°', 'HEADLESS', 'SPEED L/H', 'CALIBRATE'].map(btn => (
              <button key={btn} className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Battery', value: battery.toFixed(0), unit: '%', icon: Battery, color: battery > 50 ? '#22c55e' : battery > 20 ? '#f59e0b' : '#ef4444' },
          { label: 'Signal', value: signal.toFixed(0), unit: '%', icon: Wifi, color: '#22c55e' },
          { label: 'Altitude', value: altitude, unit: 'm', icon: ArrowUp, color: '#3b82f6' },
          { label: 'Speed', value: speed, unit: 'm/s', icon: Gauge, color: '#8b5cf6' },
        ].map(item => (
          <div key={item.label} className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{item.value}<span className="text-sm text-gray-500 ml-1">{item.unit}</span></div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls + Connection */}
        <div className="space-y-4">
          {/* Drone Connection Panel */}
          <DroneConnectionPanel />

          {/* Flight toggle */}
          <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-5">
            <div className="text-sm font-medium text-white mb-4">Flight Control</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setFlying(!flying)}
                className={`py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
                  flying
                    ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                    : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                }`}
              >
                {flying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {flying ? 'Land' : 'Take Off'}
              </button>
              <button className="py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all">
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>

            {/* Emergency */}
            <button
              onClick={() => setEmergency(!emergency)}
              className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border ${
                emergency
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {emergency ? 'EMERGENCY ACTIVE' : 'Emergency Land'}
            </button>
          </div>

          {/* D-Pad */}
          <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-5">
            <div className="text-sm font-medium text-white mb-4">Manual Control</div>
            <div className="grid grid-cols-3 gap-2 max-w-36 mx-auto">
              <div />
              <button className="h-10 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <ArrowUp className="w-4 h-4" />
              </button>
              <div />
              <button className="h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <RotateCcw className="w-3 h-3" />
              </button>
              <button className="h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
              <div />
              <button className="h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <ArrowDown className="w-4 h-4" />
              </button>
              <div />
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Auto Mode</span>
                <button
                  onClick={() => setAutoMode(!autoMode)}
                  className={`w-9 h-5 rounded-full transition-colors ${autoMode ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full m-0.5 transition-transform ${autoMode ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Geofencing</span>
                <button
                  onClick={() => setGeofenceActive(!geofenceActive)}
                  className={`w-9 h-5 rounded-full transition-colors ${geofenceActive ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full m-0.5 transition-transform ${geofenceActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map + Gauges */}
        <div className="space-y-4">
          {/* Mini map */}
          <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800/50">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">GPS Tracking</span>
            </div>
            <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <svg className="absolute inset-0 w-full h-full opacity-40">
                <polyline points="60,120 100,80 150,100 190,60" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
              </svg>
              {[[60,120],[100,80],[150,100],[190,60]].map(([x,y],i) => (
                <div key={i} className={`absolute w-3 h-3 rounded-full border-2 ${i < 2 ? 'bg-green-500 border-green-400' : i === 2 ? 'bg-blue-500 border-blue-400 animate-pulse' : 'bg-gray-700 border-gray-600'}`}
                  style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }} />
              ))}
              <div className="absolute transition-all duration-800"
                style={{
                  left: `${40 + Math.sin(tick * 0.5) * 15}%`,
                  top: `${35 + Math.cos(tick * 0.4) * 10}%`,
                }}>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Cpu className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
              </div>
              {geofenceActive && (
                <div className="absolute top-3 left-3 right-3 bottom-3 border border-dashed border-blue-500/40 rounded-lg" />
              )}
              <div className="absolute bottom-2 right-2 text-xs text-gray-600 font-mono">
                {(28.6139 + Math.sin(tick * 0.3) * 0.0005).toFixed(4)}°N
              </div>
            </div>
          </div>

          {/* Gauges */}
          <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4">
            <div className="text-sm font-medium text-white mb-4">Telemetry</div>
            <div className="flex justify-around">
              <GaugeCircle value={Math.round(battery)} max={100} label="Battery" unit="%" color="#22c55e" />
              <GaugeCircle value={Math.round(signal)} max={100} label="Signal" unit="%" color="#3b82f6" />
              <GaugeCircle value={Math.round(altitude)} max={120} label="Altitude" unit="m" color="#8b5cf6" />
            </div>
          </div>
        </div>

        {/* Waypoints + Log */}
        <div className="space-y-4">
          {/* Waypoints */}
          <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Mission Waypoints</span>
            </div>
            <div className="space-y-2">
              {waypoints.map(wp => (
                <div key={wp.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                  wp.status === 'done' ? 'bg-green-500/5 border-green-500/20 text-gray-400' :
                  wp.status === 'active' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-gray-800/30 border-gray-700/30 text-gray-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                    wp.status === 'done' ? 'bg-green-500 text-white' :
                    wp.status === 'active' ? 'bg-blue-500 text-white animate-pulse' :
                    'bg-gray-700 text-gray-500'
                  }`}>{wp.id}</div>
                  <div className="flex-1">
                    <div>{wp.lat}</div>
                    <div className="text-gray-600">{wp.lng} · Alt {wp.alt}m</div>
                  </div>
                  <span className="capitalize">{wp.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flight log */}
          <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Flight Log</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {flightLog.map((entry, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-gray-600 flex-shrink-0 font-mono">{entry.time}</span>
                  <span className={
                    entry.type === 'warning' ? 'text-yellow-400' :
                    entry.type === 'success' ? 'text-green-400' : 'text-gray-400'
                  }>{entry.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
