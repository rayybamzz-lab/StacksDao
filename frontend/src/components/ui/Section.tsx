'use client';

import React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`py-8 ${className}`}>
      {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
      {children}
    </section>
  );
}
