import { 
  db, 
  auth,
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp,
  runTransaction
} from '../firebase';
import { 
  InvestmentFund, 
  CollateralAsset, 
  PoolInvestment, 
  FundingTerm, 
  AssetCategory, 
  UserInvestmentRecord,
  UserLoanRecord 
} from '../types';
import { calculatePoolDynamicRates, calculateBorrowerRepayment } from './interest';

const FUND_COLLECTION = 'master_loan_pools';
export const MAIN_FUND_ID = 'WEFINANCE-MAIN-FUND';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Ledger Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Initial Sample Collateral Assets Backing the Single Central Fund
export const INITIAL_COLLATERAL_ASSETS: CollateralAsset[] = [
  {
    id: 'ASSET-901',
    amountRequested: 18000,
    purpose: 'Commercial inventory stock expansion',
    collateralItem: 'iPhone 17 Pro Max 512GB (Titanium)',
    collateralCategory: 'Tech & Hardware',
    collateralEstimatedValue: 28500,
    collateralCoverage: 158,
    collateralSerialMasked: 'IP17***991',
    vaultLocation: 'Sandton Central Escrow Depository (JHB)',
    collateralStatus: 'VERIFIED & IN VAULT',
    dateAdded: new Date().toISOString(),
    status: 'PENDING_FUNDING'
  },
  {
    id: 'ASSET-902',
    amountRequested: 35000,
    purpose: 'Creative agency production equipment',
    collateralItem: 'Apple MacBook Pro M3 Max 16" (36GB RAM)',
    collateralCategory: 'Tech & Hardware',
    collateralEstimatedValue: 54000,
    collateralCoverage: 154,
    collateralSerialMasked: 'C02M***882',
    vaultLocation: 'Cape Town Harbor Vault Depot',
    collateralStatus: 'VERIFIED & IN VAULT',
    dateAdded: new Date().toISOString(),
    status: 'PENDING_FUNDING'
  },
  {
    id: 'ASSET-903',
    amountRequested: 25000,
    purpose: 'Logistics expansion & cargo transport',
    collateralItem: 'Sony FX3 Cinema Camera Kit & G-Master Lens',
    collateralCategory: 'Electronics & Gadgets',
    collateralEstimatedValue: 42000,
    collateralCoverage: 168,
    collateralSerialMasked: 'SN33***104',
    vaultLocation: 'Durban Commercial Logistics Depository',
    collateralStatus: 'VERIFIED & IN VAULT',
    dateAdded: new Date().toISOString(),
    status: 'PENDING_FUNDING'
  },
  {
    id: 'ASSET-904',
    amountRequested: 22000,
    purpose: 'Surveying & agricultural inspection',
    collateralItem: '2023 DJI Mavic 3 Enterprise Thermal Drone',
    collateralCategory: 'Commercial & Industrial',
    collateralEstimatedValue: 35000,
    collateralCoverage: 159,
    collateralSerialMasked: 'DJI9***551',
    vaultLocation: 'Sandton Central Escrow Depository (JHB)',
    collateralStatus: 'VERIFIED & IN VAULT',
    dateAdded: new Date().toISOString(),
    status: 'PENDING_FUNDING'
  }
];

// 100% Single Central Investment Fund
export const INITIAL_INVESTMENT_FUND: InvestmentFund = {
  id: MAIN_FUND_ID,
  title: 'WeFinance 30-Day Master Liquidity Fund',
  cycleName: 'Cycle #WF-30D',
  category: 'Collective Liquidity & Collateral Escrow',
  totalTargetAmount: 100000,
  amountFunded: 0,
  remainingAmount: 100000,
  term: '30 Days',
  termDays: 30,
  interestRate: 46.5,
  borrowerRate: 57.1,
  platformSpread: 10.6,
  demandLevel: 'HIGH',
  demandLabel: 'High Demand (+46.5% Yield)',
  totalRepaymentDue: 157100,
  totalCollateralValue: 159500,
  collateralCoverageRatio: 160,
  vaultDepot: 'Sandton Central Escrow Depository (JHB)',
  status: 'OPEN',
  createdAt: new Date().toISOString(),
  deadlineDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
  assetCount: INITIAL_COLLATERAL_ASSETS.length,
  assets: INITIAL_COLLATERAL_ASSETS,
  borrowers: INITIAL_COLLATERAL_ASSETS,
  borrowerCount: INITIAL_COLLATERAL_ASSETS.length,
  investorCount: 0,
  investments: []
};

export const INITIAL_MASTER_POOLS: InvestmentFund[] = [INITIAL_INVESTMENT_FUND];

