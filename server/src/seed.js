import { Admin } from './models/Admin.js';
import { Tournament } from './models/Tournament.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin
    const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@checkmatearena.com').toLowerCase().trim();
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await Admin.create({
        name: 'Checkmate Arena Lead Organizer',
        email: adminEmail,
        password: process.env.ADMIN_DEFAULT_PASSWORD || 'CheckmateAdmin@2025',
        role: 'SUPER_ADMIN',
      });
      console.log(`[Seed] Created default admin: ${adminEmail}`);
    }

    // 2. Seed Default Tournament if no tournaments exist
    const tournamentCount = await Tournament.countDocuments();
    if (tournamentCount === 0) {
      await Tournament.create({
        title: 'Checkmate Arena Rapid Open — Season 1',
        slug: 'season-1-rapid-open',
        tagline: 'Competitive Online Chess Tournament Hosted on Private Chess.com Club',
        description:
          'Join India’s premier verified online chess championship. Compete against rated club players, Grandmasters, and emerging chess prodigies across 7 rounds of Swiss system Rapid chess in a secure, anti-cheat monitored private Chess.com arena.',
        date: 'Saturday, November 21, 2026',
        startTime: '06:00 PM',
        timeZone: 'IST (UTC+5:30)',
        registrationDeadline: 'Friday, November 20, 2026, 11:59 PM',
        entryFee: 199,
        currency: 'INR',
        prizePool: 10000,
        prizeDistribution: [
          { place: '1st Place (Champion)', amount: 5000, badge: 'gold', description: 'Winner Trophy + Cash Prize' },
          { place: '2nd Place (Runner-up)', amount: 3000, badge: 'silver', description: 'Silver Medal + Cash Prize' },
          { place: '3rd Place', amount: 1500, badge: 'bronze', description: 'Bronze Medal + Cash Prize' },
          { place: 'Best Under-1600 Rating', amount: 500, badge: 'medal', description: 'Category Cash Prize' },
        ],
        maxParticipants: 128,
        format: 'Swiss System (7 Rounds)',
        timeControl: '10 min + 0 sec (Rapid)',
        roundsCount: 7,
        platform: 'Chess.com',
        status: 'REGISTRATION_OPEN',
        isFeatured: true,
        chessClubName: 'Checkmate Arena Elite Club',
        chessClubLink: 'https://www.chess.com/club/checkmate-arena-elite',
        chessClubInstructions:
          '1. Login to Chess.com with your registered username.\n2. Click the private club invite link provided in your verified pass.\n3. Request membership with your Registration ID in the join note.\n4. Organizers will cross-reference your verified ID and admit you before Round 1 begins.',
        whatsappSupportNumber: process.env.WHATSAPP_SUPPORT_NUMBER || '+919876543210',
        rules: [
          'All participants must register with the exact Chess.com username they will play from.',
          'Strict Fair Play: Chess engine use, opening book consult during play, or assistance from third parties is strictly prohibited.',
          'Check-in is mandatory 15 minutes prior to 06:00 PM IST inside the private Chess.com club tournament lobby.',
          'Pairings are generated automatically by Chess.com using standard Swiss pairing algorithms.',
          'No postponement or game resets are permitted for personal internet connectivity issues.',
          'Tie-break criteria: Buchholz Cut 1, Sonneborn-Berger, and Direct Encounter.',
        ],
        fairPlayPolicy:
          'Fair play is strictly enforced through Chess.com automated anti-cheat systems alongside post-tournament game review by our arbiter team. Any player flagged or closed by Chess.com will be immediately disqualified and forfeit prize eligibility. Organizers reserve the right to review suspicious accuracy metrics.',
        refundPolicy:
          'Cancellations requested 24 hours prior to the registration deadline will receive a 100% refund upon contacting WhatsApp support with the Registration ID. No refunds are provided for no-shows, network drops, or disqualifications.',
      });
      console.log('[Seed] Created default featured tournament.');
    }
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};
