import React from 'react';

export default function StatisticCard({ label, value, icon: Icon, trend, className = '' }) {
  return (
    <div className={`bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-4 lg:p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted dark:text-white/60 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-ink dark:text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-primary/10 dark:bg-white/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary dark:text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
