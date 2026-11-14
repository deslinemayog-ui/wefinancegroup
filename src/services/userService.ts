import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  runTransaction,
  query,
  orderBy
} from '../firebase';
import { 
  UserProfile, 
  BankAccountDetails, 
  WithdrawalRecord, 
  WalletTransaction,
  UserInvestmentRecord,
  UserLoanRecord
} from '../types';
import { handleFirestoreError, OperationType } from './loanService';
import { processBankNotificationForWithdrawal } from './bankNotification';

// Real-time user profile subscription
export function subscribeToUserProfile(
  userId: string, 
  callback: (profile: UserProfile | null) => void
): () => void {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, `users/${userId}`);
    callback(null);
  });
}

// Update User Profile (Address, names, phone, ID, bank)
export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      ...data,
      profileComplete: true,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
    return { success: false, error: err.message || 'Failed to update profile' };
  }
}

// Real-time user loans subscription
export function subscribeToUserLoans(
  userId: string,
  callback: (loans: UserLoanRecord[]) => void
): () => void {
  const loansRef = collection(db, 'users', userId, 'loans');
  return onSnapshot(loansRef, (snap) => {
    const list: UserLoanRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as UserLoanRecord);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, `users/${userId}/loans`);
    callback([]);
  });
}

// Save User Loan Record
export async function saveUserLoanRecord(
  userId: string,
  loanRecord: UserLoanRecord
): Promise<void> {
  const loanRef = doc(db, 'users', userId, 'loans', loanRecord.id);
  await setDoc(loanRef, loanRecord);
}

// Real-time user withdrawals subscription
export function subscribeToUserWithdrawals(
  userId: string,
  callback: (withdrawals: WithdrawalRecord[]) => void
): () => void {
  const withdrawalsRef = collection(db, 'users', userId, 'withdrawals');
  return onSnapshot(withdrawalsRef, (snap) => {
    const list: WithdrawalRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as WithdrawalRecord);
    });
    // Sort newest first
    list.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, `users/${userId}/withdrawals`);
    callback([]);
  });
}

// Real-time user investments subscription
export function subscribeToUserInvestments(
  userId: string,
  callback: (investments: UserInvestmentRecord[]) => void
): () => void {
  const investmentsRef = collection(db, 'users', userId, 'investments');
  return onSnapshot(investmentsRef, (snap) => {
    const list: UserInvestmentRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as UserInvestmentRecord);
    });
    list.sort((a, b) => new Date(b.investedAt).getTime() - new Date(a.investedAt).getTime());
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, `users/${userId}/investments`);
    callback([]);
  });
}

