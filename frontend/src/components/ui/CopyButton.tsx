'use client';

import React from 'react';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const handle = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <button onClick={handle} className="text-xs text-indigo-600 hover:text-indigo-700">
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
