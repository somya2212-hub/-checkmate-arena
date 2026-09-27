import express from 'express';
import {
  createRegistrationOrder,
  verifyPaymentAndConfirm,
  lookupRegistration,
  getPublicRegisteredPlayers,
} from '../controllers/registrationController.js';

const router = express.Router();

// Public registration endpoints
router.post('/order', createRegistrationOrder);
router.post('/verify-payment', verifyPaymentAndConfirm);
router.post('/lookup', lookupRegistration);
router.get('/players/:tournamentId', getPublicRegisteredPlayers);

export default router;
