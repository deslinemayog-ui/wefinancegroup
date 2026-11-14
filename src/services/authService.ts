import { 
  auth, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';
import { UserProfile, BankAccountDetails } from '../types';

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const onAuthChange = subscribeToAuth;

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Register with Email & Password
export async function registerWithEmail(
  email: string, 
  pass: string, 
  displayName: string,
  role: 'investor' | 'borrower' | 'both' = 'investor'
): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || email,
    displayName: displayName || email.split('@')[0],
    role,
    availableBalance: 0, // Real balance starts at 0 ZAR; users can deposit real funds
    totalInvested: 0,
    totalEarned: 0,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', user.uid), profile);
  return profile;
}

// Log in with Email & Password
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  return await getOrCreateUserProfile(user);
}

// Sign in with Google
export async function loginWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  return await getOrCreateUserProfile(user);
}

// Quick Demo / Guest Investor Sign In
export async function loginAsGuest(role: 'investor' | 'borrower' = 'investor'): Promise<UserProfile> {
  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;
  
  const userDocRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid: user.uid,
    email: `member-${user.uid.slice(0, 5)}@wefinance.co.za`,
    displayName: 'New Member',
    role,
    availableBalance: 0,
    totalInvested: 0,
    totalEarned: 0,
    createdAt: new Date().toISOString(),
    profileComplete: false
  };

  await setDoc(userDocRef, profile);
  return profile;
}

// Log Out
export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

export const signOutUser = logoutUser;

// Fetch or initialize user profile from Firestore
export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  // Create new profile if doesn't exist
  const newProfile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'Member',
    role: 'investor',
    availableBalance: 0,
    totalInvested: 0,
    totalEarned: 0,
    createdAt: new Date().toISOString(),
  };

  await setDoc(userDocRef, newProfile);
  return newProfile;
}

// Update User Bank Account
export async function updateUserBankAccount(userId: string, bankDetails: BankAccountDetails): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, {
    bankAccount: bankDetails
  });
}
