import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Profile, Drone, AiAlert } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type Theme = 'dark' | 'light';
type Page =
  | 'camera'
  | 'drone-control'
  | 'gallery'
  | 'settings';

interface AppContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  drones: Drone[];
  alerts: AiAlert[];
  unreadAlerts: number;
  theme: Theme;
  currentPage: Page;
  sidebarOpen: boolean;
  isConnectivityHubOpen: boolean;
  torchOn: boolean;
  torchBrightness: number;
  activeDrone: Drone | null;
  droneIp: string;
  setTheme: (t: Theme) => void;
  setCurrentPage: (p: Page) => void;
  setSidebarOpen: (v: boolean) => void;
  setConnectivityHubOpen: (v: boolean) => void;
  setTorchOn: (v: boolean) => void;
  setTorchBrightness: (v: number) => void;
  setActiveDrone: (d: Drone | null) => void;
  setDroneIp: (ip: string) => void;
  markAlertRead: (id: string) => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [alerts, setAlerts] = useState<AiAlert[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentPage, setCurrentPage] = useState<Page>('camera');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isConnectivityHubOpen, setConnectivityHubOpen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchBrightness, setTorchBrightness] = useState(80);
  const [droneIp, setDroneIp] = useState('192.168.1.100');
  const [activeDrone, setActiveDrone] = useState<Drone | null>({
    id: 'ufo-284513',
    name: 'WIFI-UFO-284513',
    status: 'online',
    battery_level: 85,
    signal_strength: 94,
    user_id: 'current-user',
    last_seen: new Date().toISOString()
  } as any);

  useEffect(() => {
    // Auto-connect to the identified UFO drone
    if (!activeDrone) {
      setActiveDrone({
        id: 'ufo-284513',
        name: 'WIFI-UFO-284513',
        status: 'online',
        battery_level: 85,
        signal_strength: 94,
        user_id: 'current-user',
        last_seen: new Date().toISOString()
      } as any);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setDrones([]);
      setAlerts([]);
      return;
    }

    (async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (p) setProfile(p);

      const { data: d } = await supabase.from('drones').select('*').eq('user_id', user.id);
      if (d) {
        setDrones(d as Drone[]);
        if (d.length > 0) setActiveDrone(d[0] as Drone);
      }

      const { data: a } = await supabase
        .from('ai_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (a) setAlerts(a as AiAlert[]);
    })();
  }, [user]);

  const unreadAlerts = alerts.filter(a => !a.is_read).length;

  const markAlertRead = async (id: string) => {
    await supabase.from('ai_alerts').update({ is_read: true }).eq('id', id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
  };

  const signOut = () => supabase.auth.signOut();

  return (
    <AppContext.Provider value={{
      user, session, profile, drones, alerts, unreadAlerts,
      theme, currentPage, sidebarOpen, isConnectivityHubOpen, torchOn, torchBrightness, activeDrone, droneIp,
      setTheme, setCurrentPage, setSidebarOpen, setConnectivityHubOpen,
      setTorchOn, setTorchBrightness, setActiveDrone, setDroneIp,
      markAlertRead, signOut
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
