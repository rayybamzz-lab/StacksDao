'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'gradient';
  hover?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className,
  variant = 'default',
  hover = false,
  glow = false,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800',
    elevated: 'bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-zinc-800',
    outline: 'bg-transparent border-2 border-slate-200 dark:border-zinc-700',
    gradient: 'bg-gradient-to-br from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-800 border border-slate-200 dark:border-zinc-700',
  };

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
    : '';

  const glowStyles = glow
    ? 'relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-indigo-500/20 before:via-purple-500/10 before:to-pink-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:-z-10'
    : '';

  return (
    <div
      className={cn(
        'rounded-2xl p-6',
        variants[variant],
        hoverStyles,
        glowStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-bold text-slate-900 dark:text-zinc-100', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-slate-500 dark:text-zinc-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800', className)} {...props}>
      {children}
    </div>
  );
}
