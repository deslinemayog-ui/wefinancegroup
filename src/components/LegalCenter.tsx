import React, { useState, useEffect } from 'react';
import { Scale, ShieldCheck, ArrowLeft, FileText, Lock } from 'lucide-react';
import { TermsAndConditions } from './TermsAndConditions';
import { PrivacyPolicy } from './PrivacyPolicy';

interface LegalCenterProps {
  initialTab?: 'terms' | 'privacy';
  onBackToMarketplace: () => void;
  onTabChange?: (tab: 'terms' | 'privacy') => void;
}

export const LegalCenter: React.FC<LegalCenterProps> = ({
  initialTab = 'terms',
  onBackToMarketplace,
  onTabChange
}) => {
  const [currentLegalTab, setCurrentLegalTab] = useState<'terms' | 'privacy'>(initialTab);

  useEffect(() => {
    setCurrentLegalTab(initialTab);
  }, [initialTab]);

  const handleSelectTab = (tab: 'terms' | 'privacy') => {
    setCurrentLegalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    } else {
      const targetPath = tab === 'privacy' ? '/privacy' : '/terms';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  return (
    <div className="bg-[#07090E] min-h-screen">
      {/* Top Banner & Tab Controls */}
      <div className="bg-[#0A0C10] border-b border-gray-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            onClick={onBackToMarketplace}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer self-start sm:self-auto group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Marketplace</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-[#161922] border border-gray-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => handleSelectTab('terms')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                currentLegalTab === 'terms'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Terms & Conditions</span>
            </button>

            <button
              onClick={() => handleSelectTab('privacy')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                currentLegalTab === 'privacy'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Policy (POPIA)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-[11px] text-gray-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>NCR & POPIA Compliant</span>
          </div>

        </div>
      </div>

      {/* Content Rendering */}
      <div>
        {currentLegalTab === 'terms' ? (
          <TermsAndConditions
            onGoToPrivacyPolicy={() => handleSelectTab('privacy')}
          />
        ) : (
          <PrivacyPolicy
            onGoToTerms={() => handleSelectTab('terms')}
          />
        )}
      </div>
    </div>
  );
};
