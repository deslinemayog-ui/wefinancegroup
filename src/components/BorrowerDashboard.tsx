import React from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Coins, 
  ArrowUpRight, 
  PlusCircle, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Sparkles,
  Lock,
  Vault,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';
import { InvestmentFund, UserLoanRecord, UserProfile } from '../types';
import { formatZAR, formatPercent, formatDate, calculateRemainingDays } from '../utils/formatters';

interface BorrowerDashboardProps {
  userLoanPools: InvestmentFund[];
  userLoans?: UserLoanRecord[];
  userProfile?: UserProfile | null;
  onOpenBorrowerModal: () => void;
  onExploreMarketplace: () => void;
  onOpenProfileModal?: () => void;
}

export const BorrowerDashboard: React.FC<BorrowerDashboardProps> = ({
  userLoanPools,
  userLoans = [],
  userProfile,
  onOpenBorrowerModal,
  onExploreMarketplace,
  onOpenProfileModal
}) => {
  const totalLoansCount = (userLoans.length > 0 ? userLoans.length : userLoanPools.length);
  const totalRequested = userLoans.length > 0 
    ? userLoans.reduce((acc, l) => acc + l.loanAmount, 0)
    : userLoanPools.reduce((acc, p) => acc + (p.totalTargetAmount || 0), 0);

  const totalRepaymentDue = userLoans.length > 0
    ? userLoans.reduce((acc, l) => acc + l.totalRepaymentDue, 0)
    : userLoanPools.reduce((acc, p) => acc + (p.totalRepaymentDue || 0), 0);

  return (
    <section className="py-10 bg-[#0A0C10] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider mb-1 font-bold">
              <Vault className="w-4 h-4" />
              <span>Borrower Portal • Vault Escrow Credit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              {userProfile?.fullName || userProfile?.displayName ? `Welcome, ${userProfile.fullName || userProfile.displayName}` : 'Borrower Credit & Collateral Tracker'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Track your pledged collateral credit requests, monitor escrow vault verification, and manage 30-day settlement deadlines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenProfileModal && (
              <button
                onClick={onOpenProfileModal}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-gray-200 bg-[#161922] hover:bg-gray-800 border border-gray-800 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>{userProfile?.profileComplete ? 'Profile Verified' : 'Setup Profile & Address'}</span>
              </button>
            )}

            <button
              onClick={onOpenBorrowerModal}
              id="borrower-apply-loan-btn"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pledge Collateral for Credit</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Prompt */}
        {userProfile && !userProfile.profileComplete && onOpenProfileModal && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-300 font-sans">Setup Your Profile & Physical Address</p>
                <p className="text-[11px] text-gray-300">Complete your profile for 1-click borrowing and automated escrow vault intake registration.</p>
              </div>
            </div>
            <button
              onClick={onOpenProfileModal}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 cursor-pointer transition-colors"
            >
              Complete Profile Now
            </button>
          </div>
        )}

        {/* Top 3 Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
          <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-xs text-gray-400 font-sans">Total Credit Requested</span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono-num">
              {formatZAR(totalRequested)}
            </div>
            <span className="text-[11px] text-blue-400 block mt-1">
              Across {totalLoansCount} pledged collateral facilities
            </span>
          </div>

          <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-xs text-gray-400 font-sans font-medium">Total Repayment Due at Maturity</span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono-num">
              {formatZAR(totalRepaymentDue)}
            </div>
            <span className="text-[11px] text-gray-400 block mt-1 font-sans">
              30-day fixed tenor cycle
            </span>
          </div>

          <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-xs text-gray-400 font-sans font-medium">Escrow Collateral Status</span>
            <div className="text-xl font-bold text-emerald-400">VERIFIED & VAULTED</div>
            <span className="text-[11px] text-gray-400 block mt-1 font-sans">Protected in Sandton Escrow Depository</span>
          </div>
        </div>

        {/* User's Specific Loan Records */}
        {userLoans.length > 0 && (
          <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-sans flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>My Active Credit Applications ({userLoans.length})</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Ledger Sync</span>
              </span>
            </div>

            <div className="space-y-3 font-mono-num">
              {userLoans.map((loan) => {
                const rem = calculateRemainingDays(loan.deadlineDate);

                return (
                  <div
                    key={loan.id}
                    className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#161922] border border-gray-800 text-xs font-mono font-bold text-blue-400">
                          #{loan.id}
                        </span>
                        <span className="font-bold text-white text-sm sm:text-base font-sans">
                          {formatZAR(loan.loanAmount)} Credit Request
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/30 text-blue-400 border border-blue-500/30">
                          {loan.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-sans flex items-center space-x-1 ${
                          rem.isOverdue
                            ? 'bg-red-950/60 text-red-400 border border-red-500/40'
                            : rem.daysRemaining <= 5
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>{rem.label}</span>
                        </span>
                        <span className="text-xs text-gray-400">
                          Due: <strong className="text-gray-200 font-sans">{loan.deadlineDate}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[11px] font-sans">Pledged Collateral Asset</span>
                        <span className="text-gray-200 font-semibold font-sans">{loan.collateralItem}</span>
                        <span className="text-emerald-400 text-[11px] block mt-0.5 font-sans">
                          Valuation: {formatZAR(loan.collateralEstimatedValue)} ({loan.collateralCoverage}% coverage)
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[11px] font-sans">Loan Principal</span>
                        <span className="text-white font-bold text-sm">{formatZAR(loan.loanAmount)}</span>
                        <span className="text-gray-400 text-[11px] block mt-0.5 font-sans">
                          Interest: {formatZAR(loan.interestAmount || 0)}
                        </span>
                        <span className="text-gray-400 text-[11px] block mt-0.5 font-sans">
                          Platform Fee: {formatZAR(loan.platformFee || 0)}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[11px] font-sans">Total Repayment Due</span>
                        <span className="text-amber-300 font-bold text-sm">{formatZAR(loan.totalRepaymentDue)}</span>
                        <span className="text-gray-400 text-[11px] block mt-0.5 font-sans">
                          Due Date: <strong className="text-gray-200">{loan.repaymentDate || loan.deadlineDate}</strong>
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Central Fund & Collateral Registry Status */}
        <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-sans">
              Single Central Account & Collateral Vault Status
            </h3>
            <span className="text-xs text-gray-400 font-mono-num">
              Institutional Escrow Ledger
            </span>
          </div>

          {userLoanPools.length > 0 ? (
            <div className="space-y-4">
              {userLoanPools.map((pool) => {
                const percent = Math.min(100, Math.round((pool.amountFunded / pool.totalTargetAmount) * 100));
                const remaining = Math.max(0, pool.totalTargetAmount - pool.amountFunded);
                const assetsList = pool.assets || pool.borrowers || [];
                const rem = calculateRemainingDays(pool.deadlineDate);

                return (
                  <div
                    key={pool.id}
                    className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-3 font-mono-num"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#161922] border border-gray-800 text-xs font-mono font-bold text-blue-400">
                          WEFINANCE-FUND
                        </span>
                        <span className="font-bold text-white text-base font-sans">
                          {pool.title} ({formatZAR(pool.totalTargetAmount)})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold font-sans bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>{rem.label}</span>
                        </span>
                        <span className="text-xs text-gray-400 font-sans">
                          Term: <strong className="text-white">{pool.term}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[11px] font-sans">Collective Escrow Assets</span>
                        <span className="text-gray-200 font-sans font-semibold">
                          {assetsList.length} Vaulted Collateral Items Pledged
                        </span>
                        <span className="text-emerald-400 text-[11px] block mt-0.5 font-sans">
                          Valuation: {formatZAR(pool.totalCollateralValue)} ({pool.collateralCoverageRatio}% coverage)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px] font-sans font-medium">Repayment Due at Maturity</span>
                        <span className="text-white font-bold text-sm">{formatZAR(pool.totalRepaymentDue)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-sans">
                          Central Account Funding Progress: <strong className="text-blue-400 font-mono-num">{formatZAR(pool.amountFunded)}</strong> of {formatZAR(pool.totalTargetAmount)}
                        </span>
                        <span className="text-blue-400 font-bold">{percent}%</span>
                      </div>
                      <div className="w-full bg-[#161922] rounded-full h-2 overflow-hidden border border-gray-800">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#0A0C10] rounded-xl border border-gray-800 space-y-3">
              <Coins className="w-10 h-10 text-gray-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Active Credit Facilities Yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Need credit? Pledge physical collateral (e.g. iPhone 17 Pro Max, MacBook Pro, vehicle) to receive 30-day funding from the central account.
              </p>
              <button
                onClick={onOpenBorrowerModal}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-600/25"
              >
                Pledge Collateral Now
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
