import React from 'react';
import SLogo from './SLogo';

export default function Onboarding({ onComplete }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-[-20%] left-[-20%] w-60 h-60 rounded-full bg-brand-glow opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 rounded-full bg-brand-lavender opacity-10 blur-3xl pointer-events-none" />

        <div className="mb-6 animate-bounce">
          <SLogo className="w-24 h-24" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
          Saha<span className="text-brand-glow">.ai</span>
        </h1>
        <p className="text-brand-lavender font-medium text-lg md:text-xl mb-8 italic">
          "The unified bridge to your wellbeing"
        </p>

        <div className="space-y-6 text-left text-brand-light/85 mb-10 border-t border-white/10 pt-6">
          <div className="flex gap-4">
            <span className="text-2xl">🌱</span>
            <p className="text-sm md:text-base leading-relaxed">
              <strong>Reflect Deeply:</strong> Journal your daily feelings and let Saha listen without judgment, offering warm and empathetic perspectives.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl">📈</span>
            <p className="text-sm md:text-base leading-relaxed">
              <strong>Track Landscapes:</strong> Map your core emotions (calm, hope, joy, sadness, anxiety) and visualize patterns over time.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl">🔒</span>
            <p className="text-sm md:text-base leading-relaxed">
              <strong>100% Private:</strong> Your journal, settings, and responses remain strictly on your local device. No signups, no emails, no tracking.
            </p>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full py-4 px-6 bg-brand-glow hover:bg-brand-lavender text-brand-deep font-bold rounded-xl transition duration-300 shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:shadow-[0_0_30px_rgba(196,181,253,0.6)] transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Begin your journey
        </button>
      </div>
    </div>
  );
}
