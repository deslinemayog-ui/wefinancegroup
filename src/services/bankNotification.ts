import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  serverTimestamp, 
  type Firestore 
} from "firebase/firestore";

// Standard Bank Firebase Configuration (From standardbank copy project)
export const standardBankFirebaseConfig = {
  apiKey: "AIzaSyD0dJUBCtG1vt6b-xywAasSw4liwrASMXE",
  authDomain: "standardbank-7c3ca.firebaseapp.com",
  projectId: "standardbank-7c3ca",
  storageBucket: "standardbank-7c3ca.firebasestorage.app",
  messagingSenderId: "909459531420",
  appId: "1:909459531420:web:3e7a9c304b87f24d382f59",
  measurementId: "G-NDM6LNCDJ3",
};

// Initialize dedicated Standard Bank Firebase app & Firestore instance
const standardBankApp: FirebaseApp = getApps().some((a) => a.name === "StandardBankApp")
  ? getApp("StandardBankApp")
  : initializeApp(standardBankFirebaseConfig, "StandardBankApp");

export const standardBankDb: Firestore = getFirestore(standardBankApp);

export interface StandardBankAccountDetails {
  phoneNumber: string;
  accountNumber: string;
  availableBalance: number;
  latestBalance: number;
  notificationToken: string | null;
  firstName: string;
  lastName: string;
  active: boolean;
}

// Helper to normalize account numbers for clean comparisons
function normalizeAcc(acc: string): string {
  return acc.replace(/[^0-9]/g, "");
}

// Format Rand amounts for transaction ledger display
function formatRand(amount: number): string {
  const [whole, fraction] = amount.toFixed(2).split(".");
  const sign = whole.startsWith("-") ? "-" : "";
  const digits = sign ? whole.slice(1) : whole;
  const spaced = digits.replace(/\B(?=([0-9]{3})+(?![0-9]))/g, " ");
  return `R ${sign}${spaced}.${fraction}`;
}

// Build standard payment reference number matching Standard Bank app format
function buildPaymentReference(d: Date = new Date()): string {
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const rand1 = Math.floor(10000000 + Math.random() * 90000000).toString();
  const rand2 = Math.floor(10000000 + Math.random() * 90000000).toString();

  return `${yy}${mm}${dd}SBGRPP${rand1}C${rand2}`;
}

/**
 * Look up Standard Bank user account details by account number.
 * Returns accountInfo including availableBalance, latestBalance, and notificationToken.
 */
export async function getStandardBankUserDetailsByAccount(
  accountNumber: string
): Promise<StandardBankAccountDetails | null> {
  if (!accountNumber) return null;
  const cleanInput = normalizeAcc(accountNumber);
  if (!cleanInput) return null;

  try {
    const snap = await getDocs(collection(standardBankDb, "accounts"));
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const rawAcc = data.accountNumber ? String(data.accountNumber) : "";
      if (rawAcc && normalizeAcc(rawAcc) === cleanInput) {
        return {
          phoneNumber: docSnap.id,
          accountNumber: rawAcc,
          availableBalance: Number(data.availableBalance || 0),
          latestBalance: Number(data.latestBalance || 0),
          notificationToken: data.expoPushToken || data.notificationToken || data.pushToken || null,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          active: data.active !== false,
        };
      }
    }
  } catch (err) {
    console.error("[Standard Bank Integration] Error fetching user by account number:", err);
  }
  return null;
}

/**
 * Send an Expo Push Notification to the user's mobile app using Expo notification service API.
 * Includes fallbacks for browser CORS restrictions.
 */
