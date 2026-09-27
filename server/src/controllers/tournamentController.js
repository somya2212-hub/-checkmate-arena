import { Tournament } from '../models/Tournament.js';
import { Registration } from '../models/Registration.js';
import { AuditLog } from '../models/AuditLog.js';

// Get current featured/active tournament with dynamic registration count
export const getFeaturedTournament = async (req, res, next) => {
  try {
    let tournament = await Tournament.findOne({ isFeatured: true, status: { $ne: 'COMPLETED' } }).sort({ createdAt: -1 });

    if (!tournament) {
      tournament = await Tournament.findOne().sort({ createdAt: -1 });
    }

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'No tournament configured currently.',
      });
    }

    // Count actual PAID registrations from database
    const registeredCount = await Registration.countDocuments({
      tournamentId: tournament._id,
      paymentStatus: 'PAID',
    });

    // Public view: strip private club link unless verified
    const tournamentObj = tournament.toObject();
    delete tournamentObj.chessClubLink;

    res.json({
      success: true,
      data: {
        ...tournamentObj,
        registeredCount,
        spotsLeft: Math.max(0, tournament.maxParticipants - registeredCount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single tournament by slug
export const getTournamentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const tournament = await Tournament.findOne({ slug });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found.',
      });
    }

    const registeredCount = await Registration.countDocuments({
      tournamentId: tournament._id,
      paymentStatus: 'PAID',
    });

    const tournamentObj = tournament.toObject();
    delete tournamentObj.chessClubLink;

    res.json({
      success: true,
      data: {
        ...tournamentObj,
        registeredCount,
        spotsLeft: Math.max(0, tournament.maxParticipants - registeredCount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all previous tournaments (completed or with published results)
export const getPreviousTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find({
      $or: [{ status: 'COMPLETED' }, { 'results.isPublished': true }],
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all tournaments
export const adminGetAllTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    
    // Add registered count to each
    const tournamentsWithStats = await Promise.all(
      tournaments.map(async (t) => {
        const paidCount = await Registration.countDocuments({ tournamentId: t._id, paymentStatus: 'PAID' });
        const verifiedCount = await Registration.countDocuments({ tournamentId: t._id, verificationStatus: 'VERIFIED' });
        return {
          ...t.toObject(),
          paidCount,
          verifiedCount,
        };
      })
    );

    res.json({
      success: true,
      data: tournamentsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create tournament
export const adminCreateTournament = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      tagline,
      description,
      date,
      startTime,
      timeZone,
      registrationDeadline,
      entryFee,
      prizePool,
      prizeDistribution,
      maxParticipants,
      format,
      timeControl,
      roundsCount,
      chessClubName,
      chessClubLink,
      chessClubInstructions,
      whatsappSupportNumber,
      rules,
      fairPlayPolicy,
      refundPolicy,
      status,
      isFeatured,
    } = req.body;

    const existingSlug = await Tournament.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A tournament with this URL slug already exists. Please choose a unique slug.',
      });
    }

    if (isFeatured) {
      await Tournament.updateMany({}, { isFeatured: false });
    }

    const tournament = await Tournament.create({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline,
      description,
      date,
      startTime,
      timeZone,
      registrationDeadline,
      entryFee: Number(entryFee),
      prizePool: Number(prizePool),
      prizeDistribution,
      maxParticipants: Number(maxParticipants) || 128,
      format,
      timeControl,
      roundsCount: Number(roundsCount) || 7,
      chessClubName,
      chessClubLink,
      chessClubInstructions,
      whatsappSupportNumber,
      rules,
      fairPlayPolicy,
      refundPolicy,
      status: status || 'REGISTRATION_OPEN',
      isFeatured: isFeatured !== undefined ? isFeatured : true,
    });

    await AuditLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'UPDATE_TOURNAMENT',
      details: { message: `Created tournament: ${tournament.title}`, tournamentId: tournament._id },
    });

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully.',
      data: tournament,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update tournament
export const adminUpdateTournament = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.isFeatured) {
      await Tournament.updateMany({ _id: { $ne: id } }, { isFeatured: false });
    }

    const tournament = await Tournament.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found.',
      });
    }

    await AuditLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'UPDATE_TOURNAMENT',
      details: { message: `Updated tournament: ${tournament.title}`, tournamentId: tournament._id },
    });

    res.json({
      success: true,
      message: 'Tournament updated successfully.',
      data: tournament,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Publish / Update results
export const adminPublishResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { winner, runnerUp, thirdPlace, standingsUrl, summary, isPublished, setStatusCompleted } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found.',
      });
    }

    tournament.results = {
      isPublished: isPublished !== undefined ? isPublished : true,
      winner: winner || tournament.results?.winner || '',
      runnerUp: runnerUp || tournament.results?.runnerUp || '',
      thirdPlace: thirdPlace || tournament.results?.thirdPlace || '',
      standingsUrl: standingsUrl || tournament.results?.standingsUrl || '',
      summary: summary || tournament.results?.summary || '',
      publishedAt: new Date(),
    };

    if (setStatusCompleted) {
      tournament.status = 'COMPLETED';
    }

    await tournament.save();

    await AuditLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'PUBLISH_RESULTS',
      details: { message: `Published results for: ${tournament.title}`, results: tournament.results },
    });

    res.json({
      success: true,
      message: 'Tournament results updated successfully.',
      data: tournament,
    });
  } catch (error) {
    next(error);
  }
};
