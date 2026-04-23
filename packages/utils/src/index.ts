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
export function blocksToTime(blocks: number): string { const mins = (blocks * 10) % 60; const hrs = Math.floor((blocks * 10) / 60); return hrs + 'h ' + mins + 'm'; }
export function isValidPrincipal(p: string): boolean { return p.startsWith('SP') || p.startsWith('ST'); }
export function clamp(num: number, min: number, max: number): number { return Math.min(Math.max(num, min), max); }
export function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }
export function unique<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> { const r = {} as Pick<T, K>; keys.forEach(k => r[k] = obj[k]); return r; }
