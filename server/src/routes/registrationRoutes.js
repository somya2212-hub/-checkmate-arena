import express from 'express';
import {
  createRegistrationOrder,
  verifyPaymentAndConfirm,
  lookupRegistration,
  getPublicRegisteredPlayers,
} from '../controllers/registrationController.js';
import { authenticateFirebase } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Paid registration requires a verified Firebase ID token
router.post('/order', authenticateFirebase, createRegistrationOrder);
router.post('/verify-payment', authenticateFirebase, verifyPaymentAndConfirm);
router.post('/lookup', lookupRegistration);
router.get('/players/:tournamentId', getPublicRegisteredPlayers);

export default router;
