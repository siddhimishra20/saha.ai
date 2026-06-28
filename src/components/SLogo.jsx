import React from 'react';

export default function SLogo({ className = 'w-12 h-12' }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      filter="drop-shadow(0 0 8px rgba(167, 139, 250, 0.4))"
    >
      <defs>
        <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" /> {/* soft lavender */}
          <stop offset="50%" stopColor="#A78BFA" /> {/* accent glow */}
          <stop offset="100%" stopColor="#2D1B69" /> {/* deep purple */}
        </linearGradient>
        <linearGradient id="sGradGlow" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#9B8EC4" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Background shadow/glow orb */}
      <circle cx="50" cy="50" r="40" fill="url(#sGradGlow)" opacity="0.15" />
      
      {/* Elegant S path */}
      <path
        d="M70 30C70 20 57.5 15 50 15C35 15 30 25 30 35C30 48 50 48 50 58C50 68 35 73 30 73"
        stroke="url(#sGrad)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 73C30 80 42.5 85 50 85C65 85 70 75 70 65C70 52 50 52 50 42C50 32 65 27 70 27"
        stroke="url(#sGrad)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Decorative center glowing dot */}
      <circle cx="50" cy="50" r="4" fill="#F3F0FF" />
    </svg>
  );
}
