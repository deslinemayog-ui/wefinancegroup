import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Percent, 
  Lock, 
  CheckCircle2, 
  Users, 
  User,
  Layers,
  Sparkles,
  Building2
} from 'lucide-react';
import { MasterLoanPool } from '../types';
import { formatZAR, formatPercent } from '../utils/formatters';

interface PoolCardProps {
  pool: MasterLoanPool;
  onSelectPool: (pool: MasterLoanPool) => void;
  onQuickInvest: (pool: MasterLoanPool) => void;
}

export const PoolCard: React.FC<PoolCardProps> = ({
  pool,
  onSelectPool,
  onQuickInvest,
}) => {
  const percentFunded = Math.min(100, Math.round((pool.amountFunded / pool.totalTargetAmount) * 100));
  const remainingAmount = Math.max(0, pool.totalTargetAmount - pool.amountFunded);
  const borrowersList = pool.borrowers || [];
  const borrowerCount = pool.borrowerCount || borrowersList.length;

  // Status badge styling
  const getStatusBadge = () => {
    switch (pool.status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-num">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            ACTIVE MASTER POOL
          </span>
        );
      case 'FULLY_FUNDED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono-num">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5"></span>
            100% FUNDED
          </span>
        );
      case 'DISBURSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono-num">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1.5"></span>
            DISBURSED / ACTIVE
          </span>
        );
      case 'REPAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono-num">
            ✓ REPAID & SETTLED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-[#161922] rounded-xl p-5 flex flex-col justify-between relative group border border-gray-800 hover:border-gray-700 transition-all duration-200 shadow-xl"
      id={`pool-card-${pool.id}`}
    >
      {/* Top Header: ID, Category & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-blue-400 font-mono font-bold bg-blue-900/30 px-2 py-0.5 rounded border border-blue-500/30">
              #{pool.id}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{pool.cycleName || 'Master Cycle'}</span>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Pool Title */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors font-sans mb-1">
          {pool.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3.5">
          {pool.category} • Backed by <strong>{borrowerCount} verified individual borrowers</strong>
        </p>

        {/* Constituent Borrowers Strip Preview */}
        <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center space-x-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Constituent Borrowers ({borrowerCount}):</span>
            </span>
            <span className="text-blue-400 font-mono-num font-semibold text-[11px]">
              {borrowerCount > 0 ? `Avg ${formatZAR(Math.round(pool.totalTargetAmount / borrowerCount))} each` : ''}
            </span>
          </div>

          {/* Mini Avatars and names */}
          <div className="flex flex-wrap gap-1.5">
            {borrowersList.slice(0, 4).map((b, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#161922] border border-gray-800 text-[11px] text-gray-300 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>{b.borrowerName.split(' ')[0]}</span>
                <span className="text-gray-500 text-[10px]">({formatZAR(b.amountRequested)})</span>
              </span>
            ))}
            {borrowerCount > 4 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 font-bold font-mono-num">
                +{borrowerCount - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Collective Collateral Strip */}
        <div className="p-2.5 rounded-lg bg-gray-900/40 border border-gray-800 mb-4 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs w-full">
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Collective Escrow Collateral</span>
            <div className="flex items-center justify-between mt-0.5 font-mono-num text-[11px]">
              <span className="text-gray-300">
                Total Valuation: <strong className="text-white">{formatZAR(pool.totalCollateralValue)}</strong>
              </span>
              <span className="text-emerald-400 font-bold">✓ {pool.collateralCoverageRatio}% Backed</span>
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5 font-sans truncate">
              Depot: {pool.vaultDepot}
            </span>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-900/50 border border-gray-800 mb-4">
          <div className="p-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Pool Target</span>
            <span className="text-base font-bold text-white font-mono-num">
              {formatZAR(pool.totalTargetAmount)}
            </span>
          </div>
          <div className="p-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Dynamic Yield</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {pool.demandLevel || 'HIGH'}
              </span>
            </div>
            <span className="text-base font-bold text-blue-400 font-mono-num">
              +{pool.interestRate}% <span className="text-[10px] text-gray-400 font-normal">/ {pool.term}</span>
            </span>
          </div>
          <div className="p-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Remaining to Fund</span>
            <span className="text-xs font-bold text-amber-400 font-mono-num">
              {formatZAR(remainingAmount)}
            </span>
          </div>
          <div className="p-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Contributors</span>
            <span className="text-xs font-bold text-gray-300 font-mono-num">
              {pool.investorCount || pool.investments?.length || 0} Backers
            </span>
          </div>
        </div>

        {/* Funding Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-mono-num">
            <span className="text-gray-400">
              Funded: <strong className="text-white">{formatZAR(pool.amountFunded)}</strong> of {formatZAR(pool.totalTargetAmount)}
            </span>
            <span className="font-bold text-blue-400">{percentFunded}%</span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${percentFunded > 85 ? 'bg-amber-500' : 'bg-blue-500'}`} 
              style={{ width: `${percentFunded}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-gray-400 font-mono-num">
            <span>{borrowerCount} Borrowers • {pool.term} Cycle</span>
            {remainingAmount > 0 ? (
              <span className="text-amber-400 font-semibold">{formatZAR(remainingAmount)} open capacity</span>
            ) : (
              <span className="text-emerald-400 font-bold">100% Fully Funded</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
        <button
          onClick={() => onSelectPool(pool)}
          id={`view-pool-${pool.id}`}
          className="py-2.5 px-3 rounded-lg text-xs font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-center cursor-pointer"
        >
          View Constituents
        </button>

        {pool.status === 'OPEN' && remainingAmount > 0 ? (
          <button
            onClick={() => onQuickInvest(pool)}
            id={`invest-pool-${pool.id}`}
            className="py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-1 active:scale-95 cursor-pointer"
          >
            <span>Fund Pool</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onSelectPool(pool)}
            className="py-2.5 px-3 rounded-lg text-xs font-medium text-gray-500 bg-gray-900/50 border border-gray-800 cursor-pointer"
          >
            Pool Filled
          </button>
        )}
      </div>
    </div>
  );
};
