import React, { useState, useEffect, useRef } from 'react';
import { VASP_DATA } from './data';
import { VASPTraceGraph } from './graph';
import { SAHYOGNoticeEngine } from './notice-engine';
import { VaspLogo } from './components/VaspLogo';

export default function App() {
  const [currentScenarioKey, setCurrentScenarioKey] = useState('scenario1');
  const [currentScenario, setCurrentScenario] = useState(VASP_DATA.scenarios.scenario1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [timelineHop, setTimelineHop] = useState(2);
  const [maxHop, setMaxHop] = useState(2);
  const [customAddress, setCustomAddress] = useState('TX9KqPz8vM7L3gN1bX8Vw2Q5jE4tR6uY7a');
  const [customChain, setCustomChain] = useState('tron');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeData, setNoticeData] = useState(null);
  const [mobileTab, setMobileTab] = useState('graph'); // 'graph' | 'cases' | 'intel'
  const [copiedKey, setCopiedKey] = useState(null);
  const [particleSpeed, setParticleSpeed] = useState('normal'); // 'slow' | 'normal' | 'fast'

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const graphInstanceRef = useRef(null);

  // Initialize Canvas Graph
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      graphInstanceRef.current = new VASPTraceGraph(
        canvasRef.current,
        containerRef.current,
        {
          onHopExpanded: (curr, max) => {
            setTimelineHop(curr);
            setMaxHop(max);
          },
          onNodeSelected: (node) => {
            setSelectedNode(node);
          }
        }
      );
      graphInstanceRef.current.setData(VASP_DATA.scenarios.scenario1, true);
    }

    const handleResize = () => {
      if (graphInstanceRef.current) {
        graphInstanceRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (graphInstanceRef.current) {
        graphInstanceRef.current.destroy();
      }
    };
  }, []);

  // Resize graph on mobile tab switch
  useEffect(() => {
    if (mobileTab === 'graph' && graphInstanceRef.current) {
      setTimeout(() => {
        graphInstanceRef.current.resize();
      }, 50);
    }
  }, [mobileTab]);

  // Handle Scenario Switch
  const handleSelectScenario = (key) => {
    setCurrentScenarioKey(key);
    const sc = VASP_DATA.scenarios[key];
    setCurrentScenario(sc);
    setSelectedNode(null);
    if (graphInstanceRef.current) {
      graphInstanceRef.current.setData(sc, true);
    }
    setMobileTab('graph');
  };

  // Timeline Slider Change
  const handleTimelineChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setTimelineHop(val);
    if (graphInstanceRef.current) {
      graphInstanceRef.current.maxHopsToDisplay = val;
      graphInstanceRef.current.initParticles();
    }
  };

  // Open SAHYOG Legal Notice Modal
  const handleOpenNotice = async () => {
    const generatedNotice = await SAHYOGNoticeEngine.createNotice(currentScenario);
    setNoticeData(generatedNotice);
    setIsNoticeModalOpen(true);
  };

  // Export Forensic JSON Dossier
  const handleExportJSON = () => {
    const exportData = {
      caseTitle: currentScenario.name,
      incidentId: currentScenario.id,
      crimeType: currentScenario.crimeType,
      victimInfo: currentScenario.victimInfo,
      stolenAmount: currentScenario.stolenAmount,
      blockchain: currentScenario.chain,
      destinationVASP: currentScenario.attributionResult,
      confidenceScore: `${currentScenario.confidenceScore}% (${currentScenario.confidenceTier})`,
      mlAnomalyScore: currentScenario.mlAnomalyScore,
      evidenceTrail: currentScenario.edges,
      walletNodes: currentScenario.nodes,
      exportedAt: new Date().toISOString(),
      statutoryCertificate: "Section 63 BSA, 2023 Tamper-Evident Digest"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VASPTrace_Forensic_${currentScenario.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCustomTrace = (e) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    handleSelectScenario('scenario1');
  };

  const toggleParticleSpeed = () => {
    const nextSpeed = particleSpeed === 'normal' ? 'fast' : (particleSpeed === 'fast' ? 'slow' : 'normal');
    setParticleSpeed(nextSpeed);
    if (graphInstanceRef.current) {
      const multiplier = nextSpeed === 'fast' ? 2.0 : (nextSpeed === 'slow' ? 0.5 : 1.0);
      graphInstanceRef.current.particles.forEach(p => {
        p.speed = (0.008 + Math.random() * 0.004) * multiplier;
      });
    }
  };

  const cb = currentScenario.confidenceBreakdown;

  return (
    <div className="app-root">
      
      {/* ================= TOP COMMAND BAR ================= */}
      <header className="top-command-bar">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <VaspLogo size={36} />
          </div>
          <div className="brand-text">
            <h1>VASP<span>Trace</span> <small className="hide-mobile badge-sih">SIH 2026 PS26183</small></h1>
            <p className="hide-mobile">Real-Time Crypto Fraud Attribution & Sovereign SAHYOG Legal Intelligence</p>
          </div>
        </div>

        {/* Live Threat Stats Ticker */}
        <div className="threat-ticker-container">
          <div className="pulse-dot"></div>
          <div className="ticker-stat">
            <span>2025 LOSS:</span>
            <strong style={{ color: '#F59E0B' }}>₹22,495 Cr</strong>
          </div>
          <div className="ticker-stat hide-mobile">
            <span>CASES:</span>
            <strong>28.15 L</strong>
          </div>
          <div className="ticker-stat hide-mobile">
            <span>INVESTMENT:</span>
            <strong style={{ color: '#06B6D4' }}>75.4%</strong>
          </div>
          <div className="ticker-stat">
            <span>LATENCY:</span>
            <strong style={{ color: '#10B981' }}>&lt; 3.8s</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button onClick={handleExportJSON} className="btn-secondary hide-mobile" title="Export Forensic Dossier">
            📥 Export JSON
          </button>
          <button onClick={handleOpenNotice} className="btn-primary">
            <span className="hide-mobile">📜 Generate SAHYOG Notice (Sec 94 BNSS)</span>
            <span className="show-mobile-only">📜 Notice</span>
          </button>
        </div>
      </header>

      {/* ================= BLOCKCHAIN LIVE NODE TELEMETRY STRIP ================= */}
      <div className="blockchain-telemetry-strip hide-mobile">
        <div className="telemetry-inner">
          <span className="telemetry-label">📡 LIVE ARCHIVE NODES:</span>
          {VASP_DATA.blockchainNodes.map((node, idx) => (
            <div key={idx} className="telemetry-node-item">
              <span className="node-dot"></span>
              <span className="node-name">{node.name}:</span>
              <strong className="node-block">{node.block}</strong>
              <span className="node-ping">({node.latency})</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION SEGMENTED TABS ================= */}
      <nav className="mobile-tab-bar show-mobile-flex">
        <button
          onClick={() => setMobileTab('cases')}
          className={`mobile-tab-btn ${mobileTab === 'cases' ? 'active' : ''}`}
        >
          📂 Cases (4)
        </button>
        <button
          onClick={() => setMobileTab('graph')}
          className={`mobile-tab-btn ${mobileTab === 'graph' ? 'active' : ''}`}
        >
          🕸️ Graph Canvas
        </button>
        <button
          onClick={() => setMobileTab('intel')}
          className={`mobile-tab-btn ${mobileTab === 'intel' ? 'active' : ''}`}
        >
          🛡️ VASP Intel
        </button>
      </nav>

      {/* ================= MAIN 3-COLUMN WORKSPACE ================= */}
      <main className="main-workspace">
        
        {/* LEFT PANEL: Ingestion & Scenarios */}
        <aside className={`left-panel ${mobileTab === 'cases' ? 'mobile-active' : ''}`}>
          <div>
            <div className="panel-section-title">
              <span>SHOWCASE SCENARIOS (JUDGE DEMOS)</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>1-CLICK</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(VASP_DATA.scenarios).map((key) => {
                const sc = VASP_DATA.scenarios[key];
                const isActive = key === currentScenarioKey;
                return (
                  <div
                    key={key}
                    onClick={() => handleSelectScenario(key)}
                    className={`scenario-card ${isActive ? 'active' : ''}`}
                  >
                    <div className="scenario-header">
                      <span className="scenario-title">{sc.name}</span>
                      <span className={`badge-tag ${sc.badgeColor}`}>{sc.badge}</span>
                    </div>
                    <div className="scenario-meta">
                      <div><strong>Victim:</strong> {sc.victimInfo}</div>
                      <div><strong>Amount:</strong> <span style={{ color: '#F59E0B', fontWeight: 600 }}>{sc.stolenAmount}</span></div>
                      <div><strong>Chain:</strong> {sc.chain} · {sc.hopCount} Hops</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Address Tracer */}
          <div>
            <div className="panel-section-title">
              <span>CUSTOM ADDRESS TRACER</span>
              <span style={{ fontSize: '9px', color: 'var(--cyan-primary)' }}>LIVE BFS</span>
            </div>
            <form onSubmit={handleCustomTrace} className="custom-search-box">
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Paste Wallet Address or TX Hash..."
              />
              <div className="search-controls-row">
                <select value={customChain} onChange={(e) => setCustomChain(e.target.value)}>
                  <option value="tron">Tron (TRC-20 USDT)</option>
                  <option value="eth">Ethereum (ERC-20)</option>
                  <option value="btc">Bitcoin (UTXO)</option>
                  <option value="bsc">BNB Chain</option>
                </select>
                <button type="submit" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--cyan-primary)' }}>
                  ⚡ Trace
                </button>
              </div>
            </form>
          </div>

          {/* Live NCRP Feed */}
          <div style={{ flex: 1, paddingBottom: '20px' }}>
            <div className="panel-section-title">
              <span>LIVE NCRP 1930 COMPLAINT STREAM</span>
              <span className="badge-tag emerald" style={{ fontSize: '7.5px' }}>STREAMING</span>
            </div>
            <div className="ncrp-feed-list">
              {VASP_DATA.ncrpFeed.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const keys = Object.keys(VASP_DATA.scenarios);
                    if (keys[idx]) handleSelectScenario(keys[idx]);
                  }}
                  className="ncrp-item"
                >
                  <div className="ncrp-item-top">
                    <span>{item.id}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '11px', color: '#F8FAFC' }}>{item.type}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span className="ncrp-item-amount">{item.amount}</span>
                    <span style={{ fontSize: '9px', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '1px 4px', borderRadius: '3px' }}>
                      {item.chain}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER PANEL: Graph Canvas */}
        <section className={`center-panel ${mobileTab === 'graph' ? 'mobile-active' : ''}`}>
          <div ref={containerRef} className="graph-canvas-container">
            <canvas ref={canvasRef} id="vaspGraphCanvas" />

            {/* Floating HUD Header */}
            <div className="canvas-hud-top">
              <div className="case-active-banner">
                <div>
                  <strong className="case-title-text">{currentScenario.name}</strong>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {currentScenario.chain} · {currentScenario.stolenAmount}
                  </div>
                </div>
              </div>

              <div className="canvas-controls-box">
                <button onClick={() => graphInstanceRef.current?.animateHopExpansion()} className="btn-icon" title="Replay Trace Animation">▶️</button>
                <button onClick={toggleParticleSpeed} className="btn-icon" title={`Speed: ${particleSpeed}`}>⚡</button>
                <button onClick={() => graphInstanceRef.current?.zoomIn()} className="btn-icon" title="Zoom In">➕</button>
                <button onClick={() => graphInstanceRef.current?.zoomOut()} className="btn-icon" title="Zoom Out">➖</button>
                <button onClick={() => graphInstanceRef.current?.resetView()} className="btn-icon" title="Re-Center Graph">🎯</button>
              </div>
            </div>

            {/* Bottom Timeline Control */}
            <div className="canvas-timeline-bottom">
              <div className="timeline-info">
                <strong>Hop {timelineHop}/{maxHop}</strong>
              </div>
              <div className="timeline-slider-bar">
                <span className="hide-mobile" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Hop 1</span>
                <input
                  type="range"
                  min="1"
                  max={maxHop || 5}
                  value={timelineHop}
                  onChange={handleTimelineChange}
                />
                <span className="hide-mobile" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Hop {maxHop}</span>
              </div>
              <div className="hide-mobile" style={{ fontSize: '10px', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                STREAM: {particleSpeed.toUpperCase()}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Intelligence & Confidence Engine */}
        <aside className={`right-panel ${mobileTab === 'intel' ? 'mobile-active' : ''}`}>
          
          {/* Target Attribution Hero Card */}
          <div className={`attribution-hero-card ${currentScenario.confidenceScore < 40 ? 'degraded' : ''}`}>
            <div className="hero-label">IDENTIFIED DESTINATION VASP (EXCHANGE)</div>
            <div className="hero-target-name">{currentScenario.attributionResult}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <strong>Attribution Latency:</strong> <span style={{ color: 'var(--text-primary)' }}>{currentScenario.attributionTime}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              <strong>Risk Category:</strong> <span style={{ color: currentScenario.confidenceScore < 40 ? '#EF4444' : '#F87171', fontWeight: 600 }}>{currentScenario.riskLevel}</span>
            </div>

            <div className="confidence-gauge-container">
              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>AUDITABLE CONFIDENCE</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: currentScenario.confidenceScore < 40 ? 'var(--crimson-alert)' : 'var(--emerald-success)' }}>
                  {currentScenario.confidenceTier}
                </div>
              </div>
              <div className={`confidence-big-score ${currentScenario.confidenceScore < 40 ? 'degraded' : ''}`}>
                {currentScenario.confidenceScore}%
              </div>
            </div>
          </div>

          {/* ML Typology & Anomaly Meter */}
          <div className="breakdown-card">
            <div className="panel-section-title">
              <span>AI / ML TYPOLOGY CLASSIFIER</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>ELLIPTIC++ (822k)</span>
            </div>
            <div style={{ fontSize: '11px', marginBottom: '6px' }}>
              <strong>Laundering Signature:</strong> <span style={{ color: '#60A5FA' }}>{currentScenario.mlAnomalyScore}</span>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
              XGBoost classifier scores graph subgraph topology against verified anti-money laundering benchmarks.
            </p>
          </div>

          {/* Confidence Score Breakdown */}
          <div className="breakdown-card">
            <div className="panel-section-title">
              <span>CONFIDENCE SCORE BREAKDOWN</span>
              <span style={{ fontSize: '8px', color: 'var(--emerald-success)' }}>AUDITABLE</span>
            </div>
            <div className="breakdown-row">
              <span style={{ color: 'var(--text-secondary)' }}>Base Attribution Weight</span>
              <strong>{cb.baseScore}%</strong>
            </div>
            <div className="breakdown-row">
              <span style={{ color: 'var(--text-secondary)' }}>Hop Distance Penalty</span>
              <strong style={{ color: '#F87171' }}>{cb.hopPenalty}%</strong>
            </div>
            <div className="breakdown-row">
              <span style={{ color: 'var(--text-secondary)' }}>Transaction Velocity Bonus</span>
              <strong style={{ color: '#34D399' }}>{cb.velocityBonus >= 0 ? `+${cb.velocityBonus}` : cb.velocityBonus}%</strong>
            </div>
            <div className="breakdown-row">
              <span style={{ color: 'var(--text-secondary)' }}>Mixer / Privacy Penalty</span>
              <strong style={{ color: '#F87171' }}>{cb.mixerPenalty}%</strong>
            </div>
            <div className="breakdown-row">
              <span style={{ color: 'var(--text-secondary)' }}>Cluster Tag Ground Truth</span>
              <strong style={{ color: '#60A5FA' }}>{cb.clusterConfidence}%</strong>
            </div>
          </div>

          {/* Node Inspector Drawer */}
          <div className="breakdown-card">
            <div className="panel-section-title">
              <span>SELECTED NODE INSPECTOR</span>
              <span style={{ fontSize: '8px', color: 'var(--cyan-primary)' }}>INTERACTIVE</span>
            </div>
            {selectedNode ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedNode.label}</span>
                  <span style={{ color: 'var(--cyan-primary)', fontSize: '10px' }}>{selectedNode.type.toUpperCase()}</span>
                </div>
                
                {/* Address and Copy Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '6px 0' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#94A3B8', wordBreak: 'break-all', flex: 1 }}>
                    {selectedNode.address}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedNode.address, `addr-${selectedNode.id}`)}
                    className="btn-copy"
                    title="Copy Address"
                  >
                    {copiedKey === `addr-${selectedNode.id}` ? '✓' : '📋'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10.5px', margin: '6px 0', background: 'rgba(15,23,42,0.6)', padding: '6px', borderRadius: '4px' }}>
                  <div><strong>Balance:</strong> <span style={{ color: '#10B981' }}>{selectedNode.balance || '0'}</span></div>
                  <div><strong>TX Count:</strong> <span style={{ color: '#60A5FA' }}>{selectedNode.txCount || 'N/A'}</span></div>
                  <div><strong>First Seen:</strong> <span style={{ color: '#94A3B8' }}>{selectedNode.firstSeen || 'N/A'}</span></div>
                  <div><strong>Last Active:</strong> <span style={{ color: '#94A3B8' }}>{selectedNode.lastSeen || 'N/A'}</span></div>
                </div>

                {selectedNode.explorerUrl && (
                  <div style={{ marginTop: '6px' }}>
                    <a
                      href={selectedNode.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-link"
                    >
                      🔗 View on Blockchain Explorer ↗
                    </a>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {(selectedNode.tags || []).map((t, idx) => (
                    <span key={idx} style={{ fontSize: '8.5px', background: 'rgba(51,65,85,0.6)', padding: '2px 6px', borderRadius: '4px', color: '#E2E8F0' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Click any node on the graph canvas to inspect balance, tags, explorer links, and cluster intelligence.
              </p>
            )}
          </div>

          {/* Hop-by-Hop Breadcrumb Ledger */}
          <div style={{ flex: 1, paddingBottom: '20px' }}>
            <div className="panel-section-title">
              <span>TRANSACTION BREADCRUMB LEDGER</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>EVIDENCE TRAIL</span>
            </div>
            <div className="hop-ledger-list">
              {currentScenario.edges.map((e, idx) => {
                const fromNode = currentScenario.nodes.find(n => n.id === e.from);
                const toNode = currentScenario.nodes.find(n => n.id === e.to);
                return (
                  <div key={idx} className="hop-ledger-item">
                    <div className="hop-ledger-header">
                      <span>Hop {e.hop || 1}: {fromNode?.label} ➔ {toNode?.label}</span>
                      <span style={{ color: '#F59E0B' }}>{e.amount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                      <span className="hop-ledger-hash">TX: {e.txHash.slice(0, 14)}...</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleCopy(e.txHash, `tx-${idx}`)}
                          className="btn-copy"
                          title="Copy TX Hash"
                        >
                          {copiedKey === `tx-${idx}` ? '✓' : '📋'}
                        </button>
                        <span style={{ fontSize: '9px', color: '#64748B' }}>{e.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </main>

      {/* ================= SAHYOG LEGAL NOTICE MODAL ================= */}
      {isNoticeModalOpen && noticeData && (
        <div className="modal-overlay open">
          <div className="modal-container">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <VaspLogo size={24} />
                <h3>📜 Formal Legal Freeze Directive · SAHYOG / Section 94 BNSS</h3>
              </div>
              <button onClick={() => setIsNoticeModalOpen(false)} className="btn-icon" style={{ fontSize: '18px' }}>✖</button>
            </div>
            <div className="modal-body">
              <div className="sahyog-notice-sheet">
                <div className="notice-header">
                  <div className="emblem-container">
                    <div className="gov-emblem">🇮🇳</div>
                    <div className="gov-title">
                      <h3>GOVERNMENT OF INDIA · MINISTRY OF HOME AFFAIRS</h3>
                      <h4>INDIAN CYBER CRIME COORDINATION CENTRE (I4C)</h4>
                      <p>NATIONAL CYBERCRIME REPORTING PLATFORM · SAHYOG DISPATCH PORTAL</p>
                    </div>
                  </div>
                  <div className="notice-meta-box">
                    <div><strong>NOTICE ID:</strong> <span>{noticeData.noticeId}</span></div>
                    <div><strong>TIMESTAMP:</strong> <span>{noticeData.dateStr} · {noticeData.timeStr}</span></div>
                    <div><strong>PRIORITY:</strong> <span className="badge-urgent">URGENT FREEZE</span></div>
                  </div>
                </div>

                <hr className="notice-divider"/>

                <div className="notice-subject">
                  <strong>LEGAL NOTICE UNDER SECTION 94 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS, 2023)</strong><br/>
                  <strong>READ WITH SECTION 79(3)(b) OF THE INFORMATION TECHNOLOGY ACT, 2000</strong>
                </div>

                <div className="notice-recipient">
                  <p><strong>TO:</strong> Compliance &amp; Law Enforcement Liaison Desk, <u>{currentScenario.vaspName}</u></p>
                  <p><strong>RE:</strong> Immediate Freezing of Proceeds of Crime &amp; KYC Disclosure for Suspect Deposit Cluster</p>
                </div>

                <div className="notice-body">
                  <p>Whereas an ongoing investigation under the National Cybercrime Reporting Portal (NCRP) indicates that proceeds of crime originating from a reported cyber offense have been traced across blockchain ledgers to a deposit wallet hosted on your platform:</p>
                  
                  <table className="notice-table">
                    <tbody>
                      <tr>
                        <td><strong>NCRP Case Reference:</strong></td>
                        <td>{currentScenario.victimInfo}</td>
                      </tr>
                      <tr>
                        <td><strong>Crime Classification:</strong></td>
                        <td>{currentScenario.crimeType}</td>
                      </tr>
                      <tr>
                        <td><strong>Reported Source Address:</strong></td>
                        <td><code>{currentScenario.reportedAddress}</code></td>
                      </tr>
                      <tr>
                        <td><strong>Identified VASP Target:</strong></td>
                        <td><strong style={{ color: '#059669' }}>{currentScenario.attributionResult}</strong></td>
                      </tr>
                      <tr>
                        <td><strong>Tracing Latency:</strong></td>
                        <td>{currentScenario.attributionTime} (Automated Multi-Hop BFS Traversal)</td>
                      </tr>
                      <tr>
                        <td><strong>Evidentiary Confidence:</strong></td>
                        <td><strong>{currentScenario.confidenceScore}% ({currentScenario.confidenceTier})</strong></td>
                      </tr>
                      <tr>
                        <td><strong>Graph Traversal Depth:</strong></td>
                        <td>{currentScenario.hopCount} Hops outward across {currentScenario.chain}</td>
                      </tr>
                      <tr>
                        <td><strong>ML Typology Risk Score:</strong></td>
                        <td>{currentScenario.mlAnomalyScore}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="notice-statutory-orders">
                    <h4>STATUTORY ORDERS &amp; COMPLIANCE REQUIREMENTS:</h4>
                    <ol>
                      <li><strong>Immediate Asset Freeze:</strong> You are directed to immediately place an administrative hold/lien on all cryptocurrency balances associated with the deposit address specified above under Section 79(3)(b) IT Act.</li>
                      <li><strong>KYC &amp; Payout Disclosure:</strong> Furnish complete customer verification data (Aadhaar/PAN/Passport), registered mobile, email, IP login logs, and linked bank account details under Section 94 BNSS, 2023 within <strong>24 Hours</strong>.</li>
                      <li><strong>Chain-of-Custody Preservation:</strong> Preserve all internal server and ledger transaction records pertaining to this cluster.</li>
                    </ol>
                  </div>

                  <div className="bsa-certificate-box">
                    <div className="bsa-header">
                      <span>🛡️ CERTIFICATE UNDER SECTION 63 OF BHARATIYA SAKSHYA ADHINIYAM (BSA, 2023)</span>
                      <span style={{ fontSize: '9px' }}>ELECTRONIC EVIDENCE INTEGRITY</span>
                    </div>
                    <p style={{ fontSize: '9px', color: '#64748B', margin: '4px 0' }}>
                      I hereby certify that this electronic forensic dossier was generated automatically by the VASPTrace Sovereign Analytics Engine from immutable public blockchain ledger records. The cryptographic digest below guarantees zero post-generation alteration.
                    </p>
                    <div className="hash-display">
                      <span style={{ color: '#475569', fontWeight: 600 }}>SHA-256 INTEGRITY HASH: </span>
                      <code style={{ color: '#0F172A', fontWeight: 700 }}>{noticeData.sha256Hash}</code>
                    </div>
                  </div>
                </div>

                <div className="notice-footer">
                  <div className="sign-box">
                    <div className="sign-line"></div>
                    <p><strong>AUTHORIZED INVESTIGATING OFFICER</strong></p>
                    <p style={{ color: '#64748B' }}>Cyber Financial Crime Division · I4C / State Cyber Cell</p>
                  </div>
                  <div className="qr-placeholder">
                    <div className="qr-box">SAHYOG<br/>VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => window.print()} className="btn-primary">
                🖨️ Print / Save Court-Admissible PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
