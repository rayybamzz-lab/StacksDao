'use client';

import React from 'react';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  cta: { label: string; onClick: () => void };
}

export default function HeroBanner({ title, subtitle, cta }: HeroBannerProps) {
  return (
    <section className="mb-16">
      <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-indigo-500/20">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">{title}</h1>
        <p className="text-indigo-100/80 text-lg max-w-lg mb-8">{subtitle}</p>
        <button onClick={cta.onClick} className="h-12 px-8 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50">{cta.label}</button>
      </div>
    </section>
  );
}
