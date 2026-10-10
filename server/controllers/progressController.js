import { getProgress } from '../services/firestoreService.js';
import { buildInMemoryProgress } from '../services/inMemoryNutritionStore.js';
import { getProfile } from '../services/firestoreService.js';

export const getNutritionProgress = async (req, res, next) => {
  try {
    const period = ['week', 'two-weeks', 'month'].includes(req.query.period) ? req.query.period : 'week';
    try {
      const data = await getProgress({ userId: req.user.id, period });
      return res.json({ success: true, data });
    } catch {
      let profile = null;
      try {
        profile = await getProfile(req.user.id);
      } catch {
        profile = null;
      }
      const data = buildInMemoryProgress(req.user.id, period, profile);
      return res.json({ success: true, data });
    }
  } catch (error) { next(error); }
};
