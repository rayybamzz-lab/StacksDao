export const PACKAGE_NAME = '@stacksdao/cli';
export const PACKAGE_SCOPE = 'cli';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function runCli(args: string[]) { return args.join(' '); }
