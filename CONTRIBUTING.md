# Contributing to StacksDao

## Code of Conduct
We follow the standard contributor code of conduct. Please be respectful to all participants.

## How to Contribute
1.  **Fork the repository** and create your branch from `main`.
2.  **Ensure Clarity checks pass**: Run `clarinet check` before committing.
3.  **Build TypeScript packages**: Run `npm run build` before opening a PR.
4.  **Add tests**: If you're adding a feature or fixing a bug, add a test in `tests/`.
5.  **Sync with v2**: All new contracts should follow the `-v2` naming convention and include comprehensive NatSpec.
6.  **Submit a Pull Request**: Provide a clear description of your changes and why they are needed.

## Development Setup
- Install [Clarinet](https://github.com/hirosystems/clarinet).
- Run `clarinet console` to interact with contracts locally.
- Run `clarinet test` to execute the test suite.
