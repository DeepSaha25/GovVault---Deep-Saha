export type WalletType = 'freighter' | 'xbull' | 'albedo';

export interface WalletState {
  publicKey: string | null;
  walletType: WalletType | null;
  balance: string;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

export interface TransactionStatus {
  status: 'idle' | 'pending' | 'success' | 'failure';
  txHash: string | null;
  error: string | null;
}

export type ProposalStatus = 'active' | 'passed' | 'failed' | 'executed';

export interface Proposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  target: string;
  amount: string;
  yesVotes: number;
  noVotes: number;
  status: ProposalStatus;
  executionTime: number; // Timelock check (timestamp)
  endTime: number; // Voting period end time (timestamp)
  createdAt: number;
}

export interface ContractEvent {
  id: string;
  type: string;
  topic: string[];
  value: unknown;
  ledger: number;
  txHash: string;
  createdAt: string;
}
