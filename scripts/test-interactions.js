const {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    uintCV,
    noneCV,
    principalCV,
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

const WALLET_FILE = path.join(__dirname, '../test-wallet.json');
const NETWORK = STACKS_MAINNET;
const CONTRACT_ADDRESS = 'SP3KN56MPA655CXFK5ZBZR9BG9VX1RTCB6PB8VQH2';
const FEE = 1000n; // 0.001 STX gas
const TOTAL_INTERACTIONS = 328;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTransactionStatus(txId) {
    try {
        const response = await fetch(`https://api.mainnet.hiro.so/extended/v1/tx/${txId}`);
        const data = await response.json();
        return data.tx_status;
    } catch (error) {
        return 'pending';
    }
}

async function waitForConfirmation(txId) {
    process.stdout.write(`Waiting for interaction ${txId} to confirm... `);
    while (true) {
        const status = await getTransactionStatus(txId);
        if (status === 'success') {
            console.log('✅ Success!');
            return true;
        } else if (status === 'abort' || status === 'dropped') {
            console.log('❌ Failed/Dropped');
            return false;
        }
        process.stdout.write('.');
        await delay(10000);
    }
}

const ACTIONS = [
    { contract: 'stacks-nft-v2', function: 'mint', args: [] },
    { contract: 'nft-staking-v2', function: 'stake-nft', args: (id) => [uintCV(id)] },
    { contract: 'nft-staking-v2', function: 'claim-rewards', args: (id) => [uintCV(id)] },
    { contract: 'governance-dao-v2', function: 'vote-for', args: (id) => [uintCV(id)] },
];

async function runInteractions() {
    const wallets = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));

    console.log(`Starting ${TOTAL_INTERACTIONS} organic interactions...\n`);

    for (let i = 0; i < TOTAL_INTERACTIONS; i++) {
        // Random wallet selection
        const walletIndex = Math.floor(Math.random() * wallets.length);
        const wallet = wallets[walletIndex];

        // Pick a random action (simplified for demonstration, realistically would track state)
        // In a real scenario, we'd need to know if they have an NFT to stake, etc.
        // For this script, we'll focus on the 'mint' action as it's the most common starting point.
        const action = ACTIONS[0]; // Focusing on mints first for organic flow

        console.log(`[Interaction ${i + 1}/${TOTAL_INTERACTIONS}] Wallet ${wallet.id} performing ${action.function}...`);

        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: action.contract,
            functionName: action.function,
            functionArgs: action.args,
            senderKey: wallet.privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
            fee: FEE,
            postConditionMode: PostConditionMode.Allow,
        };

        try {
            const broadcastResponse = await broadcastTransaction({ transaction, network: NETWORK });

            if (broadcastResponse.error) {
                console.error(`Error: ${broadcastResponse.error}`);
                continue;
            }

            await waitForConfirmation(broadcastResponse.txid);

        } catch (error) {
            console.error(`Unexpected error: ${error.message}`);
        }

        // Organic delay between interactions
        await delay(2000 + Math.random() * 5000);
    }
}

runInteractions().catch(console.error);
