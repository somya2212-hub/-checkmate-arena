import express from 'express';
import {
  adminLogin,
  getAdminMe,
  getDashboardStats,
  getRegistrations,
  manualVerifyPlayer,
  updateClubAccessStatus,
  rejectOrRefundRegistration,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public auth endpoint
router.post('/login', adminLogin);

// Protected admin endpoints
router.get('/me', authenticateAdmin, getAdminMe);
router.get('/stats', authenticateAdmin, getDashboardStats);
router.get('/registrations', authenticateAdmin, getRegistrations);
router.post('/verify-player', authenticateAdmin, manualVerifyPlayer);
router.patch('/registrations/:id/club-status', authenticateAdmin, updateClubAccessStatus);
router.post('/registrations/:id/action', authenticateAdmin, rejectOrRefundRegistration);
router.get('/audit-logs', authenticateAdmin, getAuditLogs);

export default router;
