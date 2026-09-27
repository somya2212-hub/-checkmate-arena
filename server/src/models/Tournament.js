import mongoose from 'mongoose';

const prizeDistributionSchema = new mongoose.Schema({
  place: { type: String, required: true }, // e.g. "1st Place", "2nd Place"
  amount: { type: Number, required: true }, // e.g. 5000
  badge: { type: String, default: 'trophy' }, // 'gold', 'silver', 'bronze', 'medal'
  description: { type: String, default: '' },
});

const tournamentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: 'Competitive Online Chess Tournament' },
    description: { type: String, required: true },
    
    // Schedule & Timings
    date: { type: String, required: true }, // e.g. "October 15, 2026"
    startTime: { type: String, required: true }, // e.g. "06:00 PM"
    timeZone: { type: String, default: 'IST (UTC+5:30)' },
    registrationDeadline: { type: String, required: true }, // e.g. "October 14, 2026, 11:59 PM"
    
    // Financial & Capacity
    entryFee: { type: Number, required: true, min: 0 }, // e.g. 199
    currency: { type: String, default: 'INR' },
    prizePool: { type: Number, required: true, min: 0 }, // e.g. 10000
    prizeDistribution: [prizeDistributionSchema],
    maxParticipants: { type: Number, required: true, min: 2, default: 128 },
    
    // Chess Format
    format: { type: String, default: 'Swiss System (7 Rounds)' },
    timeControl: { type: String, default: '10 min + 0 sec (Rapid)' },
    roundsCount: { type: Number, default: 7 },
    platform: { type: String, default: 'Chess.com' },
    
    // Status & Controls
    status: {
      type: String,
      enum: ['UPCOMING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'],
      default: 'REGISTRATION_OPEN',
    },
    isFeatured: { type: Boolean, default: true },

    // Verification & Club Access (Sensitive - club URL is protected)
    chessClubName: { type: String, default: 'Checkmate Arena Elite Club' },
    chessClubLink: { type: String, default: 'https://www.chess.com/club/checkmate-arena-elite' },
    chessClubInstructions: {
      type: String,
      default:
        '1. Login to Chess.com with your registered username.\n2. Click the private club invite link.\n3. Request to join with your Registration ID in the join message note.\n4. Admin will cross-reference your verified registration and approve access within 2 hours.',
    },
    whatsappSupportNumber: { type: String, default: '+919876543210' },

    // Rules & Policies
    rules: {
      type: [String],
      default: [
        'Players must use the exact Chess.com username entered during registration.',
        'Strict Fair Play: Zero tolerance for chess engines, browser extensions, tablebases, or third-party assistance.',
        'Check-in is required 15 minutes before Round 1 begins in the private Chess.com club tournament lobby.',
        'Pairings are generated automatically by Chess.com using standard Swiss tournament pairing rules.',
        'Disconnections will result in loss of time. No game resets are granted for personal network issues.',
        'Tie-breaks follow Buchholz Cut 1, Sonneborn-Berger, and Direct Encounter system.',
      ],
    },
    fairPlayPolicy: {
      type: String,
      default:
        'All games are analyzed by Chess.com Anti-Cheating algorithms and post-tournament review. Players found violating fair play by Chess.com will be disqualified immediately and forfeit all prize eligibility. Checkmate Arena adheres strictly to official Chess.com fair play decisions.',
    },
    refundPolicy: {
      type: String,
      default:
        '100% refund available if cancellation is requested at least 24 hours prior to the registration deadline via WhatsApp support with your Registration ID. No refunds are granted for no-shows, disconnections, or disqualifications.',
    },

    // Results (for completed tournaments)
    results: {
      isPublished: { type: Boolean, default: false },
      winner: { type: String, default: '' },
      runnerUp: { type: String, default: '' },
      thirdPlace: { type: String, default: '' },
      standingsUrl: { type: String, default: '' },
      summary: { type: String, default: '' },
      publishedAt: { type: Date },
    },
  },
  { timestamps: true }
);

tournamentSchema.index({ status: 1 });

export const Tournament = mongoose.model('Tournament', tournamentSchema);
