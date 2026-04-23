# StacksDao Interaction Scripts

## Overview
These scripts facilitate interactions with the Stacks blockchain for testing and maintenance.

### Key Scripts
- `test-interactions.js`: High-performance script for batch transactions with exponential backoff and nonce management.
- `check-balances.js`: Utility to verify STX and SDAO balances for a list of test wallets.
- `update-pkg-json.js`: Helper to maintain modular package configurations.

## Usage
Copy either `test-wallet.example.json` or `scripts/test-wallet.example.json` to a local wallet file and point the scripts at it with `WALLET_FILE=/path/to/file.json`.

Runtime variables supported by the tracked scripts include:

- `WALLET_FILE` for the wallet JSON location
- `STACKS_API_BASE` for a custom Hiro-compatible API base
- `CONTRACT_ADDRESS` for the protocol deployer address used by `test-interactions.js`
- `TOTAL_INTERACTIONS` to override the default interaction count

```bash
# Example: Run interactions
WALLET_FILE=./scripts/test-wallet.local.json node scripts/test-interactions.js
```

## Security Note
Never commit wallet exports, mnemonics, or `.env` files. Use local-only files such as `test-wallet.local.json` so credentials stay outside git history.
