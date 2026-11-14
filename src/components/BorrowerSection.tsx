import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  Building2, 
  Car, 
  Laptop, 
  Gem, 
  Cpu, 
  Sparkles, 
  FileText,
  Lock,
  Clock
} from 'lucide-react';
import { AssetCategory, FundingTerm } from '../types';
import { formatZAR, formatPercent } from '../utils/formatters';

interface BorrowerSectionProps {
  onOpenApplicationModal: () => void;
  onGoToBorrowerDashboard: () => void;
}

export const BorrowerSection: React.FC<BorrowerSectionProps> = ({
  onOpenApplicationModal,
  onGoToBorrowerDashboard,
}) => {
  // Collateral estimation calculator state
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('Tech & Hardware');
  const [assetValue, setAssetValue] = useState<number>(150000);
  const term: FundingTerm = '30 Days';

  // LTV ratios based on category
  const getLTV = (cat: AssetCategory) => {
    switch (cat) {
      case 'Luxury & Vehicles': return 0.65;
      case 'Jewellery & Precious': return 0.70;
      case 'Tech & Hardware': return 0.60;
      case 'Commercial & Industrial': return 0.60;
      case 'Business Equipment': return 0.65;
      default: return 0.60;
    }
  };

  const ltv = getLTV(assetCategory);
  const eligibleFunding = Math.round(assetValue * ltv);
  const borrowerFeeRate = 70;
  const fundingFee = Math.round((eligibleFunding * borrowerFeeRate) / 100);
  const totalRepayment = eligibleFunding + fundingFee;

  return (
    <section id="borrower-section" className="py-16 bg-[#0A0C10] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs text-blue-400 font-mono">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Fast Business & Individual Liquidity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
            Need Funding? Unlock Capital With Collateral
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Get access to funding in as fast as 24–48 hours by using eligible high-value assets as collateral. No protracted bank delays.
          </p>

          {/* Strict Collateral Mandate Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              Important: All funding requires verified physical collateral. Unsecured loans are strictly not provided.
            </span>
          </div>
        </div>

        {/* 2-Column: Interactive LTV Calculator & Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Collateral Valuation Simulator */}
          <div className="lg:col-span-7 bg-[#161922] p-6 rounded-xl border border-gray-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-sans">
                Collateral Valuation & Funding Estimator
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Select your asset category and estimated market appraisal to see eligible funding limits.
              </p>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">
                1. Select Pledged Asset Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Tech & Hardware', icon: Laptop },
                  { name: 'Luxury & Vehicles', icon: Car },
                  { name: 'Commercial & Industrial', icon: Building2 },
                  { name: 'Jewellery & Precious', icon: Gem },
                  { name: 'Business Equipment', icon: Cpu }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = assetCategory === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setAssetCategory(item.name as AssetCategory)}
                      className={`p-3 rounded-xl flex items-center space-x-2 text-xs font-semibold border transition-all text-left ${
                        isSelected 
                          ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                          : 'bg-[#0A0C10] text-gray-400 hover:text-gray-200 border-gray-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-gray-500'}`} />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asset Market Value Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-300 font-semibold">2. Estimated Asset Market Value</span>
                <span className="text-lg font-bold text-white font-mono-num">{formatZAR(assetValue)}</span>
              </div>
              <input
                type="range"
                min={30000}
                max={1000000}
                step={10000}
                value={assetValue}
                onChange={(e) => setAssetValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono-num mt-1">
                <span>R30,000</span>
                <span>R500,000</span>
                <span>R1,000,000+</span>
              </div>
            </div>

            {/* Funding Term */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300 block">
                  3. Standard Funding Term
                </label>
                <span className="text-[10px] text-blue-400 font-mono font-semibold">Institutional Standard</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0C10] border border-blue-500/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-white text-xs font-bold block">30 Days Standard Loan Facility</span>
                  <span className="text-gray-400 text-[11px] block">Full asset custody & legal escrow protection</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
                  30 Days Fixed
                </span>
              </div>
            </div>

            {/* Output Calculation Result Box */}
            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-3 font-mono-num text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400 font-sans">Eligible Funding Offer ({(ltv * 100)}% LTV):</span>
                <span className="text-xl font-extrabold text-blue-400">{formatZAR(eligibleFunding)}</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400 font-sans">Applicable Fee Structure ({borrowerFeeRate}%):</span>
                <span>{formatZAR(fundingFee)}</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400 font-sans">Total Repayment at Maturity:</span>
                <span className="text-white font-bold">{formatZAR(totalRepayment)}</span>
              </div>

              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center space-x-1.5 text-blue-400">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Collateral Vault Custody Required</span>
                </div>
                <span className="text-gray-500">Pledged Asset: {formatZAR(assetValue)}</span>
              </div>
            </div>

            {/* Application CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenApplicationModal}
                id="borrower-apply-now-btn"
                className="flex-1 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                <span>Apply for {formatZAR(eligibleFunding)} with Collateral</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToBorrowerDashboard}
                className="py-3.5 px-5 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
              >
                View Sample Borrower Portal
              </button>
            </div>

          </div>

          {/* Right Column: 9-Step Verification & Listing Flow */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl bg-[#161922] border border-gray-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Borrower Verification Journey</span>
              </h4>

              <div className="space-y-3.5 text-xs text-gray-300">
                
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-mono font-bold text-blue-400 shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-white block font-sans">Account & KYC Compliance</strong>
                    <span className="text-gray-400 text-[11px]">Submit FICA documentation and identity verification.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-mono font-bold text-blue-400 shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-white block font-sans">Submit Asset Details & Diagnostics</strong>
                    <span className="text-gray-400 text-[11px]">Upload photos, serial numbers, title deeds, and proof of ownership.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-mono font-bold text-blue-400 shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-white block font-sans">Physical Appraisal & Vault Deposit</strong>
                    <span className="text-gray-400 text-[11px]">Asset is inspected by certified appraisers and stored in secure WeFinance vault.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-mono font-bold text-blue-400 shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-white block font-sans">Marketplace Pool Listing</strong>
                    <span className="text-gray-400 text-[11px]">Funding pool is published to verified investors with collateral dossier.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shrink-0">
                    5
                  </span>
                  <div>
                    <strong className="text-emerald-300 block font-sans">Immediate Fund Disbursal</strong>
                    <span className="text-gray-400 text-[11px]">Capital transferred to your business bank account via escrow upon 100% pool completion.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Acceptable Collateral Asset Guide */}
            <div className="p-4 rounded-xl bg-[#161922] border border-gray-800 text-xs space-y-2">
              <span className="text-gray-400 font-semibold block text-[11px] uppercase tracking-wider">
                Eligible Collateral Criteria
              </span>
              <ul className="text-gray-400 space-y-1 text-[11px]">
                <li>• Vehicles: Clear title deed, under 10 years, full roadworthy.</li>
                <li>• Tech Gear: Apple MacBooks, Cinema Cameras (RED, Arri, Sony FX), Server racks.</li>
                <li>• Machinery: CNC machinery, generators, laser cutters, medical equipment.</li>
                <li>• Precious: Certified GIA diamonds, bullion, Rolex/Audemars Piguet watches.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
