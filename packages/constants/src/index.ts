export const PACKAGE_NAME = '@stacksdao/constants';
export const PACKAGE_SCOPE = 'constants';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const CONTRACT_NAMES = { GOVERNANCE_TOKEN: 'governance-token-v2', STACKS_NFT: 'stacks-nft-v2', NFT_STAKING: 'nft-staking-v2', GOVERNANCE_DAO: 'governance-dao-v2' } as const;
export const DECIMALS = { SDAO: 6, STX: 6, MICRO: 6 } as const;
export const GAS_LIMITS = { DEFAULT: 500000, MINT: 300000, STAKE: 400000, VOTE: 350000 } as const;
export const BLOCK_TIME_SECONDS = 600;
export const REWARD_PER_BLOCK = 10_000_000;
export const MINT_PRICE_MICRO_STX = 10_000;
