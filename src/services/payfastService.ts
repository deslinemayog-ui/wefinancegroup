import { depositWalletFunds } from './userService';

// Static PayFast Merchant ID belonging to WeFinance Group
export const DEFAULT_PAYFAST_MERCHANT_ID = '15759218';
export const DEFAULT_PAYFAST_MERCHANT_KEY = '46f0cd694581a';
export const DEFAULT_PAYFAST_RETURN_URL = 'https://lifestyle.empiredigitals.org/';
export const DEFAULT_PAYFAST_CANCEL_URL = 'https://fervent-almeida-f775d3.netlify.app/';

export function getPayFastMerchantId(): string {
  return DEFAULT_PAYFAST_MERCHANT_ID;
}

export interface InitiatePayFastParams {
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  merchantId?: string;
  itemName?: string;
  itemDescription?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

/**
 * Builds direct PayFast PayNow URL (LIVE only - sandbox removed)
 * Format: https://www.payfast.co.za/eng/process?cmd=_paynow&receiver={merchantId}&item_name=...&amount=...&return_url=...&cancel_url=...
 */
export function getPayFastPayNowUrl({
  amount,
  merchantId = DEFAULT_PAYFAST_MERCHANT_ID,
  itemName = 'WeFinance Wallet Deposit',
  itemDescription = 'Escrow wallet capital funding',
  returnUrl = DEFAULT_PAYFAST_RETURN_URL,
  cancelUrl = DEFAULT_PAYFAST_CANCEL_URL,
}: {
  amount: number;
  merchantId?: string;
  itemName?: string;
  itemDescription?: string;
  returnUrl?: string;
  cancelUrl?: string;
}): string {
  const receiver = merchantId || DEFAULT_PAYFAST_MERCHANT_ID;

  return `https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=${receiver}&item_name=${encodeURIComponent(itemName)}&item_description=${encodeURIComponent(itemDescription)}&amount=${amount.toFixed(2)}&return_url=${encodeURIComponent(returnUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
}

// Launches PayFast payment gateway in a new tab via direct PayNow URL (LIVE ONLY)
export function submitPayFastGatewayForm(params: InitiatePayFastParams): { reference: string; payNowUrl: string } {
  const reference = `WFG-PF-${Date.now().toString().slice(-8)}`;
  
  const payNowUrl = getPayFastPayNowUrl({
    amount: params.amount,
    merchantId: DEFAULT_PAYFAST_MERCHANT_ID,
    itemName: params.itemName || `WeFinance Wallet Deposit - R${params.amount.toLocaleString()}`,
    itemDescription: params.itemDescription || 'Escrow wallet capital funding for peer-to-peer loan pools',
    returnUrl: params.returnUrl || DEFAULT_PAYFAST_RETURN_URL,
    cancelUrl: params.cancelUrl || DEFAULT_PAYFAST_CANCEL_URL,
  });

  if (typeof window !== 'undefined') {
    window.open(payNowUrl, '_blank');
  }

  return { reference, payNowUrl };
}

// Complete PayFast deposit and credit user wallet in Firestore (LIVE ONLY)
export async function executePayFastDeposit({
  userId,
  amount,
  merchantId = DEFAULT_PAYFAST_MERCHANT_ID,
  reference,
}: {
  userId: string;
  amount: number;
  merchantId?: string;
  reference?: string;
}): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const finalRef = reference || `WFG-PF-${Date.now().toString().slice(-8)}`;
  const methodName = `PayFast Gateway [Merchant ID: ${merchantId}] (Live)`;
  
  return depositWalletFunds(userId, amount, methodName);
}