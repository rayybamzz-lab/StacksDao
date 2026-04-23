'use client';

import React from 'react';

interface StatusDotProps {
  status: 'online' | 'offline' | 'warning';
}

export default function StatusDot({ status }: StatusDotProps) {
  const map = {
    online: 'bg-emerald-500',
    offline: 'bg-red-500',
    warning: 'bg-amber-500',
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[status]}`} />;
}
