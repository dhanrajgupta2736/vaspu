/**
 * VASPTrace - Presentation Scenarios, Benchmark Data & Seed Intelligence
 * SIH 2026 · Problem Statement 26183
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

  ncrpFeed: [
    {
      id: "NCRP-2026-89412",
      type: "Task Scam (Telegram)",
      amount: "₹4,80,000",
      victim: "Rahul Sharma (Pune)",
      chain: "Tron (TRC-20)",
      token: "USDT",
      reportedAddress: "TX9KqPz8vM7L3gN1bX8Vw2Q5jE4tR6uY7a",
      timestamp: "2 mins ago",
      status: "UNPROCESSED",
      urgency: "CRITICAL"
    },
    {
      id: "NCRP-2026-89413",
      type: "Fake SEBI Trading App",
      amount: "₹18,50,000",
      victim: "Dr. Ananya Iyer (Bengaluru)",
      chain: "Ethereum",
      token: "ETH / USDT",
      reportedAddress: "0x71C...4b9F",
      timestamp: "6 mins ago",
      status: "UNPROCESSED",
      urgency: "HIGH"
    },
    {
      id: "NCRP-2026-89414",
      type: "Digital Arrest Impersonation",
      amount: "₹12,00,000",
      victim: "Col. Suresh Verma (Retd.) (New Delhi)",
      chain: "Tron ➔ Arbitrum",
      token: "USDT / USDC",
      reportedAddress: "TN8m...L2qP",
      timestamp: "14 mins ago",
      status: "UNPROCESSED",
      urgency: "CRITICAL"
    },
    {
      id: "NCRP-2026-89415",
      type: "Ransomware Extortion",
      amount: "₹50,00,000",
      victim: "Apex Pharma Logistics (Hyderabad)",
      chain: "Ethereum",
      token: "ETH",
      reportedAddress: "0x3A2...9cD1",
      timestamp: "28 mins ago",
      status: "UNPROCESSED",
      urgency: "MEDIUM"
    }
  ],

  scenarios: {
    scenario1: {
      id: "SCENARIO-1",
      name: "Case 1: Rapid Hit (Telegram Task Scam)",
      badge: "RAPID ATTRIBUTION",
      badgeColor: "emerald",
      crimeType: "Part-Time Job / Telegram Rating Scam",
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
      attributionTime: "3.2s",
      riskLevel: "CRITICAL - ESCALATED FOR FREEZE",
      mlAnomalyScore: "0.89 (High Fan-In Structuring)",
      summary: "Victim paid INR to a mule bank account; fraudster instantly bought USDT on Tron and routed it through 1 temporary burner wallet into a high-activity Binance deposit cluster.",
      
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
          tags: ["Temporary Wallet", "Active 18m ago", "Rapid Forwarder"], 
          x: 340, 
          y: 220 
        },
        { 
          id: "node-3", 
          label: "Binance Deposit Cluster", 
          type: "vasp", 
          address: "TQ7mPz8vM7L3gN1bX8Vw2Q5jE4tR6uY999", 
          balance: "842,500 USDT", 
          txCount: 14820,
          firstSeen: "184 days ago",
          lastSeen: "Just now",
          explorerUrl: "https://tronscan.org/#/address/TQ7mPz8vM7L3gN1bX8Vw2Q5jE4tR6uY999",
          tags: ["VASP Deposit", "Binance Hot Wallet #41", "SAHYOG Active", "FIU-IND Reporting"], 
          x: 620, 
          y: 220 
        }
      ],
      edges: [
        { from: "node-1", to: "node-2", amount: "5,800 USDT", txHash: "0x8f2a41bc901e8a93cb4910283719da21894ab1", time: "18 mins ago", hop: 1 },
        { from: "node-2", to: "node-3", amount: "5,785 USDT", txHash: "0x3e1b7a829f018cd29910482910471829019bca", time: "14 mins ago", hop: 2 }
      ],
      confidenceBreakdown: {
        baseScore: 98,
        hopPenalty: -2,
        velocityBonus: +3,
        mixerPenalty: 0,
        clusterConfidence: 95
      }
    },

    scenario2: {
      id: "SCENARIO-2",
      name: "Case 2: Multi-Hop Peel-Chain (Fake SEBI Trading App)",
      badge: "PEEL-CHAIN LAYERING",
      badgeColor: "blue",
      crimeType: "Institutional Trading / Fake SEBI App Scam",
      reportedAddress: "0x71C4b9F39a04a89d2D5167664B29E30A2c7D951B",
      victimInfo: "Dr. Ananya Iyer, Bengaluru · Complaint #NCRP-2026-89413",
      stolenAmount: "22.5 ETH (₹18,50,000)",
      chain: "Ethereum Mainnet",
      hopCount: 5,
      attributionResult: "CoinDCX Custody Hot Wallet #08",
      vaspName: "CoinDCX",
      vaspSahiogOnboarded: true,
      confidenceScore: 78,
      confidenceTier: "MEDIUM CONFIDENCE",
      attributionTime: "4.7s",
      riskLevel: "HIGH - PEEL-CHAIN IDENTIFIED",
      mlAnomalyScore: "0.94 (Peel-Chain & DEX Swap Signature)",
      summary: "Funds were passed through a 5-step peel chain with partial swaps on Uniswap V3 to disguise origin before reaching CoinDCX deposit address.",

      nodes: [
        { id: "s2-n1", label: "Victim Collection", type: "victim", address: "0x71C4b9F39a04a89d2D5167664B29E30A2c7D951B", balance: "0 ETH", txCount: 6, firstSeen: "2h ago", lastSeen: "1h 12m ago", explorerUrl: "https://etherscan.io/address/0x71C4b9F39a04a89d2D5167664B29E30A2c7D951B", tags: ["Reported Wallet"], x: 80, y: 220 },
        { id: "s2-n2", label: "Peel Step 1", type: "layering", address: "0x892aF4892c901e8a93cb4910283719da21894a19", balance: "2.1 ETH", txCount: 14, firstSeen: "1h 30m ago", lastSeen: "58m ago", explorerUrl: "https://etherscan.io/address/0x892aF4892c901e8a93cb4910283719da21894a19", tags: ["Mule Intermediary"], x: 230, y: 150 },
        { id: "s2-n3", label: "Uniswap V3 Router", type: "dex", address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", balance: "Liquidity Pool", txCount: 894000, firstSeen: "3 years ago", lastSeen: "Just now", explorerUrl: "https://etherscan.io/address/0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", tags: ["DEX Swap", "USDT ➔ ETH"], x: 380, y: 150 },
        { id: "s2-n4", label: "Peel Step 2", type: "layering", address: "0x3eF418902c918a93cb4910283719da21894a98cD", balance: "1.4 ETH", txCount: 8, firstSeen: "50m ago", lastSeen: "25m ago", explorerUrl: "https://etherscan.io/address/0x3eF418902c918a93cb4910283719da21894a98cD", tags: ["Split Wallet"], x: 530, y: 220 },
        { id: "s2-n5", label: "Consolidation Hub", type: "burner", address: "0x91cA882E901e8a93cb4910283719da21894a882E", balance: "0.05 ETH", txCount: 3, firstSeen: "30m ago", lastSeen: "12m ago", explorerUrl: "https://etherscan.io/address/0x91cA882E901e8a93cb4910283719da21894a882E", tags: ["Final Aggregator"], x: 680, y: 220 },
        { id: "s2-n6", label: "CoinDCX Deposit Node", type: "vasp", address: "0x2e74F11901e8a93cb4910283719da21894a4F11", balance: "1,240 ETH", txCount: 89200, firstSeen: "500 days ago", lastSeen: "Just now", explorerUrl: "https://etherscan.io/address/0x2e74F11901e8a93cb4910283719da21894a4F11", tags: ["VASP Deposit", "CoinDCX India", "FIU Registered"], x: 840, y: 220 }
      ],
      edges: [
        { from: "s2-n1", to: "s2-n2", amount: "22.5 ETH", txHash: "0x11a98cb102938471928374619283746192837ef1", time: "1h 12m ago", hop: 1 },
        { from: "s2-n2", to: "s2-n3", amount: "20.4 ETH", txHash: "0x22b98cb102938471928374619283746192837ef2", time: "58m ago", hop: 2 },
        { from: "s2-n3", to: "s2-n4", amount: "52,000 USDT", txHash: "0x33c98cb102938471928374619283746192837ef3", time: "44m ago", hop: 3 },
        { from: "s2-n4", to: "s2-n5", amount: "50,500 USDT", txHash: "0x44d98cb102938471928374619283746192837ef4", time: "25m ago", hop: 4 },
        { from: "s2-n5", to: "s2-n6", amount: "50,450 USDT", txHash: "0x55e98cb102938471928374619283746192837ef5", time: "12m ago", hop: 5 }
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
      attributionTime: "2.8s",
      riskLevel: "CRITICAL PRIVACY BREACH - MANUAL ESCALATION",
      mlAnomalyScore: "0.99 (Known Sanctioned Privacy Mixer)",
      summary: "Funds were deposited directly into Tornado Cash privacy pools. The engine honestly stops automated deterministic attribution and provides off-chain subpoenas and relayer tracking guidance.",

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
      hopCount: 3,
      attributionResult: "WazirX Master Settlement Gateway",
      vaspName: "WazirX",
      vaspSahiogOnboarded: true,
      confidenceScore: 88,
      confidenceTier: "HIGH CONFIDENCE",
      attributionTime: "4.1s",
      riskLevel: "HIGH - CROSS-CHAIN EXTRADITION",
      mlAnomalyScore: "0.91 (Bridge Hop & Cross-Chain Consolidation)",
      summary: "Fraudster received Tron USDT, bridged to Arbitrum USDC via Stargate Finance router, and deposited to WazirX exchange account.",

      nodes: [
        { id: "s4-n1", label: "Victim Tron Wallet", type: "victim", address: "TN8mL2qPk7Y9jR4vX3Ww5Q1bE8tZ6uA7cB", balance: "0 USDT", txCount: 3, firstSeen: "50m ago", lastSeen: "42m ago", explorerUrl: "https://tronscan.org/#/address/TN8mL2qPk7Y9jR4vX3Ww5Q1bE8tZ6uA7cB", tags: ["Tron TRC-20"], x: 100, y: 220 },
        { id: "s4-n2", label: "Stargate Router (Tron)", type: "bridge", address: "0xaf514c90901e8a93cb4910283719da21894a4c90", balance: "Bridge Pool", txCount: 420000, firstSeen: "2 years ago", lastSeen: "Just now", explorerUrl: "https://tronscan.org/#/address/0xaf514c90901e8a93cb4910283719da21894a4c90", tags: ["Lock/Burn Event", "Stargate Bridge"], x: 340, y: 220 },
        { id: "s4-n3", label: "Arbitrum Relayer Recipient", type: "burner", address: "0x44fB189a901e8a93cb4910283719da21894a189a", balance: "45 USDC", txCount: 6, firstSeen: "38m ago", lastSeen: "29m ago", explorerUrl: "https://arbiscan.io/address/0x44fB189a901e8a93cb4910283719da21894a189a", tags: ["Arbitrum Mint"], x: 580, y: 220 },
        { id: "s4-n4", label: "WazirX Ingestion Wallet", type: "vasp", address: "0x918E4A77901e8a93cb4910283719da21894a4A77", balance: "580,000 USDC", txCount: 41200, firstSeen: "300 days ago", lastSeen: "Just now", explorerUrl: "https://arbiscan.io/address/0x918E4A77901e8a93cb4910283719da21894a4A77", tags: ["WazirX Exchange", "FIU-IND Registered", "SAHYOG Active"], x: 820, y: 220 }
      ],
      edges: [
        { from: "s4-n1", to: "s4-n2", amount: "14,500 USDT", txHash: "0x77198cb102938471928374619283746192837bb1", time: "42m ago", hop: 1 },
        { from: "s4-n2", to: "s4-n3", amount: "14,480 USDC", txHash: "0x77298cb102938471928374619283746192837bb2", time: "38m ago", hop: 2 },
        { from: "s4-n3", to: "s4-n4", amount: "14,435 USDC", txHash: "0x77398cb102938471928374619283746192837bb3", time: "29m ago", hop: 3 }
      ],
      confidenceBreakdown: {
        baseScore: 96,
        hopPenalty: -6,
        velocityBonus: +2,
        mixerPenalty: 0,
        clusterConfidence: 96
      }
    }
  }
};
