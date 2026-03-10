'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(id) ? [] : [id]
      );
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                'w-full flex items-center justify-between p-4 text-left',
                'bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800',
                'transition-colors duration-200'
              )}
            >
              <span className="font-medium text-slate-900 dark:text-zinc-100">
                {item.title}
              </span>
              <svg
                className={cn(
                  'w-5 h-5 text-slate-500 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="p-4 pt-0 text-sm text-slate-600 dark:text-zinc-400">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
