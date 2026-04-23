export const PACKAGE_NAME = '@stacksdao/nextjs';
export const PACKAGE_SCOPE = 'nextjs';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function StacksProviderStub({ children }: { children: unknown }) { return children; }
export function withAuth(guard: boolean) { return guard; }
