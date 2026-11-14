import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  AlertCircle, 
  Calendar, 
  UserCheck, 
  Database, 
  Eye, 
  Truck, 
  Mail, 
  Globe, 
  Settings, 
  ArrowRight,
  ChevronRight,
  Search,
  Printer,
  Scale,
  Building2,
  PhoneCall,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

interface PrivacyPolicyProps {
  onGoToTerms?: () => void;
  onClose?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  onGoToTerms,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<string>('popia-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const effectiveDate = new Date().toLocaleDateString('en-ZA', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const sections = [
    { id: 'popia-1', title: '1. Introduction & Responsible Party', icon: FileText },
    { id: 'popia-2', title: '2. Lawful Conditions Under POPIA', icon: ShieldCheck },
    { id: 'popia-3', title: '3. Personal Information We Collect', icon: UserCheck },
    { id: 'popia-4', title: '4. Borrower Confidentiality Shield', icon: Lock },
    { id: 'popia-5', title: '5. Purposes & Processing Ground', icon: Settings },
    { id: 'popia-6', title: '6. Third-Party Sharing & Operators', icon: Globe },
    { id: 'popia-7', title: '7. Statutory Data Retention (FICA/SARS)', icon: Calendar },
    { id: 'popia-8', title: '8. Data Subject Rights & Request Form', icon: CheckCircle2 },
    { id: 'popia-9', title: '9. Information Security & Encryption', icon: HardDrive },
    { id: 'popia-10', title: '10. Cross-Border Data Transfers', icon: Globe },
    { id: 'popia-11', title: '11. Cookies, Telemetry & Mobile Tokens', icon: Eye },
    { id: 'popia-12', title: '12. Protection of Minors (Under 18s)', icon: AlertCircle },
    { id: 'popia-13', title: '13. Policy Updates & Revision History', icon: Calendar },
    { id: 'popia-14', title: '14. Contact Officer & SA Regulator', icon: Mail },
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
    <div className="min-h-screen bg-[#07090E] text-gray-100 py-8 lg:py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Data Protection & Privacy Policy • POPIA Act No. 4 of 2013</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
              Privacy Policy & POPIA Manual
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Last updated: <span className="text-gray-200 font-semibold">{effectiveDate}</span> • South African Legal Framework
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

            {onGoToTerms && (
              <button
                onClick={onGoToTerms}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 transition-colors cursor-pointer"
              >
                <span>View Terms & Conditions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Regulatory Protection Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">POPIA Compliant</div>
              <div className="text-[10px] text-gray-400">8 Lawful Processing Conditions</div>
            </div>
          </div>

          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <Lock className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">Borrower Shield</div>
              <div className="text-[10px] text-gray-400">Zero Investor Identity Access</div>
            </div>
          </div>

          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <HardDrive className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">AES-256 Encryption</div>
              <div className="text-[10px] text-gray-400">Encrypted at Rest & In-Transit</div>
            </div>
          </div>

          <div className="p-3 bg-[#0E1118] border border-gray-800 rounded-xl flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white">Information Regulator</div>
              <div className="text-[10px] text-gray-400">Compliant Dispute Pathways</div>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Navigation Sidebar */}
          <aside className="lg:col-span-4 sticky top-20 bg-[#0E1118] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
                Privacy Navigation
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Jump to POPIA sections
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search privacy topics..."
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
                          ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 font-bold'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                        <span className="truncate">{section.title}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 shrink-0 ${isActive ? 'text-emerald-400' : 'text-gray-600'}`} />
                    </button>
                  );
                })}
            </nav>

            <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl space-y-1.5 text-[11px]">
              <div className="font-bold text-emerald-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>POPIA Data Subject Desk</span>
              </div>
              <p className="text-gray-400 text-[10px] leading-relaxed">
                Contact our Information Officer at <a href="mailto:privacy@wefinance.co.za" className="text-emerald-400 underline">privacy@wefinance.co.za</a>.
              </p>
            </div>
          </aside>

          {/* Privacy Articles */}
          <div className="lg:col-span-8 space-y-6 text-sm text-gray-300 leading-relaxed">
            
            {/* Section 1 */}
            <section id="popia-1" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <FileText className="w-4 h-4" />
                <span>1. Introduction & Responsible Party</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                1. Scope & Responsible Party Designation
              </h2>
              <p>
                <strong>WeFinance Group (Pty) Ltd</strong> (Registration Number: 2024/123456/07), having its registered office in Sandton, Gauteng, operates a secured peer-to-peer lending and investment marketplace in South Africa.
              </p>
              <p>
                In terms of the <strong>Protection of Personal Information Act No. 4 of 2013 ("POPIA")</strong> and the <strong>Promotion of Access to Information Act No. 2 of 2000 ("PAIA")</strong>, WeFinance acts as the designated <strong>"Responsible Party"</strong> in respect of all Personal Information collected through our platform, website, web application, APIs, and affiliated escrow depository facilities.
              </p>
              <p>
                This Privacy Policy establishes our standard operating procedures regarding the lawful collection, processing, storage, sharing, and safeguarding of your Personal Information.
              </p>
            </section>

            {/* Section 2 */}
            <section id="popia-2" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>2. Lawful Processing Principles Under POPIA</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                2. Adherence to the 8 POPIA Processing Conditions
              </h2>
              <p>
                We process personal information strictly in accordance with Chapter 3 of POPIA:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">1. Accountability</strong>
                  <span className="text-gray-400">We take full institutional responsibility for safeguarding all processed data.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">2. Processing Limitation</strong>
                  <span className="text-gray-400">Processing is lawful, minimal, and directly relevant to secured lending operations.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">3. Purpose Specification</strong>
                  <span className="text-gray-400">Data is collected only for explicit FICA verification, escrow lien, and fund settlement.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">4. Further Processing Limitation</strong>
                  <span className="text-gray-400">No secondary processing without explicit user consent or legal statutory mandate.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">5. Information Quality</strong>
                  <span className="text-gray-400">We verify accuracy and completeness of borrower and investor profiles.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">6. Openness & Transparency</strong>
                  <span className="text-gray-400">Clear notification of processing activities and Information Officer access.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">7. Security Safeguards</strong>
                  <span className="text-gray-400">AES-256 encryption, TLS 1.3 transit, role-based vault access, and 24/7 logging.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold mb-0.5">8. Data Subject Participation</strong>
                  <span className="text-gray-400">Full statutory rights to access, correct, or request erasure within 30 days.</span>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="popia-3" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <UserCheck className="w-4 h-4" />
                <span>3. Personal Information We Collect</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                3. Categories of Data Processed
              </h2>
              
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#07090E] border border-gray-800 rounded-xl space-y-1.5">
                  <h4 className="text-white font-bold text-sm">3.1 Identity & FICA Verification Information</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>Full legal names, South African 13-digit ID number, date of birth, nationality;</li>
                    <li>Residential address, province, postal code, and utility bills for proof of address;</li>
                    <li>Biometric facial selfies for liveness and anti-impersonation fraud detection;</li>
                    <li>South African bank account details (bank name, account number, branch code, account type).</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#07090E] border border-gray-800 rounded-xl space-y-1.5">
                  <h4 className="text-white font-bold text-sm">3.2 Financial, Wallet & Transaction Records</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>PayFast deposit timestamps, merchant IDs, card billing tokens, Instant EFT IDs;</li>
                    <li>Real-time bank withdrawal transaction IDs, amounts, recipient bank confirmations;</li>
                    <li>Fund allocations, dynamic yield accrual ledgers, 30-day maturity schedules;</li>
                    <li>Pledged collateral photographs, serial numbers, insurance certificates, and valuations.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#07090E] border border-gray-800 rounded-xl space-y-1.5">
                  <h4 className="text-white font-bold text-sm">3.3 Technical, Device & Telemetry Data</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300">
                    <li>IP addresses, browser finger-printing, device operating system versions;</li>
                    <li>Push notification tokens (Expo Push Notification service) for settlement alerts;</li>
                    <li>Geolocation data (province/city level for South African jurisdictional compliance).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="popia-4" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Lock className="w-4 h-4" />
                <span>4. Borrower Confidentiality Shield</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                4. Absolute Borrower Privacy Protection (Core Platform Covenant)
              </h2>
              <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Borrower Personal Information Is Never Exposed</span>
                </div>
                <p className="text-gray-300">
                  A foundational architectural tenet of WeFinance is that <strong>no investor or third-party user can view borrower personal information</strong> (such as names, ID numbers, phone numbers, email addresses, or physical residences).
                </p>
                <p className="text-gray-400">
                  Investors only have visibility over audited collateral metrics: asset category, item description, independent valuation, coverage ratio, vault depository location (e.g. Sandton Depository), and masked serial indicators.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="popia-5" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Settings className="w-4 h-4" />
                <span>5. Purposes & Lawful Grounds for Processing</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                5. Lawful Grounds for Data Processing
              </h2>
              <p className="text-xs text-gray-300">
                We process your personal data under the following lawful conditions permitted by POPIA Section 11:
              </p>
              <ul className="space-y-2 text-xs list-disc pl-5 text-gray-300">
                <li><strong>Contractual Performance:</strong> To administer your Central Fund investments, process collateral pledges, and disburse bank withdrawals;</li>
                <li><strong>Statutory Compliance:</strong> To satisfy mandatory South African laws, including FICA KYC obligations, SARS tax filing, and National Credit Act requirements;</li>
                <li><strong>Legitimate Interests:</strong> To detect financial crime, safeguard our high-security vault facilities, prevent impersonation, and enhance platform security;</li>
                <li><strong>Explicit Consent:</strong> Where you opt in to optional service updates or marketing communications (which can be revoked at any time).</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="popia-6" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Globe className="w-4 h-4" />
                <span>6. Third-Party Sharing & Authorized Operators</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                6. Permitted Disclosures & Authorized Operators
              </h2>
              <p className="text-xs text-gray-300">
                WeFinance <strong>never sells, rents, or monetizes personal data</strong>. We share information only with authorized "Operators" under strict Data Processing Agreements:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold">Payment Gateways & Clearing Banks</strong>
                  <span className="text-gray-400">PayFast (Pty) Ltd and South African commercial banks (Standard Bank, FNB, ABSA, Nedbank) for processing EFT settlements and card deposits.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold">Cloud Infrastructure & Telemetry</strong>
                  <span className="text-gray-400">Google Cloud (africa-south1 Johannesburg region) for secure cloud hosting, Firestore database storage, and Firebase Authentication under enterprise security agreements.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold">Accredited Vault & Depository Custodians</strong>
                  <span className="text-gray-400">Sandton Central Escrow Depository and Cape Town Vault Depot for physical collateral storage and courier intake logistics.</span>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <strong className="text-white block font-semibold">Regulatory Authorities</strong>
                  <span className="text-gray-400">Financial Intelligence Centre (FIC), South African Reserve Bank (SARB), Financial Sector Conduct Authority (FSCA), and South African Revenue Service (SARS) when mandated by subpoena or law.</span>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="popia-7" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Calendar className="w-4 h-4" />
                <span>7. Statutory Retention Schedules</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                7. Data Retention Periods & Archival
              </h2>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border border-gray-800 rounded-xl overflow-hidden">
                  <thead className="bg-[#161922] text-gray-200">
                    <tr>
                      <th className="p-3 border-b border-gray-800">Data Category</th>
                      <th className="p-3 border-b border-gray-800">Statutory Basis</th>
                      <th className="p-3 border-b border-gray-800">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-300">
                    <tr>
                      <td className="p-3 font-semibold text-white">FICA Identity & KYC Records</td>
                      <td className="p-3 text-gray-400">FICA Section 22 / FIC Regulations</td>
                      <td className="p-3 font-mono text-emerald-400">7 Years post account closure</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Ledger & Transaction Logs</td>
                      <td className="p-3 text-gray-400">Companies Act 71 of 2008 & SARS</td>
                      <td className="p-3 font-mono text-emerald-400">7 Years from date of transaction</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Vault Collateral Liens</td>
                      <td className="p-3 text-gray-400">Escrow Depository Registry</td>
                      <td className="p-3 font-mono text-emerald-400">10 Years from settlement</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Application Telemetry & Analytics</td>
                      <td className="p-3 text-gray-400">Aggregated / Anonymized</td>
                      <td className="p-3 font-mono text-emerald-400">2 Years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 8 */}
            <section id="popia-8" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>8. Data Subject Rights Under POPIA</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                8. Your Legal Rights as a Data Subject
              </h2>
              <p className="text-xs text-gray-300">
                Under Sections 23–25 of POPIA, you have statutory rights to:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-xs text-gray-300">
                <li><strong>Right of Access (Section 23):</strong> Request written confirmation and copies of personal data held about you;</li>
                <li><strong>Right to Correction (Section 24):</strong> Request the rectification of outdated, inaccurate, or incomplete information;</li>
                <li><strong>Right to Erasure (Section 24):</strong> Request destruction of personal data no longer required for statutory FICA or tax purposes;</li>
                <li><strong>Right to Object (Section 11(3)):</strong> Object to processing on reasonable grounds or opt out of direct marketing;</li>
                <li><strong>Right to Lodge a Complaint:</strong> Submit a complaint directly to the South African Information Regulator.</li>
              </ul>
              <div className="p-3.5 bg-blue-950/20 border border-blue-800/40 rounded-xl text-xs text-blue-200 flex items-start space-x-2">
                <Mail className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                <span>
                  To submit a formal POPIA request, email our compliance office at <a href="mailto:privacy@wefinance.co.za" className="underline font-bold">privacy@wefinance.co.za</a> with "POPIA Data Subject Request" in the subject. We fulfill all requests within 30 statutory days.
                </span>
              </div>
            </section>

            {/* Section 9 */}
            <section id="popia-9" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <HardDrive className="w-4 h-4" />
                <span>9. Information Security Safeguards</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                9. Technical & Operational Safeguards (POPIA Sec 19)
              </h2>
              <p className="text-xs text-gray-300">
                We implement state-of-the-art security controls to prevent loss, damage, or unauthorized access:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <div className="font-semibold text-white mb-1">AES-256 & TLS 1.3</div>
                  <p className="text-gray-400">All data in transit is encrypted using modern TLS 1.3; database records and documents are encrypted at rest with AES-256.</p>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <div className="font-semibold text-white mb-1">Role-Based Access Control</div>
                  <p className="text-gray-400">Access to sensitive user records is strictly restricted to certified compliance personnel under multi-factor authentication.</p>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <div className="font-semibold text-white mb-1">Immutable Audit Logging</div>
                  <p className="text-gray-400">All wallet credits, loan requests, and administrative actions are logged to tamper-resistant security ledgers.</p>
                </div>
                <div className="p-3 bg-[#07090E] border border-gray-800 rounded-xl">
                  <div className="font-semibold text-white mb-1">Breach Incident Protocol</div>
                  <p className="text-gray-400">In the event of a data incident, notifications are issued to the Information Regulator and affected subjects in compliance with POPIA Section 22.</p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="popia-10" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Globe className="w-4 h-4" />
                <span>10. Cross-Border Data Transfers (POPIA Sec 72)</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                10. Transborder Flow of Information
              </h2>
              <p className="text-xs text-gray-300">
                Our primary database infrastructure is localized within Google Cloud's South Africa region (africa-south1). Where ancillary processors (e.g. Firebase Auth token generators or Expo Push dispatchers) transfer telemetry internationally, such transfers occur strictly in compliance with Section 72 of POPIA under binding contractual clauses ensuring equivalent data protection.
              </p>
            </section>

            {/* Section 11 */}
            <section id="popia-11" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Eye className="w-4 h-4" />
                <span>11. Cookies, Telemetry & Device Identifiers</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                11. Session Management & Analytics
              </h2>
              <p className="text-xs text-gray-300">
                We use secure, essential session tokens and local storage items to maintain your authenticated state, preserve investment preferences, and deliver real-time bank notifications. We do not use third-party advertising cookies or behavioral tracking networks.
              </p>
            </section>

            {/* Section 12 */}
            <section id="popia-12" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>12. Protection of Minors</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                12. Minors Under 18 Years of Age
              </h2>
              <p className="text-xs text-gray-300">
                WeFinance strictly prohibits accounts from persons under the age of 18. We do not knowingly process personal information of minors. Any account identified as belonging to a minor will be immediately closed and all personal data deleted.
              </p>
            </section>

            {/* Section 13 */}
            <section id="popia-13" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Calendar className="w-4 h-4" />
                <span>13. Policy Updates & Revision History</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                13. Amendments to Privacy Policy
              </h2>
              <p className="text-xs text-gray-300">
                We may revise this Privacy Policy periodically to reflect legislative updates from the Information Regulator. Notice of material updates will be published on our web interface and communicated via registered email 30 days prior to enforcement.
              </p>
            </section>

            {/* Section 14 */}
            <section id="popia-14" className="bg-[#0E1118] border border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 scroll-mt-24">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Mail className="w-4 h-4" />
                <span>14. Contact Information Officer & SA Information Regulator</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                14. POPIA Officer & Regulatory Inquiries
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#07090E] border border-emerald-900/40 rounded-xl space-y-2">
                  <h4 className="text-emerald-300 font-bold">WeFinance Information Officer</h4>
                  <p className="text-gray-300">WeFinance Group (Pty) Ltd</p>
                  <p className="text-gray-400">Sandton Central Escrow Depository, Sandton, Gauteng</p>
                  <p>Email: <a href="mailto:privacy@wefinance.co.za" className="text-emerald-400 underline">privacy@wefinance.co.za</a></p>
                  <p>Email: <a href="mailto:dpo@wefinance.co.za" className="text-emerald-400 underline">dpo@wefinance.co.za</a></p>
                  <p className="text-gray-400">Tel: +27 (0) 11 884 9000</p>
                </div>

                <div className="p-4 bg-[#07090E] border border-gray-800 rounded-xl space-y-2">
                  <h4 className="text-blue-300 font-bold">The Information Regulator (South Africa)</h4>
                  <p className="text-gray-400">JD House, 27 Stiemens Street, Braamfontein, Johannesburg</p>
                  <p>General Enquiries: <a href="mailto:enquiries@inforegulator.org.za" className="text-blue-400 underline">enquiries@inforegulator.org.za</a></p>
                  <p>Complaints: <a href="mailto:POPIAComplaints@inforegulator.org.za" className="text-blue-400 underline">POPIAComplaints@inforegulator.org.za</a></p>
                  <p>Website: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">inforegulator.org.za</a></p>
                </div>
              </div>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
};