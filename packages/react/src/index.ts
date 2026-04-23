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
export function useProposalCount() { return { count: 0, loading: false }; }
export function useQuorum() { return { quorum: 500000000, loading: false }; }
export function useVotingPeriod() { return { period: 144, loading: false }; }
export function useMintPrice() { return { price: 10000, loading: false }; }
export function useMaxSupply() { return { supply: 10000, loading: false }; }
export function useRemainingSupply() { return { remaining: 10000, loading: false }; }
export function useIsVotingActive(proposalId: number) { return { active: false, proposalId, loading: false }; }
export function useVoteRecord(proposalId: number, voter: string) { return { record: null, proposalId, voter, loading: false }; }
export function useRewardPerBlock() { return { rate: 10000000, loading: false }; }
export function useStakerBalance(address: string) { return { balance: 0, address, loading: false }; }
export function useTotalSupply() { return { supply: 0, loading: false }; }
export function useTokenDecimals() { return { decimals: 6, loading: false }; }
export function useTokenSymbol() { return { symbol: 'SDAO', loading: false }; }
export function useTokenName() { return { name: 'StacksDAO Token', loading: false }; }
