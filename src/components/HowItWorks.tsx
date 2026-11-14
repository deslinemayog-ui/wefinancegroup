import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  TrendingUp, 
  UserCheck, 
  Vault,
  Sparkles,
  Smartphone,
  Users
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [roleView, setRoleView] = useState<'master-model' | 'investor' | 'borrower'>('master-model');

  const masterModelSteps = [
    {
      step: '01',
      title: 'Single Central Liquidity Fund',
      desc: 'All investor deposits enter one central 30-day liquidity fund. There are no individual pools to pick from—capital flows into a unified account.',
      icon: Vault
    },
    {
      step: '02',
      title: 'Physical Collateral Vault Escrow',
      desc: 'Credit is backed by physical assets (laptops, vehicles, smartphones, equipment) deposited into accredited escrow vaults with >160% coverage ratio.',
      icon: ShieldCheck
    },
    {
      step: '03',
      title: 'Borrower Privacy Guarantee',
      desc: 'Borrower personal details and identities are kept 100% private. Transparency is provided strictly through pledged collateral items held in vault custody.',
      icon: Lock
    },
    {
      step: '04',
      title: 'Disbursement & Dynamic Yield Settlement',
      desc: 'Upon 30-day maturity, loans are repaid and target yields are distributed directly to investor wallets for 100% free EFT bank withdrawal.',
      icon: TrendingUp
    }
  ];

  const investorSteps = [
    {
      step: '01',
      title: 'Fund Central Liquidity Account',
      desc: 'Deposit capital into your investor wallet and allocate funds directly to the central 30-day liquidity account.',
      icon: Coins
    },
    {
      step: '02',
      title: 'Inspect Vaulted Collateral Items',
      desc: 'Review the pledged collateral asset registry (e.g. iPhone 17 Pro Max, MacBook Pro M3) securing the central fund.',
      icon: Search
    },
    {
      step: '03',
      title: 'Protected in Institutional Escrow',
      desc: 'All capital is backed by physical assets stored under formal notary liens in Sandton Escrow Depository.',
      icon: Lock
    },
    {
      step: '04',
      title: 'Receive Dynamic Payouts',
      desc: 'On 30-day maturity, your principal plus dynamic target yield is credited for instant withdrawal to your South African bank account.',
      icon: TrendingUp
    }
  ];

  const borrowerSteps = [
    {
      step: '01',
      title: 'Submit Credit Request & Pledged Item',
      desc: 'Submit your 30-day credit request and describe your physical collateral item (e.g. iPhone 17 Pro Max, laptop, vehicle).',
      icon: UserCheck
    },
    {
      step: '02',
      title: 'Deposit Asset in Vault',
      desc: 'Deposit your pledged asset at Sandton Central Escrow Depository for physical inspection and serial tag verification.',
      icon: Smartphone
    },
    {
      step: '03',
      title: 'Identity Remains 100% Private',
      desc: 'Your personal name and identity are never publicly displayed. Only the collateral item is listed in the vault registry.',
      icon: Lock
    },
    {
      step: '04',
      title: 'Disbursement & Asset Reclaim',
      desc: 'Receive immediate bank payout. Settle your repayment on or before the due date to unlock and reclaim your vaulted asset.',
      icon: CheckCircle2
    }
  ];

  const currentSteps = roleView === 'master-model' 
    ? masterModelSteps 
    : roleView === 'investor' 
    ? investorSteps 
    : borrowerSteps;

  return (
    <section className="py-14 bg-[#07090E] border-b border-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold uppercase">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>TRANSPARENT COLLATERAL WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            How The Single Account Fund Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Simple 4-step workflow connecting investor capital to a single central fund backed by physical collateral held in accredited vault depots.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center">
          <div className="bg-[#161922] p-1.5 rounded-2xl border border-gray-800 flex space-x-2">
            <button
              onClick={() => setRoleView('master-model')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleView === 'master-model'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Single Fund Model
            </button>
            <button
              onClick={() => setRoleView('investor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleView === 'investor'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Investor Journey
            </button>
            <button
              onClick={() => setRoleView('borrower')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleView === 'borrower'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Borrower Journey
            </button>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {currentSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="bg-[#161922] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold font-mono text-blue-500">{s.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white font-sans leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-800/60 flex items-center space-x-1 text-[11px] text-blue-400 font-mono font-semibold">
                  <span>Step {idx + 1} of 4</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
