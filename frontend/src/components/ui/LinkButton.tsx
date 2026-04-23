'use client';

import React from 'react';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export default function LinkButton({ href, children, className = '', ...props }: LinkButtonProps) {
  return (
    <a href={href} className={`inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 ${className}`} {...props}>
      {children}
    </a>
  );
}
