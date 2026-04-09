# StacksDao

A complete Stacks blockchain protocol built in Clarity — featuring NFT minting, NFT staking for token rewards, and on-chain governance.

> [!NOTE]
> All contracts in this repository use the `-v2` suffix to denote the latest protocol version with hardened security and optimized gas fees.

## Overview

| Feature | Details |
|---------|---------|
| Network | Stacks Mainnet |
| NFT Standard | SIP-009 |
| Token Standard | SIP-010 |
| Mint Price | **0.01 STX** (10,000 micro-STX) |
| Max Supply | 10,000 NFTs |
| Reward Token | **SDAO** (StacksDAO Token) |
| Reward Rate | 10 SDAO per block staked |
| Voting Period | 144 blocks (~1 day) |
| Min to Propose | 100 SDAO |
| Quorum | 500 SDAO |

---

## Smart Contracts

### 1. `governance-token-v2.clar` — SDAO Token
The protocol's SIP-010 fungible token used for staking rewards and governance voting power.

- **Mint**: Only the authorized staking contract can mint (set via `set-authorized-minter`)
- **Transfer**: Standard SIP-010 `transfer` with optional memo
- **Burn**: Token holders can burn their own tokens

### 2. `stacks-nft-v2.clar` — StacksDAO NFT
SIP-009 compliant NFT collection with a 0.01 STX mint cost.

- **`mint`** — Mint one NFT for 0.001 STX
- **`mint-batch (count)`** — Mint up to 5 NFTs in a single transaction
- **`transfer`** — Standard SIP-009 transfer
- Admin can update `base-uri` and pause minting

### 3. `nft-staking-v2.clar` — NFT Staking Vault
Lock your NFTs to earn SDAO rewards at 10 SDAO/block.

- **`stake-nft (token-id)`** — Transfer NFT into the vault, start earning
- **`claim-rewards (token-id)`** — Claim accrued SDAO without unstaking
- **`unstake-nft (token-id)`** — Claim all rewards and return NFT to wallet
- **`get-pending-rewards (token-id)`** — View unclaimed rewards (read-only)

### 4. `governance-dao-v2.clar` — Governance DAO
On-chain proposal and voting system powered by SDAO balances.

- **`create-proposal (title description)`** — Requires 100 SDAO balance
- **`vote-for (proposal-id)`** — Vote weight = your SDAO balance
- **`vote-against (proposal-id)`** — Vote weight = your SDAO balance
- **`execute-proposal (proposal-id)`** — Execute after voting ends if quorum met and majority is for

---

## Project Structure

```
StacksDao/
├── Clarinet.toml               # Project config
├── DEPLOYMENT.md               # Mainnet deployment guide
├── README.md
├── contracts/
│   ├── governance-token-v2.clar   # SIP-010 SDAO token
│   ├── stacks-nft-v2.clar         # SIP-009 NFT + minting
│   ├── nft-staking-v2.clar        # Staking vault + rewards
│   └── governance-dao-v2.clar     # DAO voting
├── settings/
│   ├── Devnet.toml
│   ├── Testnet.toml
│   └── Mainnet.toml
└── tests/
    ├── governance-token_test.ts
    ├── stacks-nft_test.ts
    ├── nft-staking_test.ts
    └── governance-dao_test.ts
```

---

## Prerequisites

Before starting, ensure you have the following installed:
- [Clarinet](https://github.com/hirosystems/clarinet) >= v1.7.0
- [Node.js](https://nodejs.org/) >= v18.0.0
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/StacksDao/protocol.git
   cd protocol
   npm install
   ```

2. **Run Tests**
   ```bash
   clarinet test
   ```

3. **Check Logic**
   ```bash
   clarinet check
   ```

## Environment Setup

Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=SP3KN56MPA655CXFK5ZBZR9BG9VX1RTCB6PB8VQH2
NEXT_PUBLIC_NETWORK=mainnet
```

---

## Smart Contracts (Mainnet)

> See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full step-by-step guide.

**Quick summary:**
1. Deploy in order: `governance-token` → `stacks-nft` → `nft-staking` → `governance-dao`
2. Call `set-authorized-minter` on `governance-token` passing your `nft-staking` contract address
3. Verify with `get-mint-price`, `get-symbol`, etc.

---

## Security Notes

- Staking contract takes custody of NFTs during staking period
- Only the authorized minter (staking contract) can mint SDAO
- One vote per address per proposal
- Proposals require minimum SDAO balance to prevent spam
- Voting period is fixed at contract deploy time (immutable)

---

## License

MIT
