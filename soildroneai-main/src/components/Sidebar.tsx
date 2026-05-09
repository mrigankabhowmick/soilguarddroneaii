import React from 'react';
import {
  Leaf, Camera, Cpu, Image, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

const navItems: NavItem[] = [
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'drone-control', label: 'Drone Control', icon: Cpu },
  { id: 'gallery', label: 'Media Gallery', icon: Image },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, profile, unreadAlerts, signOut } = useApp();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/50`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800/50">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-green-400" />
          </div>
          <div className="absolute inset-0 rounded-lg bg-green-400/10 blur-sm" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm leading-tight">SoilGuard</div>
            <div className="text-green-400 font-bold text-sm leading-tight">AI Platform</div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const badge = item.id === 'ai-monitor' ? unreadAlerts : 0;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Parameters<typeof setCurrentPage>[0])}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-green-400 rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-green-400' : ''}`} />
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {badge > 0 && sidebarOpen && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              {badge > 0 && !sidebarOpen && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-800/50 p-3 space-y-2">
        {sidebarOpen && profile && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-green-400 text-xs font-bold">
                {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-xs font-medium truncate">{profile.full_name || 'Farmer'}</div>
              <div className="text-gray-500 text-xs truncate">{profile.farm_name || 'My Farm'}</div>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
