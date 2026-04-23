export const PACKAGE_NAME = '@stacksdao/auth';
export const PACKAGE_SCOPE = 'auth';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const AUTH_SCOPES = ['store_write', 'publish_data'] as const;
export function parseAuthScopes(scopes: string[]): string[] { return scopes.filter(s => AUTH_SCOPES.includes(s as typeof AUTH_SCOPES[number])); }
