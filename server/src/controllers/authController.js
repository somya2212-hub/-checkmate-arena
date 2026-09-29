import { User } from '../models/User.js';

export const syncCurrentUser = async (req, res, next) => {
  try {
    const authUser = req.user || req.firebaseUser;
    const { uid, email, name, picture } = authUser;

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $set: {
          name: name || '',
          email: (email || '').toLowerCase(),
          profilePhoto: picture || '',
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      success: true,
      data: {
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
