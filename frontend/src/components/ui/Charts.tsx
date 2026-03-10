'use client';
import React from 'react';

interface ChartProps {
  data: number[];
  labels?: string[];
  height?: number;
}

export function BarChart({ data, labels, height = 200 }: ChartProps) {
  const max = Math.max(...data);
  return (
    <div style={{ height }} className="flex items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div 
            className="w-full bg-indigo-600 rounded-t-md transition-all hover:bg-indigo-700" 
            style={{ height: `${(v / max) * 100}%` }}
          />
          {labels?.[i] && <span className="text-xs text-slate-500">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, height = 200 }: ChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
        className="text-indigo-600"
      />
    </svg>
  );
}

export function PieChart({ data, labels }: { data: number[]; labels?: string[] }) {
  const total = data.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  const colors = ['bg-indigo-600', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500', 'bg-purple-500'];

  return (
    <div className="relative w-32 h-32 rounded-full overflow-hidden">
      {data.map((v, i) => {
        const percent = (v / total) * 100;
        const rotate = (cumulative / total) * 360 - 90;
        cumulative += v;
        return (
          <div
            key={i}
            className={`absolute inset-0 ${colors[i % colors.length]}`}
            style={{ 
              clipPath: `conic-gradient(from ${rotate}deg, currentColor 0deg ${percent * 3.6}deg, transparent ${percent * 3.6}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
