const {
    makeSTXTokenTransfer,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

const WALLET_FILE = process.env.WALLET_FILE
    ? path.resolve(process.env.WALLET_FILE)
    : path.join(__dirname, '../test-wallet.example.json');
const AMOUNT_PER_WALLET = 45000n; // 0.045 STX in micro-STX
const FEE = 1000n; // 0.001 STX fee
const NETWORK = STACKS_MAINNET;

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
    process.stdout.write(`Waiting for transaction ${txId} to confirm... `);
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
        await delay(10000); // Check every 10 seconds
    }
}

async function distribute() {
    const wallets = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));
    const sourceWallet = wallets[0];

    console.log(`Starting distribution from Wallet 1 (${sourceWallet.mainnetAddress})`);
    console.log(`Target: 40 wallets, ${AMOUNT_PER_WALLET} micro-STX each\n`);

    for (let i = 1; i < wallets.length; i++) {
        const targetWallet = wallets[i];
        console.log(`[${i}/40] Sending to ${targetWallet.mainnetAddress}...`);

        const txOptions = {
            recipient: targetWallet.mainnetAddress,
            amount: AMOUNT_PER_WALLET,
            senderKey: sourceWallet.privateKey,
            network: NETWORK,
            memo: 'Test Fund Distribution',
            anchorMode: AnchorMode.Any,
            fee: FEE,
            postConditionMode: PostConditionMode.Allow,
        };

        try {
            const transaction = await makeSTXTokenTransfer(txOptions);
            const broadcastResponse = await broadcastTransaction({ transaction, network: NETWORK });

            if (broadcastResponse.error) {
                console.error(`Error broadcasting: ${broadcastResponse.error}`);
                if (broadcastResponse.reason) console.error(`Reason: ${broadcastResponse.reason}`);
                break;
            }

            const txId = broadcastResponse.txid;
            const success = await waitForConfirmation(txId);
            if (!success) break;

        } catch (error) {
            console.error('Unexpected error:', error);
            break;
        }

        // 3 second delay between transactions to avoid mempool issues
        await delay(3000);
    }

    console.log('\nDistribution process completed.');
}

distribute().catch(console.error);
