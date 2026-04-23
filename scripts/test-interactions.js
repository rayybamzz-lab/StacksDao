const {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    uintCV,
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

const WALLET_FILE = process.env.WALLET_FILE
    ? path.resolve(process.env.WALLET_FILE)
    : path.join(__dirname, 'test-wallet.example.json');
const NETWORK = STACKS_MAINNET;
const API_BASE = process.env.STACKS_API_BASE || 'https://api.mainnet.hiro.so';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'SP3KN56MPA655CXFK5ZBZR9BG9VX1RTCB6PB8VQH2';
const FEE = 1000n; // 0.001 STX gas
const TOTAL_INTERACTIONS = 328;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Robust fetch with retry for 429s and network issues
async function fetchWithRetry(url, options = {}, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429) {
                const wait = (i + 1) * 5000;
                process.stdout.write(`⏳ Rate limited (429), waiting ${wait / 1000}s... `);
                await sleep(wait);
                continue;
            }
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            const wait = (i + 1) * 2000;
            await sleep(wait);
        }
    }
}

async function getNonce(address) {
    const data = await fetchWithRetry(`${API_BASE}/extended/v1/address/${address}/nonces`);
    return data.possible_next_nonce;
}

// Track state locally
const walletNFTs = {};
const walletNonces = {};

const ACTIONS = [
    { contract: 'stacks-nft-v2', function: 'mint', args: () => [], type: 'MINT' },
    { contract: 'nft-staking-v2', function: 'stake-nft', args: (id) => [uintCV(id)], type: 'STAKE' },
    { contract: 'nft-staking-v2', function: 'claim-rewards', args: (id) => [uintCV(id)], type: 'CLAIM' },
    { contract: 'governance-dao-v2', function: 'vote-for', args: (id) => [uintCV(id)], type: 'VOTE' },
];

async function runInteractions() {
    let wallets;
    try {
        wallets = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));
    } catch (e) {
        console.error("❌ Could not read test-wallet.json");
        process.exit(1);
    }

    console.log(`Initializing ${wallets.length} wallets...`);
    for (let w = 0; w < wallets.length; w++) {
        const addr = wallets[w].mainnetAddress;
        process.stdout.write(`Fetching nonce for Wallet ${wallets[w].id}... `);
        walletNonces[w] = await getNonce(addr);
        console.log(`Done (${walletNonces[w]})`);

        // Initial simulated state
        walletNFTs[w] = {
            minted: [(w * 10) + 1, (w * 10) + 2],
            staked: []
        };
        await sleep(500); // Small pause during init to stay under rate limits
    }

    console.log(`\nStarting ${TOTAL_INTERACTIONS} organic interactions (non-blocking mode)...\n`);

    for (let i = 0; i < TOTAL_INTERACTIONS; i++) {
        const walletIndex = Math.floor(Math.random() * wallets.length);
        const wallet = wallets[walletIndex];
        const state = walletNFTs[walletIndex];

        // Pick action based on state
        let action;
        if (state.minted.length === 0 && state.staked.length === 0) {
            action = ACTIONS[0]; // Must mint
        } else {
            // Randomly weight actions: 20% mint, 30% stake, 30% claim, 20% vote
            const r = Math.random();
            if (r < 0.2) action = ACTIONS[0];
            else if (r < 0.5) action = ACTIONS[1];
            else if (r < 0.8) action = ACTIONS[2];
            else action = ACTIONS[3];
        }

        // Action logic
        let nftId = null;
        let args = [];

        if (action.type === 'MINT') {
            nftId = Math.floor(Math.random() * 100000) + 1000;
        } else if (action.type === 'STAKE') {
            if (state.minted.length > 0) {
                nftId = state.minted[Math.floor(Math.random() * state.minted.length)];
                args = action.args(nftId);
            } else {
                continue; // Skip if nothing to stake
            }
        } else if (action.type === 'CLAIM' || action.type === 'VOTE') {
            nftId = (state.staked.length > 0) ?
                state.staked[Math.floor(Math.random() * state.staked.length)] :
                Math.floor(Math.random() * 1000);
            args = action.args(nftId);
        }

        process.stdout.write(`[${i + 1}/${TOTAL_INTERACTIONS}] Wallet ${wallet.id} -> ${action.function}(${nftId || ''})... `);

        try {
            const txOptions = {
                contractAddress: CONTRACT_ADDRESS,
                contractName: action.contract,
                functionName: action.function,
                functionArgs: args,
                senderKey: wallet.privateKey,
                network: NETWORK,
                nonce: BigInt(walletNonces[walletIndex]),
                anchorMode: AnchorMode.Any,
                fee: FEE,
                postConditionMode: PostConditionMode.Allow,
            };

            const transaction = await makeContractCall(txOptions);
            const response = await broadcastTransaction({ transaction, network: NETWORK });

            if (response.error) {
                // Handle concurrent nonce error by refreshing
                if (response.error.includes('ConflictingNonce') || response.error.includes('NonceAlreadyUsed')) {
                    console.log('🔄 Nonce sync needed, refreshing...');
                    walletNonces[walletIndex] = await getNonce(wallet.mainnetAddress);
                } else {
                    console.log(`❌ Failed: ${response.error}`);
                }
            } else {
                console.log(`✅ Broadcasted (${response.txid.substring(0, 8)}...)`);
                walletNonces[walletIndex]++;

                // Update local simulation state
                if (action.type === 'MINT') state.minted.push(nftId);
                if (action.type === 'STAKE') {
                    state.minted = state.minted.filter(id => id !== nftId);
                    state.staked.push(nftId);
                }
            }
        } catch (error) {
            console.log(`⚠️ Error: ${error.message}`);
        }

        // Organic delay between broadcasts to prevent rate limiting
        await sleep(3000 + Math.random() * 2000);
    }

    console.log('\n🎉 Finished all interactions!');
}

runInteractions().catch(err => console.error("Fatal error:", err));
