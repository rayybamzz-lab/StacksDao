const {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    uintCV,
    noneCV,
    principalCV,
    getNonce,
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

const WALLET_FILE = path.join(__dirname, '../test-wallet.json');
const NETWORK = STACKS_MAINNET;
const CONTRACT_ADDRESS = 'SP3KN56MPA655CXFK5ZBZR9BG9VX1RTCB6PB8VQH2';
const FEE = 1000n; // 0.001 STX gas
const TOTAL_INTERACTIONS = 328;

// ── Rate limiting config ──────────────────────────────────────
// Hiro free tier: ~25 requests/minute. With nonce fetch + broadcast + status check
// that's ~3 API calls per interaction, so max ~8 interactions/minute.
// We use 25-40s gaps to stay safely under limits.
const MIN_DELAY_MS = 25000;  // 25 seconds minimum between interactions
const MAX_DELAY_MS = 40000;  // 40 seconds maximum
const MAX_RETRIES = 6;
const BASE_RETRY_MS = 20000; // 20s base retry delay (API says "wait 18s")

// ── Track nonces locally to avoid extra API calls ─────────────
const nonceCache = {}; // address -> next nonce

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Retry wrapper with exponential backoff ────────────────────
async function withRetry(fn, label = 'API call') {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const msg = error.message || '';
            const isRateLimit = msg.includes('429') || msg.toLowerCase().includes('rate limit');
            const isFetchFail = msg.includes('fetch failed') || msg.includes('ECONNRESET') || msg.includes('ETIMEDOUT');

            if (attempt >= MAX_RETRIES) {
                throw error; // exhausted retries
            }

            if (isRateLimit) {
                const backoff = BASE_RETRY_MS * Math.pow(1.5, attempt - 1);
                console.log(`  ⏳ Rate limited on ${label} (attempt ${attempt}/${MAX_RETRIES}). Waiting ${Math.round(backoff / 1000)}s...`);
                await sleep(backoff);
            } else if (isFetchFail) {
                const backoff = 10000 * attempt;
                console.log(`  🌐 Network error on ${label} (attempt ${attempt}/${MAX_RETRIES}): ${msg.slice(0, 60)}. Retrying in ${backoff / 1000}s...`);
                await sleep(backoff);
            } else {
                // Non-retryable error (e.g. "transaction rejected")
                throw error;
            }
        }
    }
}

// ── Get API base URL ──────────────────────────────────────────
function getApiUrl() {
    return NETWORK.client?.baseUrl || 'https://api.mainnet.hiro.so';
}

