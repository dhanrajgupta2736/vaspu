import React from 'react';

/**
 * Official vector SVG logos for major Indian and global exchanges
 * Binance, CoinDCX, WazirX, ZebPay
 */
export function ExchangeLogo({ name = 'Binance', size = 22, className = '' }) {
  const normName = (name || '').toLowerCase();

  // 1. BINANCE (Official Diamond Geometry)
  if (normName.includes('binance')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="#F0B90B" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        title="Binance Official VASP"
      >
        <path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"/>
      </svg>
    );
  }

  // 2. WAZIRX (Official Falcon / Origami Wing Vector)
  if (normName.includes('wazir')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 110 94" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        title="WazirX Official VASP (FIU-IND Registered)"
      >
        <polygon fill="#3067F0" points="4.37 92.94 103.75 92.94 103.75 81.35 4.37 81.35"/>
        <polygon fill="#00C4FF" points="24.51 35.61 0 18.79 4.51 68.99"/>
        <polygon fill="#3067F0" points="34.98 75.17 103.85 75.17 108.78 20.08"/>
        <polygon fill="#1E50DB" points="77.51 34.58 23.59 74.79 8.75 74.79 36.14 29.02 53.63 0"/>
      </svg>
    );
  }

  // 3. COINDCX (Official Dual-Tone Indian VASP Vector)
  if (normName.includes('dcx') || normName.includes('coindcx')) {
    return (
      <svg 
        width={Math.round(size * 2.2)} 
        height={size} 
        viewBox="0 0 120 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        title="CoinDCX Official VASP (FIU-IND Registered)"
      >
        {/* Navy C Ribbon */}
        <path d="M22 6 C12 6 4 13 4 20 C4 27 12 34 22 34 C28 34 32 31 35 28 L29 23 C27 25 25 27 22 27 C16 27 12 24 12 20 C12 16 16 13 22 13 C25 13 27 15 29 17 L35 12 C32 9 28 6 22 6 Z" fill="#38BDF8"/>
        {/* Vibrant Orange DCX Diamond Arrow */}
        <path d="M42 8 L54 20 L42 32 L49 32 L58 23 L67 32 L74 32 L62 20 L74 8 L67 8 L58 17 L49 8 Z" fill="#F94A29"/>
        <circle cx="85" cy="20" r="10" stroke="#00C48C" strokeWidth="4" fill="none"/>
        <path d="M102 8 L108 20 L102 32 L109 32 L113 24 L117 32 L124 32 L117 20 L124 8 L117 8 L113 16 L109 8 Z" fill="#F94A29"/>
      </svg>
    );
  }

  // 4. ZEBPAY (Official Blue Z Glyph)
  if (normName.includes('zebpay') || normName.includes('zeb')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        title="ZebPay Official VASP (FIU-IND Registered)"
      >
        <circle cx="12" cy="12" r="11" fill="#0066FF"/>
        <path d="M7 8 H17 L10 16 H17" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // 5. GENERIC VASP / EXCHANGE FALLBACK
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#10B981" 
      strokeWidth="2" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}
