'use client';

import { Firestore, Timestamp } from 'firebase/firestore';
import { getDailyRatings } from 'hooks/useRatings';
import { useAuth } from 'providers/AuthContext';
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const DailyRatings = () => {
  const [dailyRatings, setDailyRatings] = useState<
    { date: string; score: number }[]
  >([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) throw new Error('User not found');
      const fetchedDailyRatings = await getDailyRatings(currentUser.uid);
      const formattedData = Object.values(fetchedDailyRatings)
        .sort((a, b) => a.date.seconds - b.date.seconds)
        .map((rating) => ({
          date: rating.date.toDate().toLocaleDateString(), // Assuming 'date' is a Firestore Timestamp
          score: rating.score,
        }));
      setDailyRatings(formattedData);
    };

    fetchData();
  }, [currentUser]);

  return (
    <ResponsiveContainer width="80%" height={300}>
      <LineChart
        data={dailyRatings}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis dataKey="score" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const TurnOffDefaultPropsWarning = () => {
  // Override console.error
  // This is a hack to suppress the warning about missing defaultProps in the recharts library
  // @link https://github.com/recharts/recharts/issues/3615
  const error = console.error;

  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  return <div className="absolute h-0 w-0"></div>;
};

export default DailyRatings;
