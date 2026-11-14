import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Coins, 
  Lock, 
  HelpCircle, 
  ChevronRight, 
  Search, 
  Printer, 
  ExternalLink,
  ArrowRight,
  Landmark,
  BadgeAlert,
  Clock,
  Sparkles,
  PhoneCall,
  Mail,
  UserCheck
} from 'lucide-react';

interface TermsAndConditionsProps {
  onGoToPrivacyPolicy?: () => void;
  onClose?: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onGoToPrivacyPolicy,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<string>('sec-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const effectiveDate = new Date().toLocaleDateString('en-ZA', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const sections = [
    { id: 'sec-1', title: '1. Platform Acceptance & Scope', icon: FileText },
    { id: 'sec-2', title: '2. Legal Entity & Regulatory Standing', icon: Building2 },
    { id: 'sec-3', title: '3. User Eligibility & FICA Verification', icon: UserCheck },
    { id: 'sec-4', title: '4. Central Liquidity Fund & Investor Terms', icon: Coins },
    { id: 'sec-5', title: '5. Borrower Facility & Collateral Escrow', icon: Lock },
    { id: 'sec-6', title: '6. Escrow Liens, Default & Asset Liquidation', icon: Scale },
    { id: 'sec-7', title: '7. Marketplace Economics & Fee Structure', icon: Landmark },
    { id: 'sec-8', title: '8. PayFast Payments & Bank Settlements', icon: ShieldCheck },
    { id: 'sec-9', title: '9. Borrower Anonymity & Data Protection', icon: Lock },
    { id: 'sec-10', title: '10. Risk Disclosures & Disclaimers', icon: AlertTriangle },
    { id: 'sec-11', title: '11. Intellectual Property & Prohibitions', icon: ShieldCheck },
    { id: 'sec-12', title: '12. Limitation of Liability & Indemnity', icon: BadgeAlert },
    { id: 'sec-13', title: '13. Dispute Resolution & Governing Law', icon: Scale },
    { id: 'sec-14', title: '14. Amendments, Notices & Contact', icon: Mail },
  ];

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4 text-blue-500" />
              <span>Institutional Legal Documentation • Republic of South Africa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
              Terms & Conditions of Service
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Effective Date: <span className="text-gray-200 font-semibold">{effectiveDate}</span> • Version 3.4
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#161922] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-gray-400" />
              <span>Print / PDF</span>
            </button>

