import { STACKS_MAINNET } from '@stacks/network';
import { AppConfig, UserSession } from '@stacks/auth';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const NETWORK = STACKS_MAINNET;

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP3KN56MPA655CXFK5ZBZR9BG9VX1RTCB6PB8VQH2';

/**
 * Contract Names used across the protocol
 */
export const CONTRACTS = {
    GOVERNANCE_TOKEN: 'governance-token-v2',
    STACKS_NFT: 'stacks-nft-v2',
    NFT_STAKING: 'nft-staking-v2',
    GOVERNANCE_DAO: 'governance-dao-v2'
} as const;

/**
 * Fully qualified contract identifiers
 */
export const CONTRACT_IDENTIFIERS = {
    GOVERNANCE_TOKEN: `${CONTRACT_ADDRESS}.${CONTRACTS.GOVERNANCE_TOKEN}`,
    STACKS_NFT: `${CONTRACT_ADDRESS}.${CONTRACTS.STACKS_NFT}`,
    NFT_STAKING: `${CONTRACT_ADDRESS}.${CONTRACTS.NFT_STAKING}`,
    GOVERNANCE_DAO: `${CONTRACT_ADDRESS}.${CONTRACTS.GOVERNANCE_DAO}`
} as const;
