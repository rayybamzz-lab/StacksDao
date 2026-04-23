export const PACKAGE_NAME = '@stacksdao/cli';
export const PACKAGE_SCOPE = 'cli';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function runCli(args: string[]) { return args.join(' '); }
export function parseCliFlags(argv: string[]): Record<string, string> { const flags: Record<string, string> = {}; for (let i = 0; i < argv.length; i++) { if (argv[i].startsWith('--')) flags[argv[i].slice(2)] = argv[i + 1] || 'true'; } return flags; }
