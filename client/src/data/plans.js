export const CURRENCY = 'Rs.';

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    yearly: 0,
    tagline: 'Get started with the basics',
    features: ['Basic meal scanning', 'Daily nutrition summary', 'Limited history'],
    current: true,
  },
  {
    id: 'plus',
    name: 'Plus',
    monthly: 499,
    yearly: 4990,
    tagline: 'For people building a steady habit',
    features: ['Everything in Free', 'Full meal history', 'Streak insights', 'Weekly progress report'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 999,
    yearly: 9990,
    tagline: 'For serious tracking and goals',
    features: ['Everything in Plus', 'Custom macro goals', 'Meal plan generator', 'Priority scanning'],
    highlight: true,
  },
  {
    id: 'max',
    name: 'Max',
    monthly: 2499,
    yearly: 24990,
    tagline: 'Everything, with the highest limits',
    features: ['Everything in Pro', 'Highest scan limits', 'Advanced analytics', 'Early access to new features'],
  },
];
