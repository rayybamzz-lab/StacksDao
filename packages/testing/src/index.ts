export const PACKAGE_NAME = '@stacksdao/testing';
export const PACKAGE_SCOPE = 'testing';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function createTestAccount(seed: string) { return { address: 'SP' + seed, key: seed }; }
