import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Info, 
  Sparkles, 
  Layers, 
  Users, 
  Lock, 
  PlusCircle, 
  ArrowUpRight,
  Vault,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { InvestmentFund, CollateralAsset } from '../types';
import { CollateralCard } from './CollateralCard';
import { formatZAR, formatPercent } from '../utils/formatters';

interface MarketplaceProps {
  fund: InvestmentFund;
  pools?: InvestmentFund[]; // backward compatibility prop
  onSelectPool?: (fund: InvestmentFund) => void;
  onQuickInvest: (fund: InvestmentFund) => void;
  onOpenBorrowerModal: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  fund,
  pools,
  onSelectPool,
  onQuickInvest,
  onOpenBorrowerModal,
}) => {
  const activeFund = fund || (pools && pools[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!activeFund) return null;

  const assetsList = activeFund.assets || activeFund.borrowers || [];

  // Filter collateral items by category or keyword
  const filteredAssets = assetsList.filter((asset) => {
    if (selectedCategory !== 'ALL' && asset.collateralCategory !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchItem = asset.collateralItem.toLowerCase().includes(q);
      const matchCategory = asset.collateralCategory.toLowerCase().includes(q);
      const matchPurpose = (asset.purpose || '').toLowerCase().includes(q);
      return matchItem || matchCategory || matchPurpose;
    }
    return true;
  });

  const percentFunded = activeFund.totalTargetAmount > 0 
    ? Math.round((activeFund.amountFunded / activeFund.totalTargetAmount) * 100)
    : 0;

  return (
    <section id="marketplace-section" className="py-10 bg-[#0A0C10] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-gray-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 mb-1">
              <Vault className="w-4 h-4 text-blue-500" />
              <span>SINGLE MASTER INVESTMENT ACCOUNT</span>
              <span className="text-gray-600">•</span>
              <span className="text-emerald-400 font-bold">100% VAULT COLLATERAL BACKED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              WeFinance 30-Day Liquidity Fund
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              All investor capital enters one unified 30-day liquidity fund. Borrower identities remain 100% private — full transparency is provided strictly through institutional escrow collateral pledged to the fund.
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenBorrowerModal}
              className="px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 text-xs font-bold transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-400" />
              <span>Pledge Collateral for Credit</span>
            </button>

            <button
              onClick={() => onQuickInvest(activeFund)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <span>Invest in Central Fund</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Fund Performance & Capacity Banner */}
        <div className="p-6 rounded-2xl bg-[#161922] border border-blue-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE 30-DAY LIQUIDITY CYCLE</span>
              </div>
              <h3 className="text-xl font-bold text-white">{activeFund.title}</h3>
              <p className="text-xs text-gray-400">
                Sandton Escrow Depository • {activeFund.assetCount || assetsList.length} Vaulted Collateral Items Pledged
              </p>
            </div>

            {/* Target Yield Banner */}
            <div className="flex items-center space-x-4 bg-[#0F1117] p-4 rounded-xl border border-gray-800">
              <div>
                <span className="text-[11px] text-gray-400 block font-sans">Target 30-Day Yield</span>
                <span className="text-2xl font-extrabold text-amber-400 font-mono">+{activeFund.interestRate}%</span>
              </div>
              <div className="h-8 w-[1px] bg-gray-800" />
              <div>
                <span className="text-[11px] text-gray-400 block font-sans">Collateral Backing</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">{activeFund.collateralCoverageRatio}%</span>
              </div>
            </div>
          </div>

          {/* Progress & Capital Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="bg-[#0F1117] p-3.5 rounded-xl border border-gray-800/80">
              <span className="text-[11px] text-gray-400 block">Total Fund Target</span>
              <span className="text-base font-bold text-white font-mono">{formatZAR(activeFund.totalTargetAmount)}</span>
            </div>

            <div className="bg-[#0F1117] p-3.5 rounded-xl border border-gray-800/80">
              <span className="text-[11px] text-gray-400 block">Capital Funded So Far</span>
              <span className="text-base font-bold text-blue-400 font-mono">{formatZAR(activeFund.amountFunded)}</span>
            </div>

            <div className="bg-[#0F1117] p-3.5 rounded-xl border border-gray-800/80">
              <span className="text-[11px] text-gray-400 block">Remaining Capacity</span>
              <span className="text-base font-bold text-emerald-400 font-mono">{formatZAR(activeFund.remainingAmount)}</span>
            </div>

            <div className="bg-[#0F1117] p-3.5 rounded-xl border border-gray-800/80">
              <span className="text-[11px] text-gray-400 block">Escrow Vault Valuation</span>
              <span className="text-base font-bold text-purple-400 font-mono">{formatZAR(activeFund.totalCollateralValue)}</span>
            </div>
          </div>

          {/* Capital Allocation Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Fund Allocation Progress ({percentFunded}%)</span>
              <span className="text-blue-400 font-bold">{formatZAR(activeFund.amountFunded)} / {formatZAR(activeFund.totalTargetAmount)}</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
          </div>
        </div>

        {/* Collateral Asset Registry Section */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PLEDGED COLLATERAL ASSET VAULT</span>
              </div>
              <h3 className="text-lg font-bold text-white">Transparent Collateral Registry</h3>
              <p className="text-xs text-gray-400">
                Explore physical assets held in institutional escrow backing your investment.
              </p>
            </div>

            {/* Asset Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
                {[
                  { id: 'ALL', label: 'All Assets' },
                  { id: 'Tech & Hardware', label: 'Tech & Laptops' },
                  { id: 'Electronics & Gadgets', label: 'Mobile & Cameras' },
                  { id: 'Commercial & Industrial', label: 'Equipment & Vehicles' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'bg-[#161922] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item e.g. iPhone, MacBook..."
                  className="w-full bg-[#161922] border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Collateral Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredAssets.map((asset) => (
              <CollateralCard
                key={asset.id}
                asset={asset}
                onInvestClick={() => onQuickInvest(activeFund)}
              />
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12 bg-[#161922] rounded-xl border border-gray-800 p-6 space-y-3">
              <Info className="w-8 h-8 text-gray-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Matching Collateral Items Found</h3>
              <p className="text-xs text-gray-400">Try adjusting your search query or category filter.</p>
              <button
                onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
