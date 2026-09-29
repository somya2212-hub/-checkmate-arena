import { getFirebaseAuth, getFirebaseAdminInitError } from '../config/firebaseAdmin.js';

export const authenticateFirebase = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in with Google to continue.',
      });
    }

    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      return res.status(503).json({
        success: false,
        message:
          getFirebaseAdminInitError() ||
          'Authentication service is temporarily unavailable. Please try again later.',
      });
    }

    const idToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in with Google to continue.',
      });
    }

    const decoded = await firebaseAuth.verifyIdToken(idToken);

    const verifiedUser = {
      uid: decoded.uid,
      firebaseUid: decoded.uid,
      email: (decoded.email || '').toLowerCase(),
      name: decoded.name || decoded.email || 'Player',
      picture: decoded.picture || '',
    };

    req.user = verifiedUser;
    req.firebaseUser = verifiedUser;

    next();
  } catch (error) {
    const code = error?.code || '';
    if (code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Your session expired. Please sign in with Google again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired sign-in session. Please sign in with Google again.',
    });
  }
};
