export const PACKAGE_NAME = '@stacksdao/events';
export const PACKAGE_SCOPE = 'events';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const PROTOCOL_EVENTS = ['nft-staked', 'nft-unstaked', 'rewards-claimed', 'proposal-created', 'vote-cast', 'proposal-executed', 'authorized-minter-updated'] as const;
export type ProtocolEvent = typeof PROTOCOL_EVENTS[number];
