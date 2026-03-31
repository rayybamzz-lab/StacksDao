# StacksDao — Deployment Plan

## Contract Deployment Order (MAINNET)

Contracts must be deployed in this exact order due to inter-contract dependencies:

1. `governance-token-v2` — no dependencies
2. `stacks-nft-v2` — no dependencies
3. `nft-staking-v2` — calls `stacks-nft-v2` and `governance-token-v2`
4. `governance-dao-v2` — calls `governance-token-v2`

## Post-Deployment Setup

After deploying all four contracts, call these transactions in order:

### 1. Authorize the Staking Contract to Mint SDAO
```
Contract: governance-token-v2
Function: set-authorized-minter
Argument: <your-deployer-address>.nft-staking-v2
```

This step is **critical** — without it, the staking contract cannot mint reward tokens for stakers.

### 2. Verify Deployment
- Call `get-mint-price` on `stacks-nft-v2` → should return `u10000`
- Call `get-max-supply` on `stacks-nft-v2` → should return `u10000`
- Call `get-reward-per-block` on `nft-staking-v2` → should return `u10000000`
- Call `get-symbol` on `governance-token-v2` → should return `"SDAO"`

## Common Troubleshooting

| Issue | Solution |
|-------|----------|
| `ConflictingNonce` | Wait for previous TX to confirm or increase fee by 10%. |
| `NotEnoughFunds` | Ensure wallet has ≥ 2.5 STX (0.5 STX per contract). |
| `set-authorized-minter` fails | Ensure the caller is the exact principal that deployed `governance-token-v2`. |

## Security Best Practices (Mainnet)

1. **Verify Trait Addresses**: Always double-check SIP-010/SIP-009 trait addresses for the specific network (Mainnet vs Testnet).
2. **Immediate Authorization**: Call `set-authorized-minter` immediately after deployment to prevent unauthorized minting.
3. **Admin Key Storage**: Store the deployer private key in a secure hardware wallet (Leather/Xverse).
4. **Gas Fees**: For faster execution during network congestion, manually set the fee to `0.5 STX` or higher via the Hiro Wallet UI.

---

## Recommended Pre-Mainnet Checklist
- [x] Run `clarinet check` — 0 errors
- [ ] Deploy and test full flow on **testnet** first
- [ ] Audit staking reward math (blocks × REWARD-PER-BLOCK)
- [ ] Confirm deployer wallet has ≥ 2.5 STX for fees
- [ ] Call `set-authorized-minter` immediately after deploying