            {onGoToPrivacyPolicy && (
              <button
                onClick={onGoToPrivacyPolicy}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 transition-colors cursor-pointer"
              >
                <span>View Privacy Policy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Regulatory Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">NCR Registered Principles</div>
              <div className="text-[10px] text-gray-400">National Credit Act 34 of 2005</div>
            </div>
          </div>

          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <Lock className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">POPIA Protected</div>
              <div className="text-[10px] text-gray-400">Data Act No. 4 of 2013</div>
            </div>
          </div>

          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">FICA & AML Compliant</div>
              <div className="text-[10px] text-gray-400">Financial Intelligence Act 38</div>
            </div>
          </div>

          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <Scale className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">100% Escrow Collateral</div>
              <div className="text-[10px] text-gray-400">Sandton & Cape Town Vaults</div>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Navigation Sidebar */}
          <aside className="lg:col-span-4 sticky top-20 bg-[#0E1118] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
                Table of Clauses
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Navigate the terms of use
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search legal clauses..."
                className="w-full bg-[#07090E] border border-gray-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {sections
                .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-bold'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                        <span className="truncate">{section.title}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-600'}`} />
                    </button>
                  );
                })}
            </nav>

            <div className="p-3 bg-blue-950/20 border border-blue-800/30 rounded-xl space-y-1.5 text-[11px]">
              <div className="font-bold text-blue-300 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need Legal Clarification?</span>
              </div>
              <p className="text-gray-400 text-[10px] leading-relaxed">
                Contact our compliance desk at <a href="mailto:legal@wefinance.co.za" className="text-blue-400 underline">legal@wefinance.co.za</a> or call Sandton Registry.
              </p>
            </div>
          </aside>

          {/* Legal Body Articles */}
          <div className="lg:col-span-8 space-y-6 text-sm text-gray-300 leading-relaxed font-sans">
            
            {/* Section 1 */}
            <section id="sec-1" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <FileText className="w-4 h-4" />
                <span>1. Platform Acceptance, Agreement & Scope</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                1. Acceptance of Terms of Service
              </h2>
              <p>
                These Terms and Conditions of Service ("Terms", "Agreement") constitute a legally binding contract between you (the "User", whether acting as an "Investor", "Borrower", or authorized legal representative) and <strong>WeFinance Group (Pty) Ltd</strong> ("WeFinance", "Company", "we", "us", "our").
              </p>
              <p>
                By accessing, browsing, registering an account on, depositing capital into, or submitting collateral to the WeFinance platform (the "Platform", encompassing the website, web application, mobile applications, APIs, and affiliated escrow depository services), you unconditionally agree to be bound by these Terms, our <strong className="text-blue-400 cursor-pointer" onClick={onGoToPrivacyPolicy}>Privacy Policy</strong>, and all applicable statutory regulations of the Republic of South Africa.
              </p>
              <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200/90 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>IMPORTANT NOTICE:</strong> If you do not accept or understand any provision of these Terms, you must immediately discontinue all use of the Platform and refrain from transferring any funds or physical assets.
                </span>
              </div>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Building2 className="w-4 h-4" />
                <span>2. Corporate Structure & Regulatory Standing</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                2. Legal Entity & South African Regulatory Framework
              </h2>
              <p>
                WeFinance Group (Pty) Ltd is a private company duly incorporated in accordance with the Companies Act 71 of 2008 of South Africa (Registration Number: 2024/123456/07), having its registered office and primary escrow depository facilities situated in Sandton, Gauteng.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <strong className="text-white block font-semibold">2.1 Peer-to-Peer Marketplace Nature</strong>
                  <p className="text-gray-400">
                    WeFinance operates as an accredited peer-to-peer (P2P) secured liquidity facilitator connecting institutional and retail capital providers with qualified asset-backed borrowers. WeFinance is <em>not</em> a registered bank under the Banks Act 94 of 1990 and does not accept public deposits for banking purposes. All capital deployed on the Platform constitutes secured participation in asset-backed loan facilities.
                  </p>
                </div>

                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <strong className="text-white block font-semibold">2.2 National Credit Act (NCA) Alignment</strong>
                  <p className="text-gray-400">
                    Where applicable to individual borrowers, credit agreements executed through the Platform adhere to the cost-of-credit ceilings, disclosure standards, and consumer protections mandated under the National Credit Act 34 of 2005 ("NCA").
                  </p>
                </div>

                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <strong className="text-white block font-semibold">2.3 Financial Intelligence Centre Act (FICA)</strong>
                  <p className="text-gray-400">
                    As an accountable institution framework participant, WeFinance strictly adheres to the Financial Intelligence Centre Act 38 of 2001 ("FICA") for Know-Your-Customer (KYC), Anti-Money Laundering (AML), and Counter-Terrorism Financing (CTF) compliance.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-3" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <UserCheck className="w-4 h-4" />
                <span>3. User Eligibility & Account Onboarding</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                3. Eligibility, Verification & FICA Registration
              </h2>
              <p>
                To maintain an active account, create investment portfolios, or apply for collateral-backed credit, you must meet and continually maintain the following eligibility criteria:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-xs text-gray-300">
                <li>Be at least 18 (eighteen) years of age with full legal capacity to enter into binding agreements;</li>
                <li>Possess a valid 13-digit South African National Identity Document (or valid foreign passport with lawful residency permits);</li>
                <li>Maintain an active South African transactional bank account in your legal name (Standard Bank, FNB, ABSA, Nedbank, Capitec, Investec, TymeBank, or Discovery Bank);</li>
                <li>Successfully complete full FICA KYC onboarding by submitting certified proof of identity, proof of residential address not older than 3 months, and biometric facial selfie verification;</li>
                <li>Not be subject to international economic sanctions, OFAC lists, or domestic financial intelligence blacklists.</li>
              </ul>
              <p className="text-xs text-gray-400">
                You are solely responsible for maintaining the confidentiality of your credentials (email, password, two-factor authentication tokens). Any action executed under your account is deemed legally executed by you.
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Coins className="w-4 h-4" />
                <span>4. Central Liquidity Fund & Investor Terms</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                4. Single Central Account & Investment Mechanics
              </h2>
              <p>
                WeFinance operates a consolidated, single central liquidity fund model ("Central Investment Fund") engineered to maximize diversification and streamline capital deployment across verified collateralized loan pools.
              </p>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-400 block">4.1 30-Day Fixed Liquidity Cycle</span>
                  <p className="text-gray-400">
                    Investments are allocated into 30-day fixed funding cycles. Capital committed to the Central Fund is locked for the duration of the 30-day term to finance accredited collateral facilities.
                  </p>
                </div>

                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <span className="font-bold text-blue-400 block">4.2 Dynamic Net Yield Calculation & Payouts</span>
                  <p className="text-gray-400">
                    Investors earn an annualized target net yield (e.g. 18.5% p.a., prorated to the 30-day term). Yield accrues daily and is settled at maturity directly into your available balance, from which you may immediately reinvest or trigger a real-time bank EFT withdrawal.
                  </p>
                </div>

                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <span className="font-bold text-amber-400 block">4.3 100% Physical Escrow Backing Guarantee</span>
                  <p className="text-gray-400">
                    Every Rand allocated by investors is backed by a minimum of 150% to 260% in audited physical collateral assets held in accredited high-security vaults. In the unlikely event of borrower default, physical collateral is liquidated to recover principal and accrued yield.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-5" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Lock className="w-4 h-4" />
                <span>5. Borrower Facility & Physical Collateral Escrow</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                5. Borrower Credit Terms & Collateral Pledging
              </h2>
              <p>
                Borrowers may secure short-term liquidity by pledging eligible tangible personal property as physical collateral under a formal escrow pledge agreement.
              </p>
              <div className="space-y-2 text-xs">
                <p>
                  <strong>5.1 Eligible Collateral Categories:</strong> High-value electronics (Apple MacBook Pro, iPhone, Studio displays), accredited luxury timepieces (Rolex, Omega, Breitling), precious metals/bullion, certified motor vehicles, and specialized industrial equipment.
                </p>
                <p>
                  <strong>5.2 Loan-to-Value (LTV) Ratios:</strong> Maximum LTV ratios are strictly capped between 40% and 60% of independently appraised fair market value to ensure a substantial safety buffer for investors.
                </p>
                <p>
                  <strong>5.3 Custody & Depository Logistics:</strong> Pledged items must undergo physical intake inspection, serial number verification, and biometric check-in at an accredited WeFinance depository (Sandton Central Escrow Depository or Cape Town Harbor Vault Depot).
                </p>
                <p>
                  <strong>5.4 Vault Insurance & Care:</strong> While in escrow custody, all collateral is stored in climate-controlled, armed-response vaults and insured against theft, fire, and natural disaster by accredited South African underwriters.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="sec-6" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Scale className="w-4 h-4" />
                <span>6. Escrow Liens, Default & Asset Liquidation</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                6. Escrow Lien Enforcement, Grace Period & Liquidation
              </h2>
              <p>
                By submitting collateral, the Borrower grants WeFinance a first-ranking, perfected escrow lien over the pledged assets.
              </p>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <strong className="text-white block font-semibold">6.1 Repayment & Release</strong>
                  <p className="text-gray-400">
                    Upon full settlement of the principal, agreed interest, and origination fees by the 30-day maturity date, the escrow lien is formally discharged, and the physical asset is returned via secure courier or in-person vault collection.
                  </p>
                </div>

                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <strong className="text-amber-400 block font-semibold">6.2 Grace Period & Default Notice</strong>
                  <p className="text-gray-400">
                    Borrowers receive a mandatory 5 (five) business day grace period following due date, accompanied by SMS, email, and in-app demand notices. A late administration fee of 2.5% per week applies during grace.
                  </p>
                </div>

                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl space-y-1">
                  <strong className="text-red-400 block font-semibold">6.3 Orderly Liquidation & Surplus Accounting</strong>
                  <p className="text-gray-400">
                    If payment is not cured within the grace period, WeFinance exercises its escrow power of sale to liquidate the asset via approved secondary market auctions. Liquidation proceeds are applied strictly in order: (1) Liquidation costs, (2) Investor principal, (3) Investor yield, (4) Platform fees. <strong>Any surplus balance is refunded to the borrower</strong> in strict accordance with South African property law.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="sec-7" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Landmark className="w-4 h-4" />
                <span>7. Marketplace Economics & Fee Structure</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                7. Transparent Fee Schedule & Economics
              </h2>
              <p>
                WeFinance enforces an institutional zero-hidden-fee policy. Our revenue is derived from transparent borrower origination and spread economics:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-gray-800 rounded-xl overflow-hidden">
                  <thead className="bg-[#161922] text-gray-200">
                    <tr>
                      <th className="p-3 border-b border-gray-800">Fee Component</th>
                      <th className="p-3 border-b border-gray-800">Target Party</th>
                      <th className="p-3 border-b border-gray-800">Rate / Amount</th>
                      <th className="p-3 border-b border-gray-800">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-300">
                    <tr>
                      <td className="p-3 font-semibold text-white">Investor Management Fee</td>
                      <td className="p-3 text-emerald-400">Investor</td>
                      <td className="p-3 font-bold text-emerald-400">0.00% (Zero)</td>
                      <td className="p-3 text-gray-400">Investors receive 100% of stated net yield</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Deposit / Withdrawal Fee</td>
                      <td className="p-3 text-emerald-400">All Users</td>
                      <td className="p-3 font-bold text-emerald-400">R0.00 (Free)</td>
                      <td className="p-3 text-gray-400">No platform charge for EFT or PayFast wallet funding</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Borrower Origination Fee</td>
                      <td className="p-3 text-blue-400">Borrower</td>
                      <td className="p-3 font-mono">1.5% – 3.0%</td>
                      <td className="p-3 text-gray-400">Covers valuation, intake, and legal escrow filing</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Vault Custody & Insurance</td>
                      <td className="p-3 text-blue-400">Borrower</td>
                      <td className="p-3 font-mono">Included in rate</td>
                      <td className="p-3 text-gray-400">Full armed security & Lloyds/Sanlam underwritten cover</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 8 */}
            <section id="sec-8" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>8. Payment Gateway & Banking Settlement</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                8. PayFast Integration & Real-Time EFT Banking
              </h2>
              <p>
                All Rand financial flows on the Platform are processed through accredited South African clearing rails:
              </p>
              <div className="space-y-2 text-xs">
                <p>
                  <strong>8.1 PayFast Gateway:</strong> Card deposits, Instant EFT, and Capitec Pay transactions are handled via PayFast (Pty) Ltd (PCI-DSS Level 1 certified). WeFinance never captures or stores credit card numbers or banking internet PINs on our servers.
                </p>
                <p>
                  <strong>8.2 Bank EFT Withdrawals:</strong> Capital withdrawals are processed via real-time bank EFT directly to verified South African bank accounts matching the verified FICA account holder name. Third-party bank withdrawals are strictly prohibited to combat fraud.
                </p>
                <p>
                  <strong>8.3 Settlement Windows:</strong> Bank withdrawals initiated before 15:00 SAST on business days are settled on the same day or within 24 hours depending on recipient bank clearing speeds.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="sec-9" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Lock className="w-4 h-4" />
                <span>9. Strict Borrower Identity Confidentiality</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                9. Borrower Privacy Mandate (Core Platform Covenant)
              </h2>
              <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Absolute Borrower Identity Shield</span>
                </div>
                <p className="text-gray-300">
                  WeFinance operates under a strict institutional privacy covenant: <strong>Borrower personal identifying details (name, SA ID, telephone number, residential address, employer) are strictly confidential and NEVER disclosed to investors or the public marketplace.</strong>
                </p>
                <p className="text-gray-400">
                  Investors are presented only with verified collateral asset specifications (make, model, independent valuation report, collateral coverage ratio, vault depository location, and masked serial identifier). This protects borrower dignity and privacy while delivering 100% asset transparency to investors.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="sec-10" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>10. Risk Disclosures & Disclaimers</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                10. Investment Risk Disclosures & Statutory Warnings
              </h2>
              <div className="p-4 bg-[#07090E] border border-gray-800 rounded-xl space-y-2 text-xs text-gray-300">
                <p>
                  <strong>10.1 Capital at Risk:</strong> While all loans are 100% secured by physical vault escrow collateral at conservative LTV ratios, peer-to-peer asset-backed investments carry inherent risks including secondary market asset price fluctuation, auction delay, and unexpected counterparty friction. Past performance does not guarantee future yield.
                </p>
                <p>
                  <strong>10.2 Not a Bank Deposit:</strong> Funds deployed on the Platform are not covered by SARB Bank Deposit Insurance or FAIS statutory indemnity funds. Users are advised to seek independent financial advice before allocating substantial capital.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="sec-11" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>11. Intellectual Property & Prohibited Activities</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                11. Platform Intellectual Property & Prohibitions
              </h2>
              <p className="text-xs text-gray-300">
                All software, user interface designs, dynamic interest algorithms, collateral rating models, logos, trademarks, and documentation are the exclusive intellectual property of WeFinance Group (Pty) Ltd. Users are strictly prohibited from:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-xs text-gray-400">
                <li>Reverse engineering, scraping, or utilizing automated data extraction tools without express written authorization;</li>
                <li>Pledging stolen, encumbered, or counterfeit goods as collateral;</li>
                <li>Engaging in wash trading, money laundering, or structuring transactions to evade FICA reporting thresholds;</li>
                <li>Circumventing platform security controls, rate limiters, or KYC checks.</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section id="sec-12" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <BadgeAlert className="w-4 h-4" />
                <span>12. Limitation of Liability & Indemnity</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                12. Limitation of Liability & Force Majeure
              </h2>
              <p className="text-xs text-gray-300">
                To the maximum extent permitted by South African law (including the Consumer Protection Act 68 of 2008), WeFinance, its directors, employees, and vault contractors shall not be liable for any indirect, consequential, or punitive damages arising from platform downtime, third-party payment gateway failures, or force majeure events (civil unrest, grid collapse, national internet interruptions).
              </p>
            </section>

            {/* Section 13 */}
            <section id="sec-13" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Scale className="w-4 h-4" />
                <span>13. Dispute Resolution & Governing Law</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                13. South African Governing Law & AFSA Arbitration
              </h2>
              <p className="text-xs text-gray-300">
                This Agreement shall be governed by and construed in accordance with the substantive laws of the Republic of South Africa. Any dispute arising out of or in connection with these Terms shall first be referred to executive mediation, failing which it shall be settled by expedited arbitration administered by the <strong>Arbitration Foundation of Southern Africa (AFSA)</strong> in Johannesburg in English.
              </p>
            </section>

            {/* Section 14 */}
            <section id="sec-14" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Mail className="w-4 h-4" />
                <span>14. Amendments, Official Notices & Contacts</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                14. Legal Notices & Corporate Inquiries
              </h2>
              <div className="p-4 bg-[#07090E] border border-blue-900/40 rounded-xl space-y-2 text-xs text-gray-300">
                <p><strong className="text-white">WeFinance Group (Pty) Ltd</strong> (Reg: 2024/123456/07)</p>
                <p>Sandton Central Escrow Depository, Sandton, Johannesburg, 2196, South Africa</p>
                <div className="pt-2 flex flex-wrap gap-4 text-gray-400">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Legal: <a href="mailto:legal@wefinance.co.za" className="text-blue-400 underline">legal@wefinance.co.za</a></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Compliance: <a href="mailto:compliance@wefinance.co.za" className="text-emerald-400 underline">compliance@wefinance.co.za</a></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tel: +27 (0) 11 884 9000</span>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
};