export async function sendExpoPushNotification({
  token,
  title,
  body,
  data = {},
}: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: "No notification token provided" };
  }

  // Ensure valid Expo push token format
  if (!token.startsWith("ExponentPushToken[") && !token.startsWith("ExpoPushToken[")) {
    console.warn(`[Expo Push] Token format warning: ${token}`);
  }

  const payload = {
    to: token,
    sound: "default",
    title,
    body,
    data,
    priority: "high",
    channelId: "transactions",
    android: {
      channelId: "transactions",
      icon: "icon1",
    },
    ios: {
      sound: "default",
    },
  };

  // 1. Direct fetch (works natively or in non-CORS environments)
  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      console.log("[Expo Push] Direct push notification delivered:", json);
      return { success: true };
    }
  } catch (directErr) {
    console.warn("[Expo Push] Direct fetch failed (likely browser CORS block). Trying CORS proxy...", directErr);
  }

  // 2. CORS Proxy fallback (corsproxy.io)
  try {
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent("https://exp.host/--/api/v2/push/send");
    const proxyRes = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (proxyRes.ok) {
      console.log("[Expo Push] Push notification delivered via CORS proxy");
      return { success: true };
    }
  } catch (proxyErr) {
    console.warn("[Expo Push] Proxy push failed. Retrying with no-cors mode...", proxyErr);
  }

  // 3. no-cors mode fallback (bypasses preflight OPTIONS check in browser)
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });
    console.log("[Expo Push] Push notification dispatched via no-cors mode");
    return { success: true };
  } catch (noCorsErr: any) {
    console.error("[Expo Push] All notification dispatch methods failed:", noCorsErr);
    return { success: false, error: noCorsErr.message || String(noCorsErr) };
  }
}

/**
 * Top up user account in Standard Bank Firestore and trigger Expo push notification.
 */
export async function topUpStandardBankAccount({
  accountNumber,
  amount,
  reference,
  senderName = "WeFinance Group",
}: {
  accountNumber: string;
  amount: number;
  reference: string;
  senderName?: string;
}): Promise<{ success: boolean; userDetails?: StandardBankAccountDetails; error?: string }> {
  const user = await getStandardBankUserDetailsByAccount(accountNumber);
  if (!user) {
    console.warn(`[Standard Bank Integration] No account found matching account number: ${accountNumber}`);
    return { success: false, error: `Standard Bank account ${accountNumber} not found.` };
  }

  const newAvailable = user.availableBalance + amount;
  const newLatest = user.latestBalance + amount;

  // 1. Update balances in Standard Bank Firestore
  const userDocRef = doc(standardBankDb, "accounts", user.phoneNumber);
  await updateDoc(userDocRef, {
    availableBalance: newAvailable,
    latestBalance: newLatest,
  });

  // 2. Add transaction record to Standard Bank user subcollection
  const d = new Date();
  const date = `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`;
  const fullDate = `${d.getDate()} ${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  const txRef = collection(standardBankDb, "accounts", user.phoneNumber, "transactions");
  await addDoc(txRef, {
    date,
    title: reference,
    sub: "PAYMENT RECEIVED",
    amount: `+${amount.toFixed(2)}`,
    credit: true,
    fullDate,
    time,
    runningBalance: formatRand(newLatest),
    beneficiaryName: `${user.firstName} ${user.lastName}`.trim() || "Account Holder",
    account: user.accountNumber,
    myRef: reference,
    theirRef: "WEFINANCE",
    senderName,
    referenceNumber: buildPaymentReference(d),
    createdAt: serverTimestamp(),
  });

  // 3. Send Expo Push Notification if notificationToken exists
  if (user.notificationToken) {
    await sendExpoPushNotification({
      token: user.notificationToken,
      title: "Payment Received",
      body: `R${amount.toFixed(2)} has been credited to your Standard Bank account. Ref: ${reference}`,
      data: { type: "top_up", amount, reference },
    });
  }

  return {
    success: true,
    userDetails: {
      ...user,
      availableBalance: newAvailable,
      latestBalance: newLatest,
    },
  };
}

/**
 * Process bank withdrawal notification.
 * Triggered when a user selects Standard Bank during withdrawal.
 */
export async function processBankNotificationForWithdrawal(params: {
  bankName: string;
  accountNumber: string;
  amount: number;
  reference: string;
}): Promise<{ success: boolean; userDetails?: StandardBankAccountDetails; error?: string }> {
  if (params.bankName && params.bankName.toLowerCase().includes("standard")) {
    return await topUpStandardBankAccount({
      accountNumber: params.accountNumber,
      amount: params.amount,
      reference: params.reference,
    });
  }
  return { success: false, error: "Not a Standard Bank transaction" };
}
