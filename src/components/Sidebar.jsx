import React from 'react';
import SLogo from './SLogo';
import { Home, BookOpen, BarChart3, TrendingUp, HeartHandshake, Settings, Flame, Folder } from 'lucide-react';

export default function Sidebar({ currentView, setView, streak = 0, onOpenSettings }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'library', label: 'Library', icon: Folder },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'support', label: 'Support', icon: HeartHandshake }
  ];

  return (
    <>
      {/* Desktop Sidebar (visible on md screens and up) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-40 pt-10 pb-8 px-8 flex-shrink-0 justify-between border-r border-white/[0.03] bg-black/[0.02] backdrop-blur-[20px]">
        <div className="space-y-12">
          {/* Header & Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Saha AI Logo" 
              className="w-32 h-auto object-contain opacity-90 transition-opacity hover:opacity-100" 
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-8">
            
            {/* MAIN MENU */}
            <div className="space-y-3">
              <h3 className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-medium pl-3">Menu</h3>
              <div className="space-y-1">
                {navItems.slice(0, 3).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition-all duration-500 group relative overflow-hidden ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-white/40 hover:text-white hover:bg-white/[0.02] font-light'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-brand-glow rounded-r-full shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>
                      )}
                      <Icon size={18} className={`transition-transform duration-500 ${isActive ? 'stroke-[2px]' : 'stroke-[1.5px] group-hover:scale-110 group-hover:-rotate-3'}`} />
                      <span className={`tracking-wide transition-transform duration-500 ${!isActive ? 'group-hover:translate-x-1' : ''}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INSIGHTS */}
            <div className="space-y-3">
              <h3 className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-medium pl-3">Insights</h3>
              <div className="space-y-1">
                {navItems.slice(3, 5).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition-all duration-500 group relative overflow-hidden ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-white/40 hover:text-white hover:bg-white/[0.02] font-light'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-brand-glow rounded-r-full shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>
                      )}
                      <Icon size={18} className={`transition-transform duration-500 ${isActive ? 'stroke-[2px]' : 'stroke-[1.5px] group-hover:scale-110 group-hover:-rotate-3'}`} />
                      <span className={`tracking-wide transition-transform duration-500 ${!isActive ? 'group-hover:translate-x-1' : ''}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* HELP */}
            <div className="space-y-3">
              <h3 className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-medium pl-3">Help</h3>
              <div className="space-y-1">
                {navItems.slice(5).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition-all duration-500 group relative overflow-hidden ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-white/40 hover:text-white hover:bg-white/[0.02] font-light'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-brand-glow rounded-r-full shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>
                      )}
                      <Icon size={18} className={`transition-transform duration-500 ${isActive ? 'stroke-[2px]' : 'stroke-[1.5px] group-hover:scale-110 group-hover:-rotate-3'}`} />
                      <span className={`tracking-wide transition-transform duration-500 ${!isActive ? 'group-hover:translate-x-1' : ''}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
          </nav>
        </div>

        {/* Sidebar Footer / Settings */}
        <div className="space-y-6">
          {/* Streak Indicator */}
          {streak > 0 && (
            <div className="flex items-center gap-3 px-3 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <Flame size={16} className="text-amber-500 fill-amber-500/20" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Current Streak</span>
                <span className="text-sm text-white font-serif italic">{streak} Days</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/40 hover:text-white hover:bg-white/[0.02] rounded-lg transition-all duration-500 group font-light text-base"
          >
            <Settings size={18} className="stroke-[1.5px] group-hover:rotate-90 transition-transform duration-500" />
            <span className="tracking-wide transition-transform duration-500 group-hover:translate-x-1">Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (visible below md screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cosmic-dark/70 backdrop-blur-lg border-t border-white/10 px-4 py-2 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                isActive ? 'text-brand-glow' : 'text-brand-lilac'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 p-2 text-brand-lilac hover:text-white transition"
        >
          <Settings size={20} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </>
  );
}
