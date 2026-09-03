import React, { useState, useEffect, useRef } from 'react';
import { VaspLogo } from './VaspLogo';
import { ShieldCheck, Cpu, Terminal, ArrowRight } from 'lucide-react';

const BOOT_STAGES = [
  { text: "Ingesting NCRP 1930 Cyber Fraud Data Pipeline", detail: "Active Webhook Link Established", delay: 350 },
  { text: "Synchronizing Multi-Chain Archive RPC Nodes", detail: "Tron TRC-20 · Ethereum Erigon · Bitcoin UTXO", delay: 850 },
  { text: "Calibrating Elliptic++ 822,000-Node AML Graph Model", detail: "203 Topological Fraud Features Calibrated", delay: 1450 },
  { text: "Activating Section 63 BSA Cryptographic Integrity Engine", detail: "SHA-256 Tamper-Proof Evidence Digest Ready", delay: 2000 },
  { text: "Establishing MHA SAHYOG Exchange Freeze Gateway", detail: "14 Registered VASPs Synchronized (FIU-IND)", delay: 2500 },
  { text: "VASPTrace Sovereign Defense Core Online", detail: "Attribution Latency < 3.8s · Ready for LEA Deployment", delay: 2900 }
];

export function AnimatedIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [flightCoords, setFlightCoords] = useState({ x: 0, y: 0, scale: 1 });

  const logoRef = useRef(null);
  const finishTriggeredRef = useRef(false);

  useEffect(() => {
    // Smooth progress counter from 0 to 100% over ~3 seconds
    const interval = 30; // ms
    const totalTime = 3000;
    const increment = 100 / (totalTime / interval);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, interval);

    // Trigger sequential boot stages
    const stageTimers = BOOT_STAGES.map((stg, idx) => {
      return setTimeout(() => {
        setActiveStage(idx);
      }, stg.delay);
    });

    // Auto complete after 3.3 seconds
    const finishTimer = setTimeout(() => {
      handleFinish();
    }, 3350);

    return () => {
      clearInterval(progressTimer);
      stageTimers.forEach(t => clearTimeout(t));
      clearTimeout(finishTimer);
    };
  }, []);

  const handleFinish = () => {
    if (finishTriggeredRef.current) return;
    finishTriggeredRef.current = true;

    // Calculate exact flight coordinates from center logo to header brand-icon-wrapper
    const targetEl = document.querySelector('.brand-icon-wrapper');
    if (targetEl && logoRef.current) {
      const targetRect = targetEl.getBoundingClientRect();
      const currentRect = logoRef.current.getBoundingClientRect();

      const currentCenterX = currentRect.left + currentRect.width / 2;
      const currentCenterY = currentRect.top + currentRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const deltaX = targetCenterX - currentCenterX;
      const deltaY = targetCenterY - currentCenterY;
      const scale = targetRect.width / currentRect.width; // 36px / 90px = 0.4

      setFlightCoords({ x: deltaX, y: deltaY, scale });
    } else {
      // High-precision fallback for desktop top-left coordinate
      setFlightCoords({ x: -window.innerWidth / 2 + 42, y: -window.innerHeight / 2 + 32, scale: 0.4 });
    }

    // Phase 1: Begin flight and shrink
    setIsTransitioning(true);

    // Phase 2: Once docked at destination, trigger 3D Left-to-Right Flip animation
    setTimeout(() => {
      setIsFlipping(true);
    }, 620);

    // Phase 3: Final dissolution and handoff to live dashboard
    setTimeout(() => {
      setIsFadingOut(true);
    }, 1150);

    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1300);
  };

  // Compute dynamic transform style for the flying logo
  const getFlyingLogoStyle = () => {
    if (!isTransitioning) {
      return {
        transform: 'translate(0px, 0px) scale(1) rotateY(0deg)',
        transition: 'transform 0.65s cubic-bezier(0.2, 0.9, 0.3, 1.05)'
      };
    }

    if (isFlipping) {
      return {
        transform: `translate(${flightCoords.x}px, ${flightCoords.y}px) scale(${flightCoords.scale}) rotateY(360deg)`,
        transition: 'transform 0.5s ease-in-out'
      };
    }

    return {
      transform: `translate(${flightCoords.x}px, ${flightCoords.y}px) scale(${flightCoords.scale}) rotateY(0deg)`,
      transition: 'transform 0.62s cubic-bezier(0.2, 0.9, 0.3, 1.05)'
    };
  };

  return (
    <div className={`animated-intro-overlay ${isTransitioning ? 'transition-docking' : ''} ${isFadingOut ? 'fade-exit' : ''}`}>
      
      {/* Background Cyber Grid & Radiant Blooms */}
      <div className={`intro-grid-background ${isTransitioning ? 'elements-hidden' : ''}`}></div>
      <div className={`intro-glow-circle cyan ${isTransitioning ? 'elements-hidden' : ''}`}></div>
      <div className={`intro-glow-circle emerald ${isTransitioning ? 'elements-hidden' : ''}`}></div>
      <div className={`intro-scanner-line ${isTransitioning ? 'elements-hidden' : ''}`}></div>

      {/* Top Controls: Skip Button & Classification Banner */}
      <div className={`intro-top-bar ${isTransitioning ? 'elements-hidden' : ''}`}>
        <div className="intro-top-badge">
          <span className="pulse-dot emerald"></span>
          <span>SOVEREIGN LAW ENFORCEMENT INTELLIGENCE CORE</span>
        </div>
        <button onClick={handleFinish} className="intro-skip-btn">
          <span>Skip Intro</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Center Cinematic Container */}
      <div className="intro-content-container">
        
        {/* Flying Emblem with Shrink, Drag & 3D Flip */}
        <div className="intro-emblem-wrapper">
          <div className={`radar-crosshair-ring ring-outer ${isTransitioning ? 'elements-hidden' : ''}`}></div>
          <div className={`radar-crosshair-ring ring-inner ${isTransitioning ? 'elements-hidden' : ''}`}></div>
          <div className={`emblem-pulse-bloom ${isTransitioning ? 'elements-hidden' : ''}`}></div>
          
          <div 
            ref={logoRef} 
            className={`intro-flying-emblem ${isFlipping ? 'flip-active' : ''}`}
            style={getFlyingLogoStyle()}
          >
            <VaspLogo size={90} />
          </div>
        </div>

        {/* Title & Tagline (Fades out when docking starts) */}
        <div className={`intro-brand-title ${isTransitioning ? 'elements-hidden' : ''}`}>
          <h1>VASP<span>Trace</span></h1>
          <div className="intro-sih-tag">
            <span className="badge-pill sih">SMART INDIA HACKATHON 2026 · PS 26183</span>
            <span className="badge-pill team">🛡️ Team BlockSentinel</span>
          </div>
          <p className="intro-subtitle">
            Real-Time Sovereign Crypto Fraud Attribution &amp; SAHYOG Legal Intelligence System
          </p>
        </div>

        {/* Segmented Cyber Progress Bar */}
        <div className={`intro-progress-section ${isTransitioning ? 'elements-hidden' : ''}`}>
          <div className="progress-metrics-row">
            <span className="progress-label">
              <Cpu size={12} color="#06B6D4" />
              <span>SYSTEM INITIALIZATION SEQUENCE</span>
            </span>
            <span className="progress-percentage">{Math.min(100, Math.floor(progress))}%</span>
          </div>
          <div className="intro-progress-track">
            <div 
              className="intro-progress-fill" 
              style={{ width: `${Math.min(100, progress)}%` }}
            >
              <div className="progress-light-lead"></div>
            </div>
          </div>
        </div>

        {/* Boot Sequence Telemetry Terminal */}
        <div className={`intro-terminal-box ${isTransitioning ? 'elements-hidden' : ''}`}>
          <div className="terminal-top-strip">
            <div className="terminal-dots">
              <span></span><span></span><span></span>
            </div>
            <div className="terminal-title">
              <Terminal size={12} color="#64748B" />
              <span>SECURE BOOT PROTOCOL · I4C CIS CORE</span>
            </div>
            <span className="terminal-status">LIVE SYNC</span>
          </div>
          <div className="terminal-logs-window">
            {BOOT_STAGES.slice(0, activeStage + 1).map((stage, idx) => (
              <div key={idx} className={`intro-log-entry ${idx === activeStage ? 'active-typing' : 'done'}`}>
                <span className="log-check">✓</span>
                <span className="log-text">{stage.text}</span>
                <span className="log-detail hide-mobile">[{stage.detail}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footnote / Authority Notice */}
        <div className={`intro-footer-authority ${isTransitioning ? 'elements-hidden' : ''}`}>
          <ShieldCheck size={14} color="#10B981" />
          <span>Section 94 BNSS &amp; Section 63 BSA Digital Evidence Compliance Engine · Ministry of Home Affairs</span>
        </div>

      </div>

    </div>
  );
}
