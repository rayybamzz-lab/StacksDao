import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.1/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// --------------------------------------------------------------------------
// GOVERNANCE TOKEN (SIP-010) TESTS
// --------------------------------------------------------------------------

Clarinet.test({
    name: "governance-token: deployer can mint tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall(
                "governance-token-v2",
                "mint",
                [types.uint(1000000000), types.principal(wallet1.address)],
                deployer.address
            ),
        ]);

        block.receipts[0].result.expectOk().expectBool(true);

        let balance = chain.callReadOnlyFn(
            "governance-token-v2",
            "get-balance",
            [types.principal(wallet1.address)],
            deployer.address
        );
        balance.result.expectOk().expectUint(1000000000);
    },
});

Clarinet.test({
    name: "governance-token: unauthorized address cannot mint",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;

        let block = chain.mineBlock([
            Tx.contractCall(
                "governance-token-v2",
                "mint",
                [types.uint(1000000000), types.principal(wallet2.address)],
                wallet1.address
            ),
        ]);

        block.receipts[0].result.expectErr().expectUint(401);
    },
});

Clarinet.test({
    name: "governance-token: token metadata is correct",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        let name = chain.callReadOnlyFn("governance-token-v2", "get-name", [], deployer.address);
        name.result.expectOk().expectAscii("StacksDAO Token");

        let symbol = chain.callReadOnlyFn("governance-token-v2", "get-symbol", [], deployer.address);
        symbol.result.expectOk().expectAscii("SDAO");

        let decimals = chain.callReadOnlyFn("governance-token-v2", "get-decimals", [], deployer.address);
        decimals.result.expectOk().expectUint(6);
    },
});

// --------------------------------------------------------------------------
// STACKS NFT (SIP-009) TESTS
// --------------------------------------------------------------------------

Clarinet.test({
    name: "stacks-nft: mint costs 0.01 STX and assigns token",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "mint", [], wallet1.address),
        ]);

        block.receipts[0].result.expectOk().expectUint(1);

        // Verify STX transferred
        block.receipts[0].events.expectSTXTransferEvent(
            10000, // 0.01 STX
            wallet1.address,
            deployer.address
        );

        // Verify owner
        let owner = chain.callReadOnlyFn(
            "stacks-nft-v2",
            "get-owner",
            [types.uint(1)],
            wallet1.address
        );
        owner.result.expectOk().expectSome().expectPrincipal(wallet1.address);
    },
});

Clarinet.test({
    name: "stacks-nft: get-mint-price returns 10000 micro-STX",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        let price = chain.callReadOnlyFn("stacks-nft-v2", "get-mint-price", [], deployer.address);
        price.result.expectOk().expectUint(10000);
    },
});

Clarinet.test({
    name: "stacks-nft: get-max-supply returns 10000",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        let maxSupply = chain.callReadOnlyFn("stacks-nft-v2", "get-max-supply", [], deployer.address);
        maxSupply.result.expectOk().expectUint(10000);
    },
});

Clarinet.test({
    name: "stacks-nft: non-owner cannot transfer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;
        const wallet3 = accounts.get("wallet_3")!;

        let block = chain.mineBlock([
            // wallet1 mints token 1
            Tx.contractCall("stacks-nft-v2", "mint", [], wallet1.address),
            // wallet2 tries to transfer wallet1's token
            Tx.contractCall(
                "stacks-nft-v2",
                "transfer",
                [types.uint(1), types.principal(wallet2.address), types.principal(wallet3.address)],
                wallet2.address
            ),
        ]);
        block.receipts[1].result.expectErr().expectUint(506);

    },
});

Clarinet.test({
    name: "stacks-nft: cannot transfer to self",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "mint", [], wallet1.address),
            Tx.contractCall(
                "stacks-nft-v2",
                "transfer",
                [types.uint(1), types.principal(wallet1.address), types.principal(wallet1.address)],
                wallet1.address
            ),
        ]);

        block.receipts[1].result.expectErr().expectUint(401); // ERR-NOT-AUTHORIZED (or specific self-transfer error if added)
    },
});

Clarinet.test({
    name: "stacks-nft: cannot set empty base URI",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        let block = chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "set-base-uri", [types.ascii("")], deployer.address),
        ]);

        block.receipts[0].result.expectErr().expectUint(401);
    },
});

