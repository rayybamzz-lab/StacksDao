'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Animated number counter
interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function Counter({ end, duration = 2000, prefix = '', suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Fade in on scroll
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeIn({ children, delay = 0, direction = 'up' }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const directions = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4',
  };

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${directions[direction]}`,
      )}
    >
      {children}
    </div>
  );
}

// Stagger children animation
interface StaggerProps {
  children: React.ReactNode;
  delay?: number;
}

export function Stagger({ children, delay = 100 }: StaggerProps) {
  return (
    <div>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * delay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

// Pulse animation
export function Pulse({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      {children}
    </div>
  );
}

// Bounce animation
export function Bounce({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('animate-bounce', className)}>
      {children}
    </div>
  );
}

// Spin animation
export function Spin({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('animate-spin', className)}>
      {children}
    </div>
  );
}
