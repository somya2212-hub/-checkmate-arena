import { Tournament } from '../models/Tournament.js';
import { Registration } from '../models/Registration.js';
import { User } from '../models/User.js';
import { generateRegistrationId } from '../utils/generateRegistrationId.js';
import {
  razorpayInstance,
  isDemoMode,
  key_id,
  verifyRazorpaySignature,
} from '../config/razorpay.js';

// 1. Create Pending Registration & Razorpay Order
export const createRegistrationOrder = async (req, res, next) => {
  try {
    const authUser = req.user || req.firebaseUser;
    const firebaseUid = authUser?.uid;
    const verifiedEmail = (authUser?.email || '').toLowerCase();
    const {
      tournamentId,
      fullName,
      phone,
      whatsappNumber,
      chessUsername,
      confirmedAccountOwnership,
      confirmedTerms,
    } = req.body;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in with Google before registering.',
      });
    }

    if (!fullName || !phone || !chessUsername) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Full Name, Phone, and Chess.com Username.',
      });
    }

    if (!verifiedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Your Google account does not have an email we can use. Please use another Google account.',
      });
    }

    if (!confirmedAccountOwnership || !confirmedTerms) {
      return res.status(400).json({
        success: false,
        message: 'You must confirm Chess.com account ownership and agree to tournament rules.',
      });
    }

    const cleanChessUsername = chessUsername.trim().toLowerCase();
    const cleanEmail = verifiedEmail;
    const cleanPhone = phone.trim();

    // Check tournament status and capacity
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Selected tournament was not found.',
      });
    }

    if (tournament.status !== 'REGISTRATION_OPEN') {
      return res.status(400).json({
        success: false,
        message: `Registrations for this tournament are currently ${tournament.status.toLowerCase().replace('_', ' ')}.`,
      });
    }

    const currentPaidCount = await Registration.countDocuments({
      tournamentId: tournament._id,
      paymentStatus: 'PAID',
    });

    if (currentPaidCount >= tournament.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Tournament capacity has been reached. Registrations are full.',
      });
    }

    // Check duplicate: Is this Chess.com username already registered with PAID status?
    const existingPaid = await Registration.findOne({
      tournamentId: tournament._id,
      chessUsername: cleanChessUsername,
      paymentStatus: 'PAID',
    });

    if (existingPaid) {
      return res.status(400).json({
        success: false,
        message: `The Chess.com username "${chessUsername}" is already registered for this tournament with Registration ID: ${existingPaid.registrationId}.`,
      });
    }

    const existingPaidForUser = await Registration.findOne({
      tournamentId: tournament._id,
      firebaseUid,
      paymentStatus: 'PAID',
    });

    if (existingPaidForUser) {
      return res.status(400).json({
        success: false,
        message: `This Google account is already registered for this tournament with Registration ID: ${existingPaidForUser.registrationId}.`,
      });
    }

    const amountInPaise = Math.round(tournament.entryFee * 100);
    let orderId = '';

    if (!isDemoMode && razorpayInstance) {
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        notes: {
          tournamentId: tournament._id.toString(),
          chessUsername: cleanChessUsername,
        },
      });
      orderId = order.id;
    } else {
      // Mock Sandbox Mode for seamless testing without live Razorpay credentials
      orderId = `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    // Ensure MongoDB User is created or updated with verified Firebase info
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      {
        $set: {
          name: authUser?.name || fullName.trim(),
          email: cleanEmail,
          profilePhoto: authUser?.picture || '',
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // Create or update pending registration
    const registration = await Registration.create({
      firebaseUid,
      userId: user?._id,
      tournamentId: tournament._id,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      whatsappNumber: (whatsappNumber || cleanPhone).trim(),
      chessUsername: cleanChessUsername,
      chessUsernameDisplay: chessUsername.trim(),
      paymentStatus: 'PENDING',
      razorpayOrderId: orderId,
      amountPaid: tournament.entryFee,
      currency: tournament.currency || 'INR',
      confirmedTerms: Boolean(confirmedTerms),
      confirmedAccountOwnership: Boolean(confirmedAccountOwnership),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      data: {
        orderId,
        amount: tournament.entryFee,
        amountInPaise,
        currency: tournament.currency || 'INR',
        keyId: key_id,
        isDemoMode,
        tournamentTitle: tournament.title,
        registrationMongoId: registration._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Verify Razorpay Payment and Issue Unique Registration ID
export const verifyPaymentAndConfirm = async (req, res, next) => {
  try {
    const authUser = req.user || req.firebaseUser;
    const currentUid = authUser?.uid;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment ID are required for verification.',
      });
    }

    // Find pending registration by order ID
    const registration = await Registration.findOne({
      razorpayOrderId: razorpay_order_id,
    }).populate('tournamentId');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No registration session found for this Order ID.',
      });
    }

    if (registration.firebaseUid !== currentUid) {
      return res.status(403).json({
        success: false,
        message: 'This payment session belongs to a different signed-in account.',
      });
    }

    if (registration.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        message: 'Payment was already confirmed.',
        data: formatRegistrationSuccess(registration),
      });
    }

    // Verify cryptographic signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      registration.paymentStatus = 'FAILED';
      await registration.save();
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Please contact tournament support.',
      });
    }

    // Double check capacity at the exact moment of payment
    const currentPaid = await Registration.countDocuments({
      tournamentId: registration.tournamentId._id,
      paymentStatus: 'PAID',
    });

    if (currentPaid >= registration.tournamentId.maxParticipants) {
      registration.paymentStatus = 'REFUNDED';
      registration.rejectionReason = 'Tournament capacity reached right before payment completion. Automatically marked for refund.';
      await registration.save();
      return res.status(400).json({
        success: false,
        message: 'Tournament capacity reached before payment capture. Please contact support for an immediate refund.',
      });
    }

    // Generate unique Registration ID (CA-XXXXXX) with collision avoidance
    let uniqueRegId = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      uniqueRegId = generateRegistrationId();
      const existing = await Registration.findOne({ registrationId: uniqueRegId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    registration.registrationId = uniqueRegId;
    registration.paymentStatus = 'PAID';
    registration.razorpayPaymentId = razorpay_payment_id;
    registration.razorpaySignature = razorpay_signature;
    registration.paidAt = new Date();
    registration.verificationStatus = 'PENDING'; // Ready for manual WhatsApp / Admin verification

    await registration.save();

    res.json({
      success: true,
      message: 'Payment verified and registration confirmed!',
      data: formatRegistrationSuccess(registration),
    });
  } catch (error) {
    next(error);
  }
};

// 3. Lookup Registration Status (Safe privacy verification)
export const lookupRegistration = async (req, res, next) => {
  try {
    const { registrationId, emailOrPhone } = req.body;

    if (!registrationId || !emailOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Registration ID and your registered Email or Phone Number.',
      });
    }

    const cleanRegId = registrationId.trim().toUpperCase();
    const cleanSearch = emailOrPhone.trim().toLowerCase();

    const registration = await Registration.findOne({
      registrationId: cleanRegId,
      $or: [
        { email: cleanSearch },
        { phone: cleanSearch },
        { whatsappNumber: cleanSearch },
      ],
      paymentStatus: 'PAID',
    }).populate('tournamentId');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No paid registration found matching the given Registration ID and contact detail. Please check and try again.',
      });
    }

    const tournament = registration.tournamentId;

    const responseData = {
      registrationId: registration.registrationId,
      chessUsername: registration.chessUsernameDisplay || registration.chessUsername,
      fullName: registration.fullName,
      tournament: {
        title: tournament.title,
        date: tournament.date,
        startTime: tournament.startTime,
        timeZone: tournament.timeZone,
        format: tournament.format,
        timeControl: tournament.timeControl,
        whatsappSupportNumber: tournament.whatsappSupportNumber,
      },
      paymentStatus: registration.paymentStatus,
      paidAt: registration.paidAt,
      amountPaid: registration.amountPaid,
      currency: registration.currency,
      verificationStatus: registration.verificationStatus,
      verifiedAt: registration.verifiedAt,
      clubStatus: registration.clubStatus,
      rejectionReason: registration.rejectionReason,
    };

    // If verified by organizer, include private club link and instructions
    if (registration.verificationStatus === 'VERIFIED') {
      responseData.chessClub = {
        name: tournament.chessClubName,
        link: tournament.chessClubLink,
        instructions: tournament.chessClubInstructions,
      };
    }

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Public Safe Registered Players List
export const getPublicRegisteredPlayers = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    let filter = { paymentStatus: 'PAID' };
    if (tournamentId && tournamentId !== 'all') {
      filter.tournamentId = tournamentId;
    }

    const registrations = await Registration.find(filter)
      .select('chessUsername chessUsernameDisplay verificationStatus clubStatus createdAt')
      .sort({ createdAt: 1 });

    const safePlayers = registrations.map((r, index) => ({
      seed: index + 1,
      chessUsername: r.chessUsernameDisplay || r.chessUsername,
      verificationStatus: r.verificationStatus,
      clubStatus: r.clubStatus,
      registeredAt: r.createdAt,
    }));

    res.json({
      success: true,
      count: safePlayers.length,
      data: safePlayers,
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Format success payload
function formatRegistrationSuccess(registration) {
  const tournament = registration.tournamentId;
  const whatsappNumber = tournament?.whatsappSupportNumber?.replace(/[^0-9+]/g, '') || '919876543210';
  const cleanNumber = whatsappNumber.startsWith('+') ? whatsappNumber.substring(1) : whatsappNumber;

  const message = `Hello Checkmate Arena,%0A%0AI have registered for the tournament.%0A%0ARegistration ID: ${registration.registrationId}%0AChess.com Username: ${registration.chessUsernameDisplay || registration.chessUsername}%0A%0APlease verify my registration and provide the next steps for joining the private Chess.com club.%0A%0AThank you.`;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return {
    registrationId: registration.registrationId,
    chessUsername: registration.chessUsernameDisplay || registration.chessUsername,
    fullName: registration.fullName,
    email: registration.email,
    phone: registration.phone,
    amountPaid: registration.amountPaid,
    paymentStatus: registration.paymentStatus,
    paidAt: registration.paidAt,
    tournamentTitle: tournament?.title || 'Checkmate Arena Tournament',
    tournamentDate: tournament?.date,
    whatsappUrl,
    whatsappNumber,
  };
}
