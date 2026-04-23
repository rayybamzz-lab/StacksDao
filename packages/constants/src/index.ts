export const PACKAGE_NAME = '@stacksdao/constants';
export const PACKAGE_SCOPE = 'constants';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const CONTRACT_NAMES = { GOVERNANCE_TOKEN: 'governance-token-v2', STACKS_NFT: 'stacks-nft-v2', NFT_STAKING: 'nft-staking-v2', GOVERNANCE_DAO: 'governance-dao-v2' } as const;
export const DECIMALS = { SDAO: 6, STX: 6, MICRO: 6 } as const;
