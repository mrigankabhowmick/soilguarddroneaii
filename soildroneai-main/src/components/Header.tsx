import { useState } from 'react';
import { Bell, Sun, Moon, Menu, Wifi, Battery, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pageTitles: Record<string, string> = {
  dashboard: 'Mission Control Dashboard',
  camera: 'Live Camera System',
  'drone-control': 'Drone Control Center',
  'ai-monitor': 'AI Monitoring System',
  gallery: 'Media Gallery',
  analytics: 'Analytics & Insights',
  sustainability: 'Sustainability Hub',
  settings: 'Settings',
};

export default function Header() {
  const { theme, setTheme, currentPage, sidebarOpen, setSidebarOpen, setConnectivityHubOpen, alerts, unreadAlerts, activeDrone } = useApp();
  const [showAlerts, setShowAlerts] = useState(false);
  const recent = alerts.slice(0, 5);

  return (
    <header className="h-14 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 flex items-center gap-4 px-4 relative z-30">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden text-gray-500 hover:text-gray-300 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h2 className="text-sm font-semibold text-white">{pageTitles[currentPage] || currentPage}</h2>
        <p className="text-xs text-gray-500">SoilGuard AI Platform</p>
      </div>

      {/* Drone status pill */}
      {activeDrone && (
        <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 rounded-full px-3 py-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            activeDrone.status === 'online' || activeDrone.status === 'flying'
              ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
          }`} />
          <span className="text-xs text-gray-300">{activeDrone.name}</span>
          <Battery className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-400">{activeDrone.battery_level}%</span>
          <Wifi className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-400">{activeDrone.signal_strength}%</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Voice */}
        <button className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 flex items-center justify-center text-gray-500 hover:text-green-400 transition-all">
          <Mic className="w-4 h-4" />
        </button>

        {/* Connectivity Hub Toggle */}
        <button
          onClick={() => setConnectivityHubOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 transition-all group"
          title="Connect Hardware"
        >
          <Wifi className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold hidden md:inline">Connect</span>
        </button>

        {/* Theme */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 flex items-center justify-center text-gray-500 hover:text-yellow-400 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Alerts */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 flex items-center justify-center text-gray-500 hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-10 w-80 bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <span className="text-sm font-medium text-white">Alerts</span>
                <span className="text-xs text-gray-500">{unreadAlerts} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-800/50">
                {recent.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">No alerts</div>
                ) : recent.map(a => (
                  <div key={a.id} className={`px-4 py-3 ${!a.is_read ? 'bg-green-500/5' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                        a.severity === 'critical' ? 'bg-red-500' :
                        a.severity === 'high' ? 'bg-orange-500' :
                        a.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="text-xs font-medium text-white">{a.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
