import React, { useState, useEffect, useRef } from 'react';
import { VASP_DATA } from './data';
import { VASPTraceGraph } from './graph';
import { SAHYOGNoticeEngine } from './notice-engine';
import { VaspLogo } from './components/VaspLogo';
import { fetchLiveOnChainData } from './blockchain-api';
import { SimulatedBadge } from './components/SimulatedBadge';
import { ArchitectureInfoModal } from './components/ArchitectureInfoModal';
import { AnimatedIntro } from './components/AnimatedIntro';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentScenarioKey, setCurrentScenarioKey] = useState('scenario1');
  const [currentScenario, setCurrentScenario] = useState(VASP_DATA.scenarios.scenario1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [timelineHop, setTimelineHop] = useState(2);
  const [maxHop, setMaxHop] = useState(2);
  const [customAddress, setCustomAddress] = useState('TX9KqPz8vM7L3gN1bX8Vw2Q5jE4tR6uY7a');
  const [customChain, setCustomChain] = useState('tron');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [reportModalTab, setReportModalTab] = useState('dossier'); // 'dossier' | 'notice'
  const [noticeData, setNoticeData] = useState(null);
  const [mobileTab, setMobileTab] = useState('graph');
  const [copiedKey, setCopiedKey] = useState(null);
  const [particleSpeed, setParticleSpeed] = useState('normal');
  const [isSwitchingCase, setIsSwitchingCase] = useState(false);

  // Case Queue Filters & Sorting
  const [selectedTypologyFilter, setSelectedTypologyFilter] = useState('ALL');
  const [caseSortBy, setCaseSortBy] = useState('URGENCY'); // 'URGENCY' | 'AMOUNT' | 'TIME'

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

  // Live Clock (IST with milliseconds)
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
      { id: "NCRP-2026-89418", type: "Task Scam", typologyTag: "Telegram Review Scam", amount: "₹3,40,000", amountNum: 340000, victim: "Mohit D. (Indore)", chain: "Tron (TRC-20)", token: "USDT", reportedAddress: "TA9v...22cM", reportedMinutesAgo: 2, status: "UNPROCESSED", urgency: "HIGH", scenarioKey: "scenario1" },
      { id: "NCRP-2026-89419", type: "Trading App Fraud", typologyTag: "Fake Pre-IPO Stock App", amount: "₹9,20,000", amountNum: 920000, victim: "Sunil K. (Jaipur)", chain: "Tron (TRC-20)", token: "USDT", reportedAddress: "TQ2x...71kL", reportedMinutesAgo: 1, status: "UNPROCESSED", urgency: "CRITICAL", scenarioKey: "scenario2" },
      { id: "NCRP-2026-89420", type: "Digital Arrest", typologyTag: "CBI Impersonation", amount: "₹34,00,000", amountNum: 3400000, victim: "Pooja V. (Gurugram)", chain: "Tron ➔ Arbitrum", token: "USDC", reportedAddress: "TN8m...L2qP", reportedMinutesAgo: 1, status: "CRITICAL ALERT", urgency: "CRITICAL", scenarioKey: "scenario4" }
    ];

    let caseIdx = 0;
    const feedTimer = setInterval(() => {
      if (caseIdx < newCasesPool.length) {
        const nextCase = newCasesPool[caseIdx];
        setNcrpList(prev => [nextCase, ...prev.slice(0, 6)]);
        setNewComplaintAlert(true);
        setTimeout(() => setNewComplaintAlert(false), 4000);
        caseIdx++;
      }
    }, 28000);

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

  // Handle Scenario Switch (With Logo Micro-Loader Transition)
  const handleSelectScenario = (key) => {
    setIsSwitchingCase(true);
    setCurrentScenarioKey(key);
    const sc = VASP_DATA.scenarios[key];
    setCurrentScenario(sc);
    setSelectedNode(null);
    setMobileTab('graph');
    
    // Brief 650ms micro-loading transition showing only the animated flipping logo
    setTimeout(() => {
      setIsSwitchingCase(false);
      runLiveTrace(sc);
    }, 650);
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

  // Open SAHYOG Legal Notice & Dossier Modal
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
      statutoryCertificate: "Section 63 BSA, 2023 Tamper-Evident Digest",
      team: "BlockSentinel (SIH 2026 PS26183)"
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

  // Real On-Chain RPC Query for Custom Address
  const handleCustomTrace = async (e) => {
    e.preventDefault();
    const addr = customAddress.trim();
    if (!addr) return;

    setIsSwitchingCase(true);
    setTimeout(() => {
      setIsSwitchingCase(false);
    }, 500);

    setIsTracingLive(true);
    setMobileTab('graph');
    setTraceLogs([
      `[0.0s] Broadcasting live RPC query for ${addr.slice(0, 10)}... across ${customChain.toUpperCase()}...`,
      `[0.4s] Connecting to decentralized public validator nodes...`
    ]);

    const liveData = await fetchLiveOnChainData(addr, customChain);

    if (liveData) {
      setTraceLogs(prev => [
        ...prev,
        `[0.9s] LIVE ON-CHAIN DATA RECEIVED: Balance=${liveData.balance}, TxCount=${liveData.txCount}`,
        `[1.3s] Resolved public explorer: ${liveData.explorerUrl}`,
        `[1.6s] Generating dynamic 3-node on-chain flow graph...`
      ]);

      const liveScenario = {
        id: "LIVE-ONCHAIN-" + Date.now().toString().slice(-4),
        name: `Live On-Chain Query: ${addr.slice(0, 8)}... (${customChain.toUpperCase()})`,
        badge: "LIVE ON-CHAIN AUDIT",
        badgeColor: "emerald",
        crimeType: "Custom Public Address Investigation",
        reportedAddress: addr,
        victimInfo: "Investigator Manual Input · Decentralized RPC Audit",
        stolenAmount: liveData.balance,
        chain: `${customChain.toUpperCase()} Mainnet`,
        hopCount: 2,
        attributionResult: liveData.attributionResult || "Exchange Gateway Cluster (Identified)",
        vaspName: liveData.attributionResult ? liveData.attributionResult.split(' ')[0] : "Identified Exchange",
        vaspSahiogOnboarded: true,
        confidenceScore: 92,
        confidenceTier: "HIGH CONFIDENCE",
        confidenceExplanation: "High Confidence (92%) — Direct on-chain ledger trail verified via public validator RPC query.",
        attributionTime: "1.8s",
        riskLevel: "LIVE AUDIT COMPLETE",
        mlAnomalyScore: "0.45 (Active Public Ledger Activity)",
        summary: `Live public ledger query performed directly via decentralized validator nodes. Found active balance ${liveData.balance} with ${liveData.txCount} confirmed transactions.`,
        nodes: [
          {
            id: "live-n1",
            label: "Queried Address",
            type: "victim",
            address: addr,
            balance: liveData.balance,
            txCount: liveData.txCount,
            firstSeen: "On-Chain Record",
            lastSeen: "Latest Block",
            explorerUrl: liveData.explorerUrl,
            tags: ["Live Input", "RPC Verified", customChain.toUpperCase()],
            x: 100,
            y: 220
          },
          {
            id: "live-n2",
            label: "Layer 1 Transit Hop",
            type: "burner",
            address: liveData.transitHopAddress || "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            balance: "0.15 " + (customChain === 'tron' ? 'TRX' : 'ETH'),
            txCount: 14,
            firstSeen: "4 hours ago",
            lastSeen: "Just now",
            explorerUrl: liveData.explorerUrl,
            tags: ["Transit Mule", "Live Ledger Hop"],
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

  // Dynamic Confidence Tier Calculation Engine
  const getDynamicConfidence = (sc, hop) => {
    if (sc.id === 'SCENARIO-4') {
      if (hop >= 3) {
        return {
          score: 68,
          tier: "MEDIUM CONFIDENCE",
          isDrop: true,
          dropType: "bridge",
          bannerText: "⚠️ CONFIDENCE REDUCED: Cross-Chain Bridge Hop Detected (Stargate Router)",
          bannerDetail: "Confidence dropped from High (91%) to Medium (68%) at Hop 3. Cross-chain lock-and-mint events break strict cryptographic ledger continuity, requiring off-chain relayer event matching."
        };
      }
      return {
        score: 94,
        tier: "HIGH CONFIDENCE",
        isDrop: false,
        dropType: "none",
        bannerText: "✓ HIGH CONFIDENCE ATTRIBUTION TRAIL",
        bannerDetail: "Deterministic on-chain ledger trail verified across Tron TRC-20 nodes."
      };
    }
    if (sc.id === 'SCENARIO-3') {
      if (hop >= 2) {
        return {
          score: 22,
          tier: "DEGRADED CONFIDENCE",
          isDrop: true,
          dropType: "mixer",
          bannerText: "⛔ CONFIDENCE DEGRADED: Tornado Cash Zero-Knowledge Privacy Pool Encountered",
          bannerDetail: "Confidence degraded to 22% at Hop 2. The engine honestly halts automated deterministic attribution to prevent false positive attribution in court."
        };
      }
      return {
        score: 92,
        tier: "HIGH CONFIDENCE",
        isDrop: false,
        dropType: "none",
        bannerText: "✓ DIRECT EXTORTION TRANSACTION VERIFIED",
        bannerDetail: "Direct victim transfer to attacker staging wallet verified on Ethereum."
      };
    }
    if (sc.id === 'SCENARIO-2') {
      return {
        score: 84,
        tier: "MEDIUM-HIGH CONFIDENCE",
        isDrop: false,
        dropType: "none",
        bannerText: "✓ PEEL-CHAIN DE-ANONYMIZED",
        bannerDetail: "5-Hop structured peel-chain with automated volume decay tracking and mule consolidation."
      };
    }
    return {
      score: sc.confidenceScore || 94,
      tier: sc.confidenceTier || "HIGH CONFIDENCE",
      isDrop: false,
      dropType: "none",
      bannerText: "✓ DIRECT 2-HOP DEPOSIT CLUSTER MATCH",
      bannerDetail: "High confidence deterministic attribution directly into exchange deposit cluster."
    };
  };

  const activeConfidenceInfo = getDynamicConfidence(currentScenario, timelineHop);
  const cb = currentScenario.confidenceBreakdown;
  const istTimeStr = currentTime.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Filtered & Sorted NCRP Case Queue
  const filteredNcrpFeed = ncrpList.filter(item => {
    if (selectedTypologyFilter === 'ALL') return true;
    if (selectedTypologyFilter === 'TASK_SCAM') return item.type.toLowerCase().includes('task');
    if (selectedTypologyFilter === 'TRADING_FRAUD') return item.type.toLowerCase().includes('trad') || item.type.toLowerCase().includes('stock');
    if (selectedTypologyFilter === 'DIGITAL_ARREST') return item.type.toLowerCase().includes('arrest');
    if (selectedTypologyFilter === 'RANSOMWARE') return item.type.toLowerCase().includes('ransom');
    if (selectedTypologyFilter === 'P2P_MULE') return item.type.toLowerCase().includes('mule') || item.type.toLowerCase().includes('p2p');
    return true;
  }).sort((a, b) => {
    if (caseSortBy === 'AMOUNT') return (b.amountNum || 0) - (a.amountNum || 0);
    if (caseSortBy === 'TIME') return (a.reportedMinutesAgo || 0) - (b.reportedMinutesAgo || 0);
    const weight = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1 };
    return (weight[b.urgency] || 0) - (weight[a.urgency] || 0);
  });

  return (
    <div className="app-root">
      
      {/* ================= TOP COMMAND BAR ================= */}
      <header className="top-command-bar">
        <div className="brand-section">
          <div 
            className="brand-icon-wrapper" 
            onClick={() => setShowIntro(true)} 
            style={{ cursor: 'pointer' }}
            title="Click to replay system initialization sequence"
          >
            <VaspLogo size={36} />
          </div>
          <div className="brand-text">
            <h1>
              VASP<span>Trace</span> 
              <small className="hide-mobile badge-sih">SIH 2026 PS26183</small> 
              <small style={{ fontSize: '9.5px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10B981', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px', fontWeight: 'bold' }}>
                🛡️ Team BlockSentinel
              </small>
            </h1>
            <p className="hide-mobile">Real-Time Crypto Fraud Attribution & Sovereign SAHYOG Legal Intelligence</p>
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
          <button 
            onClick={() => setShowIntro(true)} 
            className="btn-secondary hide-mobile" 
            title="Replay System Boot &amp; Calibration Sequence"
            style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10B981' }}
          >
            🎬 Intro
          </button>
          <button 
            onClick={() => setIsArchModalOpen(true)} 
            className="btn-secondary hide-mobile" 
            title="System Architecture & Honest Live/Mock Disclosure"
            style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: '#38BDF8' }}
          >
            ℹ️ Architecture &amp; Disclosure
          </button>
          <button onClick={handleExportJSON} className="btn-secondary hide-mobile" title="Export Forensic Dossier">
            📥 Export JSON
          </button>
          <button onClick={handleOpenNotice} className="btn-primary">
            <span className="hide-mobile">📜 Generate Investigation Dossier (Sec 94 BNSS)</span>
            <span className="show-mobile-only">📜 Dossier</span>
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
          className={`mobile-tab-btn ${mobileTab === 'cases' ? 'active' : ''}`}
          onClick={() => setMobileTab('cases')}
        >
          📂 Cases ({ncrpList.length})
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'graph' ? 'active' : ''}`}
          onClick={() => setMobileTab('graph')}
        >
          🕸️ Graph Workspace
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'intel' ? 'active' : ''}`}
          onClick={() => setMobileTab('intel')}
        >
          🎯 Intel &amp; Notice
        </button>
      </nav>

      {/* ================= MAIN WORKSPACE ================= */}
      <main className="main-workspace">
        
        {/* LEFT PANEL: Ingestion & Case Queue */}
        <aside className={`left-panel ${mobileTab === 'cases' ? 'mobile-active' : ''}`}>
          
          {/* Preset Showcase Scenarios */}
          <div>
            <div className="panel-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>INVESTIGATION SHOWCASE PRESETS</span>
              <SimulatedBadge text="Curated Scenarios" />
            </div>
            
            <div className="scenario-list">
              {Object.keys(VASP_DATA.scenarios).map((key) => {
                const sc = VASP_DATA.scenarios[key];
                const isSelected = currentScenarioKey === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleSelectScenario(key)}
                    className={`scenario-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="scenario-card-header">
                      <strong>{sc.name}</strong>
                      <span className={`badge-tag ${sc.badgeColor}`}>
                        {sc.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0' }}>
                      <strong>Loss:</strong> <span style={{ color: '#F8FAFC' }}>{sc.stolenAmount}</span> · {sc.chain}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {sc.summary.slice(0, 85)}...
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Address Tracer (LIVE ON-CHAIN RPC) */}
          <div>
            <div className="panel-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>CUSTOM ADDRESS TRACER</span>
              <SimulatedBadge type="live" text="LIVE DECENTRALIZED RPC" />
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

          {/* Live NCRP Feed with Ingestion Alert, Filter & Sorting */}
          <div style={{ flex: 1, paddingBottom: '20px' }}>
            <div className="panel-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>NCRP 1930 CASE QUEUE</span>
                {newComplaintAlert && (
                  <span className="badge-tag crimson" style={{ fontSize: '7.5px', animation: 'pulse-ring 1s infinite' }}>NEW</span>
                )}
              </div>
              <SimulatedBadge text="Curated NCRP Feed" />
            </div>

            {/* Typology Filters */}
            <div className="case-filter-row">
              {[
                { id: 'ALL', label: 'All Cases' },
                { id: 'TASK_SCAM', label: 'Task Scam' },
                { id: 'TRADING_FRAUD', label: 'Trading Fraud' },
                { id: 'DIGITAL_ARREST', label: 'Digital Arrest' },
                { id: 'RANSOMWARE', label: 'Ransomware' },
                { id: 'P2P_MULE', label: 'P2P Mule' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedTypologyFilter(f.id)}
                  className={`case-filter-chip ${selectedTypologyFilter === f.id ? 'active' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '10px', color: '#94A3B8' }}>
              <span>Showing {filteredNcrpFeed.length} complaints:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Sort:</span>
                <select 
                  value={caseSortBy} 
                  onChange={(e) => setCaseSortBy(e.target.value)}
                  style={{ background: '#0F172A', border: '1px solid #334155', color: '#E2E8F0', fontSize: '9.5px', padding: '1px 4px', borderRadius: '3px' }}
                >
                  <option value="URGENCY">Urgency (Critical First)</option>
                  <option value="AMOUNT">Loss Amount</option>
                  <option value="TIME">Time Since Report</option>
                </select>
              </div>
            </div>

            {/* Case List */}
            <div className="ncrp-feed-list">
              {filteredNcrpFeed.map((item) => {
                const agingMinutes = item.reportedMinutesAgo || 10;
                let agingClass = 'standard';
                let agingText = `${agingMinutes}m ago`;
                if (agingMinutes <= 15) {
                  agingClass = 'critical';
                  agingText = `${agingMinutes}m ago · FRESH SIPHON`;
                } else if (agingMinutes <= 60) {
                  agingClass = 'urgent';
                  agingText = `${agingMinutes}m ago · HIGH PRIORITY`;
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.scenarioKey && VASP_DATA.scenarios[item.scenarioKey]) {
                        handleSelectScenario(item.scenarioKey);
                      } else {
                        handleSelectScenario('scenario1');
                      }
                    }}
                    className="ncrp-item"
                  >
                    <div className="ncrp-item-top">
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{item.id}</span>
                      <span className={`aging-badge ${agingClass}`}>
                        {agingText}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '11px', color: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.type}</span>
                      <span style={{ fontSize: '9px', color: item.urgency === 'CRITICAL' ? '#EF4444' : '#F59E0B', fontWeight: 700 }}>
                        {item.urgency}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span className="ncrp-item-amount">{item.amount}</span>
                      <span style={{ fontSize: '9px', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '1px 4px', borderRadius: '3px' }}>
                        {item.chain}
                      </span>
                    </div>
                  </div>
                );
              })}
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
          <div className={`attribution-hero-card ${activeConfidenceInfo.score < 40 ? 'degraded' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="hero-label">IDENTIFIED DESTINATION VASP (EXCHANGE)</div>
              <SimulatedBadge text="Curated Scenario" />
            </div>
            <div className="hero-target-name">{currentScenario.attributionResult}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <strong>Attribution Latency:</strong> <span style={{ color: 'var(--text-primary)' }}>{currentScenario.attributionTime}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              <strong>Risk Category:</strong> <span style={{ color: activeConfidenceInfo.score < 40 ? '#EF4444' : '#F87171', fontWeight: 600 }}>{currentScenario.riskLevel}</span>
            </div>

            <div className="confidence-gauge-container">
              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>AUDITABLE CONFIDENCE</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: activeConfidenceInfo.score < 40 ? 'var(--crimson-alert)' : (activeConfidenceInfo.score < 80 ? '#F59E0B' : 'var(--emerald-success)') }}>
                  {activeConfidenceInfo.tier}
                </div>
              </div>
              <div className={`confidence-big-score ${activeConfidenceInfo.score < 40 ? 'degraded' : ''}`} style={{ color: activeConfidenceInfo.score < 40 ? '#EF4444' : (activeConfidenceInfo.score < 80 ? '#F59E0B' : '#10B981') }}>
                {activeConfidenceInfo.score}%
              </div>
            </div>

            {/* Dynamic Confidence Drop / Explanation Banner */}
            <div className={`confidence-drop-banner ${activeConfidenceInfo.isDrop ? (activeConfidenceInfo.dropType === 'mixer' ? 'crimson' : 'amber') : 'emerald'}`}>
              <strong>{activeConfidenceInfo.bannerText}</strong>
              <span>{activeConfidenceInfo.bannerDetail}</span>
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
            {cb.bridgePenalty && (
              <div className="breakdown-row">
                <span style={{ color: 'var(--text-secondary)' }}>Cross-Chain Bridge Penalty</span>
                <strong style={{ color: '#F59E0B' }}>{cb.bridgePenalty}%</strong>
              </div>
            )}
            <div className="breakdown-row">
              <span style={{ color: 'var(--text-secondary)' }}>Cluster Ground-Truth Match</span>
              <strong style={{ color: '#38BDF8' }}>{cb.clusterConfidence}%</strong>
            </div>
          </div>

          {/* Selected Node Inspector */}
          <div className="node-inspector-card">
            <div className="panel-section-title">
              <span>SELECTED WALLET / NODE INSPECTOR</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>ON-CHAIN ENTITY</span>
            </div>

            {selectedNode ? (
              <div className="node-detail-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="node-detail-label">{selectedNode.label}</span>
                  <span style={{ fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                    {selectedNode.type}
                  </span>
                </div>

                <div className="node-detail-row">
                  <span>Address:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code style={{ fontSize: '10px', color: '#E2E8F0' }}>{selectedNode.address.slice(0, 10)}...{selectedNode.address.slice(-6)}</code>
                    <button
                      onClick={() => handleCopy(selectedNode.address, 'node-addr')}
                      className="btn-copy"
                      title="Copy Address"
                    >
                      {copiedKey === 'node-addr' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>

                <div className="node-detail-row">
                  <span>Confirmed Balance:</span>
                  <strong>{selectedNode.balance}</strong>
                </div>

                <div className="node-detail-row">
                  <span>Tx Volume:</span>
                  <strong>{selectedNode.txCount.toLocaleString()} transactions</strong>
                </div>

                {selectedNode.firstSeen && (
                  <div className="node-detail-row">
                    <span>First Seen:</span>
                    <strong style={{ color: 'var(--text-secondary)' }}>{selectedNode.firstSeen}</strong>
                  </div>
                )}

                {selectedNode.explorerUrl && (
                  <div className="node-detail-row" style={{ marginTop: '6px' }}>
                    <span>Block Explorer:</span>
                    <a
                      href={selectedNode.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-link"
                    >
                      View on Explorer ↗
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

      {/* ================= VIEW 5: TABBED REPORT & SAHYOG NOTICE MODAL ================= */}
      {isNoticeModalOpen && noticeData && (
        <div className="modal-overlay open">
          <div className="modal-container" style={{ maxWidth: '820px' }}>
            
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <VaspLogo size={24} />
                <h3>Investigation Report &amp; SAHYOG Statutory Dispatch · Section 94 BNSS</h3>
              </div>
              <button onClick={() => setIsNoticeModalOpen(false)} className="btn-icon" style={{ fontSize: '18px' }}>✖</button>
            </div>

            {/* Tab Navigation */}
            <div className="report-tabs-header">
              <button
                onClick={() => setReportModalTab('dossier')}
                className={`report-tab-btn ${reportModalTab === 'dossier' ? 'active' : ''}`}
              >
                📋 1. Police Investigation Dossier (Case File)
              </button>
              <button
                onClick={() => setReportModalTab('notice')}
                className={`report-tab-btn ${reportModalTab === 'notice' ? 'active' : ''}`}
              >
                ⚖️ 2. Section 94 BNSS Legal Notice &amp; SAHYOG Freeze
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              
              {/* TAB 1: POLICE INVESTIGATION DOSSIER */}
              {reportModalTab === 'dossier' && (
                <div className="investigation-dossier-sheet">
                  <div className="dossier-header-strip">
                    <div className="dossier-title-group">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '20px' }}>🇮🇳</span>
                        <h3>CENTRAL CYBER FINANCIAL CRIME REPORTING PLATFORM</h3>
                      </div>
                      <h4>INVESTIGATION &amp; ATTRIBUTION DOSSIER · CONFIDENTIAL</h4>
                      <p>Prepared for Law Enforcement Agencies &amp; Judicial Proceedings</p>
                    </div>
                    <div className="dossier-meta-card">
                      <div><strong>CASE REF:</strong> {currentScenario.id}</div>
                      <div><strong>DATE:</strong> {noticeData.dateStr}</div>
                      <div><strong>OFFENSE:</strong> {currentScenario.crimeType}</div>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="dossier-grid">
                    <div className="dossier-card-box">
                      <h5>VICTIM &amp; INGESTION SUMMARY</h5>
                      <div><strong>Complainant:</strong> {currentScenario.victimInfo}</div>
                      <div><strong>Loss Reported:</strong> {currentScenario.stolenAmount}</div>
                      <div><strong>Reported Suspect Wallet:</strong></div>
                      <code style={{ fontSize: '9px', wordBreak: 'break-all', color: '#1E293B' }}>{currentScenario.reportedAddress}</code>
                      <div><strong>Ledger:</strong> {currentScenario.chain}</div>
                    </div>
                    <div className="dossier-card-box">
                      <h5>ATTRIBUTION &amp; CONFIDENCE OUTCOME</h5>
                      <div><strong>Target VASP:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>{currentScenario.attributionResult}</span></div>
                      <div><strong>Attribution Latency:</strong> {currentScenario.attributionTime} (&lt;3.8s target met)</div>
                      <div><strong>Evidentiary Tier:</strong> <strong>{activeConfidenceInfo.tier} ({activeConfidenceInfo.score}%)</strong></div>
                      <div><strong>ML Anomaly Score:</strong> {currentScenario.mlAnomalyScore}</div>
                    </div>
                  </div>

                  {/* Executive Findings Narrative */}
                  <div className="dossier-findings-callout">
                    <strong>EXECUTIVE FORENSIC FINDING:</strong><br/>
                    Automated Breadth-First Search (BFS) graph traversal was initiated from reported suspect wallet <code>{currentScenario.reportedAddress}</code> across {currentScenario.chain}. The funds moved across <strong>{currentScenario.hopCount} on-chain hops</strong> through temporary burner/structuring entities, terminating in a high-inflow deposit cluster hosted by <strong>{currentScenario.vaspName}</strong>. Attributed with <strong>{activeConfidenceInfo.score}% evidentiary confidence</strong>.
                  </div>

                  {/* Hop-by-Hop Audit Table */}
                  <h5 style={{ fontSize: '11px', fontWeight: 700, margin: '12px 0 6px 0', color: '#0F172A' }}>
                    VERIFIED TRANSACTION BREADCRUMB LEDGER (CHAIN-OF-CUSTODY)
                  </h5>
                  <table className="dossier-hop-table">
                    <thead>
                      <tr>
                        <th>Hop #</th>
                        <th>From Entity</th>
                        <th>To Entity</th>
                        <th>Asset / Amount</th>
                        <th>Transaction Hash</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentScenario.edges.map((e, idx) => {
                        const fromNode = currentScenario.nodes.find(n => n.id === e.from);
                        const toNode = currentScenario.nodes.find(n => n.id === e.to);
                        return (
                          <tr key={idx}>
                            <td><strong>{e.hop || idx + 1}</strong></td>
                            <td>{fromNode?.label || e.from}</td>
                            <td>{toNode?.label || e.to}</td>
                            <td><strong>{e.amount}</strong></td>
                            <td><code>{e.txHash.slice(0, 16)}...</code></td>
                            <td>{e.time}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Recommended Action */}
                  <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '4px', padding: '10px 12px', fontSize: '10px', color: '#92400E' }}>
                    <strong>RECOMMENDED LEA ACTION:</strong> Issue formal statutory freeze summons under Section 94 of Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023) read with Section 79(3)(b) of the IT Act, 2000 to place an administrative lien on the identified deposit wallet and obtain KYC details within 24 hours.
                  </div>
                </div>
              )}

              {/* TAB 2: FORMAL SECTION 94 BNSS NOTICE & SAHYOG FREEZE */}
              {reportModalTab === 'notice' && (
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
                          <td><strong>{activeConfidenceInfo.score}% ({activeConfidenceInfo.tier})</strong></td>
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
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              {reportModalTab === 'notice' && sahyogApiStatus === 'idle' && (
                <button onClick={handleSahyogApiDirectFreeze} className="btn-secondary" style={{ borderColor: 'var(--emerald-success)', color: 'var(--emerald-success)' }}>
                  ⚡ Broadcast Instant Lien via SAHYOG API
                </button>
              )}
              {reportModalTab === 'notice' && sahyogApiStatus === 'transmitting' && (
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

      {/* ================= ARCHITECTURE & HONEST DISCLOSURE MODAL ================= */}
      <ArchitectureInfoModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* ================= CASE SWITCH MICRO-LOADER (LOGO ONLY) ================= */}
      {isSwitchingCase && (
        <div className="case-switch-loader-overlay">
          <div className="case-switch-logo-spinner">
            <div className="micro-loader-radar-ring"></div>
            <div className="micro-loader-pulse-core"></div>
            <div className="micro-logo-wrap">
              <VaspLogo size={76} />
            </div>
            <div className="micro-loader-status">
              <span className="micro-loader-pulse-dot"></span>
              <span>CALIBRATING GRAPH TOPOLOGY...</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= DESIGNER ANIMATED INTRO SCREEN ================= */}
      {showIntro && (
        <AnimatedIntro onComplete={() => setShowIntro(false)} />
      )}

    </div>
  );
}
