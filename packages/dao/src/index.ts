export const PACKAGE_NAME = '@stacksdao/dao';
export const PACKAGE_SCOPE = 'dao';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export function buildCreateProposalArgs(title: string, description: string): (string | number)[] { return [title, description]; }
export function buildVoteArgs(proposalId: number): (string | number)[] { return [proposalId]; }
export function buildExecuteArgs(proposalId: number): (string | number)[] { return [proposalId]; }
