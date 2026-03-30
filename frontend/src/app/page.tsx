'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useStacks } from '@/lib/StacksProvider';
import {
  openContractCall
} from '@stacks/connect';
import {
  Cl,
  Pc,
  PostConditionMode,
} from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS, CONTRACTS, CONTRACT_IDENTIFIERS } from '@/lib/stacks-config';
import { toast } from 'react-hot-toast';
import {
  Wallet,
  LayoutDashboard,
  Coins,
  Trophy,
  Vote,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Home() {
  const { isSignedIn, userAddress, connectWallet, disconnectWallet } = useStacks();
  const [isMinting, setIsMinting] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const handleMint = async () => {
    if (!isSignedIn) return connectWallet();

    setIsMinting(true);
    const mintPrice = 10000; // 0.01 STX as per contract constant

    try {
      const postConditions = [
        Pc.principal(userAddress!).willSendEq(mintPrice).ustx()
      ];

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.STACKS_NFT,
        functionName: 'mint',
        functionArgs: [],
        postConditionMode: PostConditionMode.Deny,
        postConditions: postConditions as any,
        network: NETWORK as any,
        onFinish: (data) => {
          toast.success('Mint transaction broadcasted!');
          console.log('TXID:', data.txId);
          setIsMinting(false);
        },
        onCancel: () => {
          toast.error('Minting cancelled');
          setIsMinting(false);
        },
      });
    } catch (e: any) {
      console.error('Minting error:', e);
      toast.error(`Minting failed: ${e.message || 'Unknown error'}`);
      setIsMinting(false);
    }
  };

  const handleStake = async (tokenId: number) => {
    if (!isSignedIn) return connectWallet();

    setIsStaking(true);
    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.NFT_STAKING,
        functionName: 'stake-nft',
        functionArgs: [Cl.uint(tokenId)],
        network: NETWORK as any,
        onFinish: (data) => {
          toast.success('Staking transaction broadcasted!');
          setIsStaking(false);
        },
        onCancel: () => {
          setIsStaking(false);
        },
      });
    } catch (e: any) {
      console.error('Staking error:', e);
      toast.error(`Staking failed: ${e.message || 'Unknown error'}`);
      setIsStaking(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-950 dark:text-zinc-100 font-sans min-h-screen selection:bg-indigo-500/30 text-slate-900">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-slate-200/60 dark:bg-zinc-950/80 dark:border-zinc-800/60 sticky top-0 z-50">
        <div className="lg:px-8 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-indigo-600 flex h-8 items-center justify-center rounded-lg w-8">
                <ShieldCheck className="h-5 text-white w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">StacksDAO</span>
            </div>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end leading-none">
                    <span className="text-sm font-medium">{userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">Mainnet Connected</span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="h-10 px-4 rounded-full bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="h-10 px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-500/20 text-sm font-semibold flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-indigo-600 p-8 sm:p-12 shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Zap className="w-64 h-64 text-white" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-300"></span>
                </span>
                MAINNET LIVE
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-[1.1]">
                Mint, Stake & Govern the <br />Future of Stacks
              </h1>
              <p className="text-lg text-indigo-100/80 mb-8 max-w-lg">
                The first decentralized protocol on Stacks enabling yield generation through NFT staking and multi-tier governance.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  className="h-12 px-8 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isMinting ? 'Minting...' : 'Mint StacksNFT'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://explorer.hiro.so/address/${CONTRACT_ADDRESS}?chain=mainnet`}
                  target="_blank"
                  className="h-12 px-6 rounded-xl bg-indigo-500/20 text-white font-semibold hover:bg-indigo-500/30 transition-colors flex items-center gap-2 border border-indigo-400/30"
                >
                  View Contracts
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Minting Card */}
          <div className="col-span-1 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">NFT Minting</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Mint your unique StacksDao NFT to start earning protocol rewards.
            </p>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Price</span>
                <span className="font-bold">0.01 STX</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Max Supply</span>
                <span className="font-bold">10,000</span>
              </div>
            </div>
          </div>

          {/* Staking Card */}
          <div className="col-span-1 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Passive Staking</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Lock your NFTs in our secure vault and earn SDAO tokens every block.
            </p>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Yield</span>
                <span className="font-bold text-emerald-500">10 SDAO / Block</span>
              </div>
              <button
                onClick={() => toast.error('You need to mint an NFT first')}
                className="w-full h-10 rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-black text-sm font-bold mt-4"
              >
                Go to Vault
              </button>
            </div>
          </div>

          {/* DAO Card */}
          <div className="col-span-1 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Vote className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Governance</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Use your SDAO tokens to vote on proposals or create your own.
            </p>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Proposal Threshold</span>
                <span className="font-bold">10,000 SDAO</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <p className="text-[11px] font-medium text-purple-800 dark:text-purple-300">
                  Governance is powered by the SIP-010 standard SDAO token.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        {!isSignedIn && (
          <div className="mt-16 text-center py-12 px-6 rounded-3xl bg-slate-100 dark:bg-zinc-900/50 border-2 border-dashed border-slate-200 dark:border-zinc-800">
            <LayoutDashboard className="mx-auto w-12 h-12 text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start Your Journey</h2>
            <p className="text-slate-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
              Unlock your personalized dashboard by connecting your Stacks wallet below.
            </p>
            <button
              onClick={connectWallet}
              className="h-12 px-10 rounded-2xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-black font-bold hover:scale-105 transition-transform"
            >
              Sign In with Leather / Xverse
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 dark:border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-60">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold tracking-tight">StacksDAO Protocol</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-500">
            © 2026 StacksDAO Mainnet Deployment. Audited Contracts.
          </p>
        </div>
      </footer>
    </div>
  );
}

