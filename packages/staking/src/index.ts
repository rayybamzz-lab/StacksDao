export const PACKAGE_NAME = '@stacksdao/staking';
export const PACKAGE_SCOPE = 'staking';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function buildStakeArgs(tokenId: number): (string | number)[] { return [tokenId]; }
export function buildUnstakeArgs(tokenId: number): (string | number)[] { return [tokenId]; }
