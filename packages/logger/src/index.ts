export const PACKAGE_NAME = '@stacksdao/logger';
export const PACKAGE_SCOPE = 'logger';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const LOGGER_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = typeof LOGGER_LEVELS[number];
