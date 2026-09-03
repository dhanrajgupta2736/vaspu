/**
 * VASPTrace - Presentation Scenarios, Benchmark Data & Seed Intelligence
 * SIH 2026 · Problem Statement 26183
 * Team: BlockSentinel
 */

export const VASP_DATA = {
  nationalStats: {
    totalLoss2025: "₹22,495 Cr",
    reportedCases: "28.15 Lakh",
    investmentScamShare: "75.4%",
    avgAttributionTime: "3.8 Seconds",
    edSeizuresCrypto: "₹4,189.9 Cr",
    sahyogIntegratedVASPs: 14
  },

  blockchainNodes: [
    { name: "Tron (TRC-20)", block: "68,419,890", latency: "1.2s", status: "HEALTHY", rpc: "grpc.trongrid.io:50051" },
    { name: "Ethereum Mainnet", block: "21,894,302", latency: "11.8s", status: "HEALTHY", rpc: "erigon-archive-node.local" },
    { name: "Arbitrum One", block: "194,520,118", latency: "0.2s", status: "HEALTHY", rpc: "nitro-sequencer.feed" },
    { name: "SAHYOG LEA Gateway", block: "SYNCED", latency: "42ms", status: "ONLINE", rpc: "i4c-sahyog-core.gov.in" }
  ],

  // Case Queue: Curated synthetic complaint set with typology tags and aging metadata
  ncrpFeed: [
    {
      id: "NCRP-2026-89412",
      type: "Task Scam",
      typologyTag: "Telegram Task Scam",
      amount: "₹4,80,000",
      amountNum: 480000,
      victim: "Rahul Sharma (Pune)",
      chain: "Tron (TRC-20)",
      token: "USDT",
      reportedAddress: "TX9KqPz8vM7L3gN1bX8Vw2Q5jE4tR6uY7a",
      reportedMinutesAgo: 4,
      status: "UNPROCESSED",
      urgency: "CRITICAL",
      scenarioKey: "scenario1"
    },
    {
      id: "NCRP-2026-89413",
      type: "Trading App Fraud",
      typologyTag: "Fake SEBI App",
      amount: "₹18,50,000",
      amountNum: 1850000,
      victim: "Dr. Ananya Iyer (Bengaluru)",
      chain: "Ethereum Mainnet",
      token: "ETH / USDT",
      reportedAddress: "0x71C...4b9F",
      reportedMinutesAgo: 14,
      status: "ANALYZING",
      urgency: "HIGH",
      scenarioKey: "scenario2"
    },
    {
      id: "NCRP-2026-89414",
      type: "Digital Arrest",
      typologyTag: "LEA Impersonation",
      amount: "₹12,00,000",
      amountNum: 1200000,
      victim: "Col. Suresh Verma (Retd.) (New Delhi)",
      chain: "Tron ➔ Arbitrum",
      token: "USDT / USDC",
      reportedAddress: "TN8mL2qPk7Y9jR4vX3Ww5Q1bE8tZ6uA7cB",
      reportedMinutesAgo: 28,
      status: "CRITICAL ALERT",
      urgency: "CRITICAL",
      scenarioKey: "scenario4"
    },
    {
      id: "NCRP-2026-89415",
      type: "Ransomware Extortion",
      typologyTag: "Corporate Extortion",
      amount: "₹50,00,000",
      amountNum: 5000000,
      victim: "Apex Pharma Logistics (Hyderabad)",
      chain: "Ethereum Mainnet",
      token: "ETH",
      reportedAddress: "0x3A2b9cD1481eE44eF929C8B56149D2F3879b2A40",
      reportedMinutesAgo: 65,
      status: "DEGRADED",
      urgency: "MEDIUM",
      scenarioKey: "scenario3"
    },
    {
      id: "NCRP-2026-89416",
      type: "P2P Mule Laundering",
      typologyTag: "Hawala Structuring",
      amount: "₹8,20,000",
      amountNum: 820000,
      victim: "Vikram Malhotra (Chandigarh)",
      chain: "Tron (TRC-20)",
      token: "USDT",
      reportedAddress: "TL3rVw8xPq7M9kN1bZ5Q2jE4tR6uY8a9b",
      reportedMinutesAgo: 82,
      status: "UNPROCESSED",
      urgency: "HIGH",
      scenarioKey: "scenario1"
    },
    {
      id: "NCRP-2026-89417",
      type: "Sextortion Blackmail",
      typologyTag: "Video Call Blackmail",
      amount: "₹1,50,000",
      amountNum: 150000,
      victim: "Kunal Bansal (Jaipur)",
      chain: "Bitcoin (BTC)",
      token: "BTC",
      reportedAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      reportedMinutesAgo: 110,
      status: "UNPROCESSED",
      urgency: "MEDIUM",
      scenarioKey: "scenario1"
    }
  ],

  scenarios: {
    scenario1: {
      id: "SCENARIO-1",
      name: "Case 1: Rapid Hit (Telegram Task Scam)",
      badge: "RAPID ATTRIBUTION",
      badgeColor: "emerald",
      crimeType: "Part-Time Job / Telegram Task Scam",
      reportedAddress: "TX9KqPz8vM7L3gN1bX8Vw2Q5jE4tR6uY7a",
      victimInfo: "Rahul Sharma, Pune · Complaint #NCRP-2026-89412",
      stolenAmount: "5,800 USDT (₹4,80,000)",
      chain: "Tron (TRC-20)",
      hopCount: 2,
      attributionResult: "Binance Hot Deposit Cluster #41",
      vaspName: "Binance",
      vaspSahiogOnboarded: true,
      confidenceScore: 94,
      confidenceTier: "HIGH CONFIDENCE",
      confidenceExplanation: "High Confidence (94%) — Direct 2-hop TRC-20 deposit cluster match with zero mixer obfuscation.",
      attributionTime: "3.2s",
      riskLevel: "CRITICAL - ESCALATED FOR FREEZE",
      mlAnomalyScore: "0.89 (High Fan-In Structuring)",
      summary: "Victim paid INR to a mule bank account; fraudster instantly bought USDT on Tron and routed it through 1 temporary burner wallet into a high-activity Binance deposit cluster.",
      
      hopConfidenceStages: [
        { hop: 1, score: 96, tier: "HIGH CONFIDENCE", annotation: "Direct on-chain ledger trail verified (Tron TRC-20)", isDrop: false },
        { hop: 2, score: 94, tier: "HIGH CONFIDENCE", annotation: "Direct Binance hot wallet deposit cluster match", isDrop: false }
      ],

      nodes: [
        { 
          id: "node-1", 
          label: "Victim Deposit", 
          type: "victim", 
          address: "TX9KqPz8vM7L3gN1bX8Vw2Q5jE4tR6uY7a", 
          balance: "0 USDT", 
          txCount: 4,
          firstSeen: "22 mins ago",
          lastSeen: "18 mins ago",
          explorerUrl: "https://tronscan.org/#/address/TX9KqPz8vM7L3gN1bX8Vw2Q5jE4tR6uY7a",
          tags: ["Reported Address", "NCRP Source", "Initial Mule Inflow"], 
          x: 100, 
          y: 220 
        },
        { 
          id: "node-2", 
          label: "Layer 1 Burner", 
          type: "burner", 
          address: "TL3rVw8xPq7M9kN1bZ5Q2jE4tR6uY8a9b", 
          balance: "12.4 USDT", 
          txCount: 2,
          firstSeen: "18 mins ago",
          lastSeen: "14 mins ago",
          explorerUrl: "https://tronscan.org/#/address/TL3rVw8xPq7M9kN1bZ5Q2jE4tR6uY8a9b",
          tags: ["Pass-Through Mule", "Zero Balance Target"], 
          x: 450, 
          y: 220 
        },
        { 
          id: "node-3", 
          label: "Binance Hot Wallet #41", 
          type: "vasp", 
          address: "TNDyZ9b8xPq7M9kN1bZ5Q2jE4tR6uY8a9b", 
          balance: "24,819,200 USDT", 
          txCount: 148200,
          firstSeen: "3 years ago",
          lastSeen: "Just now",
          explorerUrl: "https://tronscan.org/#/address/TNDyZ9b8xPq7M9kN1bZ5Q2jE4tR6uY8a9b",
          tags: ["Identified VASP", "Binance Settlement", "FIU Registered", "High Inflow Cluster"], 
          x: 800, 
          y: 220 
        }
      ],
      edges: [
        { from: "node-1", to: "node-2", amount: "5,800 USDT", txHash: "0x89ab10293847192837461928374619283746192837461928374619283746abcd", time: "18 mins ago", hop: 1 },
        { from: "node-2", to: "node-3", amount: "5,787.6 USDT", txHash: "0x77cd10293847192837461928374619283746192837461928374619283746ef01", time: "14 mins ago", hop: 2 }
      ],
      confidenceBreakdown: {
        baseScore: 95,
        hopPenalty: -2,
        velocityBonus: +3,
        mixerPenalty: 0,
        clusterConfidence: 98
      }
    },

    scenario2: {
      id: "SCENARIO-2",
      name: "Case 2: Peel Chain (Fake Trading App)",
      badge: "PEEL-CHAIN DE-ANONYMIZED",
      badgeColor: "cyan",
      crimeType: "Bogus Stock & Crypto Investment Platform",
      reportedAddress: "0x71C83644379faEB89f5F4829379faEB89f5F4b9F",
      victimInfo: "Dr. Ananya Iyer, Bengaluru · Complaint #NCRP-2026-89413",
      stolenAmount: "22.5 ETH (₹18,50,000)",
      chain: "Ethereum Mainnet",
      hopCount: 5,
      attributionResult: "CoinDCX Main Deposit Pool",
      vaspName: "CoinDCX",
      vaspSahiogOnboarded: true,
      confidenceScore: 84,
      confidenceTier: "MEDIUM-HIGH CONFIDENCE",
      confidenceExplanation: "Medium-High Confidence (84%) — 5-hop structured peel-chain de-anonymized via volume decay tracking.",
      attributionTime: "3.7s",
      riskLevel: "HIGH - VOLUMETRIC PEEL PATTERN",
      mlAnomalyScore: "0.94 (Peel Chain Signature Detected)",
      summary: "Fraud syndicate executed a 5-hop peel chain, shaving off 1.5 to 2 ETH at each hop into cash-out wallets while passing the main amount forward to CoinDCX deposit.",

      hopConfidenceStages: [
        { hop: 1, score: 94, tier: "HIGH CONFIDENCE", annotation: "Direct initial Ethereum debit", isDrop: false },
        { hop: 2, score: 91, tier: "HIGH CONFIDENCE", annotation: "Hop 2: First peel split observed", isDrop: false },
        { hop: 3, score: 88, tier: "HIGH CONFIDENCE", annotation: "Hop 3: Multi-hop volume-decay tracking", isDrop: false },
        { hop: 4, score: 86, tier: "HIGH CONFIDENCE", annotation: "Hop 4: Mule consolidation filter active", isDrop: false },
        { hop: 5, score: 84, tier: "MEDIUM-HIGH CONFIDENCE", annotation: "Hop 5: Resolved to CoinDCX hot deposit pool", isDrop: false }
      ],

      nodes: [
        { id: "s2-n1", label: "Victim Wallet", type: "victim", address: "0x71C83644379faEB89f5F4829379faEB89f5F4b9F", balance: "0.01 ETH", txCount: 8, firstSeen: "2h ago", lastSeen: "1h 12m ago", explorerUrl: "https://etherscan.io/address/0x71C83644379faEB89f5F4829379faEB89f5F4b9F", tags: ["Reported Wallet"], x: 80, y: 220 },
        { id: "s2-n2", label: "Peel Hop 1", type: "burner", address: "0x99aB128734910283719da21894a4F11901e8a93c", balance: "2.1 ETH", txCount: 3, firstSeen: "1h 12m ago", lastSeen: "58m ago", explorerUrl: "https://etherscan.io/address/0x99aB128734910283719da21894a4F11901e8a93c", tags: ["Splitter 1"], x: 230, y: 220 },
        { id: "s2-n3", label: "Peel Hop 2", type: "burner", address: "0x44cD33910283719da21894a4F11901e8a93cb491", balance: "1.8 ETH", txCount: 4, firstSeen: "58m ago", lastSeen: "44m ago", explorerUrl: "https://etherscan.io/address/0x44cD33910283719da21894a4F11901e8a93cb491", tags: ["Splitter 2"], x: 380, y: 220 },
        { id: "s2-n4", label: "Peel Hop 3", type: "burner", address: "0x12eF88910283719da21894a4F11901e8a93cb491", balance: "0.5 ETH", txCount: 3, firstSeen: "44m ago", lastSeen: "25m ago", explorerUrl: "https://etherscan.io/address/0x12eF88910283719da21894a4F11901e8a93cb491", tags: ["Splitter 3"], x: 530, y: 220 },
        { id: "s2-n5", label: "Consolidation Burner", type: "burner", address: "0x88bA44910283719da21894a4F11901e8a93cb491", balance: "0 ETH", txCount: 2, firstSeen: "25m ago", lastSeen: "12m ago", explorerUrl: "https://etherscan.io/address/0x88bA44910283719da21894a4F11901e8a93cb491", tags: ["Pre-VASP Stage"], x: 680, y: 220 },
        { id: "s2-n6", label: "CoinDCX Deposit Node", type: "vasp", address: "0x2e74F11901e8a93cb4910283719da21894a4F11", balance: "1,240 ETH", txCount: 89200, firstSeen: "500 days ago", lastSeen: "Just now", explorerUrl: "https://etherscan.io/address/0x2e74F11901e8a93cb4910283719da21894a4F11", tags: ["VASP Deposit", "CoinDCX India", "FIU Registered"], x: 840, y: 220 }
      ],
      edges: [
        { from: "s2-n1", to: "s2-n2", amount: "22.5 ETH", txHash: "0x11a98cb102938471928374619283746192837ef1", time: "1h 12m ago", hop: 1 },
        { from: "s2-n2", to: "s2-n3", amount: "20.4 ETH", txHash: "0x22b98cb102938471928374619283746192837ef2", time: "58m ago", hop: 2 },
        { from: "s2-n3", to: "s2-n4", amount: "18.6 ETH", txHash: "0x33c98cb102938471928374619283746192837ef3", time: "44m ago", hop: 3 },
        { from: "s2-n4", to: "s2-n5", amount: "18.1 ETH", txHash: "0x44d98cb102938471928374619283746192837ef4", time: "25m ago", hop: 4 },
        { from: "s2-n5", to: "s2-n6", amount: "18.05 ETH", txHash: "0x55e98cb102938471928374619283746192837ef5", time: "12m ago", hop: 5 }
      ],
      confidenceBreakdown: {
        baseScore: 95,
        hopPenalty: -12,
        velocityBonus: +2,
        mixerPenalty: 0,
        clusterConfidence: 93
      }
    },

    scenario3: {
      id: "SCENARIO-3",
      name: "Case 3: Mixer Encounter (Ransomware Extortion)",
      badge: "MIXER DETECTED · DEGRADED",
      badgeColor: "crimson",
      crimeType: "Corporate Ransomware Exfiltration",
      reportedAddress: "0x3A2b9cD1481eE44eF929C8B56149D2F3879b2A40",
      victimInfo: "Apex Pharma Logistics, Hyderabad · Complaint #NCRP-2026-89415",
      stolenAmount: "60.0 ETH (₹50,00,000)",
      chain: "Ethereum Mainnet",
      hopCount: 2,
      attributionResult: "Tornado Cash Pool (0.1 / 1.0 / 10.0 ETH Vaults)",
      vaspName: "UNRESOLVED - PRIVACY PROTOCOL",
      vaspSahiogOnboarded: false,
      confidenceScore: 22,
      confidenceTier: "DEGRADED CONFIDENCE",
      confidenceExplanation: "Confidence Degraded (22%) — Tornado Cash zero-knowledge privacy pool encountered. Deterministic trace halted to avoid false positive attribution.",
      attributionTime: "2.8s",
      riskLevel: "CRITICAL PRIVACY BREACH - MANUAL ESCALATION",
      mlAnomalyScore: "0.99 (Known Sanctioned Privacy Mixer)",
      summary: "Funds were deposited directly into Tornado Cash privacy pools. The engine honestly halts automated attribution and outputs relayer tracking recommendations.",

      hopConfidenceStages: [
        { hop: 1, score: 92, tier: "HIGH CONFIDENCE", annotation: "Direct initial extortion payment from victim", isDrop: false },
        { hop: 2, score: 22, tier: "DEGRADED CONFIDENCE", annotation: "Confidence degraded: Tornado Cash zero-knowledge privacy pool encountered", isDrop: true }
      ],

      nodes: [
        { id: "s3-n1", label: "Ransom Payment", type: "victim", address: "0x3A2b9cD1481eE44eF929C8B56149D2F3879b2A40", balance: "0 ETH", txCount: 2, firstSeen: "4h ago", lastSeen: "3h ago", explorerUrl: "https://etherscan.io/address/0x3A2b9cD1481eE44eF929C8B56149D2F3879b2A40", tags: ["Victim Address"], x: 120, y: 220 },
        { id: "s3-n2", label: "Staging Wallet", type: "burner", address: "0x77dE3A99901e8a93cb4910283719da21894a3A99", balance: "0.2 ETH", txCount: 4, firstSeen: "3h ago", lastSeen: "2h 45m ago", explorerUrl: "https://etherscan.io/address/0x77dE3A99901e8a93cb4910283719da21894a3A99", tags: ["Attacker Staging"], x: 380, y: 220 },
        { id: "s3-n3", label: "Tornado Cash 10 ETH Vault", type: "mixer", address: "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b", balance: "42,100 ETH", txCount: 142000, firstSeen: "4 years ago", lastSeen: "Just now", explorerUrl: "https://etherscan.io/address/0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b", tags: ["OFAC Sanctioned", "Zero-Knowledge Pool", "Trace Degraded"], x: 680, y: 220 }
      ],
      edges: [
        { from: "s3-n1", to: "s3-n2", amount: "60.0 ETH", txHash: "0x99198cb102938471928374619283746192837aa1", time: "3h ago", hop: 1 },
        { from: "s3-n2", to: "s3-n3", amount: "59.8 ETH", txHash: "0x99298cb102938471928374619283746192837aa2", time: "2h 45m ago", hop: 2 }
      ],
      confidenceBreakdown: {
        baseScore: 90,
        hopPenalty: -4,
        velocityBonus: 0,
        mixerPenalty: -64,
        clusterConfidence: 0
      }
    },

    scenario4: {
      id: "SCENARIO-4",
      name: "Case 4: Cross-Chain Bridge (Digital Arrest Scam)",
      badge: "CROSS-CHAIN BRIDGE CORRELATED",
      badgeColor: "amber",
      crimeType: "Law Enforcement Impersonation / Digital Arrest",
      reportedAddress: "TN8mL2qPk7Y9jR4vX3Ww5Q1bE8tZ6uA7cB",
      victimInfo: "Col. Suresh Verma (Retd.), New Delhi · Complaint #NCRP-2026-89414",
      stolenAmount: "14,500 USDT (₹12,00,000)",
      chain: "Tron ➔ Stargate Bridge ➔ Arbitrum",
      hopCount: 4,
      attributionResult: "WazirX Master Settlement Gateway",
      vaspName: "WazirX",
      vaspSahiogOnboarded: true,
      confidenceScore: 68,
      confidenceTier: "MEDIUM CONFIDENCE",
      confidenceExplanation: "Medium Confidence (68%) — Confidence reduced: cross-chain bridge hop detected (Stargate Bridge Router) causing cryptographic ledger break.",
      attributionTime: "4.1s",
      riskLevel: "HIGH - CROSS-CHAIN EXTRADITION",
      mlAnomalyScore: "0.91 (Bridge Hop & Cross-Chain Consolidation)",
      summary: "Fraudster received Tron USDT, layered via intermediary burner, bridged to Arbitrum USDC via Stargate Finance router, and deposited to WazirX exchange account.",

      hopConfidenceStages: [
        { hop: 1, score: 94, tier: "HIGH CONFIDENCE", annotation: "Direct victim TRC-20 deposit to collection wallet", isDrop: false },
        { hop: 2, score: 91, tier: "HIGH CONFIDENCE", annotation: "Intermediary structuring split identified", isDrop: false },
        { hop: 3, score: 68, tier: "MEDIUM CONFIDENCE", annotation: "Confidence reduced: cross-chain bridge hop detected (Stargate Router)", isDrop: true },
        { hop: 4, score: 68, tier: "MEDIUM CONFIDENCE", annotation: "Arbitrum mint correlated to WazirX deposit pool", isDrop: false }
      ],

      nodes: [
        { id: "s4-n1", label: "Victim Tron Wallet", type: "victim", address: "TN8mL2qPk7Y9jR4vX3Ww5Q1bE8tZ6uA7cB", balance: "0 USDT", txCount: 3, firstSeen: "50m ago", lastSeen: "42m ago", explorerUrl: "https://tronscan.org/#/address/TN8mL2qPk7Y9jR4vX3Ww5Q1bE8tZ6uA7cB", tags: ["Tron TRC-20", "Reported Source"], x: 80, y: 220 },
        { id: "s4-n2", label: "Collection Wallet", type: "burner", address: "TL7vK9pX2yM3jR5wQ8tZ1bE4tY6uA8cD", balance: "120 USDT", txCount: 6, firstSeen: "42m ago", lastSeen: "36m ago", explorerUrl: "https://tronscan.org/#/address/TL7vK9pX2yM3jR5wQ8tZ1bE4tY6uA8cD", tags: ["Aggregator Wallet"], x: 260, y: 220 },
        { id: "s4-n3", label: "Layering Structuring", type: "burner", address: "TX3pQ8vM9kL1bZ7wR5jE2tY4uA6cE9dF", balance: "15 USDT", txCount: 4, firstSeen: "36m ago", lastSeen: "30m ago", explorerUrl: "https://tronscan.org/#/address/TX3pQ8vM9kL1bZ7wR5jE2tY4uA6cE9dF", tags: ["Structuring Split"], x: 440, y: 220 },
        { id: "s4-n4", label: "Stargate Router (Tron)", type: "bridge", address: "0xaf514c90901e8a93cb4910283719da21894a4c90", balance: "Bridge Pool", txCount: 420000, firstSeen: "2 years ago", lastSeen: "Just now", explorerUrl: "https://tronscan.org/#/address/0xaf514c90901e8a93cb4910283719da21894a4c90", tags: ["Lock/Burn Event", "Cross-Chain Bridge"], x: 620, y: 220 },
        { id: "s4-n5", label: "WazirX Ingestion Wallet", type: "vasp", address: "0x918E4A77901e8a93cb4910283719da21894a4A77", balance: "580,000 USDC", txCount: 41200, firstSeen: "300 days ago", lastSeen: "Just now", explorerUrl: "https://arbiscan.io/address/0x918E4A77901e8a93cb4910283719da21894a4A77", tags: ["WazirX Exchange", "FIU-IND Registered", "SAHYOG Active"], x: 820, y: 220 }
      ],
      edges: [
        { from: "s4-n1", to: "s4-n2", amount: "14,500 USDT", txHash: "0x77198cb102938471928374619283746192837bb1", time: "42m ago", hop: 1 },
        { from: "s4-n2", to: "s4-n3", amount: "14,490 USDT", txHash: "0x77298cb102938471928374619283746192837bb2", time: "36m ago", hop: 2 },
        { from: "s4-n3", to: "s4-n4", amount: "14,480 USDT", txHash: "0x77398cb102938471928374619283746192837bb3", time: "30m ago", hop: 3 },
        { from: "s4-n4", to: "s4-n5", amount: "14,435 USDC", txHash: "0x77498cb102938471928374619283746192837bb4", time: "22m ago", hop: 4 }
      ],
      confidenceBreakdown: {
        baseScore: 95,
        hopPenalty: -9,
        velocityBonus: +2,
        bridgePenalty: -20,
        mixerPenalty: 0,
        clusterConfidence: 91
      }
    }
  }
};