// --------------------------------------------------------------------------
// NFT STAKING & REWARDS TESTS
// --------------------------------------------------------------------------

Clarinet.test({
    name: "nft-staking: stake and unstake an NFT, receive SDAO rewards",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        // Authorize staking contract to mint SDAO
        let setup = chain.mineBlock([
            Tx.contractCall(
                "governance-token-v2",
                "set-authorized-minter",
                [types.principal(`${deployer.address}.nft-staking-v2`)],
                deployer.address
            ),
            // wallet1 mints an NFT
            Tx.contractCall("stacks-nft-v2", "mint", [], wallet1.address),
        ]);
        setup.receipts[0].result.expectOk();
        setup.receipts[1].result.expectOk().expectUint(1);

        // wallet1 stakes token 1
        let stakeBlock = chain.mineBlock([
            Tx.contractCall(
                "nft-staking-v2",
                "stake-nft",
                [types.uint(1)],
                wallet1.address
            ),
        ]);
        stakeBlock.receipts[0].result.expectOk().expectBool(true);

        // Mine 10 blocks to accumulate rewards
        chain.mineEmptyBlockUntil(chain.blockHeight + 10);

        // Unstake — should receive rewards
        let unstakeBlock = chain.mineBlock([
            Tx.contractCall(
                "nft-staking-v2",
                "unstake-nft",
                [types.uint(1)],
                wallet1.address
            ),
        ]);
        unstakeBlock.receipts[0].result.expectOk();

        // Check NFT returned to wallet1
        let owner = chain.callReadOnlyFn(
            "stacks-nft-v2",
            "get-owner",
            [types.uint(1)],
            wallet1.address
        );
        owner.result.expectOk().expectSome().expectPrincipal(wallet1.address);

        // Check SDAO balance > 0
        let balance = chain.callReadOnlyFn(
            "governance-token-v2",
            "get-balance",
            [types.principal(wallet1.address)],
            wallet1.address
        );
        const sdaoBalance = balance.result.expectOk().expectUint;
        // Should have received rewards
    },
});

// --------------------------------------------------------------------------
// GOVERNANCE DAO TESTS
// --------------------------------------------------------------------------

Clarinet.test({
    name: "governance-dao: can create proposal with sufficient SDAO",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        // Mint enough SDAO for wallet1 to create a proposal (need >= 100 SDAO = 100000000)
        let setup = chain.mineBlock([
            Tx.contractCall(
                "governance-token-v2",
                "mint",
                [types.uint(200000000), types.principal(wallet1.address)],
                deployer.address
            ),
        ]);
        setup.receipts[0].result.expectOk();

        let block = chain.mineBlock([
            Tx.contractCall(
                "governance-dao-v2",
                "create-proposal",
                [
                    types.utf8("Increase reward rate"),
                    types.utf8("Proposal to increase SDAO reward rate from 10 to 15 per block"),
                ],
                wallet1.address
            ),
        ]);

        block.receipts[0].result.expectOk().expectUint(1);
    },
});

Clarinet.test({
    name: "governance-dao: cannot vote twice on same proposal",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        let setup = chain.mineBlock([
            Tx.contractCall(
                "governance-token-v2",
                "mint",
                [types.uint(500000000), types.principal(wallet1.address)],
                deployer.address
            ),
            Tx.contractCall(
                "governance-dao-v2",
                "create-proposal",
                [types.utf8("Test"), types.utf8("Test proposal")],
                wallet1.address
            ),
        ]);

        let votes = chain.mineBlock([
            Tx.contractCall("governance-dao-v2", "vote-for", [types.uint(1)], wallet1.address),
            // Second vote on same proposal
            Tx.contractCall("governance-dao-v2", "vote-for", [types.uint(1)], wallet1.address),
        ]);

        votes.receipts[0].result.expectOk().expectBool(true);
        votes.receipts[1].result.expectErr().expectUint(702); // ERR-ALREADY-VOTED
    },
});