// Sanitize fund data to ensure dynamic rates & accurate collateral totals
export function sanitizeFundData(fund: InvestmentFund): InvestmentFund {
  const cleanAssets = fund.assets || fund.borrowers || INITIAL_COLLATERAL_ASSETS;
  const cleanInvestments = fund.investments || [];

  const totalCollateral = cleanAssets.reduce((sum, a) => sum + (a.collateralEstimatedValue || 0), 0);
  const totalTarget = cleanAssets.reduce((sum, a) => sum + (a.amountRequested || 0), 0) || fund.totalTargetAmount || 100000;
  const totalFunded = cleanInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const remaining = Math.max(0, totalTarget - totalFunded);

  const rates = calculatePoolDynamicRates({
    borrowerCount: cleanAssets.length,
    investorCount: cleanInvestments.length,
    totalTargetAmount: totalTarget,
    amountFunded: totalFunded
  });

  const totalRepayment = Math.round(totalTarget * (1 + rates.borrowerRate / 100));

  return {
    ...fund,
    id: MAIN_FUND_ID,
    title: 'WeFinance 30-Day Master Liquidity Fund',
    term: '30 Days',
    termDays: 30,
    totalTargetAmount: totalTarget,
    amountFunded: totalFunded,
    remainingAmount: remaining,
    interestRate: rates.investorRate,
    borrowerRate: rates.borrowerRate,
    platformSpread: rates.platformSpread,
    demandLevel: rates.demandLevel,
    demandLabel: rates.demandLabel,
    totalRepaymentDue: totalRepayment,
    totalCollateralValue: totalCollateral,
    collateralCoverageRatio: totalTarget > 0 && totalCollateral > 0 ? Math.round((totalCollateral / totalTarget) * 100) : 160,
    assetCount: cleanAssets.length,
    assets: cleanAssets,
    borrowers: cleanAssets,
    borrowerCount: cleanAssets.length,
    investments: cleanInvestments,
    investorCount: cleanInvestments.length,
    status: remaining <= 0 ? 'FULLY_FUNDED' : 'OPEN'
  };
}

export function sanitizePoolData(pool: InvestmentFund): InvestmentFund {
  return sanitizeFundData(pool);
}

// Seed initial investment fund if empty
export async function seedLoansIfEmpty() {
  try {
    const fundRef = doc(db, FUND_COLLECTION, MAIN_FUND_ID);
    await setDoc(fundRef, INITIAL_INVESTMENT_FUND, { merge: true });
  } catch (error) {
    console.warn('Database initialization note:', error);
  }
}

// Subscribe to real-time single central fund
export function subscribeToInvestmentFund(callback: (fund: InvestmentFund) => void): () => void {
  try {
    const fundRef = doc(db, FUND_COLLECTION, MAIN_FUND_ID);
    return onSnapshot(fundRef, (docSnap) => {
      if (!docSnap.exists()) {
        seedLoansIfEmpty();
        callback(INITIAL_INVESTMENT_FUND);
      } else {
        const rawFund = docSnap.data() as InvestmentFund;
        callback(sanitizeFundData(rawFund));
      }
    }, (error) => {
      console.warn('Real-time ledger subscription fallback:', error);
      callback(INITIAL_INVESTMENT_FUND);
    });
  } catch (error) {
    console.warn('Ledger init error, using standard state:', error);
    callback(INITIAL_INVESTMENT_FUND);
    return () => {};
  }
}

// Backward compatibility helper returning array of single fund
export function subscribeToLoanPools(callback: (pools: InvestmentFund[]) => void): () => void {
  return subscribeToInvestmentFund((fund) => {
    callback([fund]);
  });
}

