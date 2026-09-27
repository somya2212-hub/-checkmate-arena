import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'VERIFY_PLAYER',
        'REJECT_REGISTRATION',
        'APPROVE_CLUB_ACCESS',
        'REJECT_CLUB_ACCESS',
        'UPDATE_TOURNAMENT',
        'PUBLISH_RESULTS',
        'REFUND_PAYMENT',
      ],
    },
    targetRegistrationId: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
