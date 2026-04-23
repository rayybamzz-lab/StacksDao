export const PACKAGE_NAME = '@stacksdao/governance-token';
export const PACKAGE_SCOPE = 'governance-token';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function buildMintTokenArgs(amount: number, recipient: string): (string | number)[] { return [amount, recipient]; }
export function buildTransferArgs(amount: number, sender: string, recipient: string): (string | number)[] { return [amount, sender, recipient]; }
export function buildBurnArgs(amount: number, sender: string): (string | number)[] { return [amount, sender]; }
