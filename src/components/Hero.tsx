import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Lock, 
  Percent, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Activity, 
  ChevronRight, 
  Users,
  Coins,
  Vault
} from 'lucide-react';
import { formatZAR, formatPercent } from '../utils/formatters';
import { calculateDynamicRates } from '../utils/interest';

interface HeroProps {
  onExploreMarketplace: () => void;
  onOpenBorrowerModal: () => void;
  onSelectPool?: (poolId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMarketplace,
  onOpenBorrowerModal,
}) => {
  // Simulator state for central account funding
  const [investorDeposit, setInvestorDeposit] = useState<number>(5000);
  const simRates = calculateDynamicRates(4, 2);
  const returnRate = simRates.investorRate;
  
  const projectedReturn = Math.round((investorDeposit * returnRate) / 100);
  const totalProjectedPayout = investorDeposit + projectedReturn;

  return (
    <section className="relative pt-8 pb-14 md:pt-12 md:pb-20 overflow-hidden subtle-grid-bg border-b border-gray-800 bg-[#0A0C10]">
      {/* Ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Badge */}
        <div className="flex justify-center md:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Single Central Master Investment Account</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300 normal-case">100% Vault Collateral Asset Backed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white font-sans">
              Turn Capital Into <br />
              <span className="text-blue-500">Secured Returns.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl font-normal leading-relaxed">
              WeFinance Group connects investors directly to one unified 30-day liquidity fund. All capital enters a single central account backed by physical collateral (e.g. <strong>iPhone 17 Pro Max</strong>, <strong>MacBook Pro M3</strong>, <strong>vehicles</strong>) stored in accredited escrow vaults.
            </p>

            {/* Core Value Statement Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#161922] border border-gray-800 text-left">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs mb-1">
                  <Vault className="w-4 h-4 text-blue-500" />
                  <span>Single Central Account</span>
                </div>
                <p className="text-[11px] text-gray-400">No complex pool selection. All investments flow directly into the central 30-day liquidity fund.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161922] border border-gray-800 text-left">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Collateral Transparency</span>
                </div>
                <p className="text-[11px] text-gray-400">Zero borrower names shown. Transparency is provided through pledged collateral items in vault escrow.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161922] border border-gray-800 text-left">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1">
                  <Percent className="w-4 h-4 text-amber-500" />
                  <span>Dynamic Market Yields</span>
                </div>
                <p className="text-[11px] text-gray-400">20% to 50% investor yield dynamically calculated based on real-time market capital demand.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-3">
              <button
                onClick={onExploreMarketplace}
                id="hero-cta-start-investing"
                className="px-8 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/5 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Invest in Central Account</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={onOpenBorrowerModal}
                id="hero-cta-get-funded"
                className="px-8 py-3.5 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 border border-gray-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Pledge Collateral for Credit</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Stats Metrics */}
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-gray-800 pt-6">
              <div>
                <div className="text-2xl font-bold text-white">R1.4M+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Funded Capital</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">20% - 50%</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">30-Day Yield</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Vault Collateral</div>
              </div>
            </div>

          </div>

          {/* Right Column: Mini Simulator */}
          <div className="lg:col-span-5">
            <div className="bg-[#161922] rounded-2xl p-6 shadow-2xl border border-gray-800 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-white font-sans">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>30-Day Yield Calculator</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded border border-amber-500/30">
                  +{returnRate}% Dynamic Yield
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono-num">
                <div>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Investment Capital (ZAR)</span>
                    <span className="text-white font-bold">{formatZAR(investorDeposit)}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={50000}
                    step={1000}
                    value={investorDeposit}
                    onChange={(e) => setInvestorDeposit(Number(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Principal Allocated:</span>
                    <span className="text-white font-bold">{formatZAR(investorDeposit)}</span>
                  </div>
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Projected 30-Day Yield (+{returnRate}%):</span>
                    <span>+{formatZAR(projectedReturn)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-800 flex justify-between text-emerald-400 font-extrabold text-sm">
                    <span>Total Payout at Maturity:</span>
                    <span>{formatZAR(totalProjectedPayout)}</span>
                  </div>
                </div>

                <button
                  onClick={onExploreMarketplace}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/25 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Invest {formatZAR(investorDeposit)} Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
