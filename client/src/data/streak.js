import { getProgressApi } from '../services/api';

export const WEEK_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Edit this rule later if the goal changes (for example, hitting calorie goal).
export function dayCounts(day) {
  return Boolean(day && day.meals && day.meals.length > 0);
}

// days: array of { date: 'YYYY-MM-DD', meals: [...] }, newest last.
export function calculateStreak(days = []) {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (dayCounts(days[i])) streak += 1;
    else break;
  }
  return streak;
}

// Returns the last 7 days, Sunday to Saturday of the current week, with a status for each.
export function currentWeek(days = [], today = new Date()) {
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  return WEEK_LABELS.map((label, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const entry = days.find((d) => d.date === key);
    return {
      label,
      key,
      isToday: key === today.toISOString().slice(0, 10),
      isFuture: date > today,
      done: dayCounts(entry),
    };
  });
}

// Fetch streak and recent days using existing getProgressApi
export async function getStreakData() {
  try {
    const res = await getProgressApi('week');
    const days = res?.data?.data?.days || [];
    const streak = calculateStreak(days);
    const week = currentWeek(days);
    return { streak, days, week };
  } catch {
    return { streak: 0, days: [], week: currentWeek([]) };
  }
}
