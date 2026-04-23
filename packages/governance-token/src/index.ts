export const PACKAGE_NAME = '@stacksdao/governance-token';
export const PACKAGE_SCOPE = 'governance-token';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function buildMintTokenArgs(amount: number, recipient: string): (string | number)[] { return [amount, recipient]; }
