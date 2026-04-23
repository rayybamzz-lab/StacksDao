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
