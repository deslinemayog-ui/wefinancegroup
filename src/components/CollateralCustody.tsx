import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Scale, 
  FileCheck, 
  KeyRound, 
  Sparkles, 
  Eye, 
  Cpu, 
  Car, 
  Gem, 
  Building2,
  Stethoscope
} from 'lucide-react';
import { formatZAR } from '../utils/formatters';

export const CollateralCustody: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<number>(0);

  const verificationSteps = [
    {
      num: '01',
      title: 'Collateral Submitted',
      desc: 'Borrower registers asset diagnostics, photos, purchase receipts, and clear title proof.'
    },
    {
      num: '02',
      title: 'Professional Valuation',
      desc: 'Independent certified appraisers perform microscopic, mechanical, and market liquidity assessments.'
    },
    {
      num: '03',
      title: 'Legal Title Verification',
      desc: 'Encumbrance checks against National Credit Registers and notary liens to guarantee 100% clean title.'
    },
    {
      num: '04',
      title: 'Secure Vault Custody',
      desc: 'Asset is deposited into high-security climate-controlled biometric vault facilities in Sandton or Cape Town.'
    },
    {
      num: '05',
      title: 'Funding Pool Approved',
      desc: 'Only assets meeting minimum 140% collateral-to-loan ratios are published to the investor marketplace.'
    },
    {
      num: '06',
      title: 'Settlement & Release',
      desc: 'Upon full principal & return settlement by borrower, collateral is released or automatically liquidated on default.'
    }
  ];

  const collateralExamples = [
    {
      title: 'Tech & Cine Production Equipment',
      assetName: 'MacBook Pro M3 Max + RED V-Raptor 8K Camera Kit',
      estimatedMarket: 145000,
      verifiedValue: 128000,
      fundingIssued: 80000,
      coverage: 160,
      vault: 'WeFinance Foreshore Vault 1, Cape Town',
      ref: 'VAL-CPT-2026-3190',
      status: 'VERIFIED & SECURED ✓',
      icon: Cpu
    },
    {
      title: 'Commercial Executive Transport',
      assetName: '2023 Mercedes-Benz Sprinter 519 CDI + Title Deed',
      estimatedMarket: 410000,
      verifiedValue: 375000,
      fundingIssued: 250000,
      coverage: 150,
      vault: 'Sandton Secured Vehicle Depot 2, Gauteng',
      ref: 'VAL-SA-2026-8841',
      status: 'VERIFIED & SECURED ✓',
      icon: Car
    },
    {
      title: 'GIA Certified Diamonds & High Jewellery',
      assetName: '2.5ct GIA Certified Round Brilliant Diamond (VVS1, E Color)',
      estimatedMarket: 275000,
      verifiedValue: 240000,
      fundingIssued: 120000,
      coverage: 200,
      vault: 'Sandton High-Security Vault Room A, Gauteng',
      ref: 'VAL-JHB-2026-1188',
      status: 'VERIFIED & SECURED ✓',
      icon: Gem
    },
    {
      title: 'Specialized Medical Diagnostics',
      assetName: 'GE Healthcare Voluson E8 Ultrasound System',
      estimatedMarket: 290000,
      verifiedValue: 260000,
      fundingIssued: 150000,
      coverage: 173,
      vault: 'Rosebank MedVault Facility, Johannesburg',
      ref: 'VAL-MED-2026-6651',
      status: 'VERIFIED & SECURED ✓',
      icon: Stethoscope
    }
  ];

  return (
    <section id="collateral-custody-section" className="py-16 bg-[#0A0C10] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs text-blue-400 font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Default Collateral Guarantee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
            Every Funding Opportunity Is Secured by Verified Collateral
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Unlike unsecured peer lending, WeFinance Group never relies on promises. Every single Rand deployed is fortified by physical, independently appraised assets held in insured legal custody.
          </p>
        </div>

        {/* 6-Stage Collateral Verification Pipeline */}
        <div className="bg-[#161922] p-6 sm:p-8 rounded-xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-bold text-white font-sans mb-6 flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-blue-400" />
            <span>The WeFinance 6-Stage Verification & Custody Protocol</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {verificationSteps.map((step, idx) => (
              <div 
                key={step.num}
                className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 flex flex-col justify-between relative group hover:border-blue-500/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold font-mono text-blue-400">
                      STAGE {step.num}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5 font-sans">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {idx < 5 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-gray-600 font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Collateral Vault Dossier Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Asset Selection Tabs */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-lg font-bold text-white font-sans mb-2">
              Select Sample Collateral In Custody:
            </h3>
            {collateralExamples.map((ex, index) => {
              const Icon = ex.icon;
              const isSelected = selectedDemo === index;
              return (
                <button
                  key={ex.ref}
                  onClick={() => setSelectedDemo(index)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-start space-x-3.5 ${
                    isSelected
                      ? 'bg-[#161922] border-blue-500/60 shadow-lg shadow-blue-900/20'
                      : 'bg-[#161922]/60 border-gray-800 hover:bg-[#161922] text-gray-400'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                    isSelected ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-800 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-400">{ex.title}</span>
                      <span className="text-[10px] font-mono text-blue-400">{ex.coverage}% Coverage</span>
                    </div>
                    <div className="text-sm font-bold text-white truncate mt-0.5">{ex.assetName}</div>
                    <div className="text-[11px] text-gray-400 font-mono-num mt-1">
                      Valuation: <strong className="text-white">{formatZAR(ex.verifiedValue)}</strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep Dossier View of Selected Collateral */}
          <div className="lg:col-span-7">
            {(() => {
              const current = collateralExamples[selectedDemo];
              return (
                <div className="bg-[#161922] p-6 rounded-xl border border-gray-800 shadow-2xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400">
                        Official Custody Dossier
                      </span>
                      <h4 className="text-lg font-bold text-white font-sans mt-0.5">
                        {current.assetName}
                      </h4>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-900/30 text-blue-400 border border-blue-500/30 font-mono self-start">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      {current.status}
                    </span>
                  </div>

                  {/* Financial Ratios Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-num">
                    <div className="p-3 bg-[#0A0C10] rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">Est. Market Value</span>
                      <span className="text-sm font-bold text-gray-300">{formatZAR(current.estimatedMarket)}</span>
                    </div>
                    <div className="p-3 bg-[#0A0C10] rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">Verified Valuation</span>
                      <span className="text-sm font-bold text-blue-400">{formatZAR(current.verifiedValue)}</span>
                    </div>
                    <div className="p-3 bg-[#0A0C10] rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">Funding Disbursed</span>
                      <span className="text-sm font-bold text-white">{formatZAR(current.fundingIssued)}</span>
                    </div>
                    <div className="p-3 bg-[#0A0C10] rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">Collateral Coverage</span>
                      <span className="text-sm font-extrabold text-blue-400">{current.coverage}%</span>
                    </div>
                  </div>

                  {/* Vault & Legal Credentials */}
                  <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400">Custodial Vault Location:</span>
                      <span className="text-white font-semibold flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 mr-1" />
                        {current.vault}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 font-mono-num">
                      <span className="text-gray-400">Appraisal Certificate Number:</span>
                      <span className="text-blue-400 font-bold">{current.ref}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400">Insurance Underwriter:</span>
                      <span className="text-gray-200">100% Insured Lloyd's Lloyd & SA Custody Policy</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400">Liquidation Speed Guarantee:</span>
                      <span className="text-blue-300 font-semibold">Immediate Secondary Auction Partner Network</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic">
                    *Independent appraisers verify serial numbers, mechanical condition, and clean title registry before listing on the marketplace.
                  </p>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
};
