import React from 'react';
import { 
  Sparkles, Folder, Calendar, Heart, ArrowRight, Bell, Sun, User, 
  BookOpen, Star, Archive, MoreHorizontal, Compass
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

export default function HomePage({ setView, entriesCount = 0 }) {
  // Simple mock data for the emotional frequency chart on the hero page
  const barData = [
    { value: 40, color: '#C4B5FD' },
    { value: 65, color: '#6EE7B7' },
    { value: 45, color: '#F472B6' },
    { value: 85, color: '#A78BFA' },
    { value: 75, color: '#C4B5FD' },
    { value: 35, color: '#6EE7B7' },
    { value: 55, color: '#A78BFA' }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-16 relative isolate">
      {/* Top Header bar matching stitch design */}
      <header className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center relative z-10">
          <img 
            src="/logo.png" 
            alt="Saha AI Logo" 
            className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" 
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 glass-button text-xs font-semibold"
          >
            <Calendar size={14} /> Mood Calendar
          </button>
          <button 
            onClick={() => setView('journal')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 glass-button text-xs font-semibold"
          >
            <Folder size={14} /> Personal Library
          </button>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <button className="p-2 text-brand-lilac hover:text-white transition hover:bg-white/5 rounded-full">
              <Sun size={16} />
            </button>
            <button className="p-2 text-brand-lilac hover:text-white transition hover:bg-white/5 rounded-full">
              <Bell size={16} />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-glow/20 border border-brand-glow/40 flex items-center justify-center text-xs font-bold text-brand-glow cursor-pointer hover:scale-105 transition">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-10 py-12 relative z-10 flex flex-col items-center justify-center min-h-[50vh]">
        
        {/* Hero Typography */}
        <div className="space-y-6 w-full">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-white tracking-tight leading-tight">
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: '-0.02em' }}>Your mind,</span> <br />
            <span className="font-serif italic text-brand-lilac/90 block mt-2">beautifully mapped.</span>
          </h1>
          <p className="text-lg sm:text-xl text-brand-light/70 max-w-2xl mx-auto font-light leading-relaxed pt-6">
            Saha.ai translates your daily thoughts into deep emotional insights. Write naturally, and discover the hidden patterns of your wellbeing.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setView('journal')}
            className="px-10 py-4 bg-brand-glow hover:bg-white text-[#0b0512] font-semibold rounded-full transition-colors duration-300 flex items-center justify-center gap-3 text-lg"
          >
            Begin Your Journey <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Personal Library Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-brand-glow block" /> Personal Library
          </h3>
          <button 
            onClick={() => setView('journal')}
            className="text-xs text-brand-glow hover:underline font-semibold flex items-center gap-1"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="glass-card glass-card-hover p-6 space-y-4 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">Daily Logs</h4>
              <p className="text-xs text-brand-lilac mt-1 font-medium">{entriesCount} entries</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-hover p-6 space-y-4 cursor-pointer group" onClick={() => setView('support')}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Compass size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">Meditations</h4>
              <p className="text-xs text-brand-lilac mt-1 font-medium">42 sessions</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-hover p-6 space-y-4 cursor-pointer group" onClick={() => setView('growth')}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Star size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">Highlights</h4>
              <p className="text-xs text-brand-lilac mt-1 font-medium">15 moments</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card glass-card-hover p-6 space-y-4 cursor-pointer group" onClick={() => setView('library')}>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Archive size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">Folders</h4>
              <p className="text-xs text-brand-lilac mt-1 font-medium">Categorized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mood Overview Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-brand-glow block" /> Mood Overview
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
              ● Calm
            </span>
            <button className="text-brand-lilac hover:text-white transition p-1 hover:bg-white/5 rounded-lg">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Spectrum & Recent Anxiety Peak */}
          <div className="space-y-6 md:col-span-1">
            {/* Today's Spectrum */}
            <div className="glass-card p-5 space-y-4">
              <span className="text-[10px] uppercase font-bold text-brand-lilac tracking-wider block">
                Today's Spectrum
              </span>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-glow to-brand-lavender shadow-md" />
                <div className="w-10 h-10 rounded-full bg-brand-lavender opacity-60" />
                <div className="w-10 h-10 rounded-full bg-brand-deep border border-white/20" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-400">Dominant: Tranquil</h4>
                <div className="w-full h-1 bg-emerald-500/30 rounded-full mt-2 overflow-hidden">
                  <div className="w-3/4 h-full bg-emerald-400" />
                </div>
              </div>
            </div>

            {/* Recent Anxiety Peak */}
            <div className="glass-card p-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-brand-lilac tracking-wider block">
                Recent Anxiety Peak
              </span>
              <p className="text-xs text-brand-light italic leading-relaxed">
                "Pressure from the upcoming project deadline is starting to build up. Need to focus on breath work."
              </p>
            </div>
          </div>

          {/* Emotional Frequency Chart */}
          <div className="glass-card p-6 md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-lilac tracking-wider block">
                EMOTIONAL FREQUENCY
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">Growth Wave</h4>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
