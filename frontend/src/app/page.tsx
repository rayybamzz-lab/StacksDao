'use client';

import { useState, useEffect } from 'react';
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
  Coins,
  Trophy,
  Vote,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  Crown,
  Activity,
  Star,
  Sparkles,
  Copy,
  Check,
  Menu,
  X,
  ChevronRight,
  Building2,
  HandCoins,
  Users,
  CircleDollarSign
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { AddressDisplay, NetworkStatus } from '@/components/ui/Address';
import { StatsCard } from '@/components/ui/EmptyState';
import { Progress } from '@/components/ui/Progress';

export default function Home() {
  const { isSignedIn, userAddress, connectWallet, disconnectWallet } = useStacks();
  const [isMinting, setIsMinting] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyAddress = async () => {
    if (userAddress) {
      await navigator.clipboard.writeText(userAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleMint = async () => {
    if (!isSignedIn) return connectWallet();

    setIsMinting(true);
    const mintPrice = 10000;

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

  const features = [
    {
      icon: <Coins className="w-6 h-6" />,
      title: 'NFT Minting',
      description: 'Mint unique StacksDao NFTs to join the governance ecosystem.',
      color: 'orange',
      stats: [
        { label: 'Price', value: '0.01 STX' },
        { label: 'Supply', value: '10,000' }
      ],
      action: (
        <Button 
          onClick={handleMint} 
          isLoading={isMinting}
          className="w-full"
        >
          {isMinting ? 'Minting...' : 'Mint NFT'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Passive Staking',
      description: 'Lock your NFTs and earn SDAO tokens every block.',
      color: 'emerald',
      stats: [
        { label: 'Yield', value: '10 SDAO/block' },
        { label: 'APY', value: '~24%' }
      ],
      action: (
        <Button 
          variant="secondary" 
          onClick={() => toast.error('You need to mint an NFT first')}
          className="w-full"
        >
          <Lock className="w-4 h-4" />
          Go to Vault
        </Button>
      )
    },
    {
      icon: <Vote className="w-6 h-6" />,
      title: 'Governance',
      description: 'Vote on proposals and shape the future of the protocol.',
      color: 'purple',
      stats: [
        { label: 'Threshold', value: '10,000 SDAO' },
        { label: 'Status', value: 'Active' }
      ],
      action: (
        <Button variant="secondary" className="w-full">
          <Users className="w-4 h-4" />
          View Proposals
        </Button>
      )
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Yield Farming',
      description: 'Provide liquidity and earn enhanced protocol rewards.',
      color: 'blue',
      stats: [
        { label: 'Multiplier', value: 'up to 3x' },
        { label: 'TVL', value: '$2.4M' }
      ],
      action: (
        <Button variant="secondary" className="w-full">
          <CircleDollarSign className="w-4 h-4" />
          Farm Now
        </Button>
      )
    }
  ];

  const stats = [
    { label: 'Total NFTs Minted', value: '8,432', change: 12.5, trend: 'up' as const },
    { label: 'Total Staked', value: '5,891', change: 8.2, trend: 'up' as const },
    { label: 'SDAO Holders', value: '3,247', change: 15.3, trend: 'up' as const },
    { label: 'Active Proposals', value: '7', change: 0, trend: 'neutral' as const },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-zinc-800/60 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">StacksDAO</span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 -mt-1">Protocol v2.0</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Features
              </a>
              <a href="#stats" className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Stats
              </a>
              <a href="#governance" className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Governance
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <NetworkStatus network="mainnet" connected={true} />
              
              {isSignedIn ? (
                <div className="hidden sm:flex items-center gap-3">
                  <Tooltip content={copiedAddress ? 'Copied!' : 'Click to copy address'}>
                    <button
                      onClick={handleCopyAddress}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all group"
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold">
                          {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Connected
                        </span>
                      </div>
                      {copiedAddress ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                      )}
                    </button>
                  </Tooltip>
                  <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button onClick={connectWallet} className="hidden sm:flex">
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-sm font-medium">Features</a>
              <a href="#stats" className="block py-2 text-sm font-medium">Stats</a>
              <a href="#governance" className="block py-2 text-sm font-medium">Governance</a>
              {!isSignedIn && (
                <Button onClick={connectWallet} className="w-full mt-4">
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 dot-pattern opacity-50" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Mainnet Live
                <Badge variant="outline" size="sm">v2.0</Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                Mint, Stake &{' '}
                <span className="gradient-text">Govern</span>{' '}
                <br className="hidden sm:block" />
                the Future of Stacks
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                The first decentralized protocol on Stacks enabling yield generation through NFT staking and multi-tier governance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <Button size="lg" onClick={handleMint} isLoading={isMinting}>
                  {isMinting ? 'Minting...' : 'Mint StacksNFT'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg">
                  <Sparkles className="w-5 h-5" />
                  Explore DAO
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500 dark:text-zinc-500 animate-in fade-in duration-500 delay-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Audited Contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>5,000+ Community</span>
                </div>
                <a
                  href={`https://explorer.hiro.so/address/${CONTRACT_ADDRESS}?chain=mainnet`}
                  target="_blank"
                  className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </a>
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-20">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-slate-50 dark:text-zinc-950" />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-slate-50 dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <Badge variant="info" className="mb-4">Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need to{' '}
                <span className="gradient-text">Succeed</span>
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Discover the powerful features that make StacksDAO the premier governance protocol on Stacks.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  hover
                  glow
                  className="relative overflow-hidden group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-${feature.color}-500/10 to-transparent`} />
                  
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      {feature.stats.map((stat) => (
                        <div key={stat.label} className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-zinc-400">{stat.label}</span>
                          <span className="font-semibold">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    {feature.action}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="success" className="mb-4">
                <Activity className="w-3 h-3 mr-1" />
                Live Stats
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Protocol at a Glance
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <StatsCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={<Activity className="w-5 h-5" />}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Governance Section */}
        <section id="governance" className="py-16 sm:py-24 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Crown className="w-3 h-3 mr-1" />
                  Decentralized Governance
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Your Voice Matters in{' '}
                  <span className="gradient-text">StacksDAO</span>
                </h2>
                <p className="text-slate-600 dark:text-zinc-400 mb-8">
                  As a SDAO token holder, you have the power to propose and vote on protocol upgrades, 
                  treasury allocations, and ecosystem initiatives. Every vote shapes the future of our community.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0">
                      <Vote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Vote on Proposals</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Participate in governance decisions with your SDAO tokens.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                      <HandCoins className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Earn Rewards</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Stake NFTs and earn SDAO tokens while helping secure the protocol.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Card className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Proposal #42</h3>
                    <p className="text-slate-500 dark:text-zinc-400">Treasury Allocation Q1 2026</p>
                  </div>

                  <Progress value={72} showLabel label="Votes For" variant="success" className="mb-4" />
                  <Progress value={18} label="Votes Against" variant="danger" className="mb-6" />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">72%</div>
                      <div className="text-xs text-slate-500">For</div>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">18%</div>
                      <div className="text-xs text-slate-500">Against</div>
                    </div>
                  </div>

                  <Button className="w-full mt-6" variant="secondary">
                    View All Proposals
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Card>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 border-0 text-white p-8 sm:p-12">
              {/* Background Effects */}
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <Zap className="w-64 h-64" />
              </div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
                  Join thousands of community members already earning rewards and shaping the future of StacksDAO.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleMint}
                    isLoading={isMinting}
                    className="bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    {isMinting ? 'Minting...' : 'Mint Your NFT'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-indigo-500/20 border-indigo-400/30 text-white hover:bg-indigo-500/30"
                  >
                    Read Documentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 py-12 bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">StacksDAO</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                The first decentralized protocol on Stacks enabling yield generation through NFT staking.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contracts</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Governance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Discord</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Twitter</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Forum</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Audits</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-zinc-500">
              © 2026 StacksDAO. Audited by Halborn & OpenZeppelin.
            </p>
            <div className="flex items-center gap-4">
              <NetworkStatus network="mainnet" connected={true} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
