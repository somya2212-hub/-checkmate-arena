import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
    },
    chessUsername: {
      type: String,
      required: [true, 'Chess.com username is required'],
      trim: true,
      lowercase: true,
    },
    chessUsernameDisplay: {
      type: String,
      trim: true,
    },

    // Payment details
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paidAt: {
      type: Date,
    },

    // Manual WhatsApp / Organizer Verification Details
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    verificationNotes: {
      type: String,
    },

    // Private Chess.com Club Access Status
    clubStatus: {
      type: String,
      enum: ['NOT_APPLIED', 'JOIN_PENDING', 'APPROVED', 'REJECTED'],
      default: 'NOT_APPLIED',
      index: true,
    },
    clubApprovedAt: {
      type: Date,
    },
    clubApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    rejectionReason: {
      type: String,
    },

    // Metadata
    ipAddress: { type: String },
    userAgent: { type: String },
    confirmedTerms: { type: Boolean, default: true },
    confirmedAccountOwnership: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index to help fast lookups & duplicate detection
registrationSchema.index({ tournamentId: 1, chessUsername: 1 });
registrationSchema.index({ tournamentId: 1, paymentStatus: 1 });

export const Registration = mongoose.model('Registration', registrationSchema);
