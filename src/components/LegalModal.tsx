import React, { useState } from 'react';
import { X, Scale, ShieldCheck, ArrowLeft, Printer } from 'lucide-react';
import { TermsAndConditions } from './TermsAndConditions';
import { PrivacyPolicy } from './PrivacyPolicy';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms'
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0E1118] rounded-2xl sm:rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-gray-800 bg-[#0A0C10] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex p-1 bg-[#161922] border border-gray-800 rounded-xl">
              <button
                onClick={() => setActiveTab('terms')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'terms'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Terms & Conditions</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#161922] border border-gray-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#07090E]">
          {activeTab === 'terms' ? (
            <TermsAndConditions
              onGoToPrivacyPolicy={() => setActiveTab('privacy')}
              onClose={onClose}
            />
          ) : (
            <PrivacyPolicy
              onGoToTerms={() => setActiveTab('terms')}
              onClose={onClose}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-800 bg-[#0A0C10] flex items-center justify-between text-xs text-gray-400 shrink-0">
          <span>WeFinance Group (Pty) Ltd • South African Secured Escrow Lending</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
