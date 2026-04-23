export const PACKAGE_NAME = '@stacksdao/utils';
export const PACKAGE_SCOPE = 'utils';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function microToStx(micro: number): string { return (micro / 1_000_000).toFixed(6); }
export function stxToMicro(stx: string): number { return Math.round(parseFloat(stx) * 1_000_000); }
