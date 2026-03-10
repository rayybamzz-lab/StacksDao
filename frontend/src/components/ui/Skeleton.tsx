'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-zinc-800',
        variants[variant],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={16} className="mb-2" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="text" width="100%" height={14} className="mb-2" />
      <Skeleton variant="text" width="80%" height={14} className="mb-4" />
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <Skeleton variant="rectangular" width="100%" height={40} />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-200 dark:bg-zinc-800 p-8 sm:p-12">
      <div className="max-w-2xl space-y-6">
        <Skeleton variant="rectangular" width={120} height={32} className="rounded-full" />
        <Skeleton variant="text" width="90%" height={48} />
        <Skeleton variant="text" width="75%" height={24} />
        <div className="flex gap-4">
          <Skeleton variant="rectangular" width={140} height={48} className="rounded-xl" />
          <Skeleton variant="rectangular" width={140} height={48} className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
