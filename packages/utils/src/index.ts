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
export function isBrowser(): boolean { return typeof window !== 'undefined'; }
export function isServer(): boolean { return typeof window === 'undefined'; }
export function toKebabCase(str: string): string { return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase()); }
export function toSnakeCase(str: string): string { return str.replace(/[A-Z]/g, m => '_' + m.toLowerCase()); }
export function toPascalCase(str: string): string { return str.replace(/^\w|_\w/g, m => m.replace('_', '').toUpperCase()); }
export function capitalize(str: string): string { return str.charAt(0).toUpperCase() + str.slice(1); }
export function slugify(str: string): string { return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); }
export function randomId(prefix = 'id'): string { return prefix + '-' + Math.random().toString(36).slice(2, 8); }
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, wait = 300) { let t: ReturnType<typeof setTimeout>; return (...args: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }
export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit = 300) { let inThrottle = false; return (...args: Parameters<T>) => { if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } }; }
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> { return arr.reduce((acc, item) => { const k = String(item[key]); (acc[k] = acc[k] || []).push(item); return acc; }, {} as Record<string, T[]>); }
export function sortBy<T>(arr: T[], key: keyof T, dir: 'asc' | 'desc' = 'asc'): T[] { return [...arr].sort((a, b) => { const av = a[key]; const bv = b[key]; return dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1); }); }
export function chunk<T>(arr: T[], size: number): T[][] { const res: T[][] = []; for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size)); return res; }
export function flatten<T>(arr: T[][]): T[] { return arr.reduce((acc, val) => acc.concat(val), []); }
export function deepEqual(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T { const cache = new Map(); return ((...args: unknown[]) => { const key = JSON.stringify(args); if (cache.has(key)) return cache.get(key); const result = fn(...args); cache.set(key, result); return result; }) as T; }
export function retry<T>(fn: () => Promise<T>, retries = 3): Promise<T> { return fn().catch(e => retries > 0 ? retry(fn, retries - 1) : Promise.reject(e)); }
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> { return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))]); }
export function daysToBlocks(days: number): number { return days * 144; }
export function blocksToDays(blocks: number): number { return Math.floor(blocks / 144); }
export function getYearlyRewards(ratePerBlock: number): number { return ratePerBlock * 144 * 365; }
export function calculateApr(rewards: number, principal: number): number { return principal > 0 ? (rewards / principal) * 100 : 0; }
export function formatPercentage(value: number, decimals = 2): string { return value.toFixed(decimals) + '%'; }
export function parsePrincipal(str: string): { prefix: string; hash: string } { return { prefix: str.slice(0, 2), hash: str.slice(2) }; }
export function isContractPrincipal(p: string): boolean { return p.includes('.'); }
export function getContractNameFromPrincipal(p: string): string { return p.split('.')[1] || ''; }
export function getAddressFromPrincipal(p: string): string { return p.split('.')[0]; }
export function encodeClarityValue(value: string | number | boolean): string { return String(value); }
export function safeDivide(a: number, b: number): number { return b === 0 ? 0 : a / b; }
export function clampUint(value: number): number { return Math.max(0, Math.min(value, Number.MAX_SAFE_INTEGER)); }
export function toMicro(amount: number, decimals = 6): number { return Math.round(amount * Math.pow(10, decimals)); }
export function fromMicro(amount: number, decimals = 6): number { return amount / Math.pow(10, decimals); }
export function formatCompactNumber(num: number): string { return Intl.NumberFormat('en', { notation: 'compact' }).format(num); }
export function formatCurrency(amount: number, currency = 'USD'): string { return new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount); }
export function timeAgo(date: Date): string { const s = Math.floor((Date.now() - date.getTime()) / 1000); return s < 60 ? s + 's ago' : s < 3600 ? Math.floor(s / 60) + 'm ago' : s < 86400 ? Math.floor(s / 3600) + 'h ago' : Math.floor(s / 86400) + 'd ago'; }
export function addDays(date: Date, days: number): Date { const r = new Date(date); r.setDate(r.getDate() + days); return r; }
export function startOfDay(date: Date): Date { const r = new Date(date); r.setHours(0, 0, 0, 0); return r; }
export function endOfDay(date: Date): Date { const r = new Date(date); r.setHours(23, 59, 59, 999); return r; }
export function isSameDay(a: Date, b: Date): boolean { return a.toDateString() === b.toDateString(); }
export function generateNonce(): string { return Math.random().toString(36).slice(2, 10); }
export function hashString(str: string): number { let h = 0; for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i); return h; }
export function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
export function shuffleArray<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
