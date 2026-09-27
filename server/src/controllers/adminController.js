import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Registration } from '../models/Registration.js';
import { Tournament } from '../models/Tournament.js';
import { AuditLog } from '../models/AuditLog.js';

// 1. Admin Login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
      process.env.JWT_SECRET || 'super_secret_checkmate_arena_jwt_key_2025_prod_ready_secure',
      { expiresIn: '7d' }
    );

    await AuditLog.create({
      adminId: admin._id,
      adminName: admin.name,
      action: 'LOGIN',
      details: { ip: req.ip },
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get Admin Profile
export const getAdminMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Dashboard Overview & Key Metrics
export const getDashboardStats = async (req, res, next) => {
  try {
    const { tournamentId } = req.query;

    const filter = {};
    if (tournamentId && tournamentId !== 'all') {
      filter.tournamentId = tournamentId;
    }

    const totalRegistrations = await Registration.countDocuments(filter);
    const successfulPayments = await Registration.countDocuments({ ...filter, paymentStatus: 'PAID' });
    const pendingPayments = await Registration.countDocuments({ ...filter, paymentStatus: 'PENDING' });
    const failedPayments = await Registration.countDocuments({ ...filter, paymentStatus: 'FAILED' });
    const refundedPayments = await Registration.countDocuments({ ...filter, paymentStatus: 'REFUNDED' });

    const verifiedPlayers = await Registration.countDocuments({ ...filter, verificationStatus: 'VERIFIED' });
    const pendingVerification = await Registration.countDocuments({
      ...filter,
      paymentStatus: 'PAID',
      verificationStatus: 'PENDING',
    });
    const rejectedVerification = await Registration.countDocuments({ ...filter, verificationStatus: 'REJECTED' });

    const clubApproved = await Registration.countDocuments({ ...filter, clubStatus: 'APPROVED' });
    const clubPending = await Registration.countDocuments({
      ...filter,
      verificationStatus: 'VERIFIED',
      clubStatus: { $in: ['NOT_APPLIED', 'JOIN_PENDING'] },
    });

    // Calculate total revenue from PAID registrations
    const revenueAgg = await Registration.aggregate([
      { $match: { ...filter, paymentStatus: 'PAID' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Get current active tournament capacity
    const activeTournament = await Tournament.findOne({ isFeatured: true });

    res.json({
      success: true,
      data: {
        totalRegistrations,
        successfulPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        verifiedPlayers,
        pendingVerification,
        rejectedVerification,
        clubApproved,
        clubPending,
        totalRevenue,
        tournamentCapacity: activeTournament ? activeTournament.maxParticipants : 128,
        capacityFilledPercentage: activeTournament
          ? Math.round((successfulPayments / activeTournament.maxParticipants) * 100)
          : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get Registrations with Search & Filter
export const getRegistrations = async (req, res, next) => {
  try {
    const {
      tournamentId,
      paymentStatus,
      verificationStatus,
      clubStatus,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    if (tournamentId && tournamentId !== 'all') {
      query.tournamentId = tournamentId;
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      query.paymentStatus = paymentStatus;
    }
    if (verificationStatus && verificationStatus !== 'ALL') {
      query.verificationStatus = verificationStatus;
    }
    if (clubStatus && clubStatus !== 'ALL') {
      query.clubStatus = clubStatus;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { registrationId: { $regex: s, $options: 'i' } },
        { chessUsername: { $regex: s, $options: 'i' } },
        { fullName: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
        { razorpayPaymentId: { $regex: s, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Registration.countDocuments(query);
    const registrations = await Registration.find(query)
      .populate('tournamentId', 'title date maxParticipants')
      .populate('verifiedBy', 'name email')
      .populate('clubApprovedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Manual WhatsApp Verification Flow
export const manualVerifyPlayer = async (req, res, next) => {
  try {
    const { registrationId, chessUsername, notes } = req.body;

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required for verification.',
      });
    }

    const cleanRegId = registrationId.trim().toUpperCase();
    const registration = await Registration.findOne({ registrationId: cleanRegId }).populate('tournamentId');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration ID "${cleanRegId}" was not found in the database.`,
      });
    }

    if (registration.paymentStatus !== 'PAID') {
      return res.status(400).json({
        success: false,
        message: `Cannot verify registration: Payment status is "${registration.paymentStatus}". Verification requires PAID status.`,
      });
    }

    if (registration.paymentStatus === 'REFUNDED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot verify player: This registration has been refunded.',
      });
    }

    // Optional cross-check with sent chess username
    if (chessUsername && chessUsername.trim()) {
      const matchUsername = chessUsername.trim().toLowerCase();
      if (registration.chessUsername !== matchUsername) {
        return res.status(400).json({
          success: false,
          message: `Chess.com username mismatch! WhatsApp message stated "${chessUsername}", but registered username is "${registration.chessUsernameDisplay || registration.chessUsername}".`,
        });
      }
    }

    registration.verificationStatus = 'VERIFIED';
    registration.verifiedAt = new Date();
    registration.verifiedBy = req.admin._id;
    registration.verificationNotes = notes || 'Manually verified via WhatsApp submission.';
    
    // Move club status to ready for join
    if (registration.clubStatus === 'NOT_APPLIED') {
      registration.clubStatus = 'JOIN_PENDING';
    }

    await registration.save();

    await AuditLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'VERIFY_PLAYER',
      targetRegistrationId: registration.registrationId,
      details: {
        player: registration.fullName,
        chessUsername: registration.chessUsername,
        notes: registration.verificationNotes,
      },
    });

    res.json({
      success: true,
      message: `Registration ${registration.registrationId} (${registration.chessUsernameDisplay || registration.chessUsername}) has been VERIFIED successfully!`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Update Chess.com Club Access Status (e.g. APPROVED or REJECTED)
export const updateClubAccessStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clubStatus, rejectionReason } = req.body;

    if (!['NOT_APPLIED', 'JOIN_PENDING', 'APPROVED', 'REJECTED'].includes(clubStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid club status provided.',
      });
    }

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found.',
      });
    }

    if (clubStatus === 'APPROVED' && (registration.paymentStatus !== 'PAID' || registration.verificationStatus !== 'VERIFIED')) {
      return res.status(400).json({
        success: false,
        message: 'Security requirement failed: A player must have Payment = PAID and Verification = VERIFIED before club membership can be approved.',
      });
    }

    registration.clubStatus = clubStatus;
    if (clubStatus === 'APPROVED') {
      registration.clubApprovedAt = new Date();
      registration.clubApprovedBy = req.admin._id;
    }
    if (rejectionReason) {
      registration.rejectionReason = rejectionReason;
    }

    await registration.save();

    await AuditLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: clubStatus === 'APPROVED' ? 'APPROVE_CLUB_ACCESS' : 'REJECT_CLUB_ACCESS',
      targetRegistrationId: registration.registrationId,
      details: { chessUsername: registration.chessUsername, clubStatus, rejectionReason },
    });

    res.json({
      success: true,
      message: `Club status updated to ${clubStatus}.`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Reject or Refund Registration
export const rejectOrRefundRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'REJECT' or 'REFUND'

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    if (action === 'REFUND') {
      registration.paymentStatus = 'REFUNDED';
      registration.verificationStatus = 'REJECTED';
      registration.clubStatus = 'REJECTED';
      registration.rejectionReason = reason || 'Payment refunded by tournament organizer.';
    } else {
      registration.verificationStatus = 'REJECTED';
      registration.clubStatus = 'REJECTED';
      registration.rejectionReason = reason || 'Registration rejected during organizer verification.';
    }

    await registration.save();

    await AuditLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: action === 'REFUND' ? 'REFUND_PAYMENT' : 'REJECT_REGISTRATION',
      targetRegistrationId: registration.registrationId,
      details: { reason },
    });

    res.json({
      success: true,
      message: `Registration successfully updated (${action}).`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// 8. Get Audit & Activity Logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
