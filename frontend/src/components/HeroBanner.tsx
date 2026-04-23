'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  cta: { label: string; onClick: () => void };
  badge?: string;
}

export default function HeroBanner({ title, subtitle, cta, badge }: HeroBannerProps) {
  return (
    <section className="mb-16">
      <div className="relative bg-indigo-600 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-indigo-500/20 overflow-hidden">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 opacity-90" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {badge && (
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 font-semibold px-3 py-1 rounded-full text-indigo-100 text-xs mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-indigo-100/80 text-lg max-w-lg mb-8">
            {subtitle}
          </p>
          <button
            onClick={cta.onClick}
            className="h-12 px-8 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 active:scale-[0.98] transition-all"
          >
            {cta.label}
          </button>
        </div>
      </div>
    </section>
  );
}
