const {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    uintCV,
    noneCV,
    principalCV,
} = require('@stacks/transactions');
const { STACKS_MAINNET, clientFromNetwork } = require('@stacks/network');
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

// Get API URL from network config
const getApiUrl = () => {
    // STACKS_MAINNET has client.baseUrl property
    return NETWORK.client.baseUrl;
};

async function getTransactionStatus(txId) {
    try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
        if (!response.ok) {
            console.log(`⚠️ API error: ${response.status}, retrying...`);
            return 'pending';
        }
        const data = await response.json();
        return data.tx_status;
    } catch (error) {
        console.log(`⚠️ Network error: ${error.message}, retrying...`);
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

// Track NFT ownership per wallet: walletIndex -> array of NFT IDs
const walletNFTs = {};

const ACTIONS = [
    { contract: 'stacks-nft-v2', function: 'mint', args: () => [], needsNFT: false },
    { contract: 'nft-staking-v2', function: 'stake-nft', args: (id) => [uintCV(id)], needsNFT: true, needsStaked: false },
    { contract: 'nft-staking-v2', function: 'claim-rewards', args: (id) => [uintCV(id)], needsNFT: false, needsStaked: true },
    { contract: 'governance-dao-v2', function: 'vote-for', args: (id) => [uintCV(id)], needsNFT: false, needsStaked: false },
];

async function runInteractions() {
    const wallets = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));

    // Initialize wallet NFT tracking - assume all wallets have already minted NFTs
    // Each wallet gets a range of NFT IDs they own (simulating previous mints)
    for (let w = 0; w < wallets.length; w++) {
        walletNFTs[w] = { 
            minted: [(w * 10) + 1, (w * 10) + 2, (w * 10) + 3, (w * 10) + 4, (w * 10) + 5], 
            staked: [] 
        };
    }

    console.log(`Starting ${TOTAL_INTERACTIONS} organic interactions...\n`);

    for (let i = 0; i < TOTAL_INTERACTIONS; i++) {
        // Random wallet selection
        const walletIndex = Math.floor(Math.random() * wallets.length);
        const wallet = wallets[walletIndex];
        const walletState = walletNFTs[walletIndex];

        // Filter actions based on prerequisites
        let availableActions = ACTIONS;
        if (walletState.minted.length === 0 && walletState.staked.length === 0) {
            // Only mint if wallet has no NFTs
            availableActions = [ACTIONS[0]];
        } else if (walletState.staked.length === 0) {
            // Can mint or stake if has NFTs but none staked
            availableActions = [ACTIONS[0], ACTIONS[1]];
        } else {
            // Can do all actions
            availableActions = ACTIONS;
        }

        // Randomly pick an action from available actions
        const actionIndex = Math.floor(Math.random() * availableActions.length);
        const action = availableActions[actionIndex];

        console.log(`[Interaction ${i + 1}/${TOTAL_INTERACTIONS}] Wallet ${wallet.id} performing ${action.function}...`);

        // Determine args based on action
        let functionArgs = [];
        let nftId = null;

        if (action.function === 'mint') {
            functionArgs = [];
            // Simulate a new NFT ID (in real scenario, would query the contract)
            nftId = Math.floor(Math.random() * 10000) + 1;
        } else if (action.function === 'stake-nft' && walletState.minted.length > 0) {
            // Use an unstaked NFT
            const availableToStake = walletState.minted.filter(id => !walletState.staked.includes(id));
            if (availableToStake.length > 0) {
                nftId = availableToStake[Math.floor(Math.random() * availableToStake.length)];
                functionArgs = action.args(nftId);
            }
        } else if (action.function === 'claim-rewards' && walletState.staked.length > 0) {
            nftId = walletState.staked[Math.floor(Math.random() * walletState.staked.length)];
            functionArgs = action.args(nftId);
        } else if (action.function === 'vote-for') {
            nftId = Math.floor(Math.random() * 1000) + 1;
            functionArgs = action.args(nftId);
        }

        const txOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: action.contract,
            functionName: action.function,
            functionArgs: functionArgs,
            senderKey: wallet.privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
            fee: FEE,
            postConditionMode: PostConditionMode.Allow,
        };

        try {
            const transaction = await makeContractCall(txOptions);
            const broadcastResponse = await broadcastTransaction({ transaction, network: NETWORK });

            if (broadcastResponse.error) {
                console.error(`Error: ${broadcastResponse.error}`);
                continue;
            }

            const success = await waitForConfirmation(broadcastResponse.txid);
            
            // Update wallet state on success
            if (success && nftId) {
                if (action.function === 'mint') {
                    walletState.minted.push(nftId);
                    console.log(`  📝 Added NFT #${nftId} to wallet's collection`);
                } else if (action.function === 'stake-nft') {
                    walletState.staked.push(nftId);
                    console.log(`  🔒 Staked NFT #${nftId}`);
                } else if (action.function === 'claim-rewards') {
                    console.log(`  💰 Claimed rewards for NFT #${nftId}`);
                } else if (action.function === 'vote-for') {
                    console.log(`  🗳️ Voted for proposal #${nftId}`);
                }
            }

        } catch (error) {
            console.error(`Unexpected error: ${error.message}`);
        }

        // Organic delay between interactions
        await delay(2000 + Math.random() * 5000);
    }
}

runInteractions().catch(console.error);
