export const PACKAGE_NAME = '@stacksdao/react';
export const PACKAGE_SCOPE = 'react';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function useWallet() { return { connected: false, address: null as string | null }; }
export function useBalance() { return { balance: 0, loading: false }; }
export function useNetwork() { return { network: 'mainnet', label: 'Mainnet' }; }
export function useBlockHeight() { return { height: 0, loading: false }; }
export function useProposals() { return { proposals: [], loading: false }; }
export function useStakes() { return { stakes: [], loading: false }; }
export function useTokenUri() { return { uri: '', loading: false }; }
export function useTokenOwner(tokenId: number) { return { owner: '', tokenId, loading: false }; }
export function usePendingRewards(tokenId: number) { return { rewards: 0, tokenId, loading: false }; }
export function useTotalStaked() { return { total: 0, loading: false }; }
