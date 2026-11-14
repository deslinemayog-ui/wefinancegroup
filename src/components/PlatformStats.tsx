import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Building2, 
  Layers, 
  Coins, 
  Scale 
} from 'lucide-react';

const PLATFORM_METRICS = {
  totalCapitalFunded: 'R148,200,000+',
  averageCollateralCoverage: '272%',
  defaultLossRate: '0.00%',
  onTimeSettlementRate: '99.4%'
};

export const PlatformStats: React.FC = () => {
  return (
    <section className="py-16 bg-[#0A0C10] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs text-blue-400 font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Audited Performance Records</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
            South Africa's Leading Secured Funding Track Record
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Over R148 Million successfully deployed and settled with strict collateral liquidation safeguards.
          </p>
        </div>

        {/* 4 Big Metrics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono-num">
          
          <div className="bg-[#161922] p-6 rounded-xl border border-gray-800 text-center space-y-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-sans font-semibold">Total Capital Deployed</span>
            <div className="text-3xl sm:text-4xl font-bold text-white">
              {PLATFORM_METRICS.totalCapitalFunded}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">Across 1,840+ completed cycles</p>
          </div>

          <div className="bg-[#161922] p-6 rounded-xl border border-gray-800 text-center space-y-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-sans font-semibold">Average Collateral Backing</span>
            <div className="text-3xl sm:text-4xl font-bold text-blue-400">
              {PLATFORM_METRICS.averageCollateralCoverage}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">Physical vault appraisal ratio</p>
          </div>

          <div className="bg-[#161922] p-6 rounded-xl border border-gray-800 text-center space-y-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-sans font-semibold">Loss Rate on Default</span>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-400">
              {PLATFORM_METRICS.defaultLossRate}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">100% recovered via collateral sale</p>
          </div>

          <div className="bg-[#161922] p-6 rounded-xl border border-gray-800 text-center space-y-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-sans font-semibold">On-Time Settlement</span>
            <div className="text-3xl sm:text-4xl font-bold text-white">
              {PLATFORM_METRICS.onTimeSettlementRate}
            </div>
            <p className="text-[11px] text-gray-400 font-sans">Automated escrow distribution</p>
          </div>

        </div>

      </div>
    </section>
  );
};
