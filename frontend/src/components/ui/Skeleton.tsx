'use client';

import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({ width = '100%', height = '1rem', className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-slate-200 dark:bg-zinc-800 ${className}`} style={{ width, height }} />;
}
