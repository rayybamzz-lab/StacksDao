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
export const MAX_SUPPLY = 10_000;
export const VOTING_PERIOD_BLOCKS = 144;
export const MIN_PROPOSAL_BALANCE_MICRO = 100_000_000;
export const QUORUM_MICRO = 500_000_000;
export const NETWORK_NAMES = { MAINNET: 'mainnet', TESTNET: 'testnet', DEVNET: 'devnet', MOCKNET: 'mocknet' } as const;
export const EXPLORER_URLS = { MAINNET: 'https://explorer.hiro.so', TESTNET: 'https://explorer.hiro.so/?chain=testnet' } as const;
export const API_URLS = { MAINNET: 'https://api.mainnet.hiro.so', TESTNET: 'https://api.testnet.hiro.so' } as const;
export const TX_VERSION = 'v2';
export const MAX_BATCH_SIZE = 5;
export const BATCH_MINT_PRICE = 50000;
export const MAX_PROPOSAL_TITLE_LENGTH = 256;
export const MAX_PROPOSAL_DESC_LENGTH = 1024;
export const SIP009_TRAIT = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait';
export const SIP010_TRAIT = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait';
export const DEFAULT_GAS_LIMIT = 500000;
export const DEFAULT_POSTCONDITION_MODE = 'deny';
export const APP_THEMES = ['light', 'dark', 'system'] as const;
