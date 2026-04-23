export const PACKAGE_NAME = '@stacksdao/queries';
export const PACKAGE_SCOPE = 'queries';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export interface QueryOptions { limit?: number; offset?: number; order?: 'asc' | 'desc'; }
export function buildPagination(limit = 20, offset = 0): QueryOptions { return { limit, offset }; }
