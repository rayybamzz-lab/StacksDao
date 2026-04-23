export const PACKAGE_NAME = '@stacksdao/utils';
export const PACKAGE_SCOPE = 'utils';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function microToStx(micro: number): string { return (micro / 1_000_000).toFixed(6); }
export function stxToMicro(stx: string): number { return Math.round(parseFloat(stx) * 1_000_000); }
export function shortenAddress(addr: string): string { return addr.slice(0, 5) + '...' + addr.slice(-4); }
export function formatNumber(n: number): string { return n.toLocaleString(); }
