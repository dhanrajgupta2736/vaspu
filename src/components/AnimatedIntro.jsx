import React, { useState, useEffect } from 'react';
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
  const [isFadingOut, setIsFadingOut] = useState(false);

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
    }, 3400);

    return () => {
      clearInterval(progressTimer);
      stageTimers.forEach(t => clearTimeout(t));
      clearTimeout(finishTimer);
    };
  }, []);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 550);
  };

  return (
    <div className={`animated-intro-overlay ${isFadingOut ? 'fade-exit' : ''}`}>
      
      {/* Background Cyber Grid & Radiant Blooms */}
      <div className="intro-grid-background"></div>
      <div className="intro-glow-circle cyan"></div>
      <div className="intro-glow-circle emerald"></div>
      <div className="intro-scanner-line"></div>

      {/* Top Controls: Skip Button & Classification Banner */}
      <div className="intro-top-bar">
        <div className="intro-top-badge">
          <span className="pulse-dot emerald"></span>
          <span>SOVEREIGN LAW ENFORCEMENT INTELLIGENCE CORE</span>
        </div>
        <button onClick={handleFinish} className="intro-skip-btn">
          <span>Skip Intro</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Center Cinematic Emblem & Branding */}
      <div className="intro-content-container">
        
        {/* Animated Emblem with Rotating Radar Crosshairs */}
        <div className="intro-emblem-wrapper">
          <div className="radar-crosshair-ring ring-outer"></div>
          <div className="radar-crosshair-ring ring-inner"></div>
          <div className="emblem-pulse-bloom"></div>
          <div className="intro-logo-glow">
            <VaspLogo size={90} />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="intro-brand-title">
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
        <div className="intro-progress-section">
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
        <div className="intro-terminal-box">
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
        <div className="intro-footer-authority">
          <ShieldCheck size={14} color="#10B981" />
          <span>Section 94 BNSS &amp; Section 63 BSA Digital Evidence Compliance Engine · Ministry of Home Affairs</span>
        </div>

      </div>

    </div>
  );
}
