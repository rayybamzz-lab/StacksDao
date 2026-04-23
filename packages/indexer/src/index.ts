export const PACKAGE_NAME = '@stacksdao/indexer';
export const PACKAGE_SCOPE = 'indexer';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export interface IndexerCursor { lastBlock: number; lastTxId?: string; }
export function createCursor(block: number, tx?: string): IndexerCursor { return { lastBlock: block, lastTxId: tx }; }
