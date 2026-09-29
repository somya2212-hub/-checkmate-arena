import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const rawConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(rawConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn(
    `[Firebase] Missing Vite env values: ${missingKeys.join(', ')}. Add them to client/.env for Google Auth.`
  );
}

const firebaseConfig = {
  apiKey: rawConfig.apiKey || 'placeholder-api-key',
  authDomain: rawConfig.authDomain || 'placeholder.firebaseapp.com',
  projectId: rawConfig.projectId || 'placeholder-project',
  storageBucket: rawConfig.storageBucket || 'placeholder.appspot.com',
  messagingSenderId: rawConfig.messagingSenderId || '1234567890',
  appId: rawConfig.appId || '1:1234567890:web:abcdef123456',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
