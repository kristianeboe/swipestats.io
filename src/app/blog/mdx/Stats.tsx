import React from "react";

interface Stat {
  label: string;
  value: string;
  change?: string;
}

interface StatsProps {
  stats: Stat[];
  title?: string;
}

export function Stats({ stats, title }: StatsProps) {
  return (
    <div className="my-8">
      {title && (
        <h3 className="mb-6 text-center text-lg font-semibold text-gray-900">
          {title}
        </h3>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
            <div className="mt-1 text-sm font-medium text-gray-900">
              {stat.label}
            </div>
            {stat.change && (
              <div className="mt-2 text-sm text-green-600">{stat.change}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
