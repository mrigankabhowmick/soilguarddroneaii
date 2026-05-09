import { 
  Activity, Shield, Zap, Cpu, BarChart3, 
  ArrowRight, Play, Globe, Smartphone
} from 'lucide-react';

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-green-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xl font-bold tracking-tight">SoilGuard <span className="text-green-400">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
            <a href="#fleet" className="hover:text-white transition-colors">Fleet Management</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>

          <button 
            onClick={onGetStarted}
            className="bg-green-500 hover:bg-green-400 text-gray-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-500/10 rounded-full blur-[120px] -z-10 opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-medium text-green-400 mb-6 animate-fade-in">
            <Zap className="w-3 h-3" />
            <span>Next-Gen Drone Telemetry v3.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Advanced Drone <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Analysis Platform</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time telemetry, advanced motor analytics, and mission-critical 
            insights for professional drone operators and agricultural fleets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-xl shadow-green-500/20"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 border border-gray-800 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Analysis Tools</h2>
            <p className="text-gray-500">Everything you need to monitor and optimize your flight missions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Activity, 
                title: 'Real-time Telemetry', 
                desc: 'Sub-100ms latency for battery, signal, altitude, and motor performance tracking.',
                color: 'text-blue-400'
              },
              { 
                icon: BarChart3, 
                title: 'Deep Analytics', 
                desc: 'Historical flight data analysis with AI-powered trend detection and optimization.',
                color: 'text-green-400'
              },
              { 
                icon: Shield, 
                title: 'Mission Security', 
                desc: 'Encrypted communication channels and automated geofencing for safe operations.',
                color: 'text-purple-400'
              },
              { 
                icon: Globe, 
                title: 'Fleet Tracking', 
                desc: 'Manage multiple drones across different locations with centralized GPS mapping.',
                color: 'text-cyan-400'
              },
              { 
                icon: Smartphone, 
                title: 'Mobile Control', 
                desc: 'Full-featured mobile app for on-field monitoring and remote drone adjustments.',
                color: 'text-orange-400'
              },
              { 
                icon: Zap, 
                title: 'Predictive Care', 
                desc: 'Maintenance alerts based on real-time hardware stress and flight hours.',
                color: 'text-yellow-400'
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800/50 p-8 rounded-3xl hover:border-gray-700/50 transition-all group">
                <div className={`w-12 h-12 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-800/50 bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-2">1.2M+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Flight Hours</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Signal Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">45k+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Active Drones</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">AI Monitoring</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Cpu className="w-5 h-5" />
            <span className="font-bold">SoilGuard AI</span>
          </div>
          <div className="text-gray-600 text-sm">
            © 2026 SoilGuard AI Technologies. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
