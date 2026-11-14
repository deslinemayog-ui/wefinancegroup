import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Loader2,
  ChevronDown,
  FileText
} from 'lucide-react';
import { BankAccountDetails, WithdrawalRecord, UserProfile } from '../types';
import { withdrawWalletFunds } from '../services/userService';
import { formatZAR } from '../utils/formatters';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onWithdrawalSuccess: (record: WithdrawalRecord) => void;
}

export const SA_BANKS = [
  { name: 'Capitec Bank', defaultBranch: '470010', type: 'Retail & Business' },
  { name: 'Standard Bank', defaultBranch: '051001', type: 'Commercial' },
  { name: 'First National Bank (FNB)', defaultBranch: '250655', type: 'Commercial' },
  { name: 'Nedbank', defaultBranch: '198765', type: 'Commercial' },
  { name: 'ABSA Bank', defaultBranch: '632005', type: 'Commercial' },
  { name: 'Investec Bank', defaultBranch: '580105', type: 'Private' },
  { name: 'TymeBank', defaultBranch: '678910', type: 'Digital' },
  { name: 'Discovery Bank', defaultBranch: '679000', type: 'Digital' },
  { name: 'African Bank', defaultBranch: '430000', type: 'Retail' },
  { name: 'Bidvest Bank', defaultBranch: '462005', type: 'Business' },
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onWithdrawalSuccess
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [bankName, setBankName] = useState<string>(
    userProfile.bankAccount?.bankName || 'Capitec Bank'
  );
  const [accountHolder, setAccountHolder] = useState<string>(
    userProfile.bankAccount?.accountHolder || userProfile.displayName || ''
  );
  const [accountNumber, setAccountNumber] = useState<string>(
    userProfile.bankAccount?.accountNumber || ''
  );
  const [accountType, setAccountType] = useState<'Cheque / Current' | 'Savings' | 'Transmission'>(
    userProfile.bankAccount?.accountType || 'Savings'
  );
  const [branchCode, setBranchCode] = useState<string>(
    userProfile.bankAccount?.branchCode || '470010'
  );
  const [saveDetails, setSaveDetails] = useState<boolean>(true);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedRecord, setCompletedRecord] = useState<WithdrawalRecord | null>(null);

  // Sync state when userProfile changes
  useEffect(() => {
    if (userProfile.bankAccount) {
      setBankName(userProfile.bankAccount.bankName);
      setAccountHolder(userProfile.bankAccount.accountHolder);
      setAccountNumber(userProfile.bankAccount.accountNumber);
      setAccountType(userProfile.bankAccount.accountType);
      setBranchCode(userProfile.bankAccount.branchCode);
    } else if (userProfile.displayName) {
      setAccountHolder(userProfile.displayName);
    }
  }, [userProfile]);

  if (!isOpen) return null;

  const handleBankChange = (selectedBank: string) => {
    setBankName(selectedBank);
    const found = SA_BANKS.find(b => b.name === selectedBank);
    if (found) {
      setBranchCode(found.defaultBranch);
    }
  };

  const handleQuickPercent = (pct: number) => {
    const calculated = Math.floor((userProfile.availableBalance * pct) / 100);
    setAmount(Math.max(100, calculated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount < 100) {
      setError('Minimum withdrawal amount is R100');
      return;
    }

    if (amount > userProfile.availableBalance) {
      setError(`Withdrawal amount cannot exceed available balance of ${formatZAR(userProfile.availableBalance)}`);
      return;
    }

    if (!accountNumber || accountNumber.length < 6) {
      setError('Please enter a valid South African bank account number');
      return;
    }

    if (!accountHolder.trim()) {
      setError('Please enter the bank account holder name matching your legal ID');
      return;
    }

    setLoading(true);

    const bankDetails: BankAccountDetails = {
      bankName,
      accountHolder: accountHolder.trim(),
      accountNumber: accountNumber.trim(),
      accountType,
      branchCode: branchCode.trim() || 'Default',
      isVerified: true
    };

    const res = await withdrawWalletFunds({
      userId: userProfile.uid,
      userEmail: userProfile.email,
      amount,
      bankDetails,
      saveBankDetails: saveDetails
    });

    setLoading(false);

    if (res.success && res.withdrawalRecord) {
      setCompletedRecord(res.withdrawalRecord);
      onWithdrawalSuccess(res.withdrawalRecord);
    } else {
      setError(res.error || 'Failed to process withdrawal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#161922] rounded-2xl sm:rounded-3xl border border-gray-800 shadow-2xl overflow-hidden text-gray-200 my-auto max-h-[85vh] flex flex-col">
        
        {/* Top Header decoration */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
        
        {/* Sticky Header with Title and Close Button */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-800 bg-[#0A0C10] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans leading-tight">
                Withdraw Capital to Bank
              </h2>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                Instant Real-Time EFT Payout
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close"
            id="withdraw-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedRecord ? (
          /* Success Receipt View - Scrollable */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-900/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono font-bold text-emerald-400 tracking-wider">
                EFT Payout Initiated
              </span>
              <h2 className="text-2xl font-bold text-white font-sans">
                {formatZAR(completedRecord.amount)} Withdrawn
              </h2>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Your funds have been deducted from your WeFinance wallet and dispatched to your bank via Real-Time Electronic Funds Transfer.
              </p>
            </div>

            {/* Payout Details Card */}
            <div className="p-4 rounded-2xl bg-[#0A0C10] border border-gray-800 text-left space-y-3 text-xs font-mono-num">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400 font-sans">Transaction Reference</span>
                <span className="font-bold text-blue-400 font-mono">{completedRecord.reference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-sans">Receiving Bank</span>
                <span className="text-white font-semibold">{completedRecord.bankName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-sans">Account Holder</span>
                <span className="text-white">{completedRecord.accountHolder}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-sans">Account Number</span>
                <span className="text-white font-mono">{completedRecord.accountNumberMasked}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-sans">Account Type</span>
                <span className="text-gray-300">{completedRecord.accountType}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-800 text-sm">
                <span className="text-gray-300 font-bold font-sans">Net Dispatched</span>
                <span className="font-bold text-emerald-400">{formatZAR(completedRecord.netAmount)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/30 text-left flex items-start space-x-2 text-[11px] text-blue-300">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              <span>
                Standard automated clearing times for South African banks range from instant (Capitec Pay / RTC) up to 2 hours for standard business-day EFTs.
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          /* Withdrawal Form View - Scrollable Body */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            
            {/* Wallet Balance Banner */}
            <div className="p-3.5 rounded-2xl bg-[#0A0C10] border border-gray-800 flex items-center justify-between font-mono-num">
              <div>
                <span className="text-gray-400 text-[11px] block">Available Wallet Balance</span>
                <span className="text-xl font-bold text-white">{formatZAR(userProfile.availableBalance)}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  0% Payout Fee
                </span>
                <span className="text-[10px] text-gray-500">Free Real-time EFT</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Amount Selection */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-gray-300 font-semibold">Withdrawal Amount (ZAR)</label>
                  <span className="text-[11px] text-gray-400">Min: R100</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-gray-500 text-sm">R</span>
                  <input
                    type="number"
                    min={100}
                    max={userProfile.availableBalance}
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono-num font-bold text-base focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Percentage Quick Selectors */}
                <div className="grid grid-cols-4 gap-1.5 font-mono-num text-[11px]">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className="py-1 rounded-lg bg-[#0A0C10] hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white font-medium transition-colors"
                    >
                      {pct === 100 ? 'Max (100%)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center space-x-2 text-gray-300 font-semibold border-b border-gray-800 pb-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>South African Bank Account Details</span>
                </div>

                {/* Bank Name */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[11px] block">Select Financial Institution</label>
                  <select
                    value={bankName}
                    onChange={(e) => handleBankChange(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl px-3 py-2.5 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {SA_BANKS.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Holder Name */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[11px] block">Account Holder Name (As per Bank)</label>
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="e.g. S. Dlamini"
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl px-3 py-2.5 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Account Number & Account Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-gray-400 text-[11px] block">Account Number</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 1029384756"
                      className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 text-[11px] block">Account Type</label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as any)}
                      className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl px-3 py-2.5 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="Savings">Savings Account</option>
                      <option value="Cheque / Current">Cheque / Current</option>
                      <option value="Transmission">Transmission</option>
                    </select>
                  </div>
                </div>

                {/* Branch Code */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-400 text-[11px]">Universal Branch Code</label>
                    <span className="text-[10px] text-gray-500">Auto-filled</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl px-3 py-2 text-gray-300 font-mono text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Save Details Checkbox */}
                <label className="flex items-center space-x-2 text-gray-300 text-[11px] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={saveDetails}
                    onChange={(e) => setSaveDetails(e.target.checked)}
                    className="rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Save bank details to my investor profile for future payouts</span>
                </label>
              </div>

              {/* Summary breakdown */}
              <div className="p-3 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-1.5 text-[11px] font-mono-num">
                <div className="flex justify-between text-gray-400">
                  <span>Gross Withdrawal:</span>
                  <span className="text-white font-semibold">{formatZAR(amount || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>WeFinance Processing Fee:</span>
                  <span className="text-emerald-400 font-semibold">R 0.00 (Free)</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-gray-800">
                  <span>Net Payout to Bank:</span>
                  <span className="text-emerald-400">{formatZAR(amount || 0)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || userProfile.availableBalance < 100}
                id="confirm-withdraw-button"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payout...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Confirm Withdrawal of {formatZAR(amount || 0)}</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
