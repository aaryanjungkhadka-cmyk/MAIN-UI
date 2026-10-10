import React, { useEffect, useState } from 'react';
import { FoodCard } from '../components/FoodCard';
import { useNutrition } from '../hooks/useNutrition';

export const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const { getHistory, loading } = useNutrition();

  useEffect(() => {
    getHistory()
      .then((res) => setLogs(res.data || []))
      .catch(() => setLogs([]));
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#1F4D33' }}>
        Nutrition Dashboard & History
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {logs.map((item) => (
          <FoodCard
            key={item._id}
            foodName={item.foodName}
            calories={item.calories}
            macros={item.macros}
            healthScore={item.healthScore}
            insights={item.insights}
          />
        ))}
      </div>
    </div>
  );
};
