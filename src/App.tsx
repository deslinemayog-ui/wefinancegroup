import React, { useState, useEffect } from 'react';
import { Navbar, NavigationTab } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlatformStats } from './components/PlatformStats';
import { Marketplace } from './components/Marketplace';
import { HowItWorks } from './components/HowItWorks';
import { CollateralCustody } from './components/CollateralCustody';
import { BorrowerSection } from './components/BorrowerSection';
import { EconomicsAndFees } from './components/EconomicsAndFees';
import { SecurityArchitecture } from './components/SecurityArchitecture';
import { InvestorDashboard } from './components/InvestorDashboard';
import { BorrowerDashboard } from './components/BorrowerDashboard';
import { BorrowerApplicationModal } from './components/BorrowerApplicationModal';
import { PoolDetailModal } from './components/PoolDetailModal';
import { InvestSuccessModal } from './components/InvestSuccessModal';
import { AuthModal } from './components/AuthModal';
import { WithdrawModal } from './components/WithdrawModal';
import { DepositModal } from './components/DepositModal';
import { ProfileModal } from './components/ProfileModal';
import { LegalCenter } from './components/LegalCenter';
import { TermsAndConditions } from './components/TermsAndConditions';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { 
  InvestmentFund, 
  UserInvestmentRecord, 
  UserProfile, 
  WithdrawalRecord, 
  WalletTransaction,
  UserLoanRecord
} from './types';
import { subscribeToInvestmentFund, INITIAL_INVESTMENT_FUND } from './services/loanService';
import { onAuthChange, signOutUser } from './services/authService';
import { 
  subscribeToUserProfile, 
  subscribeToUserWithdrawals, 
  subscribeToUserTransactions, 
  subscribeToUserInvestments,
  subscribeToUserLoans
} from './services/userService';
import { executePayFastDeposit, DEFAULT_PAYFAST_MERCHANT_ID } from './services/payfastService';
import { ShieldCheck, Lock, TrendingUp, Heart, ChevronRight, CheckCircle2, X, Scale, FileText } from 'lucide-react';

