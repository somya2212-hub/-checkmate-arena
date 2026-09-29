import express from 'express';
import { authenticateFirebase } from '../middleware/firebaseAuth.js';
import { syncCurrentUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/sync', authenticateFirebase, syncCurrentUser);
router.get('/me', authenticateFirebase, syncCurrentUser);

export default router;
