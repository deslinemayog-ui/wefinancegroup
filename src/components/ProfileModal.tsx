import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Building, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Sparkles,
  Upload,
  FileText,
  Loader2
} from 'lucide-react';
import { UserProfile, BankAccountDetails, UserAddress } from '../types';
import { updateUserProfile } from '../services/userService';
import { uploadMediaFile } from '../services/storageService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onProfileUpdated?: (updated: UserProfile) => void;
}

const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape'
];

const SA_BANKS = [
  'Standard Bank',
  'First National Bank (FNB)',
  'Absa Bank',
  'Nedbank',
  'Capitec Bank',
  'Investec',
  'TymeBank',
  'African Bank',
  'Discovery Bank'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdated
}) => {
  // Personal Details
  const [fullName, setFullName] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  
  // Address
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [province, setProvince] = useState<string>('Gauteng');
  const [postalCode, setPostalCode] = useState<string>('');

  // Bank Details
  const [bankName, setBankName] = useState<string>('Standard Bank');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('Cheque / Current');
  const [branchCode, setBranchCode] = useState<string>('051001');

  // KYC Document Attachments
  const [idDocumentUrl, setIdDocumentUrl] = useState<string>(userProfile?.idDocumentUrl || '');
  const [idDocumentName, setIdDocumentName] = useState<string>(userProfile?.idDocumentName || '');
  const [proofOfResidenceUrl, setProofOfResidenceUrl] = useState<string>(userProfile?.proofOfResidenceUrl || '');
  const [proofOfResidenceName, setProofOfResidenceName] = useState<string>(userProfile?.proofOfResidenceName || '');
  
  const [isUploadingId, setIsUploadingId] = useState<boolean>(false);
  const [isUploadingProof, setIsUploadingProof] = useState<boolean>(false);

  // Status
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync with existing profile
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || userProfile.displayName || '');
      setDisplayName(userProfile.displayName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setIdNumber(userProfile.idNumber || '');
      setIdDocumentUrl(userProfile.idDocumentUrl || '');
      setIdDocumentName(userProfile.idDocumentName || '');
      setProofOfResidenceUrl(userProfile.proofOfResidenceUrl || '');
      setProofOfResidenceName(userProfile.proofOfResidenceName || '');

      if (userProfile.address) {
        setStreet(userProfile.address.street || '');
        setCity(userProfile.address.city || '');
        setProvince(userProfile.address.province || 'Gauteng');
        setPostalCode(userProfile.address.postalCode || '');
      }

      if (userProfile.bankAccount) {
        setBankName(userProfile.bankAccount.bankName || 'Standard Bank');
        setAccountHolder(userProfile.bankAccount.accountHolder || userProfile.fullName || '');
        setAccountNumber(userProfile.bankAccount.accountNumber || '');
        setAccountType(userProfile.bankAccount.accountType || 'Cheque / Current');
        setBranchCode(userProfile.bankAccount.branchCode || '051001');
      }
    }
  }, [userProfile]);

  if (!isOpen) return null;

  const handleIdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile?.uid) return;
    setIsUploadingId(true);
    try {
      const path = `kyc/${userProfile.uid}/id_document_${Date.now()}_${file.name}`;
      const url = await uploadMediaFile(path, file);
      setIdDocumentUrl(url);
      setIdDocumentName(file.name);
    } catch (err: any) {
      setErrorMessage('Failed to upload ID document. Please try again.');
    } finally {
      setIsUploadingId(false);
    }
  };

  const handleProofFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile?.uid) return;
    setIsUploadingProof(true);
    try {
      const path = `kyc/${userProfile.uid}/proof_of_residence_${Date.now()}_${file.name}`;
      const url = await uploadMediaFile(path, file);
      setProofOfResidenceUrl(url);
      setProofOfResidenceName(file.name);
    } catch (err: any) {
      setErrorMessage('Failed to upload Proof of Residence. Please try again.');
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.uid) {
      setErrorMessage('You must be signed in to save your profile.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full legal name.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    const addressData: UserAddress = {
      street: street.trim(),
      city: city.trim(),
      province: province.trim(),
      postalCode: postalCode.trim()
    };

    const bankData: BankAccountDetails = {
      bankName,
      accountHolder: accountHolder.trim() || fullName.trim(),
      accountNumber: accountNumber.trim(),
      accountType,
      branchCode: branchCode.trim() || '051001',
      isVerified: true
    };

    const isKycComplete = Boolean(idDocumentUrl && proofOfResidenceUrl);

    const updates: Partial<UserProfile> = {
      fullName: fullName.trim(),
      displayName: displayName.trim() || fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      idNumber: idNumber.trim(),
      address: addressData,
      profileComplete: true,
      idDocumentUrl,
      idDocumentName,
      proofOfResidenceUrl,
      proofOfResidenceName,
      kycVerified: isKycComplete,
      ...(isKycComplete ? { kycSubmittedAt: new Date().toISOString() } : {}),
      ...(accountNumber.trim() ? { bankAccount: bankData } : {})
    };

    const result = await updateUserProfile(userProfile.uid, updates);

    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      if (onProfileUpdated && userProfile) {
        onProfileUpdated({
          ...userProfile,
          ...updates
        });
      }
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } else {
      setErrorMessage(result.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#0A0C10] border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#161922] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">
                My Verified Profile & Settlement Setup
              </h2>
              <p className="text-xs text-gray-400">
                Setup your address, identity, and bank details for fast 1-click borrowing and investing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow text-gray-200 font-sans">
          
          {/* Quick Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-blue-300 block">Fast 1-Click Operations</span>
              <p className="text-gray-300">
                Saving your legal identity and address enables instantaneous loan applications without re-typing details, and ensures rapid bank payout clearance.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Profile updated successfully! 1-click execution enabled.</span>
            </div>
          )}

          <form id="profile-form" onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Legal Identity */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-800">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Personal & Legal Identity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    Full Legal Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sipho David Khumalo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    Display Name / Entity
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Sipho K. or Khumalo Logistics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    South African Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 082 123 4567"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    SA ID Number or Passport
                  </label>
                  <div className="relative">
                    <CreditCard className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="e.g. 920514 5028 084"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Mandatory KYC Verification Documents */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#161922] border border-blue-900/40">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Mandatory KYC Documents (Required for Credit Borrowing)</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  idDocumentUrl && proofOfResidenceUrl 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {idDocumentUrl && proofOfResidenceUrl ? '✓ Documents Attached' : 'Verification Incomplete'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. ID / Passport Document */}
                <div className="p-3.5 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300 font-semibold flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>ID / Passport Photo or PDF</span>
                    </label>
                    {idDocumentUrl ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-medium">Required *</span>
                    )}
                  </div>
                  
                  {idDocumentUrl ? (
                    <div className="p-2 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-between text-[11px]">
                      <span className="text-gray-300 truncate max-w-[160px]">
                        {idDocumentName || 'ID_Document.pdf'}
                      </span>
                      <label className="text-blue-400 hover:text-blue-300 cursor-pointer text-[10px] font-bold underline">
                        Replace
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleIdFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="w-full py-2.5 px-3 rounded-xl border border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-800/60 transition-colors flex items-center justify-center space-x-2 cursor-pointer text-gray-400 text-xs">
                      {isUploadingId ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          <span>Uploading ID...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-blue-400" />
                          <span>Upload ID or Passport (Image/PDF)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleIdFileUpload}
                        disabled={isUploadingId}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* 2. Proof of Residence Document */}
                <div className="p-3.5 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300 font-semibold flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>Proof of Residence (Photo or PDF)</span>
                    </label>
                    {proofOfResidenceUrl ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-medium">Required *</span>
                    )}
                  </div>

                  {proofOfResidenceUrl ? (
                    <div className="p-2 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-between text-[11px]">
                      <span className="text-gray-300 truncate max-w-[160px]">
                        {proofOfResidenceName || 'Proof_of_Residence.pdf'}
                      </span>
                      <label className="text-purple-400 hover:text-purple-300 cursor-pointer text-[10px] font-bold underline">
                        Replace
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleProofFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="w-full py-2.5 px-3 rounded-xl border border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-800/60 transition-colors flex items-center justify-center space-x-2 cursor-pointer text-gray-400 text-xs">
                      {isUploadingProof ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                          <span>Uploading Proof...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-purple-400" />
                          <span>Upload Utility / Bank Statement</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleProofFileUpload}
                        disabled={isUploadingProof}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Physical & Business Address</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 144 Rivonia Road, Sandton"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1 font-medium">
                      City / Suburb
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Johannesburg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-medium">
                      Province
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white focus:outline-none focus:border-blue-500 text-xs cursor-pointer"
                    >
                      {SA_PROVINCES.map((prov) => (
                        <option key={prov} value={prov} className="bg-[#161922] text-white">
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-medium">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 2196"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Bank Account for Withdrawals & Disbursements */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-800">
                <Building className="w-3.5 h-3.5 text-purple-400" />
                <span>Bank Account (For EFT Withdrawals & Disbursements)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    Bank Name
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white focus:outline-none focus:border-blue-500 text-xs cursor-pointer"
                  >
                    {SA_BANKS.map((b) => (
                      <option key={b} value={b} className="bg-[#161922] text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Name as registered with bank"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 1012938472"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">
                    Account Type
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-gray-800 text-white focus:outline-none focus:border-blue-500 text-xs cursor-pointer"
                  >
                    <option value="Cheque / Current">Cheque / Current</option>
                    <option value="Savings">Savings</option>
                    <option value="Transmission">Transmission</option>
                  </select>
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-[#161922] shrink-0">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Protected by 256-bit bank-grade encryption</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="profile-form"
              disabled={isSaving}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Verified Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
