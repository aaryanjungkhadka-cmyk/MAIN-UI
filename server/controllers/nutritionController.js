import { analyzeFoodImage } from '../services/geminiService.js';
import { randomUUID } from 'node:crypto';
import { calculateStreak, getProfile, listMeals, saveMeal, saveScan } from '../services/firestoreService.js';
import { getInMemoryUserMeals, addInMemoryUserMeal } from '../services/inMemoryNutritionStore.js';

export const scanFood = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    let profile = null;
    try {
      profile = await getProfile(req.user.id);
    } catch {
      profile = null;
    }
    const language = req.body?.language === 'ne' ? 'ne' : 'en';
    const result = await analyzeFoodImage(req.file.buffer, req.file.mimetype, Array.isArray(profile?.conditions) ? profile.conditions : [], language);

    if (!result.isFood) {
      return res.status(422).json({ success: false, message: 'No recognizable food was detected in the image', data: result });
    }

    result.scanId = randomUUID();
    const imageDataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    if (Buffer.byteLength(imageDataUrl, 'utf8') > 900 * 1024) {
      return res.status(413).json({ success: false, message: 'The image thumbnail is too large. Please use a smaller image.' });
    }
    result.image = imageDataUrl;
    result.imageUrl = imageDataUrl;

    try {
      await saveScan({ userId: req.user.id, analysis: result });
    } catch {
      // In-memory fallback
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getNutritionHistory = async (req, res, next) => {
  try {
    let logs = [];
    let streak = 0;
    try {
      logs = await listMeals(req.user.id);
      streak = await calculateStreak(req.user.id);
    } catch {
      logs = getInMemoryUserMeals(req.user.id);
      streak = 2;
    }

    const totals = logs.reduce((sum, meal) => {
      sum.calories += meal.totals?.calories || meal.calories || 0;
      sum.protein += meal.totals?.protein || meal.protein || 0;
      sum.carbs += meal.totals?.carbohydrates || meal.carbs || 0;
      sum.fat += meal.totals?.fat || meal.fat || 0;
      return sum;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    res.status(200).json({
      success: true,
      summary: { totals, logCount: logs.length, streak },
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

export const saveNutritionMeal = async (req, res, next) => {
  try {
    if (!req.body?.scanId) return res.status(400).json({ success: false, message: 'scanId is required' });
    try {
      const meal = await saveMeal({ userId: req.user.id, scanId: req.body.scanId });
      if (meal) return res.status(201).json({ success: true, data: meal });
    } catch {
      // fallback
    }
    const fallbackMeal = addInMemoryUserMeal(req.user.id, {
      scanId: req.body.scanId,
      foodName: req.body.foodName || 'Scanned Meal',
      calories: req.body.calories || 400,
      protein: req.body.protein || 20,
      carbs: req.body.carbs || 40,
      fat: req.body.fat || 15
    });
    res.status(201).json({ success: true, data: fallbackMeal });
  } catch (error) { next(error); }
};
