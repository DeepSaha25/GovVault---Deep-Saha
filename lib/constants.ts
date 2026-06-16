export const STELLAR_RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-rpc.testnet.stellar.org';

export const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

export const EXPLORER_BASE_URL = 'https://stellar.expert/explorer/testnet';

export const GOVERNOR_CONTRACT_ID =
  process.env.NEXT_PUBLIC_GOVERNOR_CONTRACT_ID || '';

export const TREASURY_CONTRACT_ID =
  process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID || '';

export const PROPOSAL_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/10 border border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  passed: { bg: 'bg-zinc-800/60 border border-zinc-700/50', text: 'text-zinc-200', dot: 'bg-zinc-300' },
  failed: { bg: 'bg-red-500/10 border border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
  executed: { bg: 'bg-white/10 border border-white/20', text: 'text-white', dot: 'bg-white' },
};

export const PROPOSAL_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  passed: 'Passed & Timelocked',
  failed: 'Failed',
  executed: 'Executed',
};
