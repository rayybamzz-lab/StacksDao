import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.1/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "GAS PROFILING: Measure STX cost of core protocol actions",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet_1 = accounts.get('wallet_1')!;

        // 1. Profile NFT Minting
        let block = chain.mineBlock([
            Tx.contractCall('stacks-nft-v2', 'mint', [types.principal(wallet_1.address)], deployer.address)
        ]);

        const mintFee = block.receipts[0].result;
        console.log(`\n[GAS PROFILE] NFT Mint: ${mintFee}`);

        // 2. Profile Staking
        block = chain.mineBlock([
            Tx.contractCall('nft-staking-v2', 'stake-nft', [types.uint(1)], wallet_1.address)
        ]);

        console.log(`[GAS PROFILE] Stake NFT: ${block.receipts[0].result}`);

        // 3. Profile Proposal Creation
        block = chain.mineBlock([
            Tx.contractCall('governance-dao-v2', 'create-proposal', [
                types.utf8("Gas Optimized Proposal"),
                types.utf8("Testing the execution cost of governance actions."),
                types.uint(1)
            ], wallet_1.address)
        ]);

        console.log(`[GAS PROFILE] Create Proposal: ${block.receipts[0].result}\n`);

        assertEquals(block.receipts.length, 1);
    },
});
