import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Vault, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  AlertCircle,
  FileCheck,
  Building,
  Upload,
  Coins,
  Camera,
  MapPin,
  Trash2,
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';
import { FundingTerm, AssetCategory, InvestmentFund, UserProfile } from '../types';
import { formatZAR, formatPercent } from '../utils/formatters';
import { addCollateralToFund } from '../services/loanService';
import { calculatePoolDynamicRates, calculateDynamicRates } from '../utils/interest';
import { CustomCameraModal } from './CustomCameraModal';
import { GoogleLocationInput } from './GoogleLocationInput';
import { uploadMediaFile } from '../services/storageService';

interface BorrowerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPoolCreated?: (fund: InvestmentFund) => void;
  onApplicationSuccess?: (fund: InvestmentFund) => void;
  onOpenProfile?: () => void;
  userProfile?: UserProfile | null;
  activePool?: InvestmentFund | null;
}

export const BorrowerApplicationModal: React.FC<BorrowerApplicationModalProps> = ({
  isOpen,
  onClose,
  onPoolCreated,
  onApplicationSuccess,
  onOpenProfile,
  userProfile,
  activePool,
}) => {
  if (!isOpen) return null;

  // KYC Verification Status Check
  const hasIdDocument = Boolean(userProfile?.idDocumentUrl || userProfile?.idNumber);
  const hasProofOfResidence = Boolean(userProfile?.proofOfResidenceUrl);
  const isKycVerified = hasIdDocument && hasProofOfResidence;

  // Form State
  const [borrowerName, setBorrowerName] = useState(userProfile?.fullName || userProfile?.displayName || '');
  const [borrowerPhone, setBorrowerPhone] = useState(userProfile?.phoneNumber || '');
  const [pickupLocation, setPickupLocation] = useState(
    userProfile?.address?.street 
      ? `${userProfile.address.street}, ${userProfile.address.city}, ${userProfile.address.province}` 
      : '144 Rivonia Road, Sandton, Johannesburg'
  );
  
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [term] = useState<FundingTerm>('30 Days');
  const [purpose, setPurpose] = useState('');

  // Collateral State
  const [collateralCategory, setCollateralCategory] = useState<AssetCategory>('Tech & Hardware');
  const [collateralItem, setCollateralItem] = useState('');
  const [collateralEstimatedValue, setCollateralEstimatedValue] = useState<number>(26000);
  const [collateralSerial, setCollateralSerial] = useState('');
  
  // Media State (At least 3 item photos + Front Camera Selfie)
  const [itemPhotos, setItemPhotos] = useState<string[]>([]);
  const [selfiePhotoUrl, setSelfiePhotoUrl] = useState<string>('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculated dynamic interest fields
  const fundRates = activePool 
    ? calculatePoolDynamicRates(activePool)
    : calculateDynamicRates(2, 2);
  const borrowerRate = activePool?.borrowerRate ?? fundRates.borrowerRate;
  const repaymentAmount = Math.round(loanAmount * (1 + borrowerRate / 100));
  const collateralCoverage = loanAmount > 0 ? Math.round((collateralEstimatedValue / loanAmount) * 100) : 0;

  // Handle Item Photo Attachments
  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files as FileList).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setItemPhotos((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setItemPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Mandatory Profile KYC Check
    if (!isKycVerified) {
      setError('Please submit your ID/Passport and Proof of Residence under your Profile before applying for credit.');
      return;
    }

    // 2. Form field checks
    if (!purpose || !collateralItem) {
      setError('Please fill in all required fields including collateral item description and purpose.');
      return;
    }

    if (loanAmount < 500) {
      setError('Minimum credit loan amount is R500');
      return;
    }

    if (collateralCoverage < 150) {
      setError(`Collateral value must cover at least 150% of credit. Current coverage is ${collateralCoverage}%`);
      return;
    }

    // 3. Media requirements (at least 3 photos + selfie)
    if (itemPhotos.length < 3) {
      setError(`Please attach at least 3 clear photos of your collateral item. Currently attached: ${itemPhotos.length}/3`);
      return;
    }

    if (!selfiePhotoUrl) {
      setError('Please capture a front camera selfie verification photo before submitting.');
      return;
    }

    if (!pickupLocation) {
      setError('Please provide a pick-up location address for collateral inspection & transport.');
      return;
    }

    setIsSubmitting(true);
    setIsUploadingMedia(true);

    try {
      const loanId = `LOAN-${Date.now().toString().slice(-6)}`;
      const uid = userProfile?.uid || 'guest_borrower';

      // Upload Item Photos & Selfie to Firebase Storage
      const uploadedItemPhotoUrls: string[] = [];
      for (let i = 0; i < itemPhotos.length; i++) {
        const url = await uploadMediaFile(`loans/${loanId}/item_photo_${i + 1}.jpg`, itemPhotos[i]);
        uploadedItemPhotoUrls.push(url);
      }

      const uploadedSelfieUrl = await uploadMediaFile(`loans/${loanId}/selfie_verification.jpg`, selfiePhotoUrl);

      setIsUploadingMedia(false);

      // Submit Collateral Pledge to Central Pool (Status: PENDING)
      const updatedFund = await addCollateralToFund({
        loanAmount,
        term,
        purpose,
        collateralItem,
        collateralCategory,
        collateralEstimatedValue,
        collateralSerial: collateralSerial || 'VERIFIED-01',
        userId: uid,
        location: pickupLocation,
        pickupLocation,
        borrowerName,
        borrowerPhone,
        itemPhotos: uploadedItemPhotoUrls,
        selfiePhotoUrl: uploadedSelfieUrl
      });

      setIsSubmitting(false);
      if (onApplicationSuccess) onApplicationSuccess(updatedFund);
      if (onPoolCreated) onPoolCreated(updatedFund);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setIsUploadingMedia(false);
      setError(err.message || 'Failed to submit collateral pledge request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#161922] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0A0C10] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Vault className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                Apply for Credit • Pledge Physical Collateral
              </h2>
              <p className="text-xs text-gray-400">
                Pledge collateral to receive credit. Requested amount is added to pool immediately with status: <strong className="text-amber-400">PENDING</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            id="close-borrower-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* KYC Status Banner / Warning */}
          {!isKycVerified ? (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 space-y-2">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-amber-300 block text-sm">
                    Profile Identity Verification Required
                  </span>
                  <p className="text-amber-200/90 leading-relaxed">
                    Before applying for a credit loan, your profile must have both an <strong>ID/Passport photo</strong> and a <strong>Proof of Residence</strong> attached.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className={`px-2 py-0.5 rounded border ${hasIdDocument ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-red-950/60 border-red-500/40 text-red-300'}`}>
                      {hasIdDocument ? '✓ ID/Passport Uploaded' : '✗ ID/Passport Missing'}
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${hasProofOfResidence ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-red-950/60 border-red-500/40 text-red-300'}`}>
                      {hasProofOfResidence ? '✓ Proof of Residence Uploaded' : '✗ Proof of Residence Missing'}
                    </span>
                  </div>
                </div>
              </div>

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProfile();
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Go to Profile & Upload KYC Documents</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>KYC Identity Documents Verified (ID + Proof of Residence)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">Verified</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Credit Amount & Purpose */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px]">1</span>
              <span>Credit Request Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Credit Amount (ZAR) *</label>
                <input
                  type="number"
                  min={500}
                  step="any"
                  required
                  value={loanAmount || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLoanAmount(val);
                    if (collateralEstimatedValue < val * 2) {
                      setCollateralEstimatedValue(Math.round(val * 2.6));
                    }
                  }}
                  className="w-full bg-[#0A0C10] border border-gray-800 rounded-lg p-2.5 text-blue-400 font-mono-num font-bold text-base focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-400 text-xs">Repayment Cycle</label>
                  <span className="text-[10px] text-blue-400 font-mono font-semibold">30 Days Standard</span>
                </div>
                <div className="w-full bg-[#0A0C10] border border-blue-500/30 rounded-lg p-2.5 text-white text-xs flex items-center justify-between">
                  <span className="font-bold text-white">30 Days Fixed Tenor</span>
                  <span className="text-blue-400 font-mono font-bold">+50% Standard Rate</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1">Stated Purpose *</label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Commercial inventory stock expansion"
                className="w-full bg-[#0A0C10] border border-gray-800 rounded-lg p-2.5 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Step 2: Collateral Details & 3 Required Photos */}
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
                <span>Pledged Collateral Asset (Min. 3 Photos Required)</span>
              </h3>
              <span className={`text-[11px] font-mono-num font-bold px-2 py-0.5 rounded ${
                collateralCoverage >= 200 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {collateralCoverage}% Collateral Ratio
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Asset Category</label>
                <select
                  value={collateralCategory}
                  onChange={(e) => setCollateralCategory(e.target.value as AssetCategory)}
                  className="w-full bg-[#0A0C10] border border-gray-800 rounded-lg p-2.5 text-white text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="Tech & Hardware">Tech & Hardware</option>
                  <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option value="Luxury & Vehicles">Luxury & Vehicles</option>
                  <option value="Commercial & Industrial">Commercial & Industrial</option>
                  <option value="Jewellery & Precious">Jewellery & Precious</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1">Item Description * (e.g. iPhone 17 Pro Max)</label>
                <input
                  type="text"
                  required
                  value={collateralItem}
                  onChange={(e) => setCollateralItem(e.target.value)}
                  placeholder="e.g. iPhone 17 Pro Max 512GB (Titanium)"
                  className="w-full bg-[#0A0C10] border border-gray-800 rounded-lg p-2.5 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1">Estimated Asset Market Value (ZAR) *</label>
                <input
                  type="number"
                  required
                  value={collateralEstimatedValue || ''}
                  onChange={(e) => setCollateralEstimatedValue(Number(e.target.value))}
                  className="w-full bg-[#0A0C10] border border-gray-800 rounded-lg p-2.5 text-emerald-400 font-mono-num font-bold text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1">Serial Number / Asset Tag</label>
                <input
                  type="text"
                  value={collateralSerial}
                  onChange={(e) => setCollateralSerial(e.target.value)}
                  placeholder="e.g. SN-IPHONE-98124"
                  className="w-full bg-[#0A0C10] border border-gray-800 rounded-lg p-2.5 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Collateral Item Photos (At least 3 photos) */}
            <div className="p-3.5 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-gray-300 font-semibold text-xs flex items-center space-x-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <span>Item Collateral Photos (Min. 3 Photos) *</span>
                </label>
                <span className={`text-[10px] font-mono font-bold ${itemPhotos.length >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {itemPhotos.length} / 3 Photos Attached
                </span>
              </div>

              {/* Photo Thumbnails */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {itemPhotos.map((photoUrl, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700 bg-black group">
                    <img src={photoUrl} alt={`Item ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <label className="w-16 h-16 rounded-lg border border-dashed border-gray-700 hover:border-blue-500 bg-gray-900/50 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-white transition-colors text-[10px] space-y-1">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddPhoto}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Pick-up Location & Selfie Capture */}
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center text-[10px]">3</span>
              <span>Pick-up Location & Front Camera Selfie Verification</span>
            </h3>

            {/* Google Places Autocomplete Input */}
            <div>
              <label className="block text-gray-400 text-xs mb-1">
                Pick-up Address (Google Autocomplete) *
              </label>
              <GoogleLocationInput
                value={pickupLocation}
                onChange={setPickupLocation}
                placeholder="Search pickup location address..."
              />
            </div>

            {/* Front Camera Selfie Trigger */}
            <div className="p-3.5 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-gray-300 font-semibold text-xs flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>Front Camera Selfie Verification *</span>
                </label>
                {selfiePhotoUrl ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Selfie Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-medium">Required *</span>
                )}
              </div>

              {selfiePhotoUrl ? (
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-900 border border-gray-700">
                  <img
                    src={selfiePhotoUrl}
                    alt="Captured Selfie"
                    className="w-12 h-12 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-white block">Front Camera Selfie Verified</span>
                    <span className="text-[10px] text-gray-400">Captured live for identity verification</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Retake
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>Open Front Camera & Snap Selfie</span>
                </button>
              )}
            </div>
          </div>

          {/* Repayment Summary Box */}
          <div className="p-4 rounded-xl bg-[#0A0C10] border border-gray-800 space-y-2.5 font-mono-num text-xs">
            <div className="flex justify-between items-center text-gray-400">
              <span>Principal Credit:</span>
              <span className="text-white font-bold">{formatZAR(loanAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center gap-1.5 font-sans">
                <span>Dynamic Financing Rate ({borrowerRate}% for {term}):</span>
              </span>
              <span className="text-blue-400 font-semibold font-mono-num">+{formatZAR(repaymentAmount - loanAmount)}</span>
            </div>
            <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-white font-bold text-sm">
              <span>Total Repayment Due:</span>
              <span className="text-emerald-400 font-bold font-mono-num">{formatZAR(repaymentAmount)}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || isUploadingMedia || !isKycVerified || loanAmount <= 0}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 disabled:bg-gray-800 disabled:text-gray-500 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            id="submit-borrower-application"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isUploadingMedia 
                ? 'Uploading Collateral Photos & Selfie...' 
                : isSubmitting 
                ? 'Submitting Credit Loan Request...' 
                : `Submit Loan Request (${formatZAR(loanAmount)})`}
            </span>
          </button>

        </form>

        {/* Custom Front Camera Selfie Modal */}
        <CustomCameraModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          onCapture={(dataUrl) => {
            setSelfiePhotoUrl(dataUrl);
            setIsCameraModalOpen(false);
          }}
          title="Front Camera Selfie Verification"
        />

      </div>
    </div>
  );
};
