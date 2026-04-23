export const PACKAGE_NAME = '@stacksdao/react';
export const PACKAGE_SCOPE = 'react';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function useWallet() { return { connected: false, address: null as string | null }; }
export function useBalance() { return { balance: 0, loading: false }; }
