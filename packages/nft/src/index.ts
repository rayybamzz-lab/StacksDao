export const PACKAGE_NAME = '@stacksdao/nft';
export const PACKAGE_SCOPE = 'nft';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function buildMintArgs(): string[] { return []; }
