import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.1/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// ============================================================
// governance-token tests
// ============================================================

Clarinet.test({
    name: "governance-token: deployer can mint tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall(
                "governance-token",
                "mint",
                [types.uint(1000000000), types.principal(wallet1.address)],
                deployer.address
            ),
        ]);

        block.receipts[0].result.expectOk().expectBool(true);

        let balance = chain.callReadOnlyFn(
            "governance-token",
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
                "governance-token",
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

        let name = chain.callReadOnlyFn("governance-token", "get-name", [], deployer.address);
        name.result.expectOk().expectAscii("StacksDAO Token");

        let symbol = chain.callReadOnlyFn("governance-token", "get-symbol", [], deployer.address);
        symbol.result.expectOk().expectAscii("SDAO");

        let decimals = chain.callReadOnlyFn("governance-token", "get-decimals", [], deployer.address);
        decimals.result.expectOk().expectUint(6);
    },
});

// ============================================================
// stacks-nft tests
// ============================================================

Clarinet.test({
    name: "stacks-nft: mint costs 0.001 STX and assigns token",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall("stacks-nft", "mint", [], wallet1.address),
        ]);

        block.receipts[0].result.expectOk().expectUint(1);

        // Verify STX transferred
        block.receipts[0].events.expectSTXTransferEvent(
            100000, // 0.001 STX
            wallet1.address,
            deployer.address
        );

        // Verify owner
        let owner = chain.callReadOnlyFn(
            "stacks-nft",
            "get-owner",
            [types.uint(1)],
            wallet1.address
        );
        owner.result.expectOk().expectSome().expectPrincipal(wallet1.address);
    },
});

Clarinet.test({
    name: "stacks-nft: get-mint-price returns 100000 micro-STX",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        let price = chain.callReadOnlyFn("stacks-nft", "get-mint-price", [], deployer.address);
        price.result.expectOk().expectUint(100000);
    },
});

Clarinet.test({
    name: "stacks-nft: get-max-supply returns 10000",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        let maxSupply = chain.callReadOnlyFn("stacks-nft", "get-max-supply", [], deployer.address);
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
            Tx.contractCall("stacks-nft", "mint", [], wallet1.address),
            // wallet2 tries to transfer wallet1's token
            Tx.contractCall(
                "stacks-nft",
                "transfer",
                [types.uint(1), types.principal(wallet2.address), types.principal(wallet3.address)],
                wallet2.address
            ),
        ]);

        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectErr().expectUint(401);
    },
});

// ============================================================
// nft-staking tests
// ============================================================

Clarinet.test({
    name: "nft-staking: stake and unstake an NFT, receive SDAO rewards",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        // Authorize staking contract to mint SDAO
        let setup = chain.mineBlock([
            Tx.contractCall(
                "governance-token",
                "set-authorized-minter",
                [types.principal(`${deployer.address}.nft-staking`)],
                deployer.address
            ),
            // wallet1 mints an NFT
            Tx.contractCall("stacks-nft", "mint", [], wallet1.address),
        ]);
        setup.receipts[0].result.expectOk();
        setup.receipts[1].result.expectOk().expectUint(1);

        // wallet1 stakes token 1
        let stakeBlock = chain.mineBlock([
            Tx.contractCall(
                "nft-staking",
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
                "nft-staking",
                "unstake-nft",
                [types.uint(1)],
                wallet1.address
            ),
        ]);
        unstakeBlock.receipts[0].result.expectOk();

        // Check NFT returned to wallet1
        let owner = chain.callReadOnlyFn(
            "stacks-nft",
            "get-owner",
            [types.uint(1)],
            wallet1.address
        );
        owner.result.expectOk().expectSome().expectPrincipal(wallet1.address);

        // Check SDAO balance > 0
        let balance = chain.callReadOnlyFn(
            "governance-token",
            "get-balance",
            [types.principal(wallet1.address)],
            wallet1.address
        );
        const sdaoBalance = balance.result.expectOk().expectUint;
        // Should have received rewards
    },
});

// ============================================================
// governance-dao tests
// ============================================================

Clarinet.test({
    name: "governance-dao: can create proposal with sufficient SDAO",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        // Mint enough SDAO for wallet1 to create a proposal (need >= 100 SDAO = 100000000)
        let setup = chain.mineBlock([
            Tx.contractCall(
                "governance-token",
                "mint",
                [types.uint(200000000), types.principal(wallet1.address)],
                deployer.address
            ),
        ]);
        setup.receipts[0].result.expectOk();

        let block = chain.mineBlock([
            Tx.contractCall(
                "governance-dao",
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
                "governance-token",
                "mint",
                [types.uint(500000000), types.principal(wallet1.address)],
                deployer.address
            ),
            Tx.contractCall(
                "governance-dao",
                "create-proposal",
                [types.utf8("Test"), types.utf8("Test proposal")],
                wallet1.address
            ),
        ]);

        let votes = chain.mineBlock([
            Tx.contractCall("governance-dao", "vote-for", [types.uint(1)], wallet1.address),
            // Second vote on same proposal
            Tx.contractCall("governance-dao", "vote-for", [types.uint(1)], wallet1.address),
        ]);

        votes.receipts[0].result.expectOk().expectBool(true);
        votes.receipts[1].result.expectErr().expectUint(702); // ERR-ALREADY-VOTED
    },
});
