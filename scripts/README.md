# StacksDao Interaction Scripts

## Overview
These scripts facilitate interactions with the Stacks blockchain for testing and maintenance.

### Key Scripts
- `test-interactions.js`: High-performance script for batch transactions with exponential backoff and nonce management.
- `check-balances.js`: Utility to verify STX and SDAO balances for a list of test wallets.
- `update-pkg-json.js`: Helper to maintain modular package configurations.

## Usage
Ensure you have a `.env` file configured in the root or `frontend/` directory with `PRIVATE_KEY` and `NETWORK`.

```bash
# Example: Run interactions
node scripts/test-interactions.js
```

## Security Note
Never commit your `test-wallet.json` or `.env` files. They are ignored by git for your protection.
