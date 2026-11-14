import React, { useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  Calendar, 
  Percent, 
  Wallet,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IndividualLoanPool } from '../types';
import { formatZAR, formatPercent, formatDate } from '../utils/formatters';

interface InvestSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: IndividualLoanPool | null;
  investedAmount: number;
  expectedReturn: number;
  onGoToDashboard: () => void;
}

export const InvestSuccessModal: React.FC<InvestSuccessModalProps> = ({
  isOpen,
  onClose,
  pool,
  investedAmount,
  expectedReturn,
  onGoToDashboard,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#06B6D4', '#3B82F6', '#F59E0B']
        });
      } catch {
        // graceful ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !pool) return null;

  const totalPayout = investedAmount + expectedReturn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#161922] rounded-2xl border border-gray-800 shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[85vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-blue-900/30 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto ring-8 ring-blue-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
            Investment Confirmed!
          </h3>
          <p className="text-xs text-gray-300">
            Your funds have been allocated to <strong>{pool.borrowerName}</strong>'s open loan pool #{pool.id}.
          </p>
        </div>

        {/* Receipt Certificate Box */}
        <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-3 font-mono-num text-xs">
          
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span className="text-gray-400">Loan Pool Reference:</span>
            <span className="text-blue-400 font-bold font-mono">#{pool.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Borrower:</span>
            <span className="text-white font-semibold font-sans">{pool.borrowerName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Principal Invested:</span>
            <span className="text-white font-bold text-sm">{formatZAR(investedAmount)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Target Return Rate:</span>
            <span className="text-blue-400 font-bold">+{pool.interestRate}% ({pool.term})</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Expected Target Yield:</span>
            <span className="text-blue-400 font-bold">+{formatZAR(expectedReturn)}</span>
          </div>

          <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-sm">
            <span className="text-gray-300 font-bold">Total Expected Payout:</span>
            <span className="text-emerald-400 font-bold">{formatZAR(totalPayout)}</span>
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
            <span>Expected Settlement:</span>
            <span className="text-gray-200">{pool.deadlineDate}</span>
          </div>

        </div>

        {/* Security Custody Badge */}
        <div className="p-3 rounded-xl bg-[#0A0C10] border border-gray-800 flex items-start space-x-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-gray-300">
            <span className="font-semibold text-white block">Secured Asset Custody</span>
            <span>Collateral <strong>{pool.collateralItem}</strong> ({pool.collateralCoverage}% coverage) is held in WeFinance escrow vault.</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 text-center cursor-pointer transition-colors"
          >
            Explore More Pools
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToDashboard();
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>View My Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
