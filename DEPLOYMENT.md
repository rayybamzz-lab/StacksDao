# StacksDao — Deployment Plan

## Contract Deployment Order (MAINNET)

Contracts must be deployed in this exact order due to inter-contract dependencies:

1. `governance-token` — no dependencies
2. `stacks-nft` — no dependencies
3. `nft-staking` — calls `stacks-nft` and `governance-token`
4. `governance-dao` — calls `governance-token`

## Post-Deployment Setup

After deploying all four contracts, call these transactions in order:

### 1. Authorize the Staking Contract to Mint SDAO
```
Contract: governance-token
Function: set-authorized-minter
Argument: <your-deployer-address>.nft-staking
```

This step is **critical** — without it, the staking contract cannot mint reward tokens for stakers.

### 2. Verify Deployment
- Call `get-mint-price` on `stacks-nft` → should return `u100000`
- Call `get-max-supply` on `stacks-nft` → should return `u10000`
- Call `get-reward-per-block` on `nft-staking` → should return `u10000000`
- Call `get-symbol` on `governance-token` → should return `"SDAO"`

## Mainnet Trait Addresses (already in contracts)

| Trait | Mainnet Address |
|-------|----------------|
| SIP-010 FT | `SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard` |
| SIP-009 NFT | `SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait` |

## Recommended Pre-Mainnet Checklist
- [ ] Run `clarinet check` — 0 errors
- [ ] Deploy and test full flow on **testnet** first
- [ ] Audit staking reward math (blocks × REWARD-PER-BLOCK)
- [ ] Confirm deployer wallet has ≥ 2 STX for fees
- [ ] Call `set-authorized-minter` immediately after deploying
