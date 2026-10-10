import { randomUUID } from 'node:crypto';

// In-memory meal store with realistic default mock meals for testing
const inMemoryMeals = new Map();
const inMemoryScans = new Map();

// Generate dates for the past 7 days
const appTimeZone = process.env.APP_TIME_ZONE || 'Asia/Kathmandu';
export const dateKey = (date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: appTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(date));
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

export const addDaysToKey = (key, amount) => {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateKey(date);
};

const dayLabel = (date, days) =>
  days <= 7
    ? new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: appTimeZone }).format(date)
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: appTimeZone }).format(date);

const getSampleMeals = () => {
  const now = new Date();
  const todayKey = dateKey(now);
  const yesterdayKey = addDaysToKey(todayKey, -1);
  const twoDaysAgoKey = addDaysToKey(todayKey, -2);
  const threeDaysAgoKey = addDaysToKey(todayKey, -3);

  return [
    {
      _id: 'sample-meal-1',
      id: 'sample-meal-1',
      foodName: 'Avocado Toast & Poached Egg',
      mealName: 'Avocado Toast & Poached Egg',
      calories: 380,
      protein: 16,
      carbs: 32,
      fat: 22,
      fiber: 7,
      sodium: 410,
      itemCount: 2,
      items: [
        { name: 'Sourdough bread with mashed avocado', calories: 290, protein: 9, carbs: 31, fat: 17, fiber: 6 },
        { name: 'Poached free-range egg', calories: 90, protein: 7, carbs: 1, fat: 5, fiber: 1 }
      ],
      createdAt: `${todayKey}T08:30:00.000Z`,
      savedAt: `${todayKey}T08:30:00.000Z`,
      tracked: true
    },
    {
      _id: 'sample-meal-2',
      id: 'sample-meal-2',
      foodName: 'Grilled Chicken & Quinoa Salad',
      mealName: 'Grilled Chicken & Quinoa Salad',
      calories: 520,
      protein: 42,
      carbs: 48,
      fat: 16,
      fiber: 9,
      sodium: 520,
      itemCount: 3,
      items: [
        { name: 'Grilled lemon herb chicken breast', calories: 240, protein: 34, carbs: 0, fat: 9, fiber: 0 },
        { name: 'Cooked tri-color quinoa', calories: 180, protein: 6, carbs: 34, fat: 3, fiber: 5 },
        { name: 'Mixed greens with olive oil & feta', calories: 100, protein: 2, carbs: 14, fat: 4, fiber: 4 }
      ],
      createdAt: `${todayKey}T13:15:00.000Z`,
      savedAt: `${todayKey}T13:15:00.000Z`,
      tracked: true
    },
    {
      _id: 'sample-meal-3',
      id: 'sample-meal-3',
      foodName: 'Steamed Momos with Achar',
      mealName: 'Steamed Momos with Achar',
      calories: 460,
      protein: 24,
      carbs: 56,
      fat: 14,
      fiber: 4,
      sodium: 680,
      itemCount: 2,
      items: [
        { name: 'Chicken steamed momos (8 pcs)', calories: 410, protein: 23, carbs: 52, fat: 12, fiber: 3 },
        { name: 'Spicy tomato sesame achar dip', calories: 50, protein: 1, carbs: 4, fat: 2, fiber: 1 }
      ],
      createdAt: `${yesterdayKey}T19:00:00.000Z`,
      savedAt: `${yesterdayKey}T19:00:00.000Z`,
      tracked: true
    },
    {
      _id: 'sample-meal-4',
      id: 'sample-meal-4',
      foodName: 'Nepali Dal Bhat Tarkari',
      mealName: 'Nepali Dal Bhat Tarkari',
      calories: 640,
      protein: 26,
      carbs: 98,
      fat: 15,
      fiber: 12,
      sodium: 710,
      itemCount: 3,
      items: [
        { name: 'Steamed basmati rice', calories: 290, protein: 5, carbs: 64, fat: 1, fiber: 2 },
        { name: 'Yellow lentil dal soup', calories: 190, protein: 13, carbs: 26, fat: 3, fiber: 6 },
        { name: 'Cauliflower & potato curry (Aloo Gobi)', calories: 160, protein: 8, carbs: 8, fat: 11, fiber: 4 }
      ],
      createdAt: `${twoDaysAgoKey}T13:00:00.000Z`,
      savedAt: `${twoDaysAgoKey}T13:00:00.000Z`,
      tracked: true
    },
    {
      _id: 'sample-meal-5',
      id: 'sample-meal-5',
      foodName: 'Greek Yogurt Berry Bowl',
      mealName: 'Greek Yogurt Berry Bowl',
      calories: 310,
      protein: 22,
      carbs: 38,
      fat: 6,
      fiber: 5,
      sodium: 95,
      itemCount: 3,
      items: [
        { name: 'Plain 0% Greek yogurt', calories: 150, protein: 18, carbs: 8, fat: 0, fiber: 0 },
        { name: 'Granola with pumpkin seeds', calories: 110, protein: 3, carbs: 22, fat: 5, fiber: 3 },
        { name: 'Fresh blueberries and honey', calories: 50, protein: 1, carbs: 8, fat: 1, fiber: 2 }
      ],
      createdAt: `${threeDaysAgoKey}T09:00:00.000Z`,
      savedAt: `${threeDaysAgoKey}T09:00:00.000Z`,
      tracked: true
    }
  ];
};

