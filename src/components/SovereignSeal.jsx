import React from 'react';

/**
 * Section 63 BSA Holographic Security Seal Component
 * Renders an official sovereign digital evidence certification seal
 * with holographic shimmer and Ashoka Chakra motif.
 */
export function SovereignSeal({ size = 110, certifiedHash = '' }) {
  return (
    <div className="sovereign-seal-container" style={{ width: size, height: size }}>
      <div className="sovereign-seal-hologram">
        <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldHoloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706"/>
              <stop offset="25%" stopColor="#FBBF24"/>
              <stop offset="50%" stopColor="#F59E0B"/>
              <stop offset="75%" stopColor="#FEF3C7"/>
              <stop offset="100%" stopColor="#B45309"/>
            </linearGradient>

            <linearGradient id="emeraldHoloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669"/>
              <stop offset="50%" stopColor="#10B981"/>
              <stop offset="100%" stopColor="#34D399"/>
            </linearGradient>

            <filter id="sealGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          {/* Outer Starburst / Scalloped Ring */}
          <circle cx="80" cy="80" r="76" stroke="url(#goldHoloGrad)" strokeWidth="2.5" strokeDasharray="3 2"/>
          <circle cx="80" cy="80" r="70" stroke="url(#emeraldHoloGrad)" strokeWidth="1.5"/>

          {/* Curved Text Path: Outer Ring */}
          <path id="outerTextPath" d="M 80,80 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0" fill="none"/>
          <text fontSize="7.8" fontWeight="800" fill="#92400E" letterSpacing="1.2">
            <textPath href="#outerTextPath" startOffset="50%" textAnchor="middle">
              ★ MINISTRY OF HOME AFFAIRS · GOVT OF INDIA ★
            </textPath>
          </text>

          {/* Inner Ring */}
          <circle cx="80" cy="80" r="48" stroke="url(#goldHoloGrad)" strokeWidth="1.8"/>

          {/* Curved Text Path: Inner Ring */}
          <path id="innerTextPath" d="M 80,80 m 40,0 a 40,40 0 1,1 -80,0 a 40,40 0 1,1 80,0" fill="none"/>
          <text fontSize="6.2" fontWeight="700" fill="#047857" letterSpacing="0.8">
            <textPath href="#innerTextPath" startOffset="50%" textAnchor="middle">
              SEC 63 BSA 2023 · ELECTRONIC EVIDENCE
            </textPath>
          </text>

          {/* Center Ashoka Chakra (24 Spokes) */}
          <circle cx="80" cy="80" r="24" stroke="url(#goldHoloGrad)" strokeWidth="2" fill="#FEF3C7"/>
          <circle cx="80" cy="80" r="4.5" fill="#B45309"/>
          
          {/* 24 Radiating Spokes */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 80 + 4.5 * Math.cos(angle);
            const y1 = 80 + 4.5 * Math.sin(angle);
            const x2 = 80 + 23 * Math.cos(angle);
            const y2 = 80 + 23 * Math.sin(angle);
            return (
              <line 
                key={i} 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke="#B45309" 
                strokeWidth="1.2"
              />
            );
          })}

          {/* Security Badge Shield Tag */}
          <rect x="52" y="108" width="56" height="14" rx="3" fill="#1E293B" stroke="url(#goldHoloGrad)" strokeWidth="1"/>
          <text x="80" y="118" fontSize="6.5" fontWeight="800" fill="#FBBF24" textAnchor="middle" letterSpacing="0.6">
            AUTHENTICATED
          </text>
        </svg>

        {/* Diagonal Holographic Sheen Overlay */}
        <div className="hologram-sheen-sweep"></div>
      </div>
    </div>
  );
}

/**
 * Sovereign Background Watermark for the Graph Workspace
 */
export function WorkspaceWatermark() {
  return (
    <div className="workspace-sovereign-watermark">
      <div className="watermark-crest">
        {/* Official State Emblem of India (Lion Capital of Ashoka) */}
        <img 
          src="/emblem_of_india_gold.svg" 
          alt="State Emblem of India" 
          className="watermark-emblem-img" 
        />
      </div>
      <div className="watermark-text">
        <span>सत्यमेव जयते · GOVERNMENT OF INDIA</span>
        <strong>MINISTRY OF HOME AFFAIRS · I4C CYBERCRIME WING</strong>
        <small>VASPTrace Sovereign Blockchain Attribution Engine · Section 94 BNSS</small>
      </div>
    </div>
  );
}
