import React from 'react';

export function VaspLogo({ size = 36, animated = true }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="vaspLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7"/>
          <stop offset="50%" stopColor="#06B6D4"/>
          <stop offset="100%" stopColor="#10B981"/>
        </linearGradient>
        <filter id="vaspLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Cyber Law Enforcement Shield Shell */}
      <path 
        d="M60 8 L104 26 V62 C104 88 60 112 60 112 C60 112 16 88 16 62 V26 L60 8 Z" 
        fill="#081022" 
        stroke="url(#vaspLogoGrad)" 
        strokeWidth="3.5" 
        filter="url(#vaspLogoGlow)"
      />
      
      {/* Grid Coordinates */}
      <path d="M60 22 L60 98" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.2" strokeDasharray="3 3"/>
      <path d="M28 50 L92 50" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.2" strokeDasharray="3 3"/>

      {/* Radar Target Pulse Ring */}
      <circle cx="60" cy="58" r="26" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.2" fill="none"/>
      <circle cx="60" cy="58" r="14" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.2" fill="none"/>
      
      {/* Stylized V-Trace Pathfinder Arrow */}
      <path 
        d="M38 40 L60 76 L82 40" 
        stroke="url(#vaspLogoGrad)" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        filter="url(#vaspLogoGlow)"
      />
      <path 
        d="M46 40 L60 62 L74 40" 
        stroke="#FFFFFF" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Interconnected Blockchain Nodes */}
      <circle cx="38" cy="40" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5"/>
      <circle cx="82" cy="40" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5"/>
      <circle cx="60" cy="76" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2"/>
      <circle cx="60" cy="22" r="3" fill="#06B6D4"/>
      <circle cx="60" cy="98" r="3" fill="#10B981"/>
    </svg>
  );
}
