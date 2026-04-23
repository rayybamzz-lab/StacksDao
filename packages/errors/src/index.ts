export const PACKAGE_NAME = '@stacksdao/errors';
export const PACKAGE_SCOPE = 'errors';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export class StacksDaoError extends Error { constructor(message: string) { super(message); this.name = 'StacksDaoError'; } }
export class InsufficientBalanceError extends StacksDaoError { constructor() { super('Insufficient balance'); this.name = 'InsufficientBalanceError'; } }