export const getInMemoryUserMeals = (userId) => {
  if (!inMemoryMeals.has(userId)) {
    inMemoryMeals.set(userId, getSampleMeals());
  }
  return inMemoryMeals.get(userId) || [];
};

export const addInMemoryUserMeal = (userId, meal) => {
  const current = getInMemoryUserMeals(userId);
  const newMeal = {
    _id: meal.id || meal.scanId || randomUUID(),
    id: meal.id || meal.scanId || randomUUID(),
    createdAt: new Date().toISOString(),
    savedAt: new Date().toISOString(),
    tracked: true,
    ...meal
  };
  current.unshift(newMeal);
  inMemoryMeals.set(userId, current);
  return newMeal;
};

export const buildInMemoryProgress = (userId, period = 'week', profileGoals = null) => {
  const meals = getInMemoryUserMeals(userId);
  const daysCount = ({ week: 7, 'two-weeks': 14, month: 30 })[period] || 7;
  const todayKey = dateKey(new Date());
  const firstDayKey = addDaysToKey(todayKey, -daysCount + 1);

  const byDay = new Map();
  for (let index = 0; index < daysCount; index += 1) {
    const key = addDaysToKey(firstDayKey, index);
    byDay.set(key, {
      date: key,
      label: dayLabel(new Date(`${key}T12:00:00Z`), daysCount),
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      meals: []
    });
  }

  for (const meal of meals) {
    const day = byDay.get(dateKey(meal.createdAt));
    if (!day) continue;
    const calories = Number(meal.calories || meal.totals?.calories || 0);
    const protein = Number(meal.protein || meal.totals?.protein || 0);
    const carbs = Number(meal.carbs || meal.totals?.carbohydrates || 0);
    const fat = Number(meal.fat || meal.totals?.fat || 0);
    const fiber = Number(meal.fiber || meal.totals?.fiber || 0);

    day.calories += calories;
    day.protein += protein;
    day.carbs += carbs;
    day.fat += fat;
    day.fiber += fiber;
    day.meals.push({
      id: meal.id || meal._id,
      name: meal.foodName || meal.mealName,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sodium: Number(meal.sodium || meal.totals?.sodium || 0),
      items: meal.items?.length || 1,
      image: meal.image || meal.imageUrl,
      createdAt: meal.createdAt
    });
  }

  const days = [...byDay.values()];
  const totals = days.reduce(
    (sum, day) => ({
      calories: sum.calories + day.calories,
      protein: sum.protein + day.protein,
      carbs: sum.carbs + day.carbs,
      fat: sum.fat + day.fat,
      fiber: sum.fiber + day.fiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const goals = {
    calories: Number(profileGoals?.calorieGoal) || 2000,
    protein: Number(profileGoals?.proteinGoal) || 120,
    carbs: Number(profileGoals?.carbsGoal) || 250,
    fat: Number(profileGoals?.fatGoal) || 70,
    fiber: 30
  };

  const today = byDay.get(todayKey) || {
    date: todayKey,
    meals: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  };

  const completion = Object.fromEntries(
    Object.entries(goals).map(([key, goal]) => [
      key,
      goal > 0 ? Math.round((today[key] / goal) * 100) : 0
    ])
  );

  // calculate streak
  const dates = new Set(meals.map((m) => dateKey(m.createdAt)));
  let streak = 0;
  let cursor = todayKey;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addDaysToKey(cursor, -1);
  }

  return { period, goals, days, totals, today, completion, streak };
};
