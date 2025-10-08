import React from 'react';

const StatsCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2 flex flex-col items-center justify-center">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 dark:text-gray-400">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      {trend && (
        <div className={`text-sm ${trend > 0 ? 'text-success' : 'text-danger'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};

export default StatsCard;