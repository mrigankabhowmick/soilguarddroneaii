import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CameraPage from './pages/CameraPage';
import DroneControl from './pages/DroneControl';
import Gallery from './pages/Gallery';
import SettingsPage from './pages/Settings';
import LandingPage from './pages/LandingPage';
import ConnectivityHub from './components/ConnectivityHub';

function AppShell() {
  const { user, currentPage, sidebarOpen, theme } = useApp();
  const [showApp, setShowApp] = useState(false);

  if (!showApp && !user) return <LandingPage onGetStarted={() => setShowApp(true)} />;

  const pageMap: Record<string, React.ReactNode> = {
    camera: <CameraPage />,
    'drone-control': <DroneControl />,
    gallery: <Gallery />,
    settings: <SettingsPage />,
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Sidebar />
      <div
        className="transition-all duration-300 flex flex-col min-h-screen"
        style={{ marginLeft: sidebarOpen ? 256 : 64 }}
      >
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {pageMap[currentPage] ?? <CameraPage />}
        </main>
        <ConnectivityHub />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
