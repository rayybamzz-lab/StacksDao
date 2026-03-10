'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
};

export function Avatar({ src, alt, fallback, size = 'md', status }: AvatarProps) {
  const initials = fallback || (alt ? alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?');

  return (
    <div className="relative inline-flex">
      <div
        className={cn(
          'rounded-full overflow-hidden bg-slate-200 dark:bg-zinc-700 flex items-center justify-center font-medium text-slate-600 dark:text-zinc-300',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
}

export function AvatarGroup({ avatars, max = 4 }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <div key={i} className="ring-2 ring-white dark:ring-zinc-900 rounded-full">
          <Avatar {...avatar} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={cn('rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center font-medium text-slate-600 dark:text-zinc-300 ring-2 ring-white dark:ring-zinc-900', sizes.md)}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
