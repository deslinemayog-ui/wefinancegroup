export type FundingTerm = '30 Days';

export type LoanStatus = 'OPEN' | 'FULLY_FUNDED' | 'DISBURSED' | 'REPAID';

export type AssetCategory = 
  | 'Electronics & Gadgets' 
  | 'Vehicles & Transport' 
  | 'Luxury & Vehicles'
  | 'Tools & Machinery' 
  | 'Valuables & Jewellery' 
  | 'Jewellery & Precious'
  | 'Appliances & Home'
  | 'Tech & Hardware'
  | 'Commercial & Industrial'
  | 'Business Equipment';

export interface PoolInvestment {
  id: string;
  investorName: string;
  investorId?: string;
  amount: number;
  expectedReturn: number;
  timestamp: string;
}

export interface CollateralAsset {
  id: string;
  userId?: string;
  location?: string;
  
  amountRequested: number;        // e.g. 10000 (R10,000)
  purpose: string;                // e.g. "Commercial equipment expansion"
  
  // Pledged Collateral Asset
  collateralItem: string;         // e.g. "iPhone 17 Pro Max 512GB (Titanium)"
  collateralCategory: AssetCategory;
  collateralEstimatedValue: number; // e.g. 26000 (R26,000)
  collateralCoverage: number;     // e.g. 260%
  collateralSerialMasked: string; // e.g. "C02***991"
  vaultLocation: string;          // e.g. "Sandton Escrow Depository"
  collateralStatus: 'VERIFIED & IN VAULT' | 'UNDER PHYSICAL INSPECTION';
  
  dateAdded: string;
  deadlineDate?: string;
  repaymentDue?: number;
  status: 'PENDING' | 'PENDING_FUNDING' | 'FUNDED' | 'DISBURSED' | 'REPAID' | 'DENIED' | 'COMPLETED';
  
  // Media & Pickup
  itemPhotos?: string[];
  selfiePhotoUrl?: string;
  pickupLocation?: string;
}

// Backward compatibility alias
export type BorrowerTranche = CollateralAsset;

export interface InvestmentFund {
  id: string;
  title: string;
  cycleName: string;
  category: string;
  
  // Aggregate Financials
  totalTargetAmount: number;      // sum of capital needed for all pledged collateral loans
  amountFunded: number;           // total contributed by investors so far
  remainingAmount: number;        // totalTargetAmount - amountFunded
  
  term: FundingTerm;              // '30 Days'
  termDays: number;               // 30
  interestRate: number;           // Dynamic 20% - 50% for investors based on demand
  borrowerRate?: number;          // Dynamic 35% - 60% for borrowers based on demand
  platformSpread?: number;        // Dynamic 10% - 15% platform spread
  demandLevel?: 'LOW' | 'BALANCED' | 'HIGH';
  demandLabel?: string;
  totalRepaymentDue: number;      
  
  // Collective Collateral Backing
  totalCollateralValue: number;   // sum of all vaulted collateral values
  collateralCoverageRatio: number;// (totalCollateralValue / totalTargetAmount) * 100
  vaultDepot: string;
  
  status: LoanStatus;             // 'OPEN' | 'FULLY_FUNDED' | 'DISBURSED' | 'REPAID'
  createdAt: string;
  deadlineDate: string;
  
  // Vaulted Collateral Items Backing this Fund
  assetCount: number;
  borrowerCount?: number;
  assets: CollateralAsset[];
  borrowers?: CollateralAsset[];
  
  // Investors funding this single central account
  investments: PoolInvestment[];
  investorCount: number;
}

// Backward compatibility aliases
export type MasterLoanPool = InvestmentFund;
export type IndividualLoanPool = InvestmentFund;

