export const PACKAGE_NAME = '@stacksdao/errors';
export const PACKAGE_SCOPE = 'errors';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export class StacksDaoError extends Error { constructor(message: string) { super(message); this.name = 'StacksDaoError'; } }
export class InsufficientBalanceError extends StacksDaoError { constructor() { super('Insufficient balance'); this.name = 'InsufficientBalanceError'; } }
export class NotAuthorizedError extends StacksDaoError { constructor() { super('Not authorized'); this.name = 'NotAuthorizedError'; } }
export class ProposalNotFoundError extends StacksDaoError { constructor(id: number) { super("Proposal " + id + " not found"); this.name = 'ProposalNotFoundError'; } }
export class AlreadyVotedError extends StacksDaoError { constructor() { super('Already voted on this proposal'); this.name = 'AlreadyVotedError'; } }
export class VotingEndedError extends StacksDaoError { constructor() { super('Voting period has ended'); this.name = 'VotingEndedError'; } }
export class QuorumNotMetError extends StacksDaoError { constructor() { super('Quorum not met'); this.name = 'QuorumNotMetError'; } }
export class ProposalRejectedError extends StacksDaoError { constructor() { super('Proposal was rejected'); this.name = 'ProposalRejectedError'; } }
export class AlreadyExecutedError extends StacksDaoError { constructor() { super('Proposal already executed'); this.name = 'AlreadyExecutedError'; } }
export class NotStakedError extends StacksDaoError { constructor() { super('NFT is not staked'); this.name = 'NotStakedError'; } }