// Add a new pledged collateral asset to the central fund account
export async function addCollateralToFund(params: {
  loanAmount: number;
  term: FundingTerm;
  purpose: string;
  collateralItem: string;
  collateralCategory: AssetCategory;
  collateralEstimatedValue: number;
  collateralSerial: string;
  userId?: string;
  location?: string;
  pickupLocation?: string;
  borrowerName?: string;
  borrowerPhone?: string;
  itemPhotos?: string[];
  selfiePhotoUrl?: string;
}): Promise<InvestmentFund> {
  const coverageRatio = Math.round((params.collateralEstimatedValue / params.loanAmount) * 100);
  const nowIso = new Date().toISOString();
  const deadlineDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const assetId = `ASSET-${Date.now().toString().slice(-6)}`;

  const newAsset: CollateralAsset = {
    id: assetId,
    userId: params.userId,
    location: params.location || 'Johannesburg, Gauteng',
    pickupLocation: params.pickupLocation || params.location || 'Johannesburg, Gauteng',
    amountRequested: params.loanAmount,
    purpose: params.purpose,
    collateralItem: params.collateralItem,
    collateralCategory: params.collateralCategory,
    collateralEstimatedValue: params.collateralEstimatedValue,
    collateralCoverage: coverageRatio,
    collateralSerialMasked: params.collateralSerial ? `${params.collateralSerial.slice(0, 4)}***${params.collateralSerial.slice(-3)}` : 'SN-VERIFIED-991',
    vaultLocation: 'Sandton Central Escrow Depository (JHB)',
    collateralStatus: 'VERIFIED & IN VAULT',
    dateAdded: nowIso,
    deadlineDate,
    repaymentDue: Math.round(params.loanAmount * 1.5),
    status: 'PENDING',
    itemPhotos: params.itemPhotos || [],
    selfiePhotoUrl: params.selfiePhotoUrl || ''
  };

  try {
    const fundRef = doc(db, FUND_COLLECTION, MAIN_FUND_ID);
    let updatedFund: InvestmentFund | null = null;

    await runTransaction(db, async (transaction) => {
      const fundDoc = await transaction.get(fundRef);
      
      let baseFund: InvestmentFund;
      if (fundDoc.exists()) {
        baseFund = sanitizeFundData(fundDoc.data() as InvestmentFund);
      } else {
        baseFund = INITIAL_INVESTMENT_FUND;
      }

      const existingAssets = baseFund.assets || [];
      const newAssets = [newAsset, ...existingAssets];
      
      const newTotalTarget = baseFund.totalTargetAmount + params.loanAmount;
      const newRemaining = newTotalTarget - baseFund.amountFunded;
      const newTotalCollateral = baseFund.totalCollateralValue + params.collateralEstimatedValue;
      const newCoverageRatio = Math.round((newTotalCollateral / newTotalTarget) * 100);

      const dynamicRates = calculatePoolDynamicRates({
        borrowerCount: newAssets.length,
        investorCount: baseFund.investorCount || 0,
        totalTargetAmount: newTotalTarget,
        amountFunded: baseFund.amountFunded
      });

      const borrowerRepaymentDue = Math.round(params.loanAmount * (1 + dynamicRates.borrowerRate / 100));
      newAsset.repaymentDue = borrowerRepaymentDue;

      updatedFund = {
        ...baseFund,
        totalTargetAmount: newTotalTarget,
        remainingAmount: Math.max(0, newRemaining),
        totalCollateralValue: newTotalCollateral,
        collateralCoverageRatio: newCoverageRatio,
        interestRate: dynamicRates.investorRate,
        borrowerRate: dynamicRates.borrowerRate,
        platformSpread: dynamicRates.platformSpread,
        demandLevel: dynamicRates.demandLevel,
        demandLabel: dynamicRates.demandLabel,
        totalRepaymentDue: Math.round(newTotalTarget * (1 + dynamicRates.borrowerRate / 100)),
        assetCount: newAssets.length,
        assets: newAssets,
        borrowers: newAssets,
        borrowerCount: newAssets.length,
        status: newRemaining <= 0 ? 'FULLY_FUNDED' : 'OPEN'
      };

      transaction.set(fundRef, updatedFund);

      if (params.userId) {
        const userLoanRef = doc(db, 'users', params.userId, 'loans', assetId);
        const userLoanRecord: UserLoanRecord = {
          id: assetId,
          userId: params.userId,
          borrowerName: params.borrowerName || 'Verified Borrower',
          borrowerPhone: params.borrowerPhone || 'Protected',
          borrowerLocation: params.location || 'Johannesburg, Gauteng',
          pickupLocation: params.pickupLocation || params.location || 'Johannesburg, Gauteng',
          loanAmount: params.loanAmount,
          poolId: MAIN_FUND_ID,
          poolTitle: 'WeFinance 30-Day Master Liquidity Fund',
          term: '30 Days',
          purpose: params.purpose,
          collateralItem: params.collateralItem,
          collateralCategory: params.collateralCategory,
          collateralEstimatedValue: params.collateralEstimatedValue,
          collateralCoverage: coverageRatio,
          collateralSerialMasked: newAsset.collateralSerialMasked,
          totalRepaymentDue: borrowerRepaymentDue,
          interestAmount: Math.round(params.loanAmount * (dynamicRates.investorRate / 100)),
          platformFee: Math.round(params.loanAmount * (dynamicRates.platformSpread / 100)),
          feeStructure: {
            interestRate: dynamicRates.investorRate,
            platformFeeRate: dynamicRates.platformSpread,
            totalRate: dynamicRates.borrowerRate
          },
          status: 'PENDING',
          createdAt: nowIso,
          deadlineDate,
          itemPhotos: params.itemPhotos || [],
          selfiePhotoUrl: params.selfiePhotoUrl || ''
        };
        transaction.set(userLoanRef, userLoanRecord);
      }
    });

    return updatedFund || INITIAL_INVESTMENT_FUND;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${FUND_COLLECTION}/${MAIN_FUND_ID}`);
    console.warn('Could not write asset to ledger, returning fallback:', error);
    return INITIAL_INVESTMENT_FUND;
  }
}

/**
 * Updates a loan status (e.g. DENIED or COMPLETED).
 * If status is DENIED or COMPLETED, removes its loan amount from the central pool.
 */
export async function updateLoanStatus(
  assetId: string,
  newStatus: 'PENDING' | 'DENIED' | 'COMPLETED' | 'FUNDED' | 'DISBURSED' | 'REPAID',
  userId?: string
): Promise<{ success: boolean; updatedFund?: InvestmentFund; error?: string }> {
  try {
    const fundRef = doc(db, FUND_COLLECTION, MAIN_FUND_ID);
    let updatedResult: InvestmentFund | undefined;

    await runTransaction(db, async (transaction) => {
      const fundDoc = await transaction.get(fundRef);
      if (!fundDoc.exists()) return;

      const fund = sanitizeFundData(fundDoc.data() as InvestmentFund);
      const assets = fund.assets || [];
      const targetAsset = assets.find((a) => a.id === assetId);

      if (!targetAsset) return;

      let newAssets: CollateralAsset[] = [];

      if (newStatus === 'DENIED' || newStatus === 'COMPLETED') {
        // Remove amount from pool
        newAssets = assets.filter((a) => a.id !== assetId);
      } else {
        // Update status in place
        newAssets = assets.map((a) => (a.id === assetId ? { ...a, status: newStatus } : a));
      }

      const newTotalTarget = newAssets.reduce((sum, a) => sum + (a.amountRequested || 0), 0);
      const newTotalCollateral = newAssets.reduce((sum, a) => sum + (a.collateralEstimatedValue || 0), 0);
      const newRemaining = Math.max(0, newTotalTarget - fund.amountFunded);

      const dynamicRates = calculatePoolDynamicRates({
        borrowerCount: newAssets.length,
        investorCount: fund.investorCount || 0,
        totalTargetAmount: newTotalTarget,
        amountFunded: fund.amountFunded
      });

      updatedResult = {
        ...fund,
        totalTargetAmount: newTotalTarget,
        remainingAmount: newRemaining,
        totalCollateralValue: newTotalCollateral,
        collateralCoverageRatio: newTotalTarget > 0 ? Math.round((newTotalCollateral / newTotalTarget) * 100) : 160,
        assetCount: newAssets.length,
        assets: newAssets,
        borrowers: newAssets,
        borrowerCount: newAssets.length,
        interestRate: dynamicRates.investorRate,
        borrowerRate: dynamicRates.borrowerRate,
        platformSpread: dynamicRates.platformSpread,
        status: newRemaining <= 0 ? 'FULLY_FUNDED' : 'OPEN'
      };

      transaction.set(fundRef, updatedResult);

      if (userId) {
        const userLoanRef = doc(db, 'users', userId, 'loans', assetId);
        transaction.update(userLoanRef, { status: newStatus });
      }
    });

    return { success: true, updatedFund: updatedResult };
  } catch (err: any) {
    console.error('Error updating loan status:', err);
    return { success: false, error: err.message || 'Failed to update loan status' };
  }
}

export const addBorrowerToMasterPool = addCollateralToFund;

// Invest capital directly into the Single Central Fund
export async function investInFund(
  investAmount: number,
  investorName: string = 'Verified Investor',
  userId?: string
): Promise<{ success: boolean; updatedFund?: InvestmentFund; userInvestment?: UserInvestmentRecord; error?: string }> {
  const path = `${FUND_COLLECTION}/${MAIN_FUND_ID}`;
  try {
    const fundRef = doc(db, FUND_COLLECTION, MAIN_FUND_ID);
    const userRef = userId ? doc(db, 'users', userId) : null;
    const invId = `INV-${Date.now().toString().slice(-6)}`;
    const userInvRef = userId ? doc(db, 'users', userId, 'investments', invId) : null;
    const txnRef = userId ? doc(db, 'users', userId, 'transactions', `TXN-${invId}`) : null;

    let createdUserInv: UserInvestmentRecord | undefined;

    const result = await runTransaction(db, async (transaction) => {
      let userBalance = 0;
      let userData: any = null;
      if (userRef) {
        const userDoc = await transaction.get(userRef);
        if (userDoc.exists()) {
          userData = userDoc.data();
          userBalance = userData.availableBalance || 0;
          if (userBalance < investAmount) {
            throw new Error(`Insufficient wallet balance. You have R${userBalance.toLocaleString()} available. Please deposit funds first.`);
          }
        }
      }

      const fundDoc = await transaction.get(fundRef);
      let fund: InvestmentFund;

      if (fundDoc.exists()) {
        fund = sanitizeFundData(fundDoc.data() as InvestmentFund);
      } else {
        fund = INITIAL_INVESTMENT_FUND;
      }

      if (fund.status !== 'OPEN') {
        throw new Error('The investment fund is currently fully allocated');
      }

      if (investAmount <= 0) {
        throw new Error('Investment amount must be greater than R0');
      }

      if (investAmount > fund.remainingAmount) {
        throw new Error(`Investment cannot exceed remaining fund capacity of R${fund.remainingAmount.toLocaleString()}`);
      }

      const newAmountFunded = fund.amountFunded + investAmount;
      const newRemainingAmount = fund.totalTargetAmount - newAmountFunded;
      const isFullyFunded = newRemainingAmount <= 0;

      const lockedInRate = fund.interestRate;
      const expectedReturn = Math.round((investAmount * lockedInRate) / 100);

      const newInvestment: PoolInvestment = {
        id: invId,
        investorName,
        investorId: userId,
        amount: investAmount,
        expectedReturn,
        timestamp: new Date().toISOString()
      };

      const updatedInvestments = [newInvestment, ...(fund.investments || [])];
      const updatedInvestorCount = updatedInvestments.length;

      const dynamicRates = calculatePoolDynamicRates({
        borrowerCount: fund.assetCount || fund.assets?.length || 0,
        investorCount: updatedInvestorCount,
        totalTargetAmount: fund.totalTargetAmount,
        amountFunded: newAmountFunded
      });

      const updatedFund: InvestmentFund = {
        ...fund,
        amountFunded: newAmountFunded,
        remainingAmount: Math.max(0, newRemainingAmount),
        status: isFullyFunded ? 'FULLY_FUNDED' : 'OPEN',
        investorCount: updatedInvestorCount,
        investments: updatedInvestments,
        interestRate: dynamicRates.investorRate,
        borrowerRate: dynamicRates.borrowerRate,
        platformSpread: dynamicRates.platformSpread,
        demandLevel: dynamicRates.demandLevel,
        demandLabel: dynamicRates.demandLabel,
        totalRepaymentDue: Math.round(fund.totalTargetAmount * (1 + dynamicRates.borrowerRate / 100))
      };

      transaction.set(fundRef, updatedFund);

      if (userRef && userData && userInvRef && txnRef) {
        const newBalance = userBalance - investAmount;
        const newTotalInvested = (userData.totalInvested || 0) + investAmount;

        transaction.update(userRef, {
          availableBalance: newBalance,
          totalInvested: newTotalInvested
        });

        const maturityDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        createdUserInv = {
          id: invId,
          poolId: fund.id,
          poolTitle: fund.title,
          investedAmount: investAmount,
          interestRate: lockedInRate,
          interestAmount: expectedReturn,
          expectedReturn,
          totalPayout: investAmount + expectedReturn,
          term: fund.term,
          investedAt: new Date().toISOString().split('T')[0],
          maturityDate,
          status: 'Active',
          collateralItem: `${fund.assets?.length || 1} Escrow Vaulted Assets (${fund.collateralCoverageRatio}% Collateral Backing)`
        };

        transaction.set(userInvRef, createdUserInv);

        transaction.set(txnRef, {
          id: `TXN-${invId}`,
          userId,
          type: 'INVESTMENT',
          amount: investAmount,
          description: `Capital allocation to ${fund.title} at +${lockedInRate}% 30-day yield`,
          status: 'COMPLETED',
          reference: `WFG-INV-${Date.now().toString().slice(-7)}`,
          createdAt: new Date().toISOString()
        });
      }

      return updatedFund;
    });

    return { success: true, updatedFund: result, userInvestment: createdUserInv };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
    console.error('Error investing in fund:', error);
    return { success: false, error: error.message || 'Investment failed' };
  }
}

export function investInLoanPool(
  poolId: string,
  investAmount: number,
  investorName: string = 'Verified Investor',
  userId?: string
) {
  return investInFund(investAmount, investorName, userId);
}

export const createIndividualLoanPool = addCollateralToFund;
