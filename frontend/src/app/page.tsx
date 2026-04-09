'use client';

import { useState } from 'react';
import { useStacks } from '@/lib/StacksProvider';
import {
  openContractCall
} from '@stacks/connect';
import {
  Cl,
  Pc,
  PostConditionMode,
} from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS, CONTRACTS } from '@/lib/stacks-config';
import { toast } from 'react-hot-toast';
import {
  Wallet,
  LayoutDashboard,
  Trophy,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame
} from 'lucide-react';
import ProposalCard from '@/components/ProposalCard';

/**
 * Home
 * Functional UI component / utility
 */
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
          toast.success('Successfully broadcasted mint transaction!');
          console.log('Mint TXID:', data.txId);
          setIsMinting(false);
        },
        onCancel: () => {
          toast('Minting cancelled by user', { icon: 'ℹ️' });
          setIsMinting(false);
        },
      });
    } catch (e: any) {
      console.error('[Mint] Error:', e);
      const errorMessage = e.message || 'Transaction failed to broadcast';
      toast.error(`Minting Failed: ${errorMessage}`);
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
          toast.success('Successfully broadcasted staking transaction!');
          console.log('Stake TXID:', data.txId);
          setIsStaking(false);
        },
        onCancel: () => {
          toast('Staking cancelled by user', { icon: 'ℹ️' });
          setIsStaking(false);
        },
      });
    } catch (e: any) {
      console.error('[Stake] Error:', e);
      const errorMessage = e.message || 'Transaction failed to broadcast';
      toast.error(`Staking Failed: ${errorMessage}`);
      setIsStaking(false);
    }
  };

  const handleUnstake = async (tokenId: number) => {
    if (!isSignedIn) return connectWallet();
    setIsUnstaking(true);
    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.NFT_STAKING,
        functionName: 'unstake-nft',
        functionArgs: [Cl.uint(tokenId)],
        network: NETWORK as any,
        onFinish: (data) => {
          toast.success('Successfully broadcasted unstaking transaction!');
          console.log('Unstake TXID:', data.txId);
          setIsUnstaking(false);
        },
        onCancel: () => {
          toast('Unstaking cancelled', { icon: 'ℹ️' });
          setIsUnstaking(false);
        },
      });
    } catch (e: any) {
      console.error('[Unstake] Error:', e);
      toast.error(`Unstaking Failed: ${e.message || 'Unknown error'}`);
      setIsUnstaking(false);
    }
  };

  const handleClaim = async (tokenId: number) => {
    if (!isSignedIn) return connectWallet();
    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.NFT_STAKING,
        functionName: 'claim-rewards',
        functionArgs: [Cl.uint(tokenId)],
        network: NETWORK as any,
        onFinish: (data) => {
          toast.success('Successfully broadcasted claim transaction!');
          console.log('Claim TXID:', data.txId);
        },
        onCancel: () => {
          toast('Claim cancelled', { icon: 'ℹ️' });
        },
      });
    } catch (e: any) {
      console.error('[Claim] Error:', e);
      toast.error(`Claim Failed: ${e.message || 'Unknown error'}`);
    }
  };

  const handleVote = async (proposalId: number, inFavor: boolean) => {
    if (!isSignedIn) return connectWallet();

    const functionName = inFavor ? 'vote-for' : 'vote-against';

    try {
      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.GOVERNANCE_DAO,
        functionName,
        functionArgs: [Cl.uint(proposalId)],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          toast.success(`Vote ${inFavor ? 'for' : 'against'} proposal #${proposalId} broadcasted!`);
          console.log('Transaction:', data.txId);
        },
        onCancel: () => {
          toast.error('Voting cancelled');
        },
      });
    } catch (error) {
      console.error('Voting error:', error);
      toast.error('Failed to broadcast vote');
    }
  };

  const handleExecute = async (proposalId: number) => {
    if (!isSignedIn) return connectWallet();
    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.GOVERNANCE_DAO,
        functionName: 'execute-proposal',
        functionArgs: [Cl.uint(proposalId)],
        network: NETWORK as any,
        onFinish: (data) => {
          toast.success('Successfully broadcasted execution transaction!');
          console.log('Execute TXID:', data.txId);
        },
        onCancel: () => {
          toast('Execution cancelled', { icon: 'ℹ️' });
        },
      });
    } catch (e: any) {
      console.error('[Execute] Error:', e);
      toast.error(`Execution Failed: ${e.message || 'Unknown error'}`);
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
              <div className="flex flex-col leading-none">
                <div className="flex gap-1.5 items-center">
                  <span className="font-bold text-xl tracking-tight">StacksDAO</span>
                  <span className="bg-indigo-500/10 border border-indigo-500/20 font-bold px-1.5 py-0.5 rounded text-[10px] text-indigo-400">V2</span>
                </div>
                <span className="font-medium opacity-50 px-0.5 text-[9px] tracking-widest uppercase">Protocol</span>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              {isSignedIn ? (
                <div className="flex gap-3 items-center">
                  <div className="flex-col hidden items-end leading-none sm:flex">
                    <span className="font-medium text-sm">{userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</span>
                    <span className="dark:text-zinc-400 text-[10px] text-slate-500">Mainnet Connected</span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    aria-label="Disconnect wallet"
                    className="bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 font-medium h-10 hover:bg-slate-200 px-4 rounded-full text-sm transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  aria-label="Connect Stacks wallet"
                  className="bg-indigo-600 flex font-semibold gap-2 h-10 hover:bg-indigo-700 items-center px-6 rounded-full shadow-indigo-500/20 shadow-lg text-sm text-white transition-all"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="lg:px-8 max-w-7xl mx-auto px-4 py-12 sm:px-6">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="bg-indigo-600 overflow-hidden p-8 relative rounded-3xl shadow-2xl shadow-indigo-500/20 sm:p-12">
            <div className="absolute opacity-10 p-12 pointer-events-none right-0 top-0">
              <Zap className="h-64 text-white w-64" />
            </div>
            <div className="max-w-2xl relative z-10">
              <div className="bg-indigo-500/30 font-bold gap-2 inline-flex items-center mb-6 px-3 py-1 rounded-full text-indigo-100 text-xs">
                <span className="flex h-2 relative w-2">
                  <span className="absolute animate-ping bg-indigo-400 h-full inline-flex opacity-75 rounded-full w-full"></span>
                  <span className="bg-indigo-300 h-2 inline-flex relative rounded-full w-2"></span>
                </span>
                MAINNET LIVE
              </div>
              <h1 className="font-extrabold leading-[1.1] mb-6 sm:text-5xl text-4xl text-white">
                Mint, Stake & Govern the <br />Future of Stacks
              </h1>
              <p className="max-w-lg mb-8 text-indigo-100/80 text-lg">
                The first decentralized protocol on Stacks enabling yield generation through NFT staking and multi-tier governance.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  aria-label="Mint new StacksNFT"
                  className="bg-white disabled:opacity-50 flex font-bold gap-2 h-12 hover:bg-indigo-50 items-center px-8 rounded-xl text-indigo-700 transition-colors"
                >
                  {isMinting ? 'Minting...' : 'Mint StacksNFT'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={`https://explorer.hiro.so/address/${CONTRACT_ADDRESS}?chain=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View StacksDao contracts (v2) on Hiro Explorer"
                  aria-label="View StacksDao contracts on Explorer"
                  className="bg-indigo-500/20 border border-indigo-400/30 flex font-semibold gap-2 h-12 hover:bg-indigo-500/30 items-center px-6 rounded-xl text-white transition-colors"
                >
                  View Contracts
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
          {/* Minting Card */}
          <div className="glass-panel border border-slate-200 col-span-1 dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-2xl">
            <div className="flex flex-col gap-6 glass-panel p-8 rounded-3xl">
              <div className="flex items-center justify-between">
                <div className="bg-emerald-500/10 p-3 rounded-xl">
                  <Flame className="h-6 text-emerald-400 w-6" />
                </div>
                <span className="bg-emerald-500/10 font-medium px-3 py-1 rounded-full text-emerald-400 text-sm">
                  SIP-009 Standard
                </span>
              </div>
              <div>
                <h3 className="font-bold mb-1 text-2xl text-white">Mint Stacks NFT</h3>
                <p className="text-indigo-200/60">Limit: 5 NFTs per transaction</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-indigo-200/50">Price</span>
                  <span className="font-medium text-white">0.01 STX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200/50">Supply</span>
                  <span className="font-medium text-white">2,450 / 5,000</span>
                </div>
              </div>
              <button
                onClick={handleMint}
                disabled={isMinting}
                className="bg-white flex font-bold h-12 hover:bg-indigo-50 items-center justify-center rounded-xl text-indigo-950 transition-colors w-full"
                aria-label="Mint NFT for 0.01 STX"
              >
                {isMinting ? 'Minting...' : 'Mint Now'}
              </button>
            </div>
          </div>

          {/* Staking Card */}
          <div className="glass-panel border border-slate-200 col-span-1 dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-2xl">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 flex h-12 items-center justify-center mb-6 rounded-xl text-emerald-600 w-12">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-2 text-xl">Passive Staking</h3>
            <p className="dark:text-zinc-400 mb-6 text-slate-500 text-sm">
              Lock your NFTs in our secure vault and earn SDAO tokens every block.
            </p>
            <div className="border-slate-100 border-t dark:border-zinc-800 pt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Yield</span>
                <span className="font-bold text-emerald-500">10 SDAO / Block</span>
              </div>
              <button
                onClick={() => toast.error('You need to mint an NFT first')}
                aria-label="Go to staking vault"
                className="bg-slate-900 dark:bg-zinc-100 dark:text-black font-bold h-10 mt-4 rounded-lg text-sm text-white w-full"
              >
                Go to Vault
              </button>
            </div>
          </div>

          {/* DAO Card */}
          <ProposalCard
            proposal={{
              id: 1,
              title: "Increase Staking Rewards",
              description: "Proposal to increase the SDAO rewards from 10 to 15 per block to incentivize long-term stakers.",
              votesFor: 450000000,
              votesAgainst: 50000000,
              endBlock: 154000,
              executed: false
            }}
            currentBlock={153000}
            onVote={handleVote}
            onExecute={handleExecute}
          />
        </div>

        {/* Status Section */}
        {!isSignedIn && (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 dark:bg-zinc-900/50 dark:border-zinc-800 mt-16 px-6 py-12 rounded-3xl text-center">
            <LayoutDashboard className="h-12 mb-4 mx-auto text-slate-300 w-12" />
            <h2 className="font-bold mb-2 text-2xl">Start Your Journey</h2>
            <p className="dark:text-zinc-400 max-w-sm mb-8 mx-auto text-slate-600">
              Unlock your personalized dashboard by connecting your Stacks wallet below.
            </p>
            <button
              onClick={connectWallet}
              aria-label="Sign in to Stacks wallet"
              className="bg-slate-900 dark:bg-zinc-100 dark:text-black font-bold h-12 hover:scale-105 px-10 rounded-2xl text-white transition-transform"
            >
              Sign In with Leather / Xverse
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-slate-200 border-t dark:border-zinc-900 mt-24 py-12">
        <div className="flex flex-col gap-6 items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 sm:flex-row sm:px-6">
          <div className="flex gap-2 grayscale items-center opacity-60">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-bold tracking-tight">StacksDAO Protocol</span>
          </div>
          <p className="dark:text-zinc-500 text-slate-500 text-sm">
            © 2026 StacksDAO Mainnet Deployment. Audited Contracts.
          </p>
        </div>
      </footer>
    </div>
  );
}
