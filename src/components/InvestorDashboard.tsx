import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Building2, 
  Calendar, 
  Layers, 
  ChevronRight, 
  Info,
  CreditCard,
  History,
  FileCheck2,
  Lock,
  Download,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { 
  UserInvestmentRecord, 
  InvestmentFund, 
  UserProfile, 
  WithdrawalRecord, 
  WalletTransaction 
} from '../types';
import { formatZAR, formatPercent, formatDate, calculateRemainingDays } from '../utils/formatters';

interface InvestorDashboardProps {
  userProfile: UserProfile | null;
  userInvestments: UserInvestmentRecord[];
  withdrawals: WithdrawalRecord[];
  transactions: WalletTransaction[];
  allPools: InvestmentFund[];
  onOpenDepositModal: () => void;
  onOpenWithdrawModal: () => void;
  onOpenAuthModal: () => void;
  onExplorePools: () => void;
  onSelectPool: (fund: InvestmentFund) => void;
  onOpenProfileModal?: () => void;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  userProfile,
  userInvestments,
  withdrawals,
  transactions,
  allPools,
  onOpenDepositModal,
  onOpenWithdrawModal,
  onOpenAuthModal,
  onExplorePools,
  onSelectPool,
  onOpenProfileModal
}) => {
  const [activeTab, setActiveTab] = useState<'investments' | 'withdrawals' | 'transactions'>('investments');

  const availableBalance = userProfile?.availableBalance || 0;
  const totalInvested = userInvestments.reduce((acc, inv) => acc + inv.investedAmount, 0);
  const totalExpectedYield = userInvestments.reduce((acc, inv) => acc + inv.expectedReturn, 0);
  const totalWithdrawn = withdrawals.reduce((acc, w) => acc + (w.status !== 'CANCELLED' ? w.amount : 0), 0);

  return (
    <section className="py-10 bg-[#0A0C10] border-b border-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-800/80">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider mb-1 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>Real Escrow Investor Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              {userProfile?.fullName || userProfile?.displayName ? `Welcome, ${userProfile.fullName || userProfile.displayName}` : 'Investor Portfolio & Bank Payouts'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Institutional settlement ledger. Allocate capital to the WeFinance 30-day liquidity fund, monitor yields, and withdraw payouts directly to your South African bank account.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {userProfile ? (
              <>
                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    id="investor-profile-setup-btn"
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-gray-200 bg-[#161922] hover:bg-gray-800 border border-gray-800 transition-all cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>{userProfile.profileComplete ? 'Profile Verified' : 'Setup Profile'}</span>
                  </button>
                )}

                <button
                  onClick={onOpenDepositModal}
                  id="dashboard-deposit-btn"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deposit Funds</span>
                </button>

                <button
                  onClick={onOpenWithdrawModal}
                  id="dashboard-withdraw-btn"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Withdraw to Bank</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In / Register to Invest & Withdraw</span>
              </button>
            )}

            <button
              onClick={onExplorePools}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-gray-200 bg-[#161922] hover:bg-gray-800 border border-gray-800 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Explore Marketplace Fund</span>
            </button>
          </div>
        </div>

        {/* Not Logged In Warning Card */}
        {!userProfile && (
          <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Log in for Live Payouts & Real Balance</h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Create your free account or sign in to link your Capitec, Standard Bank, FNB, Nedbank, or ABSA account for direct EFT withdrawals.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md shadow-blue-600/20"
            >
              Register / Sign In
            </button>
          </div>
        )}

        {/* Real Financial Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-num">
          
          {/* Available Wallet Balance */}
          <div className="p-5 rounded-2xl bg-[#161922] border border-gray-800 relative overflow-hidden group">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-sans">
              <span>Available Wallet Balance</span>
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {formatZAR(availableBalance)}
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px] font-sans">
              <span className="text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Withdrawable
              </span>
              {availableBalance > 0 && (
                <button
                  onClick={onOpenWithdrawModal}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer"
                >
                  Withdraw now →
                </button>
              )}
            </div>
          </div>

          {/* Total Capital Invested */}
          <div className="p-5 rounded-2xl bg-[#161922] border border-gray-800">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-sans">
              <span>Total Deployed Capital</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1">
              {formatZAR(totalInvested)}
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 font-sans">
              <span>{userInvestments.length} Capital Allocations</span>
              <span>100% Vault Backed</span>
            </div>
          </div>

          {/* Expected Returns Yield */}
          <div className="p-5 rounded-2xl bg-[#161922] border border-gray-800">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-sans">
              <span>Expected Target Yield</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
              +{formatZAR(totalExpectedYield)}
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px] text-emerald-400 font-sans">
              <span>Dynamic Term Yield</span>
              <span>On Settlement</span>
            </div>
          </div>

          {/* Bank Withdrawals Processed */}
          <div className="p-5 rounded-2xl bg-[#161922] border border-gray-800">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-sans">
              <span>Total Bank Payouts</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 mt-1">
              {formatZAR(totalWithdrawn)}
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 font-sans">
              <span>{withdrawals.length} EFT transfers</span>
              <span className="text-emerald-400 font-semibold">0% Fee</span>
            </div>
          </div>

        </div>

        {/* Saved Bank Account Card */}
        {userProfile && (
          <div className="p-4 rounded-2xl bg-[#161922] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950/50 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white font-sans">
                    {userProfile.bankAccount ? userProfile.bankAccount.bankName : 'No Bank Account Saved'}
                  </span>
                  {userProfile.bankAccount && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold">
                      Direct EFT Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-0.5">
                  {userProfile.bankAccount 
                    ? `Account Holder: ${userProfile.bankAccount.accountHolder} • Acc: ••••${userProfile.bankAccount.accountNumber.slice(-4)}`
                    : 'Link your bank account when requesting your first withdrawal.'
                  }
                </p>
              </div>
            </div>

            <button
              onClick={onOpenWithdrawModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Request Withdrawal
            </button>
          </div>
        )}

        {/* Portfolio Tabs & Table */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <button
              onClick={() => setActiveTab('investments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'investments'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#161922] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Active Capital Allocations ({userInvestments.length})
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'withdrawals'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#161922] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Bank Withdrawals ({withdrawals.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#161922] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Ledger History ({transactions.length})
            </button>
          </div>

          {/* Tab 1: Investments */}
          {activeTab === 'investments' && (
            <div className="bg-[#161922] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              {userInvestments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#0F1117] text-gray-400 border-b border-gray-800 text-[11px] uppercase font-mono">
                      <tr>
                        <th className="py-3 px-4">Fund Title</th>
                        <th className="py-3 px-4">Capital Allocated</th>
                        <th className="py-3 px-4">Target Rate</th>
                        <th className="py-3 px-4">Interest Amount</th>
                        <th className="py-3 px-4">Total Payout</th>
                        <th className="py-3 px-4">Maturity Date</th>
                        <th className="py-3 px-4">Withdrawal Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 font-mono-num">
                      {userInvestments.map((inv) => (
                        <tr key={inv.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-sans font-bold text-white">
                            {inv.poolTitle || 'WeFinance 30-Day Master Liquidity Fund'}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {formatZAR(inv.investedAmount)}
                          </td>
                          <td className="py-3.5 px-4 text-blue-400 font-bold">
                            +{inv.interestRate}%
                          </td>
                          <td className="py-3.5 px-4 text-amber-300 font-bold font-mono-num">
                            {formatZAR(inv.interestAmount || (inv.expectedReturn - inv.investedAmount))}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">
                            {formatZAR(inv.totalPayout)}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-sans">
                            {inv.maturityDate}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-sans font-mono text-[11px]">
                            {inv.withdrawalDate || '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px] font-sans">
                              {inv.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <Info className="w-8 h-8 text-gray-500 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Capital Allocations Yet</h4>
                  <p className="text-xs text-gray-400">Allocate capital to the central liquidity fund to earn dynamic 30-day yields backed by physical escrow collateral.</p>
                  <button
                    onClick={onExplorePools}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>Invest in Central Fund</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Withdrawals */}
          {activeTab === 'withdrawals' && (
            <div className="bg-[#161922] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              {withdrawals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#0F1117] text-gray-400 border-b border-gray-800 text-[11px] uppercase font-mono">
                      <tr>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Bank Name</th>
                        <th className="py-3 px-4">Account Number</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Requested At</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 font-mono-num">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3.5 px-4 text-blue-400 font-mono font-semibold">
                            {w.reference}
                          </td>
                          <td className="py-3.5 px-4 font-sans font-medium text-white">
                            {w.bankName}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400">
                            {w.accountNumberMasked}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">
                            {formatZAR(w.amount)}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-sans">
                            {formatDate(w.requestedAt)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px] font-sans">
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <Building2 className="w-8 h-8 text-gray-500 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Withdrawals Processed Yet</h4>
                  <p className="text-xs text-gray-400">Request 100% free EFT payouts directly to your South African bank account.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Transactions */}
          {activeTab === 'transactions' && (
            <div className="bg-[#161922] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#0F1117] text-gray-400 border-b border-gray-800 text-[11px] uppercase font-mono">
                      <tr>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 font-mono-num">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-md font-semibold text-[11px] font-sans ${
                              tx.type === 'DEPOSIT' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                              tx.type === 'WITHDRAWAL' ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30' :
                              'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-300 font-sans">
                            {tx.description}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {formatZAR(tx.amount)}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                            {tx.reference}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-sans">
                            {formatDate(tx.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <History className="w-8 h-8 text-gray-500 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Ledger Transactions Found</h4>
                  <p className="text-xs text-gray-400">Your deposit, investment, and withdrawal transactions will appear here.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
