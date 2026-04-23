export const PACKAGE_NAME = '@stacksdao/types';
export const PACKAGE_SCOPE = 'types';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export type ProposalStatus = 'active' | 'passed' | 'rejected' | 'executed';
