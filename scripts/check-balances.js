const fs = require('fs');
const path = require('path');

const WALLET_FILE = path.join(__dirname, 'test-wallet.json');

// We use the public Stacks API structure (Hiro API)
const API_BASE = process.env.STACKS_API_BASE || 'https://api.mainnet.hiro.so';

async function fetchBalance(address) {
    try {
        const response = await fetch(`${API_BASE}/extended/v1/address/${address}/balances`);
        if (response.status === 429) {
            throw new Error('429');
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        // Return STX balance in micro-STX format natively
        return BigInt(data.stx.balance);
    } catch (e) {
        if (e.message === '429') return 'RATE_LIMIT';
        return 'ERROR';
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkAllBalances() {
    let wallets;
    try {
        wallets = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));
    } catch (e) {
        console.error("❌ Could not read test-wallet.json", e.message);
        process.exit(1);
    }

    console.log(`Checking STX balances for ${wallets.length} test wallets on Mainnet...\n`);

    let totalStx = 0n;
    let successCount = 0;

    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i];
        const address = wallet.mainnetAddress;

        if (!address) {
            console.log(`Wallet ${wallet.id} [Missing Address]`);
            continue;
        }

        let balance = 'RATE_LIMIT';
        while (balance === 'RATE_LIMIT') {
            balance = await fetchBalance(address);
            if (balance === 'RATE_LIMIT') {
                process.stdout.write('⏳ Rate limited, waiting 15s... ');
                await sleep(15000);
            }
        }

        if (balance === 'ERROR') {
            console.log(`Wallet ${wallet.id.toString().padStart(2)}: ${address} - ❌ Fetch Failed`);
        } else {
            const stx = Number(balance) / 1000000;
            console.log(`Wallet ${wallet.id.toString().padStart(2)}: ${address} - 💰 ${stx.toFixed(6)} STX`);
            totalStx += balance;
            successCount++;
        }

        // Small delay to prevent hitting free-tier api rate limit (~25/min -> wait 2.5s between calls)
        await sleep(2500);
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`✅ Checked ${successCount}/${wallets.length} wallets`);
    console.log(`💎 Total Balance: ${(Number(totalStx) / 1000000).toFixed(6)} STX`);
    console.log(`════════════════════════════════════════`);
}

checkAllBalances();
