export const PACKAGE_NAME = '@stacksdao/logger';
export const PACKAGE_SCOPE = 'logger';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export const LOGGER_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = typeof LOGGER_LEVELS[number];
export interface LogEntry { level: LogLevel; message: string; timestamp: number; context?: string; }
export function createLogger(context: string) { return { debug: (m: string) => console.debug('[' + context + ']', m), info: (m: string) => console.info('[' + context + ']', m), warn: (m: string) => console.warn('[' + context + ']', m), error: (m: string) => console.error('[' + context + ']', m) }; }
