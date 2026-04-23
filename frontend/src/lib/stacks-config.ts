import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { AppConfig, UserSession } from '@stacks/auth';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

const networkName = (process.env.NEXT_PUBLIC_NETWORK || 'mainnet').toLowerCase();

export const NETWORK = networkName === 'testnet' ? STACKS_TESTNET : STACKS_MAINNET;
export const NETWORK_LABEL = networkName === 'testnet' ? 'Testnet' : 'Mainnet';
export const EXPLORER_CHAIN = networkName === 'testnet' ? 'testnet' : 'mainnet';

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
export function cn(...classes: (string | false | undefined)[]) { return classes.filter(Boolean).join(' '); }
export const EXPLORER_TX_URL = (txid: string) => 'https://explorer.hiro.so/txid/' + txid + '?chain=mainnet';
export const EXPLORER_ADDRESS_URL = (addr: string) => 'https://explorer.hiro.so/address/' + addr + '?chain=mainnet';
export const MICRO_STX = 1000000;
export function formatMicroStx(micro: number): string { return (micro / MICRO_STX).toFixed(6) + ' STX'; }
export function truncateMiddle(str: string, start = 6, end = 4): string { return str.length > start + end ? str.slice(0, start) + '...' + str.slice(-end) : str; }
export function isMainnet(network: string): boolean { return network === 'mainnet'; }
export function isTestnet(network: string): boolean { return network === 'testnet'; }
export const SUPPORTED_WALLETS = ['leather', 'xverse'] as const;
