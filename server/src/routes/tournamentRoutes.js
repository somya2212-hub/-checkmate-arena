import express from 'express';
import {
  getFeaturedTournament,
  getTournamentBySlug,
  getPreviousTournaments,
  adminGetAllTournaments,
  adminCreateTournament,
  adminUpdateTournament,
  adminPublishResults,
} from '../controllers/tournamentController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedTournament);
router.get('/previous', getPreviousTournaments);
router.get('/slug/:slug', getTournamentBySlug);

// Admin protected routes
router.get('/admin/all', authenticateAdmin, adminGetAllTournaments);
router.post('/admin', authenticateAdmin, adminCreateTournament);
router.put('/admin/:id', authenticateAdmin, adminUpdateTournament);
router.post('/admin/:id/results', authenticateAdmin, adminPublishResults);

export default router;