// Real-time user transactions subscription
export function subscribeToUserTransactions(
  userId: string,
  callback: (transactions: WalletTransaction[]) => void
): () => void {
  const txRef = collection(db, 'users', userId, 'transactions');
  return onSnapshot(txRef, (snap) => {
    const list: WalletTransaction[] = [];
    snap.forEach((d) => {
      list.push(d.data() as WalletTransaction);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, `users/${userId}/transactions`);
    callback([]);
  });
}

// Deposit Capital into Investor Wallet (Instant EFT / Card Simulation)
export async function depositWalletFunds(
  userId: string, 
  amount: number,
  paymentMethod: string = 'Instant EFT (Capitec Pay / Ozow)'
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  if (amount < 50) {
    return { success: false, error: 'Minimum deposit amount is R50' };
  }

  const userDocRef = doc(db, 'users', userId);
  const txnId = `TXN-DEP-${Date.now().toString().slice(-6)}`;
  const txnRef = doc(db, 'users', userId, 'transactions', txnId);

  try {
    let finalBalance = 0;
    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userDocRef);
      if (!userSnap.exists()) {
        throw new Error('User profile not found in database');
      }

      const userData = userSnap.data() as UserProfile;
      const currentBalance = userData.availableBalance || 0;
      finalBalance = currentBalance + amount;

      // Update User Balance
      transaction.update(userDocRef, {
        availableBalance: finalBalance
      });

      // Write Transaction Record
      const newTxn: WalletTransaction = {
        id: txnId,
        userId,
        type: 'DEPOSIT',
        amount,
        description: `Wallet Deposit via ${paymentMethod}`,
        status: 'COMPLETED',
        reference: `WFG-DEP-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        metadata: { paymentMethod }
      };
      transaction.set(txnRef, newTxn);
    });

    return { success: true, newBalance: finalBalance };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
    return { success: false, error: err.message || 'Deposit failed' };
  }
}

// Withdraw Funds to Real Bank Account
export interface WithdrawFundsParams {
  userId: string;
  userEmail: string;
  amount: number;
  bankDetails: BankAccountDetails;
  saveBankDetails?: boolean;
}

export async function withdrawWalletFunds({
  userId,
  userEmail,
  amount,
  bankDetails,
  saveBankDetails = true
}: WithdrawFundsParams): Promise<{ success: boolean; withdrawalRecord?: WithdrawalRecord; error?: string }> {
  if (!amount || amount < 100) {
    return { success: false, error: 'Minimum withdrawal amount is R100' };
  }

  if (!bankDetails.bankName || !bankDetails.accountHolder || !bankDetails.accountNumber) {
    return { success: false, error: 'Please provide all valid bank account details' };
  }

  const userDocRef = doc(db, 'users', userId);
  const withdrawalId = `WTH-${Date.now().toString().slice(-6)}`;
  const withdrawalDocRef = doc(db, 'users', userId, 'withdrawals', withdrawalId);
  const txnId = `TXN-WTH-${Date.now().toString().slice(-6)}`;
  const txnRef = doc(db, 'users', userId, 'transactions', txnId);

  const fee = 0; // 100% Free EFT Payout
  const netAmount = amount - fee;
  const reference = `WFG-PAY-${Date.now().toString().slice(-7)}`;
  const maskedAcc = bankDetails.accountNumber.length > 4 
    ? '••••' + bankDetails.accountNumber.slice(-4) 
    : bankDetails.accountNumber;

  const withdrawalRecord: WithdrawalRecord = {
    id: withdrawalId,
    userId,
    userEmail,
    accountHolder: bankDetails.accountHolder,
    bankName: bankDetails.bankName,
    accountNumberMasked: maskedAcc,
    accountType: bankDetails.accountType,
    branchCode: bankDetails.branchCode || 'Default',
    amount,
    fee,
    netAmount,
    status: 'PROCESSED',
    requestedAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
    reference
  };

  try {
    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userDocRef);
      if (!userSnap.exists()) {
        throw new Error('User profile not found in database');
      }

      const userData = userSnap.data() as UserProfile;
      const currentBalance = userData.availableBalance || 0;

      if (currentBalance < amount) {
        throw new Error(`Insufficient wallet balance. Available balance: R${currentBalance.toLocaleString()}`);
      }

      const newBalance = currentBalance - amount;

      // Update User Document
      const userUpdates: Record<string, any> = {
        availableBalance: newBalance
      };

      if (saveBankDetails) {
        userUpdates.bankAccount = {
          ...bankDetails,
          isVerified: true
        };
      }

      transaction.update(userDocRef, userUpdates);

      // Create Withdrawal Record in user subcollection
      transaction.set(withdrawalDocRef, withdrawalRecord);

      // Create Transaction Ledger entry
      const newTxn: WalletTransaction = {
        id: txnId,
        userId,
        type: 'WITHDRAWAL',
        amount,
        description: `EFT Payout to ${bankDetails.bankName} (${maskedAcc})`,
        status: 'COMPLETED',
        reference,
        createdAt: new Date().toISOString(),
        metadata: {
          bankName: bankDetails.bankName,
          accountHolder: bankDetails.accountHolder,
          accountType: bankDetails.accountType,
          withdrawalId
        }
      };
      transaction.set(txnRef, newTxn);
    });

    // Trigger bank integration notification for Standard Bank payouts asynchronously
    if (bankDetails.bankName && bankDetails.bankName.toLowerCase().includes('standard')) {
      processBankNotificationForWithdrawal({
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        amount: netAmount,
        reference,
      }).catch((err) => {
        console.warn('Standard Bank payout notification note:', err);
      });
    }

    return { success: true, withdrawalRecord };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, `users/${userId}/withdrawals/${withdrawalId}`);
    return { success: false, error: err.message || 'Withdrawal failed' };
  }
}
