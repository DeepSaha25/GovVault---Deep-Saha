'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useGovernor } from '@/hooks/useGovernor';
import { useContractEvents } from '@/hooks/useContractEvents';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProposalCountdown } from '@/components/ui/ProposalCountdown';
import { stellar } from '@/lib/stellar';
import { GOVERNOR_CONTRACT_ID, TREASURY_CONTRACT_ID } from '@/lib/constants';
import {
  FiPlus,
  FiCheck,
  FiX,
  FiPlay,
  FiActivity,
  FiLoader,
  FiExternalLink,
  FiInfo,
  FiSearch,
  FiLock,
  FiUnlock,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { publicKey, isConnected } = useWallet();
  const { proposals, treasuryBalance, loading, createProposal, castVote, executeProposal, evaluateResult } = useGovernor(
    publicKey || undefined
  );
  const { events, loading: eventsLoading } = useContractEvents(GOVERNOR_CONTRACT_ID);

  // Proposal Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Search and Filter State
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'failed' | 'executed'>('all');
  const [showGuide, setShowGuide] = useState(true);

  // Voting Calculator State per Proposal
  const [voteInputs, setVoteInputs] = useState<Record<number, { votes: number }>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first.');
      return;
    }

    try {
      setSubmitting(true);
      await createProposal(title, description, target, amount);
      toast.success('Proposal created successfully!');
      setShowForm(false);
      setTitle('');
      setDescription('');
      setTarget('');
      setAmount('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create proposal';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (proposalId: number, approve: boolean) => {
    const input = voteInputs[proposalId];
    const votes = input?.votes || 1;
    const actionKey = `vote-${proposalId}`;

    if (proposalId === 9999) {
      toast.success(`[Demo] Successfully cast ${votes} votes!`);
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));
      await castVote(proposalId, votes, approve);
      toast.success(`Successfully cast ${votes} votes!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Voting failed';
      toast.error(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleEvaluate = async (proposalId: number) => {
    if (proposalId === 9999) {
      toast.success('[Demo] Proposal evaluation triggered!');
      return;
    }
    const actionKey = `eval-${proposalId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));
      await evaluateResult(proposalId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation failed';
      toast.error(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleExecute = async (proposalId: number) => {
    const actionKey = `exec-${proposalId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));
      await executeProposal(proposalId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Execution failed';
      toast.error(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const updateVoteInput = (proposalId: number, votes: number) => {
    setVoteInputs((prev) => ({
      ...prev,
      [proposalId]: { ...prev[proposalId], votes: Math.max(1, votes) },
    }));
  };

  // Filtered Proposals
  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString() === search;
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  let displayProposals = filteredProposals;
  let showingSample = false;
  if (displayProposals.length === 0 && !loading) {
    displayProposals = [{
      id: 9999,
      title: 'Sample Proposal: Fund Core Infrastructure',
      description: 'This is a mock proposal to demonstrate the UI. It requests 50,000 XLM to fund the core infrastructure development team for Q3. Voting here will only trigger a demo toast.',
      target: 'GBXX...TEST',
      amount: '50000',
      yesVotes: 142,
      noVotes: 12,
      status: 'active',
      proposer: 'GABC...TEST',
      createdAt: Date.now(),
      executionTime: 0,
      endTime: Math.floor(Date.now() / 1000) + 12 * 3600 // 12 hours from now
    } as any];
    showingSample = true;
  }

  // Timelocked Treasury Queue items
  const treasuryQueue = proposals.filter((p) => p.status === 'passed');

  const timelockedAmount = proposals
    .filter((p) => p.status === 'passed')
    .reduce((acc, p) => acc + parseFloat(p.amount || '0'), 0);

  const totalVotesCast = proposals
    .filter((p) => p.id !== 9999)
    .reduce((acc, p) => acc + p.yesVotes + p.noVotes, 0);

  const uniqueParticipants = Array.from(
    new Set([
      ...proposals.filter((p) => p.id !== 9999).map((p) => p.proposer),
      ...events
        .filter((e) => e.topic[0] === 'vote')
        .map((e) => (Array.isArray(e.value) ? String(e.value[0]) : '')),
    ])
  ).filter((addr) => addr && addr.length > 5).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in bg-[#fcf8fa] dark:bg-surface-900">
      {/* Header & Subtitle */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-surface-700 pb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Network Overview</p>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white font-sans">Governance Dashboard</h1>
        </div>

        {isConnected && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-5 py-2.5 rounded font-semibold flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all text-xs uppercase tracking-wider"
          >
            <FiPlus className="h-4 w-4" />
            {showForm ? 'Close Console' : 'New Proposal'}
          </button>
        )}
      </div>

      {!GOVERNOR_CONTRACT_ID && (
        <div className="rounded border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-4 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2.5">
          <FiInfo className="text-slate-400 h-4 w-4 flex-shrink-0" />
          <span>Governor contract ID is not configured. Please deploy the smart contracts first to fetch real-time state.</span>
        </div>
      )}

      {showGuide && (
        <div className="relative rounded border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-5">
          <button 
            onClick={() => setShowGuide(false)}
            className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FiX className="h-4 w-4" />
          </button>
          <div className="flex gap-3">
            <FiInfo className="text-blue-500 dark:text-blue-400 h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">Welcome to GovVault! How to Vote</h3>
              <p className="text-xs text-blue-800 dark:text-blue-200/80 max-w-3xl leading-relaxed">
                GovVault uses <strong>Quadratic Voting</strong> to ensure fair governance. This means the cost to vote scales quadratically: <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-[10px]">Cost = Votes²</code>. 
                For example, casting 1 vote costs 1 token, but casting 4 votes costs 16 tokens. This protects the protocol from being dominated by a few wealthy participants. Use the slider on active proposals to see your cost!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-6">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Total Treasury Pool</p>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black dark:text-white font-sans">
              {parseFloat(treasuryBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XLM
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">
              Timelocked: {timelockedAmount.toLocaleString()} XLM
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Active Proposals</p>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black dark:text-white font-sans">
              {proposals.filter((p) => p.status === 'active' && p.id !== 9999).length} Proposals
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400">Voting Live</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Quadratic Votes Cast</p>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black dark:text-white font-sans">
              {totalVotesCast.toLocaleString()} Votes
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">On-Chain Total</span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">DAO Participants</p>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black dark:text-white font-sans">
              {uniqueParticipants} Wallets
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">Active on Stellar Testnet</span>
          </div>
        </div>
      </div>

      {/* New Proposal Modal Form */}
      {showForm && (
        <div className="rounded border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 animate-slide-up space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-black dark:text-white uppercase tracking-wider">Create New Grant Proposal</h2>
            <p className="text-xs text-slate-400">Deposit 100 GVT tokens to initiate a proposal.</p>
          </div>
          <form onSubmit={handleCreateProposal} className="space-y-4 max-w-3xl">
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">Proposal Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Funding Core Infrastructure"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="field-input"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">Description</label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe the milestone and scope of work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="field-input h-24 pt-2"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="target" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">Recipient Target Account</label>
                <input
                  id="target"
                  type="text"
                  placeholder="G..."
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="field-input font-mono"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">Amount (XLM)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="field-input"
                  required
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" isLoading={submitting}>
                Submit Proposal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Layout (8/4 Split Screen) */}
      {!isConnected ? (
        <div className="text-center py-16 rounded border border-dashed border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800">
          <FiActivity className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-black dark:text-white">Wallet Connection Required</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Please connect your Freighter wallet using the selector in the header to view governance proposals and cast votes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Active Proposals List (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-bold text-black dark:text-white uppercase tracking-wider">Active Proposals</h2>
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  className="w-full pl-9 pr-3 h-10 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded focus:border-black outline-none text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Search proposals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-surface-700 overflow-x-auto pb-px">
              {([
                { id: 'all', label: 'All Proposals' },
                { id: 'active', label: 'Active' },
                { id: 'passed', label: 'Passed' },
                { id: 'failed', label: 'Failed' },
                { id: 'executed', label: 'Executed' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`font-semibold text-xs uppercase tracking-wider pb-2 px-1 whitespace-nowrap border-b-2 transition-all ${
                    filter === tab.id
                      ? 'border-black text-black dark:text-white'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-black dark:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Proposals List mapping */}
            {loading ? (
              <div className="flex justify-center items-center py-20 text-slate-500 dark:text-slate-400 gap-2">
                <FiLoader className="animate-spin h-5 w-5" />
                <span className="text-xs uppercase tracking-wider font-semibold">Synchronizing state from Soroban...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {showingSample && (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-surface-700 rounded bg-slate-50 dark:bg-surface-800 text-xs font-semibold">
                    No real proposals found on-chain. Showing a sample proposal to demonstrate the workflow.
                  </div>
                )}
                {displayProposals.map((prop) => {
                  const votesToCast = voteInputs[prop.id]?.votes || 1;
                  const quadraticCost = votesToCast * votesToCast;
                  const evalLoading = actionLoading[`eval-${prop.id}`];
                  const execLoading = actionLoading[`exec-${prop.id}`];
                  const voteLoading = actionLoading[`vote-${prop.id}`];

                  return (
                    <div
                      key={prop.id}
                      className="border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 rounded flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-black transition-colors"
                    >
                      {/* Left Part of Card */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-slate-100 dark:bg-surface-700 border border-slate-200 dark:border-surface-700 px-2 py-0.5 text-slate-600 dark:text-slate-300 rounded">
                              #GV-{prop.id}
                            </span>
                            <Badge status={prop.status} />
                          </div>
                          {prop.status === 'active' && prop.endTime > 0 && (
                            <ProposalCountdown targetTime={prop.endTime} prefix="Ends In:" />
                          )}
                          {prop.status === 'passed' && prop.executionTime > 0 && (
                            <ProposalCountdown targetTime={prop.executionTime} prefix="Timelock:" />
                          )}
                        </div>
                        <Link href={`/proposals/${prop.id}`} className="hover:underline group flex items-center gap-1">
                          <h3 className="text-base font-bold text-black dark:text-white font-sans group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{prop.title}</h3>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{prop.description}</p>

                        {/* Vote Distribution Bar */}
                        {(() => {
                          const totalVotes = prop.yesVotes + prop.noVotes;
                          const yesPercentage = totalVotes > 0 ? (prop.yesVotes / totalVotes) * 100 : 50;
                          const noPercentage = totalVotes > 0 ? (prop.noVotes / totalVotes) * 100 : 50;
                          return (
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{prop.yesVotes} YES ({totalVotes > 0 ? yesPercentage.toFixed(0) : 0}%)</span>
                                <span className="text-rose-600 dark:text-rose-400 font-bold">{prop.noVotes} NO ({totalVotes > 0 ? noPercentage.toFixed(0) : 0}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-surface-700 rounded-full h-2 overflow-hidden flex border border-slate-200/50 dark:border-surface-700/50">
                                {totalVotes === 0 ? (
                                  <div className="w-full bg-slate-200 dark:bg-surface-700 h-full rounded-full" />
                                ) : (
                                  <>
                                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${yesPercentage}%` }} />
                                    <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${noPercentage}%` }} />
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <div>
                            <span className="block text-slate-400 text-[9px] mb-0.5">Proposer</span>
                            <span className="font-mono text-black dark:text-white">{stellar.formatAddress(prop.proposer, 5, 5)}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[9px] mb-0.5">Grant Value</span>
                            <span className="text-black dark:text-white font-bold">{prop.amount} XLM</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[9px] mb-0.5">Yes Votes</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{prop.yesVotes}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[9px] mb-0.5">No Votes</span>
                            <span className="text-rose-700 dark:text-rose-400 font-bold">{prop.noVotes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Part: Vote Panel / Action Panel */}
                      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-200 dark:border-surface-700 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center gap-4">
                        {prop.status === 'active' && (
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <label className="block text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                Cast Your Vote (Quadratic Cost)
                              </label>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="range"
                                      min="1"
                                      max="100"
                                      value={votesToCast}
                                      onChange={(e) => updateVoteInput(prop.id, parseInt(e.target.value) || 1)}
                                      className="flex-1 h-1.5 bg-slate-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                                      disabled={voteLoading}
                                    />
                                    <input
                                      type="number"
                                      min="1"
                                      value={votesToCast}
                                      onChange={(e) => updateVoteInput(prop.id, parseInt(e.target.value) || 1)}
                                      className="w-16 h-8 rounded border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-xs text-black dark:text-white font-mono text-center focus:border-black focus:ring-0 focus:outline-none"
                                      disabled={voteLoading}
                                    />
                                  </div>
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Votes: {votesToCast}</span>
                                    <span className="text-[10px] text-black dark:text-white font-bold bg-slate-100 dark:bg-surface-700 px-2 py-0.5 rounded font-mono">
                                      Cost: {quadraticCost} Tokens
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                onClick={() => handleVote(prop.id, true)}
                                isLoading={voteLoading}
                                className="h-9 text-xs bg-white dark:bg-surface-800 hover:bg-emerald-50 dark:bg-emerald-900/30 hover:border-emerald-600 border border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-200"
                              >
                                <FiCheck className="mr-1 h-3.5 w-3.5 text-emerald-600" /> YES
                              </Button>
                              <Button
                                onClick={() => handleVote(prop.id, false)}
                                isLoading={voteLoading}
                                className="h-9 text-xs bg-white dark:bg-surface-800 hover:bg-rose-50 dark:bg-rose-900/30 hover:border-rose-600 border border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-200"
                              >
                                <FiX className="mr-1 h-3.5 w-3.5 text-rose-600" /> NO
                              </Button>
                            </div>

                            <Button
                              onClick={() => handleEvaluate(prop.id)}
                              isLoading={evalLoading}
                              variant="secondary"
                              className="w-full h-8 text-[10px] uppercase tracking-wider"
                            >
                              End Voting Period
                            </Button>
                          </div>
                        )}

                        {prop.status === 'passed' && (
                          <div className="space-y-2">
                            <div className="rounded border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/30 p-2.5 text-[9px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                              <FiLock className="h-3 w-3 flex-shrink-0" />
                              <span>Timelock Active (Executable)</span>
                            </div>
                            <Button
                              onClick={() => handleExecute(prop.id)}
                              isLoading={execLoading}
                              className="w-full h-9 flex items-center justify-center gap-1.5 uppercase text-xs tracking-wider"
                            >
                              <FiPlay className="h-3.5 w-3.5" /> Execute Release
                            </Button>
                          </div>
                        )}

                        {prop.status === 'executed' && (
                          <div className="rounded border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/30/50 p-3 text-xs text-emerald-800 dark:text-emerald-300 text-center font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                            <FiUnlock className="h-3.5 w-3.5" /> Paid Out
                          </div>
                        )}

                        {prop.status === 'failed' && (
                          <div className="rounded border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/30/50 p-3 text-xs text-rose-800 dark:text-rose-300 text-center font-bold uppercase tracking-wider">
                            Rejected
                          </div>
                        )}

                        <Link 
                          href={`/proposals/${prop.id}`}
                          className="text-[9px] text-center text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white uppercase font-bold tracking-wider pt-2 border-t border-slate-100 dark:border-surface-750 block"
                        >
                          View Details & Audit &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Treasury Payout Queue & Event Sidebar (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Treasury Balance Info Card */}
            <div className="border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 rounded p-4 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-surface-750">
                <span className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">Treasury Contract</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-250 uppercase">
                  Connected
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Contract Balance</p>
                <p className="text-2xl font-bold text-black dark:text-white font-sans">
                  {parseFloat(treasuryBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XLM
                </p>
              </div>
              <div className="text-[10px] space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Address:</span>
                  <a 
                    href={stellar.getExplorerLink(TREASURY_CONTRACT_ID, 'contract')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-500 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    {stellar.formatAddress(TREASURY_CONTRACT_ID, 6, 6)}
                    <FiExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Treasury Payout Queue */}
            <div className="border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 rounded overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-800 flex justify-between items-center">
                <span className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">Treasury Queue</span>
                <span className="font-mono text-xs bg-black text-white px-2 py-0.5 rounded">
                  {treasuryQueue.length} Items
                </span>
              </div>
              <div className="divide-y divide-slate-200">
                {treasuryQueue.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 dark:text-slate-400 italic text-center">No payouts pending execution.</p>
                ) : (
                  treasuryQueue.map((item) => (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-xs text-black dark:text-white truncate max-w-[140px]">{item.title}</p>
                          <p className="font-mono text-slate-400 text-[10px]">GV-{item.id}</p>
                        </div>
                        <span className="font-mono text-xs font-bold text-black dark:text-white">{item.amount} XLM</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-700">
                        <FiLock className="h-3 w-3" />
                        <span className="font-mono text-[10px]">Timelocked Payout</span>
                      </div>
                      <button
                        onClick={() => handleExecute(item.id)}
                        className="w-full py-2 bg-black text-white hover:bg-opacity-90 active:scale-95 text-[10px] font-bold uppercase tracking-widest transition-all rounded border border-black"
                      >
                        Execute Release
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Event Ledger Logs Feed */}
            <div className="border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-4 rounded space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white flex items-center gap-1.5">
                <FiActivity className="text-slate-500 dark:text-slate-400 animate-pulse" />
                Live Event Ledger
              </h3>
              
              {eventsLoading ? (
                <div className="space-y-2">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-10 animate-pulse bg-slate-100 dark:bg-surface-700 rounded" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No events streaming. Actions on-chain will appear here.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="rounded border border-slate-150 bg-slate-50 dark:bg-surface-800 p-2.5 text-[10px] font-mono animate-fade-in space-y-1"
                    >
                      <div className="flex justify-between text-black dark:text-white font-semibold">
                        <span>{evt.topic.join(' / ')}</span>
                        <span className="text-slate-400 text-[9px]">L{evt.ledger}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                        Payload: {JSON.stringify(evt.value, (k, v) => typeof v === 'bigint' ? v.toString() : v)}
                      </p>
                      <a
                        href={stellar.getExplorerLink(evt.txHash, 'tx')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] text-slate-400 hover:text-black dark:text-white"
                      >
                        Tx Hash: {stellar.formatAddress(evt.txHash, 5, 5)}
                        <FiExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