export interface BankAccountDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: 'Cheque / Current' | 'Savings' | 'Transmission';
  branchCode: string;
  isVerified?: boolean;
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  userEmail: string;
  accountHolder: string;
  bankName: string;
  accountNumberMasked: string;
  accountType: string;
  branchCode: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSED' | 'COMPLETED' | 'CANCELLED';
  requestedAt: string;
  processedAt?: string;
  reference: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'RETURN_PAYOUT';
  amount: number;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  reference: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface UserAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  fullName?: string;
  phoneNumber?: string;
  idNumber?: string;
  address?: UserAddress;
  role: 'investor' | 'borrower' | 'both';
  availableBalance: number;
  totalInvested: number;
  totalEarned: number;
  createdAt: string;
  bankAccount?: BankAccountDetails;
  profileComplete?: boolean;
  
  // Verification / KYC Documents
  idDocumentUrl?: string;
  idDocumentName?: string;
  proofOfResidenceUrl?: string;
  proofOfResidenceName?: string;
  kycVerified?: boolean;
  kycSubmittedAt?: string;
}

export interface UserLoanRecord {
  id: string;
  userId: string;
  borrowerName: string;
  borrowerPhone: string;
  borrowerLocation?: string;
  pickupLocation?: string;
  loanAmount: number;
  poolId: string;
  poolTitle: string;
  term: FundingTerm;
  purpose: string;
  collateralItem: string;
  collateralCategory: AssetCategory;
  collateralEstimatedValue: number;
  collateralCoverage: number;
  collateralSerialMasked?: string;
  totalRepaymentDue: number;
  interestAmount: number;
  platformFee: number;
  feeStructure: {
    interestRate: number; // 50%
    platformFeeRate: number; // 20%
    totalRate: number; // 70%
  };
  status: 'PENDING' | 'PENDING_FUNDING' | 'FUNDED' | 'DISBURSED' | 'REPAID' | 'DENIED' | 'COMPLETED';
  createdAt: string;
  deadlineDate: string;
  repaymentDate?: string;
  
  itemPhotos?: string[];
  selfiePhotoUrl?: string;
}

export interface UserInvestmentRecord {
  id: string;
  poolId: string;
  poolTitle?: string;
  borrowerName?: string;
  loanAmount?: number;
  investedAmount: number;
  interestRate: number;
  interestAmount: number;
  expectedReturn: number;
  totalPayout: number;
  term: FundingTerm;
  investedAt: string;
  maturityDate: string;
  withdrawalDate?: string;
  status: 'Funding' | 'Active' | 'Settled';
  collateralItem?: string;
}

export interface UserLoanApplication {
  id: string;
  borrowerName: string;
  loanAmount: number;
  poolId: string;
  amountFunded: number;
  term: FundingTerm;
  purpose: string;
  collateralItem: string;
  collateralEstimatedValue: number;
  status: LoanStatus;
  createdAt: string;
  repaymentDue: number;
}

// Backward compatibility types
export interface InvestmentPool {
  id: string;
  title: string;
  category: string;
  fundingRequired: number;
  alreadyFunded: number;
  collateralValue: number;
  collateralCoverage: number;
  term: string;
  termDays: number;
  targetReturnRate: number;
  expectedReturnAmount: number;
  riskLevel: string;
  minInvestment: number;
  investorCount: number;
  status: string;
  deadlineDate: string;
  startDate: string;
  description: string;
  useOfFunds: string[];
  collateral: {
    name: string;
    category: string;
    estimatedValue: number;
    verifiedValue: number;
    coverageRatio: number;
    status: string;
    vaultLocation: string;
    appraisalRef: string;
    serialNumberMasked: string;
    description: string;
  };
  borrower: {
    type: string;
    kycVerified: boolean;
    creditScore: number;
    creditBand: string;
    businessRegistration?: string;
    province: string;
    purpose: string;
    successfulRepaymentsCount: number;
  };
}

export interface UserInvestment {
  id: string;
  poolId: string;
  poolTitle: string;
  investedAmount: number;
  expectedReturn: number;
  totalPayout: number;
  term: string;
  investedAt: string;
  maturityDate: string;
  status: string;
  collateralName: string;
  collateralCoverage: number;
}

export interface TransactionRecord {
  id: string;
  type: string;
  amount: number;
  poolId?: string;
  description: string;
  date: string;
  status: string;
  reference: string;
}
