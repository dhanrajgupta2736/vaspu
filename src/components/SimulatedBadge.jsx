import React from 'react';

/**
 * Reusable subtle marker for simulated / curated demo data.
 * Adheres strictly to Section 2 of the VASPTrace Build Brief:
 * Confident, professional, and clearly signals live-integration readiness.
 */
export function SimulatedBadge({ text = "Simulated · Live Integration Ready", type = "simulated", style = {} }) {
  const isLive = type === 'live';
  
  return (
    <span 
      className="simulated-badge-chip"
      title={isLive ? "Active real-time decentralized on-chain query" : "Curated for SIH 2026 demonstration. Architecture designed for live API drop-in."}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '9.5px',
        fontWeight: '600',
        letterSpacing: '0.3px',
        padding: '2px 7px',
        borderRadius: '4px',
        background: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.75)',
        border: isLive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(148, 163, 184, 0.35)',
        color: isLive ? '#10B981' : '#94A3B8',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style
      }}
    >
      <span style={{ 
        width: '5px', 
        height: '5px', 
        borderRadius: '50%', 
        background: isLive ? '#10B981' : '#38BDF8', 
        display: 'inline-block' 
      }}></span>
      {text}
    </span>
  );
}
