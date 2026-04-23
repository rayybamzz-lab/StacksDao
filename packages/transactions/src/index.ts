export const PACKAGE_NAME = '@stacksdao/transactions';
export const PACKAGE_SCOPE = 'transactions';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export interface TxOptions { postConditionMode?: 'allow' | 'deny'; postConditions?: unknown[]; }
export function buildPostCondition(amount: number, sender: string, asset: string): string { return sender + ' sends ' + amount + ' ' + asset; }
export function encodeMemo(memo: string): string { return memo.slice(0, 34); }
