# StacksDao Frontend

Next.js interface for minting StacksDAO NFTs, viewing protocol metadata, and submitting governance transactions through a connected Stacks wallet.

## Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment

Create `frontend/.env.local` with the contract deployer address and network you want the UI to target:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=SP3KN56MPA655CXFK5ZBZR9BG9VX1RTCB6PB8VQH2
NEXT_PUBLIC_NETWORK=mainnet
```

## Verification

```bash
npm run lint
```
