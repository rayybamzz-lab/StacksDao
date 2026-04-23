export const PACKAGE_NAME = '@stacksdao/nft';
export const PACKAGE_SCOPE = 'nft';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function buildMintArgs(): string[] { return []; }
export function buildBatchMintArgs(count: number): (string | number)[] { return [count]; }
export function buildSetBaseUriArgs(uri: string): (string | number)[] { return [uri]; }
export function buildSetPausedArgs(paused: boolean): (string | number)[] { return [paused]; }
