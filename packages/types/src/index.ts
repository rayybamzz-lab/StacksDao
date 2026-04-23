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
export interface NftSummary { minted: number; remaining: number; floorPrice?: number; }
export interface TokenSummary { name: string; symbol: string; decimals: number; supply: number; price?: number; }
export interface ProposalSummary { id: number; title: string; status: ProposalStatus; votesFor: number; votesAgainst: number; }
export interface UserActivity { address: string; proposalsCreated: number; votesCast: number; nftsStaked: number; }
export interface PriceFeed { asset: string; price: number; timestamp: number; source: string; }
export type TransactionStatus = 'pending' | 'success' | 'error' | 'dropped';
export interface FeeEstimate { fee: number; gasLimit: number; nonce: number; }
export interface ContractCallOptions { contractAddress: string; contractName: string; functionName: string; functionArgs: unknown[]; network: string; }
export interface ReadOnlyCallOptions { contractAddress: string; contractName: string; functionName: string; functionArgs: unknown[]; network: string; senderAddress: string; }
export interface PostCondition { type: string; principal: string; condition: string; amount: number; }
export type PostConditionMode = 'allow' | 'deny';
export interface Notification { id: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; read: boolean; timestamp: number; }
export interface FilterState { search: string; status: string; sortBy: string; sortDir: 'asc' | 'desc'; }
export interface FormState { values: Record<string, unknown>; errors: Record<string, string>; touched: Record<string, boolean>; }
export interface RouteConfig { path: string; label: string; icon?: string; protected: boolean; }
export type IconName = 'wallet' | 'trophy' | 'vote' | 'flame' | 'zap' | 'shield' | 'globe' | 'layout';
export interface ChartData { labels: string[]; datasets: { label: string; data: number[] }[]; }
export interface TimeSeriesPoint { timestamp: number; value: number; }
