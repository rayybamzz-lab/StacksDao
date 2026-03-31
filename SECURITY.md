# Security Policy

## Reporting a Vulnerability
We take the security of StacksDao seriously. If you find a vulnerability, please report it privately.

### Scope
The following contracts are in scope for the security policy:
- `governance-token-v2.clar`
- `stacks-nft-v2.clar`
- `nft-staking-v2.clar`
- `governance-dao-v2.clar`

### Reporting Process
Please do not report security vulnerabilities via public GitHub issues. Instead, send an email to security@stacksdao.com with a detailed description of the issue and steps to reproduce.

## Security Best Practices
- **Never share your mnemonic phrase**.
- **Always verify the contract ID** before signing any transaction on mainnet.
- **Use post-conditions** in your interactions to prevent unauthorized token transfers.
