import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let initError = null;

const parseServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();

    // 1. Direct JSON string
    if (raw.startsWith('{')) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn('[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON string:', e.message);
      }
    }

    // 2. File path (relative or absolute)
    try {
      const resolvedPath = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
      if (fs.existsSync(resolvedPath)) {
        const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('[Firebase Admin] Failed to read FIREBASE_SERVICE_ACCOUNT file:', e.message);
    }

    // 3. Base64-encoded JSON
    try {
      const decoded = Buffer.from(raw, 'base64').toString('utf-8');
      if (decoded.trim().startsWith('{')) {
        return JSON.parse(decoded);
      }
    } catch (e) {
      console.warn('[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT as base64 JSON:', e.message);
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY.trim();
    // Strip surrounding quotes if present and resolve escaped newlines
    const cleanedKey = rawKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

    return {
      projectId: process.env.FIREBASE_PROJECT_ID || 'checkmate-arena-dfb15',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
      privateKey: cleanedKey,
    };
  }

  return null;
};

export const initFirebaseAdmin = () => {
  if (getApps().length > 0) {
    initError = null;
    return getApps()[0];
  }

  try {
    const credentials = parseServiceAccount();
    const projectId = process.env.FIREBASE_PROJECT_ID || 'checkmate-arena-dfb15';

    if (credentials) {
      const privateKey = (credentials.privateKey || credentials.private_key || '')
        .replace(/^["']|["']$/g, '')
        .replace(/\\n/g, '\n');

      const app = initializeApp({
        credential: cert({
          projectId: credentials.projectId || credentials.project_id || projectId,
          clientEmail: credentials.clientEmail || credentials.client_email,
          privateKey,
        }),
        projectId: credentials.projectId || credentials.project_id || projectId,
      });
      initError = null;
      console.log('[Firebase Admin] Initialized with service account credentials');
      return app;
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const app = initializeApp({
        credential: applicationDefault(),
        projectId,
      });
      initError = null;
      console.log('[Firebase Admin] Initialized with application default credentials');
      return app;
    } else {
      initError =
        'Firebase Admin credentials are not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (or FIREBASE_SERVICE_ACCOUNT) in server/.env.';
      console.warn(`[Firebase Admin] ${initError}`);
      return null;
    }
  } catch (error) {
    initError = `Failed to initialize Firebase Admin SDK: ${error.message}`;
    console.error('[Firebase Admin] Initialization error:', error.message);
    return null;
  }
};

export const getFirebaseAdmin = () => {
  if (getApps().length === 0) {
    return initFirebaseAdmin();
  }
  return getApps()[0];
};

export const getFirebaseAuth = () => {
  const app = getFirebaseAdmin();
  if (!app) return null;
  return getAuth(app);
};

export const getFirebaseAdminInitError = () => initError;

