import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { syncAuthenticatedUser } from '../services/api';

const PlayerAuthContext = createContext(null);

const mapFirebaseUser = (firebaseUser) => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || '',
  };
};

export const getGoogleAuthErrorMessage = (error) => {
  const code = error?.code || '';

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was closed before finishing. You can try again whenever you are ready.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.';
    case 'auth/network-request-failed':
      return 'A network error occurred while contacting Google. Check your connection and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google sign-in. Add localhost (and later your production domain) in Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled for this project yet. Enable the Google provider in Firebase Authentication.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'Firebase API key is invalid or not configured. Please check your client/.env file.';
    case 'auth/internal-error':
      return 'Google sign-in could not be completed. Please try again in a moment.';
    default:
      return error?.message || 'Unable to sign in with Google. Please try again.';
  }
};

export const PlayerAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      await syncAuthenticatedUser();
    } catch (error) {
      console.error('Failed to sync authenticated user with backend:', error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser));
      if (firebaseUser) {
        await syncProfile(firebaseUser);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const mapped = mapFirebaseUser(result.user);
      setUser(mapped);
      await syncProfile(result.user);
      return { success: true, user: mapped };
    } catch (error) {
      return {
        success: false,
        message: getGoogleAuthErrorMessage(error),
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch {
      return {
        success: false,
        message: 'Unable to sign out right now. Please try again.',
      };
    }
  }, []);

  return (
    <PlayerAuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </PlayerAuthContext.Provider>
  );
};

export const usePlayerAuth = () => {
  const context = useContext(PlayerAuthContext);
  if (!context) {
    throw new Error('usePlayerAuth must be used within a PlayerAuthProvider');
  }
  return context;
};
