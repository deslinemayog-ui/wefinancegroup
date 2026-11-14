import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  FileCheck2, 
  KeyRound, 
  CheckCircle2, 
  Building2, 
  Scale, 
  ArrowDown, 
  Eye,
  Server,
  Layers
} from 'lucide-react';

export const SecurityArchitecture: React.FC = () => {
  const securityPillars = [
    {
      title: 'Institutional FICA & KYC',
      desc: 'All borrowers and capital deployers undergo verified identity checks, credit assessment, and source of funds screening.',
      icon: UserCheck
    },
    {
      title: '140%+ Physical Collateral Custody',
      desc: 'Physical assets are transferred to guarded biometric vault facilities in Sandton and Cape Town before listing.',
      icon: ShieldCheck
    },
    {
      title: 'Controlled Escrow Disbursals',
      desc: 'Investor capital remains locked in institutional escrow and is released in verified tranches only upon full pool funding.',
      icon: Lock
    },
    {
      title: 'Independent Valuation & Audit',
      desc: 'Certified appraisers and notary registries establish verified baseline market values and legally enforceable liens.',
      icon: Scale
    },
    {
      title: 'Automated Repayment Telemetry',
      desc: 'Live loan status, payment milestones, and collateral liquidation triggers are monitored around the clock.',
      icon: FileCheck2
    },
    {
      title: '256-Bit Cryptographic Ledger',
      desc: 'Immutable audit logs of all cash flows, escrow allocations, and settlement disbursements.',
      icon: Server
    }
  ];

  return (
    <section id="security-section" className="py-16 bg-[#0A0C10] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs text-blue-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Bank-Grade Escrow Protection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
            Built Around Security and Transparency
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Eliminating peer counterparty risk through institutional custody, independent asset appraisal, and controlled escrow workflows.
          </p>
        </div>

        {/* Visual Capital Flow Chain */}
        <div className="bg-[#161922] p-6 sm:p-8 rounded-xl border border-gray-800 space-y-6 shadow-xl">
          <div className="text-center">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              Controlled Capital & Settlement Flow
            </span>
            <h3 className="text-xl font-bold text-white font-sans mt-1">
              End-to-End Escrow Protection Mechanism
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Step 1</span>
              <div className="text-sm font-bold text-white">Investor</div>
              <p className="text-[10px] text-gray-400">Selects pool & commits capital</p>
            </div>

            <div className="hidden md:flex justify-center text-blue-500 font-bold text-lg">→</div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/30 text-center space-y-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Step 2</span>
              <div className="text-sm font-bold text-blue-300">WeFinance Escrow</div>
              <p className="text-[10px] text-gray-300">Controlled trust holding</p>
            </div>

            <div className="hidden md:flex justify-center text-blue-500 font-bold text-lg">→</div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/20 text-center space-y-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Step 3</span>
              <div className="text-sm font-bold text-blue-300">Collateral Vault</div>
              <p className="text-[10px] text-gray-300">Asset locked in custody</p>
            </div>

            <div className="hidden md:flex justify-center text-blue-500 font-bold text-lg">→</div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Step 4</span>
              <div className="text-sm font-bold text-white">Settlement Payout</div>
              <p className="text-[10px] text-gray-400">Principal + target yield paid</p>
            </div>

          </div>
        </div>

        {/* 6 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-[#161922] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all space-y-3 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A0C10] border border-gray-800 flex items-center justify-center text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white font-sans">
                  {p.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
