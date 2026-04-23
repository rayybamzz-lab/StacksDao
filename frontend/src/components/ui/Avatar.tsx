'use client';

import React from 'react';

interface AvatarProps {
  address: string;
  size?: number;
}

export default function Avatar({ address, size = 32 }: AvatarProps) {
  const initials = address.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs" style={{ width: size, height: size }}>
      {initials}
    </div>
  );
}
