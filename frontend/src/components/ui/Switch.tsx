'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'w-11 h-6 rounded-full transition-colors',
            checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-600'
          )}
        />
        <div
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
            checked && 'translate-x-5'
          )}
        />
      </div>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{label}</span>}
    </label>
  );
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'w-5 h-5 rounded-md border-2 transition-colors flex items-center justify-center',
            checked 
              ? 'bg-indigo-600 border-indigo-600' 
              : 'border-slate-300 dark:border-zinc-600 hover:border-indigo-500'
          )}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-slate-700 dark:text-zinc-300">{label}</span>}
    </label>
  );
}

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function RadioGroup({ options, value, onChange, label }: RadioGroupProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-3">{label}</label>}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-colors',
                  value === option.value 
                    ? 'border-indigo-600' 
                    : 'border-slate-300 dark:border-zinc-600 hover:border-indigo-500'
                )}
              >
                {value === option.value && (
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full m-0.5" />
                )}
              </div>
            </div>
            <span className="text-sm text-slate-700 dark:text-zinc-300">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
