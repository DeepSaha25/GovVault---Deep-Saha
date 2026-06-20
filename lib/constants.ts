export const STELLAR_RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';

export const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

export const EXPLORER_BASE_URL = 'https://stellar.expert/explorer/testnet';

export const GOVERNOR_CONTRACT_ID =
  process.env.NEXT_PUBLIC_GOVERNOR_CONTRACT_ID || '';

export const TREASURY_CONTRACT_ID =
  process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID || '';

export const PROPOSAL_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-amber-100 border border-amber-250', text: 'text-amber-800', dot: 'bg-amber-600' },
  passed: { bg: 'bg-emerald-100 border border-emerald-250', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  failed: { bg: 'bg-rose-100 border border-rose-250', text: 'text-rose-800', dot: 'bg-rose-600' },
  executed: { bg: 'bg-slate-100 border border-slate-250', text: 'text-slate-800', dot: 'bg-slate-600' },
};

export const PROPOSAL_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  passed: 'Passed & Timelocked',
  failed: 'Failed',
  executed: 'Executed',
};
