import { getProfile as getFirestoreProfile, saveProfile as saveFirestoreProfile } from '../services/firestoreService.js';

// In-memory fallback if Firebase admin service account is not provided
const fallbackProfiles = new Map();

export const getProfile = async (req, res, next) => {
  try {
    try {
      const profile = await getFirestoreProfile(req.user.id);
      return res.json({ success: true, data: profile });
    } catch (firestoreError) {
      // Fallback in-memory profile
      const cached = fallbackProfiles.get(req.user.id) || null;
      return res.json({ success: true, data: cached });
    }
  } catch (error) { next(error); }
};

export const saveProfile = async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = String(body.name || req.user.name || '').trim();
    const email = String(req.user.email || body.email || '').trim();
    const completed = Boolean(name && body.age && body.gender && body.height && body.currentWeight);
    const avatar = body.avatar === 'sushi' ? 'sushi' : (body.avatar || 'taco');
    const goals = {
      calorieGoal: Number(body.calorieGoal) || 2000,
      proteinGoal: Number(body.proteinGoal) || 120,
      carbsGoal: Number(body.carbsGoal) || 250,
      fatGoal: Number(body.fatGoal) || 70
    };
    const profileData = {
      ...body,
      ...goals,
      userId: req.user.id,
      name,
      email,
      avatar,
      completed
    };

    try {
      const profile = await saveFirestoreProfile(req.user.id, profileData, req.user);
      return res.json({ success: true, data: profile });
    } catch (firestoreError) {
      fallbackProfiles.set(req.user.id, profileData);
      return res.json({ success: true, data: profileData });
    }
  } catch (error) { next(error); }
};
