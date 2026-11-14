import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Vault, 
  Lock, 
  ArrowUpRight, 
  Menu, 
  X, 
  BarChart3, 
  FileCheck2, 
  Scale, 
  UserCheck,
  Briefcase,
  ChevronRight,
  Wallet,
  Sparkles,
  Coins,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavigationTab = 
  | 'marketplace' 
  | 'investor-dashboard' 
  | 'borrower-dashboard' 
  | 'collateral-custody' 
  | 'how-it-works' 
  | 'economics'
  | 'terms-conditions'
  | 'privacy-policy'
  | 'legal';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBorrowerModal: () => void;
  onQuickInvestClick: () => void;
  userAvailableBalance: number;
  openPoolsCount: number;
  userProfile: UserProfile | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onSignOut: () => void;
  onOpenProfileModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBorrowerModal,
  onQuickInvestClick,
  userAvailableBalance,
  openPoolsCount,
  userProfile,
  onOpenAuthModal,
  onSignOut,
  onOpenProfileModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const navItems: NavItem[] = [
    { id: 'marketplace', label: 'Marketplace Fund', icon: Vault },
    { id: 'investor-dashboard', label: 'Investor Portal', icon: BarChart3 },
    { id: 'borrower-dashboard', label: 'Borrower Portal', icon: UserCheck },
    { id: 'how-it-works', label: 'How It Works', icon: FileCheck2 },
    { id: 'collateral-custody', label: 'Escrow Custody', icon: ShieldCheck },
    { id: 'economics', label: 'Economics', icon: Scale },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0A0C10]/95 backdrop-blur-md">
      {/* Top Real-time Ticker */}
      <div className="hidden lg:flex items-center justify-between border-b border-gray-800/80 bg-[#0A0C10] px-6 py-1.5 text-[11px] text-gray-400 font-mono-num">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-gray-200">INSTITUTIONAL SETTLEMENT ACTIVE</span>
          </div>
          <span className="text-gray-700">|</span>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Model:</span>
            <span className="text-blue-400 font-semibold">Single Central Liquidity Fund</span>
          </div>
          <span className="text-gray-700">|</span>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Custody:</span>
            <span className="text-emerald-400 font-semibold">100% Physical Vault Collateral Backed</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-gray-400">
          <span className="flex items-center text-gray-300">
            <Lock className="w-3 h-3 text-blue-500 mr-1" />
            Bank Payouts via Real-Time EFT
          </span>
          <span className="text-gray-700">|</span>
          <span className="text-gray-300 font-medium">South Africa (ZAR)</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('marketplace')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              W
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight font-sans block leading-none">
                WEFINANCE <span className="text-blue-500 text-xs font-semibold">GROUP</span>
              </span>
              
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Quick Invest CTA */}
            <button
              onClick={onQuickInvestClick}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center space-x-1"
            >
              <span>Invest Capital</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* User Profile or Sign In */}
            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#161922] border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left font-mono-num text-xs">
                    <span className="text-gray-200 font-sans font-semibold block text-[11px] truncate max-w-[100px]">
                      {userProfile.displayName}
                    </span>
                    <span className="text-emerald-400 font-bold text-[11px] block">
                      R{userAvailableBalance.toLocaleString()}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#161922] border border-gray-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-xs">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveTab('investor-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/60 flex items-center space-x-2 cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span>Investor Portal</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveTab('borrower-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/60 flex items-center space-x-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Borrower Portal</span>
                    </button>

                    {onOpenProfileModal && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenProfileModal();
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/60 flex items-center space-x-2 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        <span>Profile & Address</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveTab('terms-conditions');
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/60 flex items-center space-x-2 cursor-pointer"
                    >
                      <Scale className="w-4 h-4 text-purple-400" />
                      <span>Legal & Terms</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveTab('privacy-policy');
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/60 flex items-center space-x-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Privacy Policy (POPIA)</span>
                    </button>

                    <div className="my-1 border-t border-gray-800" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-950/30 flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-4 py-2 rounded-xl bg-[#161922] hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0A0C10] p-4 space-y-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left flex items-center space-x-2 ${
                    activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="my-2 border-t border-gray-800/80" />

            <button
              onClick={() => {
                setActiveTab('terms-conditions');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left flex items-center space-x-2 ${
                activeTab === 'terms-conditions' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Scale className="w-4 h-4 text-purple-400" />
              <span>Terms & Conditions</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('privacy-policy');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left flex items-center space-x-2 ${
                activeTab === 'privacy-policy' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy Policy (POPIA)</span>
            </button>
          </nav>

          <div className="pt-3 border-t border-gray-800 space-y-2">
            {!userProfile ? (
              <button
                onClick={() => {
                  onOpenAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                Sign In / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-red-950/40 border border-red-800 text-red-400 font-bold text-xs rounded-xl"
              >
                Sign Out ({userProfile.displayName})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
