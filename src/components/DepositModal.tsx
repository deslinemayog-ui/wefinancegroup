import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  ArrowRight,
  ExternalLink,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { depositWalletFunds } from '../services/userService';
import { 
  submitPayFastGatewayForm, 
  executePayFastDeposit,
  DEFAULT_PAYFAST_MERCHANT_ID
} from '../services/payfastService';
import { formatZAR } from '../utils/formatters';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onDepositSuccess: (newBalance: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onDepositSuccess
}) => {
  const [amount, setAmount] = useState<number>(2500);
  const [method, setMethod] = useState<'payfast' | 'instant_eft' | 'card' | 'bank_transfer'>('payfast');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [depositedAmount, setDepositedAmount] = useState<number>(0);
  const [usedMethodName, setUsedMethodName] = useState<string>('');

  // PayFast Merchant ID (Static - WeFinance Group: 15759218)
  const merchantId = DEFAULT_PAYFAST_MERCHANT_ID;
  const [payFastGatewayLaunched, setPayFastGatewayLaunched] = useState<boolean>(false);
  const [payFastReference, setPayFastReference] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPayFastGatewayLaunched(false);
      setPayFastReference('');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayFastGatewayLaunch = () => {
    if (amount < 50) {
      setError('Minimum deposit amount is R50');
      return;
    }
    setError(null);
    try {
      const result = submitPayFastGatewayForm({
        userId: userProfile.uid,
        userEmail: userProfile.email,
        userName: userProfile.displayName,
        amount,
        merchantId
      });
      setPayFastReference(result.reference);
      setPayFastGatewayLaunched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize PayFast redirect');
    }
  };

  const handleCompletePayFastDeposit = async () => {
    if (amount < 50) {
      setError('Minimum deposit amount is R50');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await executePayFastDeposit({
      userId: userProfile.uid,
      amount,
      merchantId,
      reference: payFastReference
    });

    setLoading(false);

    if (res.success && res.newBalance !== undefined) {
      setDepositedAmount(amount);
      setUsedMethodName('PayFast Gateway');
      setSuccess(true);
      onDepositSuccess(res.newBalance);
    } else {
      setError(res.error || 'Failed to credit PayFast deposit');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount < 50) {
      setError('Minimum deposit amount is R50');
      return;
    }

    if (method === 'payfast') {
      await handleCompletePayFastDeposit();
      return;
    }

    setLoading(true);

    const methodName = 
      method === 'instant_eft' 
        ? 'Instant EFT (Capitec Pay / Ozow)' 
        : method === 'card' 
        ? 'Debit / Credit Card (Visa / Mastercard)' 
        : 'Direct Bank EFT';

    const res = await depositWalletFunds(userProfile.uid, amount, methodName);

    setLoading(false);

    if (res.success && res.newBalance !== undefined) {
      setDepositedAmount(amount);
      setUsedMethodName(methodName);
      setSuccess(true);
      onDepositSuccess(res.newBalance);
    } else {
      setError(res.error || 'Failed to deposit funds');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#161922] rounded-2xl sm:rounded-3xl border border-gray-800 shadow-2xl overflow-hidden text-gray-200 my-auto max-h-[85vh] flex flex-col">
        
        {/* Top Gradient Banner */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-red-600 via-blue-600 to-emerald-500" />
        
        {/* Sticky Header with Title and Close Button */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-800 bg-[#0A0C10] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans leading-tight">
                Deposit Capital (ZAR)
              </h2>
              <span className="text-[10px] text-gray-400 font-mono">
                Secure Escrow Top-Up • PayFast & Real-time EFT
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close"
            id="deposit-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success Receipt View - Scrollable */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-900/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono font-bold text-emerald-400 tracking-wider">
                Deposit Confirmed & Available
              </span>
              <h2 className="text-2xl font-bold text-white font-sans">
                {formatZAR(depositedAmount)} Added
              </h2>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Your funds have been credited to your verified investor wallet. You can immediately participate in active loan pools.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0C10] border border-gray-800 text-left space-y-2.5 text-xs font-mono-num">
              <div className="flex justify-between items-center text-gray-400 font-sans pb-2 border-b border-gray-800">
                <span>Updated Available Balance</span>
                <span className="font-bold text-emerald-400 text-sm font-mono-num">{formatZAR(userProfile.availableBalance)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 font-sans">
                <span>Deposit Gateway</span>
                <span className="text-white font-mono text-[11px] truncate max-w-[200px]">{usedMethodName}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 font-sans">
                <span>Settlement Status</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Instant Live Credit
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Done & Explore Loan Pools
            </button>
          </div>
        ) : (
          /* Deposit Form View - Scrollable Body */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-gray-300 font-semibold block">Select Deposit Method</label>
                  <span className="text-[10px] text-gray-400">South African Gateways</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* PayFast Button */}
                  <button
                    type="button"
                    onClick={() => setMethod('payfast')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      method === 'payfast'
                        ? 'border-red-500 bg-red-950/30 text-white ring-1 ring-red-500/50'
                        : 'border-gray-800 bg-[#0A0C10] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black tracking-tight text-red-400 font-sans">PayFast</span>
                      <span className="px-1 py-0.2 text-[8px] font-bold uppercase rounded bg-red-500/20 text-red-300">
                        SA #1
                      </span>
                    </div>
                    <div className="font-bold text-[11px] text-white">PayFast Gateway</div>
                    <div className="text-[9px] text-gray-400 truncate">EFT, Card, Capitec</div>
                  </button>

                  {/* Instant EFT Button */}
                  <button
                    type="button"
                    onClick={() => setMethod('instant_eft')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      method === 'instant_eft'
                        ? 'border-blue-500 bg-blue-950/30 text-white'
                        : 'border-gray-800 bg-[#0A0C10] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-400 mb-1" />
                    <div className="font-bold text-[11px]">Instant EFT</div>
                    <div className="text-[9px] text-gray-500">Ozow / RTC</div>
                  </button>

                  {/* Card Button */}
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      method === 'card'
                        ? 'border-blue-500 bg-blue-950/30 text-white'
                        : 'border-gray-800 bg-[#0A0C10] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-400 mb-1" />
                    <div className="font-bold text-[11px]">Bank Card</div>
                    <div className="text-[9px] text-gray-500">Visa / MC 3DS</div>
                  </button>

                  {/* Bank Transfer Button */}
                  <button
                    type="button"
                    onClick={() => setMethod('bank_transfer')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      method === 'bank_transfer'
                        ? 'border-blue-500 bg-blue-950/30 text-white'
                        : 'border-gray-800 bg-[#0A0C10] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-400 mb-1" />
                    <div className="font-bold text-[11px]">Direct EFT</div>
                    <div className="text-[9px] text-gray-500">Manual Wire</div>
                  </button>
                </div>
              </div>

              {/* PayFast Dedicated Gateway Details */}
              {method === 'payfast' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/20 via-[#0A0C10] to-gray-900/40 border border-red-900/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center text-white font-black text-[10px]">
                        PF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <span>PayFast South Africa</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Verified Merchant
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          Instant EFT • Capitec Pay • Cards • SnapScan • Zapper
                        </span>
                      </div>
                    </div>
                  </div>



                  {/* PayFast Channels Badges */}
                  <div className="flex flex-wrap gap-1 text-[9px] text-gray-300">
                    <span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700">⚡ Capitec Pay</span>
                    <span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700">🏦 Instant EFT (RTC)</span>
                    <span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700">💳 Visa & Mastercard</span>
                    <span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700">📱 SnapScan & Zapper</span>
                  </div>

                  {/* Single Live PayFast Action */}
                  <button
                    type="button"
                    onClick={handlePayFastGatewayLaunch}
                    disabled={loading || amount < 50}
                    className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open PayFast Live Checkout</span>
                  </button>

                  {payFastGatewayLaunched && (
                    <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[10px] text-blue-300 space-y-1">
                      <p className="font-semibold text-white">PayFast checkout opened in new tab!</p>
                      <p>
                        Once your payment completes on PayFast, your wallet will automatically receive the capital.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Amount Selection */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-gray-300 font-semibold block">Deposit Amount (ZAR)</label>
                  <span className="text-[10px] text-gray-400">Min: R50</span>
                </div>
                
                <div className="grid grid-cols-4 gap-1.5 mb-2 font-mono-num text-[11px]">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                        amount === amt
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-[#0A0C10] text-gray-300 border-gray-800 hover:bg-gray-800'
                      }`}
                    >
                      R {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-gray-500 text-sm">R</span>
                  <input
                    type="number"
                    min={50}
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl pl-8 pr-4 py-2.5 text-blue-400 font-mono-num font-bold text-base focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Escrow Guarantee Note */}
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/30 text-[11px] text-blue-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <span>
                  All investor capital is held in segregated escrow accounts governed by South African banking standards and secured by real physical collateral.
                </span>
              </div>

              {/* Submit CTA - Only for non-PayFast methods */}
              {method !== 'payfast' && (
                <button
                  type="submit"
                  disabled={loading || amount < 50}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Deposit...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Deposit {formatZAR(amount || 0)}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
};