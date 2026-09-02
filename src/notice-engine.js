/**
 * VASPTrace - Section 94 BNSS & SAHYOG Legal Notice Dispatch Engine
 * Generates court-admissible electronic evidence dossiers compliant with Section 63 BSA
 */

export class SAHYOGNoticeEngine {
  static async generateHash(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async createNotice(scenario) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const noticeId = `I4C/SAHYOG/${now.getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;

    const noticeRawText = `
GOVERNMENT OF INDIA · MINISTRY OF HOME AFFAIRS
INDIAN CYBER CRIME COORDINATION CENTRE (I4C)
DIRECTIVE UNDER SECTION 94 BNSS, 2023 & SECTION 79(3)(b) IT ACT, 2000

NOTICE REF: ${noticeId}
DATE: ${dateStr} ${timeStr}
TO: NODAL COMPLIANCE OFFICER, ${scenario.vaspName.toUpperCase()}
SUBJECT: URGENT DIGITAL EVIDENCE DISCLOSURE & PROCEEDS OF CRIME FREEZE DIRECTIVE

CASE PARTICULARS:
- Victim & Incident: ${scenario.victimInfo}
- Initial Inbound Source: NCRP Portal (1930 Cyber Fraud Stream)
- Stolen Proceeds: ${scenario.stolenAmount}
- First Reported Wallet: ${scenario.reportedAddress}
- Destination Deposit Cluster: ${scenario.attributionResult}
- Automated Attribution Time: ${scenario.attributionTime}
- Forensic Confidence: ${scenario.confidenceScore}% (${scenario.confidenceTier})
- Multi-Hop Path Length: ${scenario.hopCount} Hops
- ML Anomaly Classification: ${scenario.mlAnomalyScore}

LEGAL DIRECTIVES:
1. Under Section 94 of Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023), you are hereby directed to produce all KYC records, IP access logs, bank payout accounts, and full transaction history associated with deposit identifier ${scenario.attributionResult}.
2. Under Section 79(3)(b) of the Information Technology Act, 2000, you are ordered to immediately disable access to and place an emergency lien/freeze on the identified proceeds of crime.
3. This record is certified under Section 63 of Bharatiya Sakshya Adhiniyam (BSA, 2023) as an authentic, tamper-evident electronic record.
    `.trim();

    const sha256Hash = await this.generateHash(noticeRawText);

    return {
      noticeId,
      dateStr,
      timeStr,
      sha256Hash,
      rawText: noticeRawText,
      scenario
    };
  }
}
