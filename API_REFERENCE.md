# StacksDao V2 API Reference

This document provides a comprehensive overview of the public and read-only functions available in the StacksDao V2 smart contracts.

## 1. Governance Token (`governance-token-v2.clar`)

### Public Functions

- `set-authorized-minter(minter principal)`: Restricts minting to a specific address (Deployer only).
- `set-token-uri(new-uri (string-utf8 256))`: Updates the metadata URI for the token (Deployer only).
- `mint(amount uint, recipient principal)`: Mints SDAO tokens. Requires authorization.
- `burn(amount uint)`: Burns tokens from the caller's balance.
- `transfer(amount uint, sender principal, recipient principal, memo (optional (buff 34)))`: Standard SIP-010 transfer.

### Read-Only Functions

- `get-name()`: Returns "StacksDao Governance Token".
- `get-symbol()`: Returns "SDAO".
- `get-decimals()`: Returns `u6`.
- `get-balance(user principal)`: Returns the SDAO balance of a user.
- `get-total-supply()`: Returns the current circulating supply.
- `get-token-uri()`: Returns the metadata URI.

## 2. Stacks NFT (`stacks-nft-v2.clar`)

### Public Functions

- `mint(recipient principal)`: Mints a new NFT to the recipient.
- `set-base-uri(new-base-uri (string-ascii 256))`: Updates the base URI (Owner only).
- `transfer(token-id uint, sender principal, recipient principal)`: Standard SIP-009 transfer.

### Read-Only Functions

- `get-last-token-id()`: Returns the ID of the last minted NFT.
- `get-token-uri(token-id uint)`: Returns the metadata URI for a specific NFT.
- `get-owner(token-id uint)`: Returns the owner of a specific NFT.

## 3. NFT Staking (`nft-staking-v2.clar`)

### Public Functions

- `stake-nft(token-id uint)`: Transfers an NFT to the staking contract and starts reward accrual.
- `unstake-nft(token-id uint)`: Withdraws an NFT and claims any pending rewards. Enforces `unstake-delay`.
- `claim-rewards(token-id uint)`: Mints accrued SDAO rewards without unstaking the NFT.
- `set-unstake-delay(new-delay uint)`: Sets the global unstaking cooldown (Owner only).

### Read-Only Functions

- `calculate-rewards(token-id uint)`: Returns the rewards accumulated for a specific staked NFT.
- `get-staking-details(token-id uint)`: Returns staker address, stake block, and last claim block.
- `get-total-staked()`: Returns the count of NFTs currently in the vault.

## 4. Governance DAO (`governance-dao-v2.clar`)

### Public Functions

- `create-proposal(title (string-utf8 256), description (string-utf8 1024), category uint)`: Creates a new proposal.
- `vote-for(proposal-id uint)`: Votes in favor of a proposal using SDAO tokens.
- `vote-against(proposal-id uint)`: Votes against a proposal using SDAO tokens.
- `execute-proposal(proposal-id uint)`: Finalizes a proposal if it has reached quorum and the voting period has ended.

### Read-Only Functions

- `get-proposal(proposal-id uint)`: Returns full details of a proposal including votes and status.
- `get-vote-record(proposal-id uint, voter principal)`: Returns the specific vote info for a user.
- `get-proposal-count()`: Returns the total number of proposals created.