// ── Fetch nonce with retry ────────────────────────────────────
async function fetchNonceWithRetry(address) {
    // Use cached nonce if available
    if (nonceCache[address] !== undefined) {
        const nonce = nonceCache[address];
        nonceCache[address] = nonce + 1n;
        return nonce;
    }

    const nonce = await withRetry(async () => {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/v2/accounts/${address}?proof=0`);
        if (res.status === 429) {
            throw new Error('429 Too Many Requests');
        }
        if (!res.ok) {
            throw new Error(`Account fetch failed: ${res.status}`);
        }
        const data = await res.json();
        return BigInt(data.nonce);
    }, `nonce(${address.slice(0, 8)}...)`);

    nonceCache[address] = nonce + 1n;
    return nonce;
}

// ── Get transaction status with retry ─────────────────────────
async function getTransactionStatus(txId) {
    return withRetry(async () => {
        const res = await fetch(`${getApiUrl()}/extended/v1/tx/${txId}`);
        if (res.status === 429) throw new Error('429 Too Many Requests');
        if (!res.ok) throw new Error(`TX status fetch failed: ${res.status}`);
        const data = await res.json();
        return data.tx_status;
    }, 'tx-status');
}

// ── Wait for confirmation with timeout ────────────────────────
async function waitForConfirmation(txId) {
    process.stdout.write(`  ⌛ Waiting for ${txId.slice(0, 12)}... `);
    const MAX_POLLS = 30; // 5 minutes max

    for (let i = 0; i < MAX_POLLS; i++) {
        try {
            const status = await getTransactionStatus(txId);
            if (status === 'success') {
                console.log('✅ Confirmed!');
                return true;
            }
            if (status === 'abort_by_response' || status === 'abort_by_post_condition' || status === 'dropped') {
                console.log(`❌ ${status}`);
                return false;
            }
        } catch (e) {
            // Retry silently on polling errors
        }
        process.stdout.write('.');
        await sleep(10000);
    }

    console.log('⏰ Timed out');
    return false;
}

// ── NFT tracking ──────────────────────────────────────────────
const walletNFTs = {};

const ACTIONS = [
    { contract: 'stacks-nft-v2', function: 'mint', args: () => [] },
    { contract: 'nft-staking-v2', function: 'stake-nft', args: (id) => [uintCV(id)] },
    { contract: 'nft-staking-v2', function: 'claim-rewards', args: (id) => [uintCV(id)] },
    { contract: 'governance-dao-v2', function: 'vote-for', args: (id) => [uintCV(id)] },
];

// ── Derive STX address from private key ───────────────────────
function getAddressFromKey(privateKey) {
    const { getAddressFromPrivateKey } = require('@stacks/transactions');
    const { TransactionVersion } = require('@stacks/network');
    return getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet);
}

// ── Main loop ─────────────────────────────────────────────────
async function runInteractions() {
    const wallets = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));

    // Pre-compute addresses
    for (const w of wallets) {
        if (!w.address) {
            try {
                w.address = getAddressFromKey(w.privateKey);
            } catch (e) {
                // Address derivation may fail for some key formats; skip
            }
        }
    }

    // Initialize NFT tracking
    for (let w = 0; w < wallets.length; w++) {
        walletNFTs[w] = {
            minted: [(w * 10) + 1, (w * 10) + 2, (w * 10) + 3, (w * 10) + 4, (w * 10) + 5],
            staked: [],
        };
    }

    console.log(`Starting ${TOTAL_INTERACTIONS} organic interactions...`);
    console.log(`⚙️  Rate limiting: ${MIN_DELAY_MS / 1000}-${MAX_DELAY_MS / 1000}s delay, ${MAX_RETRIES} retries with backoff`);
    console.log(`⚙️  API: ${getApiUrl()}\n`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (let i = 0; i < TOTAL_INTERACTIONS; i++) {
        const walletIndex = Math.floor(Math.random() * wallets.length);
        const wallet = wallets[walletIndex];
        const walletState = walletNFTs[walletIndex];

        // Choose available action
        let availableActions;
        if (walletState.minted.length === 0 && walletState.staked.length === 0) {
            availableActions = [ACTIONS[0]]; // Can only mint
        } else if (walletState.staked.length === 0) {
            availableActions = [ACTIONS[0], ACTIONS[1]]; // Mint or stake
        } else {
            availableActions = ACTIONS; // All
        }

        const action = availableActions[Math.floor(Math.random() * availableActions.length)];

        console.log(`[${i + 1}/${TOTAL_INTERACTIONS}] Wallet ${wallet.id || walletIndex} → ${action.function}`);

        // Build function args
        let functionArgs = [];
        let nftId = null;

        if (action.function === 'mint') {
            functionArgs = [];
            nftId = Math.floor(Math.random() * 10000) + 1;
        } else if (action.function === 'stake-nft') {
            const available = walletState.minted.filter(id => !walletState.staked.includes(id));
            if (available.length === 0) {
                console.log(`  ⏭️  No unstaked NFTs available, skipping`);
                skipCount++;
                continue;
            }
            nftId = available[Math.floor(Math.random() * available.length)];
            functionArgs = action.args(nftId);
        } else if (action.function === 'claim-rewards') {
            if (walletState.staked.length === 0) {
                console.log(`  ⏭️  No staked NFTs, skipping`);
                skipCount++;
                continue;
            }
            nftId = walletState.staked[Math.floor(Math.random() * walletState.staked.length)];
            functionArgs = action.args(nftId);
        } else if (action.function === 'vote-for') {
            nftId = Math.floor(Math.random() * 1000) + 1;
            functionArgs = action.args(nftId);
        }

        try {
            // Step 1: Fetch nonce with retry (this is what was causing 429s)
            const senderAddress = wallet.address || getAddressFromKey(wallet.privateKey);
            const nonce = await fetchNonceWithRetry(senderAddress);

            // Step 2: Build transaction with explicit nonce (skips internal nonce fetch)
            const transaction = await withRetry(async () => {
                return makeContractCall({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: action.contract,
                    functionName: action.function,
                    functionArgs: functionArgs,
                    senderKey: wallet.privateKey,
                    network: NETWORK,
                    anchorMode: AnchorMode.Any,
                    fee: FEE,
                    nonce: nonce,          // ← explicit nonce prevents internal API call
                    postConditionMode: PostConditionMode.Allow,
                });
            }, 'build-tx');

            // Step 3: Broadcast with retry
            const broadcastResponse = await withRetry(async () => {
                const resp = await broadcastTransaction({ transaction, network: NETWORK });
                if (resp.error) {
                    if (resp.reason === 'ConflictingNonceInMempool' || resp.reason === 'BadNonce') {
                        // Reset nonce cache for this address 
                        delete nonceCache[senderAddress];
                        throw new Error(`Nonce error: ${resp.reason}`);
                    }
                    throw new Error(`Broadcast error: ${resp.error} — ${resp.reason || ''}`);
                }
                return resp;
            }, 'broadcast');

            // Step 4: Wait for confirmation
            const success = await waitForConfirmation(broadcastResponse.txid);

            if (success) {
                successCount++;
                if (action.function === 'mint') {
                    walletState.minted.push(nftId);
                    console.log(`  📝 Minted NFT #${nftId}`);
                } else if (action.function === 'stake-nft') {
                    walletState.staked.push(nftId);
                    console.log(`  🔒 Staked NFT #${nftId}`);
                } else if (action.function === 'claim-rewards') {
                    console.log(`  💰 Claimed rewards for NFT #${nftId}`);
                } else if (action.function === 'vote-for') {
                    console.log(`  🗳️  Voted on proposal #${nftId}`);
                }
            } else {
                failCount++;
            }

        } catch (error) {
            console.error(`  ❌ Failed: ${error.message}`);
            failCount++;
        }

        // Rate-limited delay between interactions
        const gap = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
        const nextTime = new Date(Date.now() + gap).toLocaleTimeString();
        console.log(`  ⏱️  Next interaction at ~${nextTime} (${Math.round(gap / 1000)}s)\n`);
        await sleep(gap);
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Failed:  ${failCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  📊 Total:   ${TOTAL_INTERACTIONS}`);
    console.log(`════════════════════════════════════════`);
}

runInteractions().catch(console.error);
