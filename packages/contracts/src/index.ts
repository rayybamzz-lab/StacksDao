export const PACKAGE_NAME = '@stacksdao/contracts';
export const PACKAGE_SCOPE = 'contracts';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const CONTRACT_ADDRESS = 'SP3KN56MPA655CXFK5ZBZR9BG9VX1RTCB6PB8VQH2';
export const CONTRACT_VERSION = 'v2';
export function getContractIdentifier(name: string): string { return CONTRACT_ADDRESS + '.' + name; }
