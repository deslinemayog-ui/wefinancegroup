import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  TrendingUp, 
  Percent, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building2, 
  FileText, 
  Wallet,
  ArrowRight,
  Sparkles,
  Vault,
  Info,
  ChevronDown,
  ChevronUp,
  Plus,
  Tag
} from 'lucide-react';
import { InvestmentFund, CollateralAsset, UserProfile } from '../types';
import { formatZAR, formatPercent } from '../utils/formatters';
import { investInFund } from '../services/loanService';

interface PoolDetailModalProps {
  pool: InvestmentFund | null;
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  userProfile: UserProfile | null;
  onInvestSuccess: (pool: InvestmentFund, investedAmount: number, expectedReturn: number) => void;
  onOpenDepositModal: () => void;
  onOpenAuthModal: () => void;
}

export const PoolDetailModal: React.FC<PoolDetailModalProps> = ({
  pool,
  isOpen,
  onClose,
  userBalance,
  userProfile,
  onInvestSuccess,
  onOpenDepositModal,
  onOpenAuthModal,
}) => {
  if (!isOpen || !pool) return null;

  const percentFunded = Math.min(100, Math.round((pool.amountFunded / pool.totalTargetAmount) * 100));
  const remainingAmount = Math.max(0, pool.totalTargetAmount - pool.amountFunded);
  const assetsList: CollateralAsset[] = pool.assets || pool.borrowers || [];
  const assetCount = pool.assetCount || assetsList.length;

  const defaultInvest = remainingAmount > 0 ? Math.min(5000, remainingAmount) : 0;
  const [investAmount, setInvestAmount] = useState<number>(defaultInvest);
  const [investorName, setInvestorName] = useState<string>(userProfile?.displayName || 'Verified Investor');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(assetsList[0]?.id || null);

  useEffect(() => {
    if (userProfile?.displayName) {
      setInvestorName(userProfile.displayName);
    }
  }, [userProfile]);

  const calculatedReturn = Math.round((investAmount * pool.interestRate) / 100);
  const totalPayout = investAmount + calculatedReturn;

  const handleInvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (investAmount <= 0) {
      setErrorMessage('Investment amount must be greater than R0');
      return;
    }

    if (investAmount > remainingAmount) {
      setErrorMessage(`Cannot invest more than the open fund capacity of ${formatZAR(remainingAmount)}`);
      return;
    }

    if (userBalance < investAmount) {
      setErrorMessage(`Insufficient wallet balance (${formatZAR(userBalance)}). Please deposit funds to complete this investment.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await investInFund(investAmount, investorName, userProfile?.uid);
      setIsSubmitting(false);

      if (result.success && result.updatedFund) {
        onInvestSuccess(result.updatedFund, investAmount, calculatedReturn);
      } else {
        setErrorMessage(result.error || 'Failed to complete investment transaction');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Investment failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#161922] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0A0C10] shrink-0">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded bg-[#161922] border border-blue-500/30 text-xs font-mono font-bold text-blue-400">
              WEFINANCE-FUND
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                {pool.title} • {formatZAR(pool.totalTargetAmount)} Target Capacity
              </h2>
              <p className="text-xs text-gray-400">
                {assetCount} Vaulted Collateral Items • Backed by {formatZAR(pool.totalCollateralValue)} Escrow Value
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            id="pool-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6 text-gray-200">
          
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0A0C10] p-4 rounded-xl border border-gray-800 font-mono-num">
            <div>
              <span className="text-[11px] text-gray-400 block font-sans">30-Day Target Yield</span>
              <span className="text-xl font-bold text-amber-400">+{pool.interestRate}%</span>
              <span className="text-[10px] text-blue-400/90 block font-sans font-medium">
                {pool.demandLabel || 'High Demand Tier'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block font-sans">Cycle Term</span>
              <span className="text-xl font-bold text-white">{pool.term}</span>
              <span className="text-[10px] text-gray-500 block font-sans">Maturing {pool.deadlineDate}</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block font-sans">Collateral Coverage</span>
              <span className="text-xl font-bold text-emerald-400">{pool.collateralCoverageRatio}%</span>
              <span className="text-[10px] text-emerald-500/80 block font-sans">Physical Vault Liens</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block font-sans">Remaining Capacity</span>
              <span className="text-xl font-bold text-blue-400">{formatZAR(remainingAmount)}</span>
              <span className="text-[10px] text-gray-400 block font-sans">{assetCount} Assets Pledged</span>
            </div>
          </div>

          {/* Single Account Notice Banner */}
          <div className="p-4 rounded-xl bg-blue-950/25 border border-blue-800/40 flex items-start space-x-3 text-xs">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans">Single Central Investment Account</strong>
              <p className="text-gray-300 mt-0.5 leading-relaxed">
                All investor capital enters this central account ({formatZAR(pool.totalTargetAmount)}). Borrower identities are kept 100% confidential — transparency is provided through physical collateral assets held in verified escrow.
              </p>
            </div>
          </div>

          {/* 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Vaulted Collateral Items (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-1.5 font-sans">
                    <Vault className="w-4 h-4 text-emerald-400" />
                    <span>Pledged Vault Collateral Items ({assetsList.length})</span>
                  </h3>
                  <span className="text-[11px] text-gray-400">Click item for details</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {assetsList.map((asset) => {
                    const isExpanded = expandedAssetId === asset.id;
                    return (
                      <div
                        key={asset.id}
                        className="rounded-xl border border-gray-800 bg-[#0A0C10] overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedAssetId(isExpanded ? null : asset.id)}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-800/40 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs block">{asset.collateralItem}</span>
                              <span className="text-[11px] text-gray-400 flex items-center space-x-2 font-mono">
                                <Tag className="w-3 h-3 text-blue-400 inline" />
                                <span>{asset.collateralCategory}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <div className="text-right">
                              <span className="text-xs font-mono-num font-bold text-emerald-400 block">
                                {formatZAR(asset.collateralEstimatedValue)}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono-num font-medium">
                                Credit: {formatZAR(asset.amountRequested)}
                              </span>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </div>
                        </button>

                        {/* Expanded Collateral Details */}
                        {isExpanded && (
                          <div className="p-3.5 border-t border-gray-800/80 bg-gray-900/40 space-y-2.5 text-xs">
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <span className="text-gray-500 block">Serial Number Mask:</span>
                                <span className="text-gray-300 font-mono">{asset.collateralSerialMasked || 'SN-VERIFIED-991'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Vault Location:</span>
                                <span className="text-gray-300">{asset.vaultLocation || 'Sandton Escrow Depository'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Coverage Ratio:</span>
                                <span className="text-emerald-400 font-bold font-mono">{asset.collateralCoverage}% Ratio</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Escrow Verification Status:</span>
                                <span className="text-emerald-400 font-semibold">{asset.collateralStatus || 'VERIFIED & IN VAULT'}</span>
                              </div>
                            </div>

                            <div className="pt-1.5 border-t border-gray-800">
                              <span className="text-gray-500 block text-[10px] mb-0.5">Commercial Purpose:</span>
                              <p className="text-gray-300 italic text-[11px]">"{asset.purpose || 'Commercial inventory expansion pledged to central fund'}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Escrow Depository Summary */}
              <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Collective Collateral Backing ({pool.collateralCoverageRatio}% Ratio)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ALL ASSETS IN VAULT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono-num">
                  <div>
                    <span className="text-gray-400 block text-[11px] font-sans font-medium">Total Collateral Valuation</span>
                    <span className="font-bold text-emerald-400 text-sm">{formatZAR(pool.totalCollateralValue)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px] font-sans font-medium">Primary Vault Location</span>
                    <span className="font-semibold text-gray-200 text-xs font-sans">{pool.vaultDepot}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Investment Form (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-5 rounded-2xl bg-[#0A0C10] border border-gray-800 shadow-xl space-y-4">
                
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-white text-sm font-sans">Fund Central Account</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded border border-amber-500/30">
                    +{pool.interestRate}% Yield ({pool.term})
                  </span>
                </div>

                {/* Progress Gauge */}
                <div className="space-y-1.5 font-mono-num text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Fund Capacity:</span>
                    <span className="font-bold text-white">{formatZAR(pool.totalTargetAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Funded so far:</span>
                    <span className="text-blue-400 font-bold">{formatZAR(pool.amountFunded)} ({percentFunded}%)</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Remaining to Fund:</span>
                    <span>{formatZAR(remainingAmount)}</span>
                  </div>

                  <div className="w-full bg-[#161922] rounded-full h-2.5 overflow-hidden border border-gray-800 mt-1">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${percentFunded}%` }}
                    />
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="p-3 rounded-xl bg-[#161922] border border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Your Wallet Balance:</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono-num">
                    <span className="font-bold text-white">{formatZAR(userBalance)}</span>
                    <button
                      type="button"
                      onClick={onOpenDepositModal}
                      className="text-blue-400 hover:text-blue-300 font-bold text-[11px] underline cursor-pointer"
                    >
                      + Top Up
                    </button>
                  </div>
                </div>

                {remainingAmount > 0 ? (
                  <form onSubmit={handleInvestSubmit} className="space-y-3.5 pt-2">
                    
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex flex-col space-y-2">
                        <div className="flex items-start space-x-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                          <span className="leading-relaxed">{errorMessage}</span>
                        </div>
                        {userBalance < investAmount && (
                          <button
                            type="button"
                            onClick={onOpenDepositModal}
                            className="self-start px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Deposit {formatZAR(investAmount - userBalance)} to Complete</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Investor Display Name */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-gray-400 text-[11px] font-semibold">Investor Name</label>
                        {!userProfile && (
                          <button
                            type="button"
                            onClick={onOpenAuthModal}
                            className="text-blue-400 text-[10px] font-bold hover:underline cursor-pointer"
                          >
                            Sign In for Live Payouts
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={investorName}
                        onChange={(e) => setInvestorName(e.target.value)}
                        className="w-full bg-[#161922] border border-gray-800 rounded-lg p-2 text-white text-xs font-sans focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. Verified Investor"
                      />
                    </div>

                    {/* Investment Amount Input */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <label className="text-gray-300 font-bold">Investment Amount (ZAR)</label>
                        <span className="text-gray-400 text-[11px]">Max: {formatZAR(remainingAmount)}</span>
                      </div>

                      <input
                        type="number"
                        min={100}
                        max={remainingAmount}
                        step={100}
                        required
                        value={investAmount || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setInvestAmount(Math.min(val, remainingAmount));
                        }}
                        className="w-full bg-[#161922] border border-gray-800 rounded-xl p-2.5 text-blue-400 font-mono-num font-extrabold text-base focus:outline-none focus:border-blue-500"
                        placeholder={`Enter amount up to ${formatZAR(remainingAmount)}`}
                      />
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono-num">
                      {remainingAmount >= 1000 && (
                        <button
                          type="button"
                          onClick={() => setInvestAmount(Math.min(1000, remainingAmount))}
                          className="py-1.5 rounded-lg bg-[#161922] hover:bg-gray-800 text-gray-200 border border-gray-800 cursor-pointer"
                        >
                          R 1,000
                        </button>
                      )}
                      {remainingAmount >= 5000 && (
                        <button
                          type="button"
                          onClick={() => setInvestAmount(Math.min(5000, remainingAmount))}
                          className="py-1.5 rounded-lg bg-[#161922] hover:bg-gray-800 text-gray-200 border border-gray-800 cursor-pointer"
                        >
                          R 5,000
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setInvestAmount(remainingAmount)}
                        className="py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-500/30 font-bold cursor-pointer"
                      >
                        Fund Rest ({formatZAR(remainingAmount)})
                      </button>
                    </div>

                    {/* Yield Box */}
                    <div className="p-3 rounded-xl bg-[#161922] border border-gray-800 space-y-2 font-mono-num text-xs">
                      <div className="flex justify-between items-center text-gray-400">
                        <span>Principal Investment:</span>
                        <span className="text-white font-semibold">{formatZAR(investAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-400">
                        <span className="flex items-center gap-1.5 font-sans">
                          <span>Dynamic Yield (+{pool.interestRate}%):</span>
                        </span>
                        <span className="text-amber-400 font-bold">+{formatZAR(calculatedReturn)}</span>
                      </div>
                      <div className="pt-1.5 border-t border-gray-800 flex justify-between items-center text-white font-bold text-sm">
                        <span>Total Expected Payout:</span>
                        <span className="text-emerald-400 font-bold">{formatZAR(totalPayout)}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || investAmount <= 0 || investAmount > remainingAmount}
                      className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 disabled:bg-gray-800 disabled:text-gray-500 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isSubmitting ? 'Allocating Funds...' : `Confirm Investment of ${formatZAR(investAmount)}`}</span>
                    </button>

                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-blue-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Central Account 100% Fully Funded!</h4>
                    <p className="text-xs text-gray-300">
                      All {formatZAR(pool.totalTargetAmount)} has been funded by investors.
                    </p>
                  </div>
                )}

              </div>

              {/* Escrow Guarantee */}
              <div className="flex items-center space-x-2 text-[11px] text-gray-400 px-1">
                <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Capital pooled under verified physical collateral liens in Sandton Vault Depot.</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
