export const PACKAGE_NAME = '@stacksdao/core';
export const PACKAGE_SCOPE = 'core';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const APP_NAME = 'StacksDAO';
export const APP_VERSION = '2.0.0';
export function getUserAgent(): string { return APP_NAME + '/' + APP_VERSION; }