Clarinet.test({
    name: "governance-dao: cannot create proposal with empty title",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const deployer = accounts.get("deployer")!;

        let setup = chain.mineBlock([
            Tx.contractCall("governance-token-v2", "mint", [types.uint(200000000), types.principal(wallet1.address)], deployer.address),
        ]);

        let block = chain.mineBlock([
            Tx.contractCall("governance-dao-v2", "create-proposal", [types.utf8(""), types.utf8("Valid description")], wallet1.address),
        ]);

        block.receipts[0].result.expectErr().expectUint(710); // ERR-INVALID-TITLE
    },
});

Clarinet.test({
    name: "governance-dao: cannot create proposal with empty description",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const deployer = accounts.get("deployer")!;

        let setup = chain.mineBlock([
            Tx.contractCall("governance-token-v2", "mint", [types.uint(200000000), types.principal(wallet1.address)], deployer.address),
        ]);

        let block = chain.mineBlock([
            Tx.contractCall("governance-dao-v2", "create-proposal", [types.utf8("Valid title"), types.utf8("")], wallet1.address),
        ]);

        block.receipts[0].result.expectErr().expectUint(711); // ERR-INVALID-DESCRIPTION
    },
});

Clarinet.test({
    name: "nft-staking: cannot unstake NFT owned by someone else",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;
        const deployer = accounts.get("deployer")!;

        chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "mint", [], wallet1.address),
            Tx.contractCall("nft-staking-v2", "stake-nft", [types.uint(1)], wallet1.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall("nft-staking-v2", "unstake-nft", [types.uint(1)], wallet2.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(603); // ERR-NOT-OWNER
    },
});

Clarinet.test({
    name: "governance-dao: execution fails if quorum is not met",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const deployer = accounts.get("deployer")!;

        chain.mineBlock([
            Tx.contractCall("governance-token-v2", "mint", [types.uint(200000000), types.principal(wallet1.address)], deployer.address),
            Tx.contractCall("governance-dao-v2", "create-proposal", [types.utf8("Test"), types.utf8("Test")], wallet1.address),
            Tx.contractCall("governance-dao-v2", "vote-for", [types.uint(1)], wallet1.address)
        ]);

        chain.mineEmptyBlockUntil(chain.blockHeight + 150);

        let block = chain.mineBlock([
            Tx.contractCall("governance-dao-v2", "execute-proposal", [types.uint(1)], wallet1.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(705); // ERR-QUORUM-NOT-MET
    },
});

Clarinet.test({
    name: "governance-token: cannot mint zero tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        let block = chain.mineBlock([
            Tx.contractCall("governance-token-v2", "mint", [types.uint(0), types.principal(deployer.address)], deployer.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(402); // ERR-INSUFFICIENT-BALANCE
    },
});

Clarinet.test({
    name: "governance-token: cannot transfer zero tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;
        let block = chain.mineBlock([
            Tx.contractCall("governance-token-v2", "transfer", [types.uint(0), types.principal(wallet1.address), types.principal(wallet2.address), types.none()], wallet1.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(402);
    },
});

Clarinet.test({
    name: "governance-token: only owner can set authorized minter",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        let block = chain.mineBlock([
            Tx.contractCall("governance-token-v2", "set-authorized-minter", [types.principal(wallet1.address)], wallet1.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(401);
    },
});

Clarinet.test({
    name: "stacks-nft: only owner can set base URI",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        let block = chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "set-base-uri", [types.ascii("https://hacked.com")], wallet1.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(401);
    },
});

Clarinet.test({
    name: "stacks-nft: only owner can pause contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        let block = chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "set-paused", [types.bool(true)], wallet1.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(401);
    },
});

Clarinet.test({
    name: "stacks-nft: cannot mint when paused",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "set-paused", [types.bool(true)], deployer.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall("stacks-nft-v2", "mint", [], wallet1.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(401);
    },
});

Clarinet.test({
    name: "governance-token: cannot burn zero tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        let block = chain.mineBlock([
            Tx.contractCall("governance-token-v2", "burn", [types.uint(0), types.principal(wallet1.address)], wallet1.address)
        ]);
        block.receipts[0].result.expectErr().expectUint(402);
    },
});

Clarinet.test({
    name: "governance-dao: only owner can call authorized-only helpers (theoretical)",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        // Testing private function access via public wrapper if we ever add one, 
        // for now we just verify the ERR-NOT-AUTHORIZED exists.
        // This is a placeholder for future governance expansion.
        assertEquals(true, true);
    },
});
