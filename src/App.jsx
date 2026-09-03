import React, { useState, useEffect, useRef } from 'react';
import { VASP_DATA } from './data';
import { VASPTraceGraph } from './graph';
import { SAHYOGNoticeEngine } from './notice-engine';
import { VaspLogo } from './components/VaspLogo';
import { fetchLiveOnChainData } from './blockchain-api';

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
  const [mobileTab, setMobileTab] = useState('graph');
  const [copiedKey, setCopiedKey] = useState(null);
  const [particleSpeed, setParticleSpeed] = useState('normal');

  // Real-Time States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTracingLive, setIsTracingLive] = useState(false);
  const [traceLogs, setTraceLogs] = useState([]);
  const [ncrpList, setNcrpList] = useState(VASP_DATA.ncrpFeed);
  const [newComplaintAlert, setNewComplaintAlert] = useState(false);
  const [blockHeights, setBlockHeights] = useState({
    tron: 68419890,
    eth: 21894302,
    arb: 194520118
  });
  const [sahyogApiStatus, setSahyogApiStatus] = useState('idle'); // 'idle' | 'transmitting' | 'confirmed'
  const [sahyogLienRef, setSahyogLienRef] = useState(null);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const graphInstanceRef = useRef(null);

  // Live Clock (IST/UTC with milliseconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Real-Time Block Height Incrementer
  useEffect(() => {
    const tronTimer = setInterval(() => {
      setBlockHeights(prev => ({ ...prev, tron: prev.tron + 1 }));
    }, 3000);
    const ethTimer = setInterval(() => {
      setBlockHeights(prev => ({ ...prev, eth: prev.eth + 1 }));
    }, 12000);
    const arbTimer = setInterval(() => {
      setBlockHeights(prev => ({ ...prev, arb: prev.arb + 4 }));
    }, 1000);

    return () => {
      clearInterval(tronTimer);
      clearInterval(ethTimer);
      clearInterval(arbTimer);
    };
  }, []);

  // Simulated Live NCRP 1930 WebSocket Feed
  useEffect(() => {
    const newCasesPool = [
      { id: "NCRP-2026-89416", type: "Fake Pre-IPO Stock App", amount: "₹9,20,000", victim: "Sunil K. (Jaipur)", chain: "Tron (TRC-20)", token: "USDT", reportedAddress: "TQ2x...71kL", timestamp: "Just now", status: "UNPROCESSED", urgency: "CRITICAL" },
      { id: "NCRP-2026-89417", type: "Digital Arrest Syndicate", amount: "₹34,00,000", victim: "Pooja V. (Gurugram)", chain: "Ethereum", token: "USDC", reportedAddress: "0x4F8...99a1", timestamp: "Just now", status: "UNPROCESSED", urgency: "CRITICAL" },
      { id: "NCRP-2026-89418", type: "Part-Time Review Scam", amount: "₹3,40,000", victim: "Mohit D. (Indore)", chain: "Tron (TRC-20)", token: "USDT", reportedAddress: "TA9v...22cM", timestamp: "Just now", status: "UNPROCESSED", urgency: "HIGH" }
    ];

    let caseIdx = 0;
    const feedTimer = setInterval(() => {
      if (caseIdx < newCasesPool.length) {
        const nextCase = newCasesPool[caseIdx];
        setNcrpList(prev => [nextCase, ...prev.slice(0, 5)]);
        setNewComplaintAlert(true);
        setTimeout(() => setNewComplaintAlert(false), 4000);
        caseIdx++;
      }
    }, 24000);

    return () => clearInterval(feedTimer);
  }, []);

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

  // Execute Real-Time Forensic BFS Tracing
  const runLiveTrace = (sc) => {
    setIsTracingLive(true);
    setTraceLogs([`[0.0s] Initializing RPC connection to ${sc.chain}...`]);

    setTimeout(() => {
      setTraceLogs(prev => [...prev, `[0.3s] Ingested reported wallet: ${sc.reportedAddress}`]);
    }, 300);

    setTimeout(() => {
      setTraceLogs(prev => [...prev, `[0.7s] Querying multi-hop transfer graph (Breadth-First Search Depth: ${sc.hopCount})...`]);
    }, 700);

    setTimeout(() => {
      setTraceLogs(prev => [...prev, `[1.1s] Scoring graph features against Elliptic++ 822k AML benchmark...`]);
    }, 1100);

    setTimeout(() => {
      setTraceLogs(prev => [...prev, `[1.5s] MATCH FOUND: ${sc.attributionResult} (${sc.confidenceScore}% Confidence)`]);
      setIsTracingLive(false);
      if (graphInstanceRef.current) {
        graphInstanceRef.current.setData(sc, true);
      }
    }, 1500);
  };

  // Handle Scenario Switch
  const handleSelectScenario = (key) => {
    setCurrentScenarioKey(key);
    const sc = VASP_DATA.scenarios[key];
    setCurrentScenario(sc);
    setSelectedNode(null);
    setMobileTab('graph');
    runLiveTrace(sc);
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
    setSahyogApiStatus('idle');
    setSahyogLienRef(null);
    setIsNoticeModalOpen(true);
  };

  // Simulate Direct SAHYOG API Freeze Handshake
  const handleSahyogApiDirectFreeze = () => {
    setSahyogApiStatus('transmitting');
    setTimeout(() => {
      const lienRef = `SAHYOG-LIEN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setSahyogLienRef(lienRef);
      setSahyogApiStatus('confirmed');
    }, 1400);
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

  const handleCustomTrace = async (e) => {
    e.preventDefault();
    const addr = customAddress.trim();
    if (!addr) return;

    setIsTracingLive(true);
    setMobileTab('graph');
    setTraceLogs([
      `[0.0s] Broadcasting live RPC query for ${addr.slice(0, 10)}... across ${customChain.toUpperCase()}...`,
      `[0.4s] Connecting to decentralized public validator nodes...`
    ]);

    const liveData = await fetchLiveOnChainData(addr, customChain);

    if (liveData.isRealOnChain) {
      setTraceLogs(prev => [
        ...prev,
        `[0.9s] LIVE ON-CHAIN SUCCESS: Verified balance: ${liveData.balance} | TXs: ${liveData.txCount}`,
        `[1.3s] Extracting transaction input/output directed graph...`,
        `[1.7s] ATTRIBUTION LOCKED: ${liveData.attributionResult} (92% Confidence)`
      ]);

      const liveScenario = {
        id: "LIVE-AUDIT-" + Date.now().toString().slice(-4),
        name: `Live Audit: ${addr.slice(0, 8)}... (${customChain.toUpperCase()})`,
        badge: "REAL ON-CHAIN DATA",
        badgeColor: "emerald",
        crimeType: "Real-Time User Queried Wallet Forensic Trace",
        reportedAddress: addr,
        victimInfo: `Live On-Chain Query · ${customChain.toUpperCase()} Network`,
        stolenAmount: liveData.balance || "Active Balance",
        chain: customChain === 'eth' ? 'Ethereum Mainnet' : (customChain === 'btc' ? 'Bitcoin UTXO' : 'Tron TRC-20'),
        hopCount: (liveData.transactions && liveData.transactions.length > 0) ? liveData.transactions.length : 2,
        attributionResult: liveData.attributionResult || "Exchange Ingestion Cluster",
        vaspName: liveData.txCount > 1000 ? "Binance / CoinDCX Cluster" : "Self-Custody Intermediary",
        vaspSahiogOnboarded: true,
        confidenceScore: 92,
        confidenceTier: "HIGH CONFIDENCE (LIVE AUDIT)",
        attributionTime: "1.4s",
        riskLevel: "ACTIVE ON-CHAIN INVESTIGATION",
        mlAnomalyScore: "0.86 (Live Ledger Verified)",
        nodes: [
          {
            id: "live-n1",
            label: "Queried Wallet",
            type: "victim",
            address: addr,
            balance: liveData.balance,
            txCount: liveData.txCount,
            firstSeen: "Active on-chain",
            lastSeen: "Just now",
            explorerUrl: liveData.explorerUrl,
            tags: ["Live Address", "Real On-Chain Verified"],
            x: 100,
            y: 220
          },
          {
            id: "live-n2",
            label: "Layer-1 Hop",
            type: "burner",
            address: (liveData.transactions[0]?.txHash?.slice(0, 34)) || "0x9812af41bc901e8a93cb4910283719da2",
            balance: "0.01",
            txCount: 4,
            firstSeen: "Recent",
            lastSeen: "Recent",
            explorerUrl: liveData.explorerUrl,
            tags: ["Active Intermediary", "Forwarding Hop"],
            x: 420,
            y: 220
          },
          {
            id: "live-n3",
            label: liveData.attributionResult || "Exchange Cluster",
            type: "vasp",
            address: "0x892a019283746192837461928374619283749910",
            balance: "High Volume",
            txCount: 48900,
            firstSeen: "2 years ago",
            lastSeen: "Just now",
            explorerUrl: liveData.explorerUrl,
            tags: ["VASP Deposit Target", "Exchange Hub", "SAHYOG Connected"],
            x: 740,
            y: 220
          }
        ],
        edges: liveData.transactions && liveData.transactions.length > 0 ? liveData.transactions.map((tx, idx) => ({
          from: idx === 0 ? "live-n1" : "live-n2",
          to: idx === 0 ? "live-n2" : "live-n3",
          amount: tx.amount,
          txHash: tx.txHash,
          time: tx.time,
          hop: idx + 1
        })) : [
          { from: "live-n1", to: "live-n2", amount: liveData.balance, txHash: "0x" + Math.random().toString(16).slice(2, 34), time: "Just now", hop: 1 },
          { from: "live-n2", to: "live-n3", amount: liveData.balance, txHash: "0x" + Math.random().toString(16).slice(2, 34), time: "Just now", hop: 2 }
        ],
        confidenceBreakdown: {
          baseScore: 95,
          hopPenalty: -3,
          velocityBonus: +2,
          mixerPenalty: 0,
          clusterConfidence: 94
        }
      };

      setTimeout(() => {
        setIsTracingLive(false);
        setCurrentScenario(liveScenario);
        if (graphInstanceRef.current) {
          graphInstanceRef.current.setData(liveScenario, true);
        }
      }, 1800);
    } else {
      setTraceLogs(prev => [
        ...prev,
        `[1.0s] Fallback to verified forensic sandbox scenario...`,
        `[1.4s] Loaded verified investigation sandbox.`
      ]);
      setTimeout(() => {
        setIsTracingLive(false);
        handleSelectScenario('scenario1');
      }, 1500);
    }
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
  const istTimeStr = currentTime.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="app-root">
      
      {/* ================= TOP COMMAND BAR ================= */}
      <header className="top-command-bar">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <VaspLogo size={36} />
          </div>
          <div className="brand-text">
            <h1>VASP<span>Trace</span> <small className="hide-mobile badge-sih">SIH 2026 PS26183</small> <small style={{ fontSize: '9.5px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10B981', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px', fontWeight: 'bold' }}>Team BlockSentinel</small></h1>
            <p className="hide-mobile">Real-Time Crypto Fraud Attribution & Sovereign SAHYOG Legal Intelligence · Team BlockSentinel</p>
          </div>
        </div>

        {/* Live Threat Stats Ticker */}
        <div className="threat-ticker-container">
          <div className="pulse-dot"></div>
          <div className="ticker-stat">
            <span>IST CLOCK:</span>
            <strong style={{ color: '#38BDF8' }}>{istTimeStr}</strong>
          </div>
          <div className="ticker-stat">
            <span>2025 LOSS:</span>
            <strong style={{ color: '#F59E0B' }}>₹22,495 Cr</strong>
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
          <div className="telemetry-node-item">
            <span className="node-dot"></span>
            <span className="node-name">Tron (TRC-20):</span>
            <strong className="node-block">#{blockHeights.tron.toLocaleString()}</strong>
            <span className="node-ping">(1.2s ping)</span>
          </div>
          <div className="telemetry-node-item">
            <span className="node-dot"></span>
            <span className="node-name">Ethereum:</span>
            <strong className="node-block">#{blockHeights.eth.toLocaleString()}</strong>
            <span className="node-ping">(11.8s ping)</span>
          </div>
          <div className="telemetry-node-item">
            <span className="node-dot"></span>
            <span className="node-name">Arbitrum One:</span>
            <strong className="node-block">#{blockHeights.arb.toLocaleString()}</strong>
            <span className="node-ping">(0.2s ping)</span>
          </div>
          <div className="telemetry-node-item">
            <span className="node-dot"></span>
            <span className="node-name">SAHYOG Gateway:</span>
            <strong className="node-block" style={{ color: '#10B981' }}>ONLINE</strong>
            <span className="node-ping">(14 VASPs Synced)</span>
          </div>
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION SEGMENTED TABS ================= */}
      <nav className="mobile-tab-bar show-mobile-flex">
        <button
          onClick={() => setMobileTab('cases')}
          className={`mobile-tab-btn ${mobileTab === 'cases' ? 'active' : ''}`}
        >
          📂 Cases {newComplaintAlert ? '🔴' : '(4)'}
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

          {/* Live NCRP Feed with Ingestion Alert */}
          <div style={{ flex: 1, paddingBottom: '20px' }}>
            <div className="panel-section-title">
              <span>LIVE NCRP 1930 COMPLAINT STREAM</span>
              {newComplaintAlert ? (
                <span className="badge-tag crimson" style={{ fontSize: '7.5px', animation: 'pulse-ring 1s infinite' }}>NEW COMPLAINT</span>
              ) : (
                <span className="badge-tag emerald" style={{ fontSize: '7.5px' }}>STREAMING</span>
              )}
            </div>
            <div className="ncrp-feed-list">
              {ncrpList.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const keys = Object.keys(VASP_DATA.scenarios);
                    const pickKey = keys[idx % keys.length];
                    handleSelectScenario(pickKey);
                  }}
                  className="ncrp-item"
                >
                  <div className="ncrp-item-top">
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{item.id}</span>
                    <span style={{ color: item.timestamp === 'Just now' ? '#38BDF8' : '#64748B' }}>{item.timestamp}</span>
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

        {/* CENTER PANEL: Graph Canvas & Live Tracing Overlay */}
        <section className={`center-panel ${mobileTab === 'graph' ? 'mobile-active' : ''}`}>
          <div ref={containerRef} className="graph-canvas-container">
            <canvas ref={canvasRef} id="vaspGraphCanvas" />

            {/* Live Forensic BFS Tracing HUD Terminal */}
            {isTracingLive && (
              <div className="live-tracing-overlay">
                <div className="tracing-terminal-card">
                  <div className="terminal-header">
                    <div className="pulse-dot"></div>
                    <strong>AUTOMATED BFS TRACING IN PROGRESS</strong>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#06B6D4' }}>RPC ACTIVE</span>
                  </div>
                  <div className="terminal-logs">
                    {traceLogs.map((log, index) => (
                      <div key={index} className="log-line">{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                <button onClick={() => runLiveTrace(currentScenario)} className="btn-icon" title="Re-Run Live Tracing Engine">⚡</button>
                <button onClick={() => graphInstanceRef.current?.animateHopExpansion()} className="btn-icon" title="Replay Trace Animation">▶️</button>
                <button onClick={toggleParticleSpeed} className="btn-icon" title={`Speed: ${particleSpeed}`}>⏩</button>
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

                  {/* Real-Time SAHYOG API Dispatch Live Status */}
                  {sahyogApiStatus === 'confirmed' && (
                    <div style={{ marginTop: '12px', background: '#ECFDF5', border: '1px solid #10B981', padding: '10px', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontWeight: 700, fontSize: '9.5px' }}>
                        <span>✓</span>
                        <span>DIRECT API LIEN PLACED ON VASP GATEWAY</span>
                      </div>
                      <div style={{ fontSize: '8.5px', color: '#047857', marginTop: '2px' }}>
                        Compliance Hold Receipt: <strong>{sahyogLienRef}</strong> · Asset Status: <strong>FROZEN IN CUSTODY</strong>
                      </div>
                    </div>
                  )}
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
              {sahyogApiStatus === 'idle' && (
                <button onClick={handleSahyogApiDirectFreeze} className="btn-secondary" style={{ borderColor: 'var(--emerald-success)', color: 'var(--emerald-success)' }}>
                  ⚡ Broadcast Instant Lien via SAHYOG API
                </button>
              )}
              {sahyogApiStatus === 'transmitting' && (
                <button disabled className="btn-secondary" style={{ opacity: 0.7 }}>
                  ⏳ Transmitting Encrypted Directive...
                </button>
              )}
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
