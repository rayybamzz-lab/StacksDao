'use client';

import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export default function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <a href={href} className={`text-sm font-medium transition-colors ${active ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}>
      {children}
    </a>
  );
}
