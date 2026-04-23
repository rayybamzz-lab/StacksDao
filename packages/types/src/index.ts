export const PACKAGE_NAME = '@stacksdao/types';
export const PACKAGE_SCOPE = 'types';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export type ProposalStatus = 'active' | 'passed' | 'rejected' | 'executed';
export interface Proposal { id: number; title: string; description: string; status: ProposalStatus; proposer: string; startBlock: number; endBlock: number; votesFor: number; votesAgainst: number; executed: boolean; }
export interface StakeInfo { tokenId: number; staker: string; stakedAt: number; lastClaim: number; }
export interface TokenMetadata { name: string; symbol: string; decimals: number; uri?: string; }
export type NetworkType = 'mainnet' | 'testnet' | 'devnet' | 'mocknet';
export interface NetworkConfig { network: NetworkType; url: string; explorerUrl: string; }
export type ContractName = 'governance-token-v2' | 'stacks-nft-v2' | 'nft-staking-v2' | 'governance-dao-v2';
export interface ContractIdentifier { address: string; name: ContractName; }
export type VoteDirection = 'for' | 'against';
export interface VoteRecord { proposalId: number; voter: string; amount: number; direction: VoteDirection; }
export type AppTheme = typeof APP_THEMES[number];
export interface ThemeConfig { theme: AppTheme; system: boolean; }
export interface PaginationResult<T> { data: T[]; total: number; page: number; limit: number; hasMore: boolean; }
export interface ApiResponse<T> { success: boolean; data?: T; error?: string; }
export interface ApiError { code: string; message: string; status: number; }
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export interface AsyncState<T> { data: T | null; loading: boolean; error: ApiError | null; }
export interface WalletInfo { address: string; balance: number; network: string; connected: boolean; }
export interface TransactionReceipt { txId: string; status: 'pending' | 'success' | 'error'; blockHeight?: number; }
export interface StakingSummary { totalStaked: number; totalRewards: number; apr: number; }
export interface DaoSummary { activeProposals: number; totalProposals: number; totalVotes: number; }
