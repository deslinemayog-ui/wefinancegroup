import React, { useState } from 'react';
import { 
  Scale, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  Calendar,
  Building,
  CheckCircle2,
  Activity,
  Flame
} from 'lucide-react';
import { 
  calculateDynamicRates, 
  MIN_INVESTOR_RATE, 
  MAX_INVESTOR_RATE, 
  MIN_BORROWER_RATE, 
  MAX_BORROWER_RATE 
} from '../utils/interest';

export const EconomicsAndFees: React.FC = () => {
  const [samplePrincipal, setSamplePrincipal] = useState<number>(50000);
  const [simDemand, setSimDemand] = useState<'HIGH' | 'BALANCED' | 'LOW'>('HIGH');

  // Compute rates using the dedicated dynamic interest engine
  const demandConfig = simDemand === 'HIGH' 
    ? { borrowers: 6, investors: 2 } 
    : simDemand === 'LOW' 
      ? { borrowers: 2, investors: 6 } 
      : { borrowers: 4, investors: 4 };

  const currentRates = calculateDynamicRates(demandConfig.borrowers, demandConfig.investors);
  const investorTargetRate = currentRates.investorRate;
  const borrowerFeeRate = currentRates.borrowerRate;
  const platformSpreadRate = currentRates.platformSpread;

  const investorPayoutGain = Math.round((samplePrincipal * investorTargetRate) / 100);
  const borrowerCost = Math.round((samplePrincipal * borrowerFeeRate) / 100);
  const platformSpreadAmount = Math.round((samplePrincipal * platformSpreadRate) / 100);

  return (
    <section id="economics-section" className="py-16 bg-[#0A0C10] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs text-blue-400 font-mono">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Dynamic Demand-Driven Economics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
            Platform Economics & Dynamic Interest
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Interest rates on WeFinance are responsive to market liquidity. When loan demand exceeds available capital, investor yields rise up to <strong>50%</strong> to attract funding. When investor capital is abundant, yields normalize down to <strong>20%</strong>, lowering borrowing costs from <strong>60% down to 35%</strong>.
          </p>
        </div>

        {/* 2 Comparative Structure Cards: Investor vs Borrower in Dynamic Demand Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Investor Structure */}
          <div className="bg-[#161922] p-6 sm:p-8 rounded-xl border border-blue-500/30 space-y-6 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                  Capital Provider Architecture
                </span>
                <h3 className="text-2xl font-bold text-white font-sans mt-1">
                  Investor Dynamic Yield
                </h3>
              </div>
              <span className="p-2 rounded-xl bg-blue-900/30 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
                20% - 50% Range
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Dynamic Target Yield</span>
                  <span className="text-xs text-gray-500">Tuned to borrower vs. investor volume</span>
                </div>
                <div className="text-2xl font-bold text-blue-400 font-mono-num">
                  +{MIN_INVESTOR_RATE}% to +{MAX_INVESTOR_RATE}% <span className="text-xs text-gray-400 font-normal">/ 30d</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Collateral Backing Floor</span>
                  <span className="text-xs text-gray-500">Physical custody verification</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400 font-mono-num">
                  150%+ <span className="text-xs text-gray-400 font-normal">LTV</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0C10]/60 border border-gray-800 text-xs space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Cycle Duration:</span>
                  <span className="text-white font-mono-num font-bold">30 Calendar Days</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Repayment Priority:</span>
                  <span className="text-blue-400 font-mono font-bold">First-lien Preferred</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Default Liquidation Floor:</span>
                  <span className="text-gray-200 font-mono-num">Public Auction at 48h Default</span>
                </div>
              </div>
            </div>
          </div>

          {/* Borrower Structure */}
          <div className="bg-[#161922] p-6 sm:p-8 rounded-xl border border-gray-800 space-y-6 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">
                  Credit Client Facility
                </span>
                <h3 className="text-2xl font-bold text-white font-sans mt-1">
                  Borrower Facility Cost
                </h3>
              </div>
              <span className="p-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 text-xs font-mono font-bold">
                35% - 60% Range
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Comprehensive Facility Fee</span>
                  <span className="text-xs text-gray-500">Includes appraisal, custody & escrow</span>
                </div>
                <div className="text-2xl font-bold text-gray-200 font-mono-num">
                  {MIN_BORROWER_RATE}% to {MAX_BORROWER_RATE}% <span className="text-xs text-gray-400 font-normal">/ 30d</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Repayment Grace Buffer</span>
                  <span className="text-xs text-gray-500">Prior to collateral foreclosure</span>
                </div>
                <div className="text-2xl font-bold text-amber-400 font-mono-num">
                  72 Hours
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0C10]/60 border border-gray-800 text-xs space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Platform Custody Spread:</span>
                  <span className="text-white font-mono-num font-bold">10% - 15% Dynamic Spread</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Credit Check Requirement:</span>
                  <span className="text-emerald-400 font-mono font-bold">Zero (100% Collateral-based)</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Asset Return Guarantee:</span>
                  <span className="text-gray-200 font-mono-num">Within 24h of settlement</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Dynamic Demand Calculator */}
        <div className="bg-[#161922] p-6 sm:p-8 rounded-xl border border-gray-800 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-sans">
                Interactive Dynamic Interest & Spread Simulator
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Observe how market demand shifts interest rates for both investors (20%-50%) and borrowers (35%-60%).
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-900/30 border border-blue-500/30 text-xs font-mono font-bold text-blue-400">
              Demand Tier: {currentRates.demandLevel}
            </div>
          </div>

          {/* Market Demand Presets */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium">Select Market Liquidity / Demand Scenario:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSimDemand('HIGH')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  simDemand === 'HIGH'
                    ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg'
                    : 'bg-[#0A0C10] border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-400">🔥 High Loan Demand</span>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                    Borrowers &gt; Investors
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  More people requesting loans. Investor yields peak up to <strong>50%</strong> (borrower pays <strong>60%</strong>).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSimDemand('BALANCED')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  simDemand === 'BALANCED'
                    ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg'
                    : 'bg-[#0A0C10] border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-200">⚖️ Balanced Market</span>
                  <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">
                    Borrowers ≈ Investors
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Equilibrium equilibrium state. Investor yield stabilizes around <strong>35%</strong> (borrower pays <strong>47.5%</strong>).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSimDemand('LOW')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  simDemand === 'LOW'
                    ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg'
                    : 'bg-[#0A0C10] border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400">💧 High Capital Supply</span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                    Investors &gt; Borrowers
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  High investor capital competing. Rates fall to <strong>20%</strong> for investors and <strong>35%</strong> for borrowers.
                </p>
              </button>
            </div>
          </div>

          {/* Principal Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Simulated Principal Facility</span>
              <span className="text-white font-mono font-bold text-sm">R{samplePrincipal.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={200000}
              step={5000}
              value={samplePrincipal}
              onChange={(e) => setSamplePrincipal(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-gray-500 font-mono">
              <span>R10,000</span>
              <span>R50,000</span>
              <span>R100,000</span>
              <span>R200,000</span>
            </div>
          </div>

          {/* Dynamic Calculation Outcome Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0A0C10] border border-blue-500/30 text-xs space-y-1">
              <span className="text-blue-400 font-semibold block">Investor 30-Day Yield (+{investorTargetRate}%)</span>
              <div className="text-xl font-bold text-white font-mono-num">
                +R{investorPayoutGain.toLocaleString()}
              </div>
              <span className="text-gray-400 text-[11px] block">Total payout: R{(samplePrincipal + investorPayoutGain).toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-xs space-y-1">
              <span className="text-gray-300 font-semibold block">Borrower 30-Day Cost ({borrowerFeeRate}%)</span>
              <div className="text-xl font-bold text-gray-200 font-mono-num">
                R{borrowerCost.toLocaleString()}
              </div>
              <span className="text-gray-400 text-[11px] block">Total repayment: R{(samplePrincipal + borrowerCost).toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-xs space-y-1">
              <span className="text-purple-400 font-semibold block">Platform Spread ({platformSpreadRate}%)</span>
              <div className="text-xl font-bold text-purple-300 font-mono-num">
                R{platformSpreadAmount.toLocaleString()}
              </div>
              <span className="text-gray-400 text-[11px] block">Allocated to vaults, security & reserve</span>
            </div>
          </div>
        </div>

        {/* Spread Breakdown Diagram */}
        <div className="bg-[#161922] p-6 sm:p-8 rounded-xl border border-gray-800 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white font-sans">
              Where Does the Platform Fee Spread Go?
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              The spread between the borrower rate and investor yield directly funds collateral security, independent appraisals, and vault insurance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-xs space-y-1.5">
              <span className="text-blue-400 font-bold font-mono block">40% of Spread</span>
              <strong className="text-white block font-sans">Physical Vault & Biometrics</strong>
              <p className="text-gray-400 text-[11px]">24/7 guarded, climate-controlled vault storage facilities in Sandton and Cape Town.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-xs space-y-1.5">
              <span className="text-blue-400 font-bold font-mono block">30% of Spread</span>
              <strong className="text-white block font-sans">Independent Appraisals</strong>
              <p className="text-gray-400 text-[11px]">Accredited master appraisers, gemologists, vehicle inspectors, and mechanical diagnostics.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-xs space-y-1.5">
              <span className="text-purple-400 font-bold font-mono block">20% of Spread</span>
              <strong className="text-white block font-sans">Insurance & Legal Liens</strong>
              <p className="text-gray-400 text-[11px]">Lloyd's syndicate custody policy and formal high-court registered notary liens.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 text-xs space-y-1.5">
              <span className="text-amber-400 font-bold font-mono block">10% of Spread</span>
              <strong className="text-white block font-sans">Reserve Liquidity Fund</strong>
              <p className="text-gray-400 text-[11px]">Emergency platform reserve ensuring instant liquidity in secondary auction windows.</p>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Compliance Disclaimer Box */}
        <div className="p-5 rounded-xl bg-[#161922] border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Important Risk & Legal Notice</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed font-sans">
            <strong>Investment involves risk. Projected returns are dynamic target yields based on market demand and are not guaranteed.</strong> Actual investment outcomes are governed by individual pool agreements, collateral liquidations, borrower fulfillment, and applicable South African legal and financial regulations. WeFinance Group does not provide banking deposit insurance or unconditional capital guarantees.
          </p>
        </div>

      </div>
    </section>
  );
};
