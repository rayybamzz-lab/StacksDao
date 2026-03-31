# Implementation Details

## Architecture Overview
StacksDao (v2) is built on the Stacks blockchain using Clarity smart contracts. The protocol consists of four core contracts interacting in a modular fashion:

1.  **Governance Token (`governance-token-v2.clar`)**: A SIP-010 compliant fungible token (SDAO) used for rewards and voting power.
2.  **NFT Contract (`stacks-nft-v2.clar`)**: A SIP-009 compliant non-fungible token (StacksNFT) that acts as the primary staking asset.
3.  **Staking Vault (`nft-staking-v2.clar`)**: Manages the custody of NFTs and the distribution of SDAO rewards based on block time.
4.  **Governance DAO (`governance-dao-v2.clar`)**: Handles proposal creation, voting, and execution logic.

## Security Hardening
- **Unchecked Data Mitigation**: All public functions now include strict validation for inputs (amounts > 0, non-empty strings, valid principals).
- **Authorization Checks**: Centralized `is-authorized` helpers ensure only the contract owner or authorized contracts can perform sensitive operations (e.g., minting).
- **Safe Math**: Natural Clarity 2.0 properties are leveraged to prevent overflows/underflows in reward calculations.

## Frontend Integration
The frontend uses `Next.js` and `@stacks/connect` for seamless wallet interactions. Post-conditions are strictly enforced for all STX transfers to ensure user security.
