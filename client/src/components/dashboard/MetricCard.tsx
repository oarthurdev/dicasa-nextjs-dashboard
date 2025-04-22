import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  className?: string;
}

export function MetricCard({ title, value, className = "" }: MetricCardProps) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}