export function getTabFromPath(path: string): NavigationTab {
  const cleanPath = (path || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (cleanPath === '/privacy' || cleanPath === '/privacy-policy' || cleanPath === '/popia') {
    return 'privacy-policy';
  }
  if (cleanPath === '/terms' || cleanPath === '/terms-and-conditions' || cleanPath === '/tnc' || cleanPath === '/terms-of-service') {
    return 'terms-conditions';
  }
  if (cleanPath === '/legal') {
    return 'legal';
  }
  if (cleanPath === '/investor' || cleanPath === '/investor-dashboard') {
    return 'investor-dashboard';
  }
  if (cleanPath === '/borrower' || cleanPath === '/borrower-dashboard') {
    return 'borrower-dashboard';
  }
  if (cleanPath === '/how-it-works') {
    return 'how-it-works';
  }
  if (cleanPath === '/collateral-custody' || cleanPath === '/custody' || cleanPath === '/escrow') {
    return 'collateral-custody';
  }
  if (cleanPath === '/economics' || cleanPath === '/fees') {
    return 'economics';
  }
  return 'marketplace';
}

export function getPathFromTab(tab: NavigationTab): string {
  switch (tab) {
    case 'privacy-policy':
      return '/privacy';
    case 'terms-conditions':
      return '/terms';
    case 'legal':
      return '/legal';
    case 'investor-dashboard':
      return '/investor';
    case 'borrower-dashboard':
      return '/borrower';
    case 'how-it-works':
      return '/how-it-works';
    case 'collateral-custody':
      return '/collateral-custody';
    case 'economics':
      return '/economics';
    case 'marketplace':
    default:
      return '/';
  }
}

export default function App() {
  // Navigation tab state with initial path support (e.g. /privacy, /terms)
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => getTabFromPath(window.location.pathname));

  // Sync tab navigation with browser history
  const handleNavigate = (newTab: NavigationTab) => {
    setActiveTab(newTab);
    const targetPath = getPathFromTab(newTab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: newTab }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const onPopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      setActiveTab(tab);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Update document title based on active view
  useEffect(() => {
    if (activeTab === 'privacy-policy') {
      document.title = 'Privacy Policy & POPIA | WeFinance Group';
    } else if (activeTab === 'terms-conditions') {
      document.title = 'Terms & Conditions of Service | WeFinance Group';
    } else if (activeTab === 'legal') {
      document.title = 'Legal Center & Compliance | WeFinance Group';
    } else if (activeTab === 'investor-dashboard') {
      document.title = 'Investor Portal & Liquidity Dashboard | WeFinance Group';
    } else if (activeTab === 'borrower-dashboard') {
      document.title = 'Borrower Credit & Vault Tracker | WeFinance Group';
    } else {
      document.title = 'WeFinance Group | Secured Peer-to-Peer Lending Marketplace';
    }
  }, [activeTab]);

  // Single central fund state
  const [fund, setFund] = useState<InvestmentFund>(INITIAL_INVESTMENT_FUND);
  const [isLoadingFund, setIsLoadingFund] = useState<boolean>(true);

  // Authentication & User Profile state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userWithdrawals, setUserWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [userTransactions, setUserTransactions] = useState<WalletTransaction[]>([]);
  const [userInvestments, setUserInvestments] = useState<UserInvestmentRecord[]>([]);
  const [userLoans, setUserLoans] = useState<UserLoanRecord[]>([]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isBorrowerModalOpen, setIsBorrowerModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Fund investment modal state
  const [selectedPool, setSelectedPool] = useState<InvestmentFund | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Investment success modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [lastInvestedPool, setLastInvestedPool] = useState<InvestmentFund | null>(null);
  const [lastInvestedAmount, setLastInvestedAmount] = useState<number>(0);
  const [lastExpectedReturn, setLastExpectedReturn] = useState<number>(0);

  // PayFast Notification State
  const [payFastNotification, setPayFastNotification] = useState<string | null>(null);

  // Handle PayFast Return Redirects
  useEffect(() => {
    if (!currentUser?.uid) return;
    const params = new URLSearchParams(window.location.search);
    const payfastStatus = params.get('payfast_status');
    const amountStr = params.get('amount');
    const paymentId = params.get('m_payment_id');
    const merchantId = params.get('merchant_id') || DEFAULT_PAYFAST_MERCHANT_ID;

    if (payfastStatus === 'success' && amountStr) {
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        executePayFastDeposit({
          userId: currentUser.uid,
          amount,
          merchantId,
          reference: paymentId || undefined
        })
          .then((res) => {
            if (res.success) {
              setPayFastNotification(`PayFast deposit of R${amount.toLocaleString()} confirmed! Funds credited to your investment wallet.`);
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch((err) => {
            console.error('Error settling PayFast deposit:', err);
          });
      }
    } else if (payfastStatus === 'cancelled') {
      setPayFastNotification('PayFast payment was cancelled. Your wallet was not charged.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser?.uid]);

  // 1. Subscribe to Live Central Investment Fund
  useEffect(() => {
    setIsLoadingFund(true);
    const unsubscribeFund = subscribeToInvestmentFund((updatedFund) => {
      setFund(updatedFund);
      setIsLoadingFund(false);
      setSelectedPool((prev) => prev ? updatedFund : null);
    });

    return () => unsubscribeFund();
  }, []);

  // 2. Subscribe to Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthChange((user) => {
      setCurrentUser(user);
      if (!user) {
        setUserProfile(null);
        setUserWithdrawals([]);
        setUserTransactions([]);
        setUserInvestments([]);
        setUserLoans([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 3. Subscribe to User Profile & Subcollections
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubs: (() => void)[] = [];

    unsubs.push(
      subscribeToUserProfile(currentUser.uid, (profile) => {
        setUserProfile(profile);
      })
    );

    unsubs.push(
      subscribeToUserWithdrawals(currentUser.uid, (withdrawals) => {
        setUserWithdrawals(withdrawals);
      })
    );

    unsubs.push(
      subscribeToUserTransactions(currentUser.uid, (txs) => {
        setUserTransactions(txs);
      })
    );

    unsubs.push(
      subscribeToUserInvestments(currentUser.uid, (investments) => {
        setUserInvestments(investments);
      })
    );

    unsubs.push(
      subscribeToUserLoans(currentUser.uid, (loans) => {
        setUserLoans(loans);
      })
    );

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [currentUser?.uid]);

  // Handlers
  const handleQuickInvest = (f: InvestmentFund) => {
    setSelectedPool(f || fund);
    setIsDetailModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUserProfile(null);
    setUserWithdrawals([]);
    setUserTransactions([]);
    setUserInvestments([]);
    setUserLoans([]);
  };

  const handleOpenDeposit = () => {
    if (!currentUser) {
      handleOpenAuth('login');
    } else {
      setIsDepositModalOpen(true);
    }
  };

  const handleOpenWithdraw = () => {
    if (!currentUser) {
      handleOpenAuth('login');
    } else {
      setIsWithdrawModalOpen(true);
    }
  };

  const handleInvestSuccess = (updatedFund: InvestmentFund, amount: number, returnYield: number) => {
    setLastInvestedPool(updatedFund);
    setLastInvestedAmount(amount);
    setLastExpectedReturn(returnYield);
    setIsDetailModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const userBalance = userProfile?.availableBalance || 0;

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-100 flex flex-col selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenBorrowerModal={() => setIsBorrowerModalOpen(true)}
        onQuickInvestClick={() => handleQuickInvest(fund)}
        userAvailableBalance={userBalance}
        openPoolsCount={1}
        userProfile={userProfile}
        onOpenAuthModal={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* PayFast Notification Toast */}
      {payFastNotification && (
        <div className="bg-gradient-to-r from-red-600 via-emerald-600 to-blue-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-16 z-40 animate-fade-in">
          <div className="flex items-center space-x-2 mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{payFastNotification}</span>
          </div>
          <button
            onClick={() => setPayFastNotification(null)}
            className="p-1 text-white/80 hover:text-white rounded-md hover:bg-black/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-grow">
        {activeTab === 'marketplace' && (
          <>
            <Hero
              onExploreMarketplace={() => {
                const el = document.getElementById('marketplace-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenBorrowerModal={() => setIsBorrowerModalOpen(true)}
            />

            <Marketplace
              fund={fund}
              pools={[fund]}
              onSelectPool={() => handleQuickInvest(fund)}
              onQuickInvest={handleQuickInvest}
              onOpenBorrowerModal={() => setIsBorrowerModalOpen(true)}
            />

            <PlatformStats />
            <HowItWorks />
            <CollateralCustody />
            <BorrowerSection
              onOpenApplicationModal={() => setIsBorrowerModalOpen(true)}
              onGoToBorrowerDashboard={() => handleNavigate('borrower-dashboard')}
            />
            <EconomicsAndFees />
            <SecurityArchitecture />
          </>
        )}

        {activeTab === 'investor-dashboard' && (
          <InvestorDashboard
            userProfile={userProfile}
            userInvestments={userInvestments}
            withdrawals={userWithdrawals}
            transactions={userTransactions}
            allPools={[fund]}
            onOpenDepositModal={handleOpenDeposit}
            onOpenWithdrawModal={handleOpenWithdraw}
            onOpenAuthModal={() => handleOpenAuth('login')}
            onExplorePools={() => handleNavigate('marketplace')}
            onSelectPool={() => handleQuickInvest(fund)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'borrower-dashboard' && (
          <BorrowerDashboard
            userLoanPools={[fund]}
            userLoans={userLoans}
            userProfile={userProfile}
            onOpenBorrowerModal={() => setIsBorrowerModalOpen(true)}
            onExploreMarketplace={() => handleNavigate('marketplace')}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'how-it-works' && <HowItWorks />}
        {activeTab === 'economics' && <EconomicsAndFees />}
        {activeTab === 'collateral-custody' && <CollateralCustody />}

        {activeTab === 'terms-conditions' && (
          <LegalCenter
            initialTab="terms"
            onBackToMarketplace={() => handleNavigate('marketplace')}
            onTabChange={(tab) => handleNavigate(tab === 'privacy' ? 'privacy-policy' : 'terms-conditions')}
          />
        )}

        {activeTab === 'privacy-policy' && (
          <LegalCenter
            initialTab="privacy"
            onBackToMarketplace={() => handleNavigate('marketplace')}
            onTabChange={(tab) => handleNavigate(tab === 'privacy' ? 'privacy-policy' : 'terms-conditions')}
          />
        )}

        {activeTab === 'legal' && (
          <LegalCenter
            initialTab="terms"
            onBackToMarketplace={() => handleNavigate('marketplace')}
            onTabChange={(tab) => handleNavigate(tab === 'privacy' ? 'privacy-policy' : 'terms-conditions')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0C10] border-t border-gray-800 pt-12 pb-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/20">
                  W
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  WEFINANCE <span className="text-blue-500 font-medium text-xs">GROUP</span>
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                South Africa's secured peer lending marketplace. Single central investment account backed by 100% physical escrow collateral. Borrower identities remain strictly confidential.
              </p>
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Vault Collateral Backed Mandate</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold block text-xs uppercase tracking-widest">
                Single Account Model
              </span>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('marketplace')}>
                  • Central 30-Day Liquidity Fund
                </li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('collateral-custody')}>
                  • Escrow Vault Collateral Registry
                </li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('how-it-works')}>
                  • Dynamic Yield Settlement
                </li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('economics')}>
                  • Fee Schedule & Economics
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold block text-xs uppercase tracking-widest">
                User Portals & Banking
              </span>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('investor-dashboard')}>
                  • Investor Portfolio & Bank Withdrawals
                </li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavigate('borrower-dashboard')}>
                  • Borrower Collateral Tracker
                </li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setIsBorrowerModalOpen(true)}>
                  • Pledge Collateral for Credit
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-white font-bold block text-xs uppercase tracking-widest">
                Legal & Compliance (SA)
              </span>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors flex items-center space-x-1" onClick={() => handleNavigate('terms-conditions')}>
                  <Scale className="w-3 h-3 text-purple-400" />
                  <span>• Terms & Conditions of Service</span>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors flex items-center space-x-1" onClick={() => handleNavigate('privacy-policy')}>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>• Privacy Policy (POPIA Act No. 4)</span>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors flex items-center space-x-1" onClick={() => handleNavigate('collateral-custody')}>
                  <Lock className="w-3 h-3 text-blue-400" />
                  <span>• Escrow Custody Lien Mandate</span>
                </li>
              </ul>
              <div className="pt-2 text-[11px] text-gray-400">
                • <strong className="text-gray-300">Sandton Vault:</strong> Sandton Central Depository<br />
                • <strong className="text-gray-300">Cape Town Vault:</strong> Harbor Vault Depot
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 text-[11px] text-gray-400 leading-relaxed space-y-2">
            <p>
              <strong className="text-gray-300">Regulatory Compliance:</strong> WeFinance Group (Pty) Ltd (Reg. 2024/123456/07). All investments fund a central secured liquidity account backed by physical collateral liens in accredited depositories. Borrower identities remain strictly confidential under POPIA Act No. 4 of 2013. National Credit Act (NCA) and FICA compliant. All monetary figures in South African Rand (ZAR).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 pt-2 border-t border-gray-800/60 gap-2">
            <span>© {new Date().getFullYear()} WeFinance Group (Pty) Ltd. All rights reserved.</span>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavigate('terms-conditions')}
                className="hover:text-gray-300 underline cursor-pointer transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleNavigate('privacy-policy')}
                className="hover:text-gray-300 underline cursor-pointer transition-colors"
              >
                Privacy Policy (POPIA)
              </button>
              <a 
                href="mailto:legal@wefinance.co.za" 
                className="hover:text-gray-300 underline transition-colors"
              >
                Legal Inquiries
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={(profile) => {
          setUserProfile(profile);
          setIsAuthModalOpen(false);
        }}
      />

      {userProfile && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          userProfile={userProfile}
          onWithdrawalSuccess={(newBalance) => {
            setUserProfile((prev) => prev ? { ...prev, availableBalance: newBalance } : null);
          }}
        />
      )}

      {userProfile && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          userProfile={userProfile}
          onDepositSuccess={(newBalance) => {
            setUserProfile((prev) => prev ? { ...prev, availableBalance: newBalance } : null);
          }}
        />
      )}

      {userProfile && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userProfile={userProfile}
          onProfileUpdated={(updatedProfile) => {
            setUserProfile(updatedProfile);
          }}
        />
      )}

      <BorrowerApplicationModal
        isOpen={isBorrowerModalOpen}
        onClose={() => setIsBorrowerModalOpen(false)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userProfile={userProfile}
        onApplicationSuccess={(updatedFund) => {
          setFund(updatedFund);
          setActiveTab('borrower-dashboard');
        }}
      />

      <PoolDetailModal
        pool={selectedPool || fund}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPool(null);
        }}
        userBalance={userBalance}
        userProfile={userProfile}
        onInvestSuccess={handleInvestSuccess}
        onOpenDepositModal={handleOpenDeposit}
        onOpenAuthModal={() => handleOpenAuth('login')}
      />

      <InvestSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        pool={lastInvestedPool || fund}
        investedAmount={lastInvestedAmount}
        expectedReturn={lastExpectedReturn}
        onGoToDashboard={() => setActiveTab('investor-dashboard')}
      />

    </div>
  );
}
