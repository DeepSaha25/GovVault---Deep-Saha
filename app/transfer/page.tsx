'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { stellar } from '@/lib/stellar';
import { Button } from '@/components/ui/Button';
import { FiArrowRight, FiCheckCircle, FiAlertCircle, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TransferPage() {
  const { publicKey, isConnected, balance, refreshBalance } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (!recipient || !amount) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('idle');
      setTxHash('');
      setErrorMsg('');

      const res = await stellar.sendXlmTransaction(publicKey, recipient, amount);

      setTxStatus('success');
      setTxHash(res.hash);
      toast.success('Transaction submitted successfully!');
      
      // Clear inputs
      setRecipient('');
      setAmount('');
      
      // Refresh balance
      await refreshBalance();
    } catch (err: unknown) {
      setTxStatus('error');
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-20 animate-fade-in">
      <div className="bg-white border border-slate-200 p-8 rounded shadow-none">
        <h2 className="text-xl font-bold text-black mb-1 font-sans">Direct XLM Testnet Transfer</h2>
        <p className="text-xs text-slate-500 mb-6">
          Send XLM directly on the Stellar testnet using your connected wallet.
        </p>

        {!isConnected ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded">
            <FiAlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Please connect your wallet using the button in the top right to start transfers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleTransfer} className="space-y-4">
            {/* Sender Display */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Sender Account
              </label>
              <div className="h-11 w-full rounded border border-slate-200 bg-slate-50 px-3 flex items-center justify-between text-xs text-slate-700 font-mono">
                <span>{stellar.formatAddress(publicKey, 6, 6)}</span>
                <span className="text-slate-500 font-sans font-semibold">Balance: {balance} XLM</span>
              </div>
            </div>

            {/* Recipient Input */}
            <div>
              <label htmlFor="recipient" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Recipient Stellar Address
              </label>
              <input
                id="recipient"
                type="text"
                placeholder="G..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
                className="field-input font-mono"
                required
              />
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Amount (XLM)
              </label>
              <input
                id="amount"
                type="number"
                step="0.0000001"
                min="0.0000001"
                placeholder="10.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="field-input"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-11 flex justify-center items-center gap-2 uppercase tracking-wider text-xs"
            >
              Send Transaction <FiArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        {/* Transaction Feedback */}
        {txStatus === 'success' && txHash && (
          <div className="mt-6 rounded border border-emerald-250 bg-emerald-50/50 p-4 animate-slide-up">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800">Payment Successful!</h4>
                <p className="mt-1 text-xs text-emerald-700">
                  Your payment has been successfully recorded on the Stellar Testnet.
                </p>
                <a
                  href={stellar.getExplorerLink(txHash, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:underline font-semibold"
                >
                  View on Explorer <FiExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {txStatus === 'error' && errorMsg && (
          <div className="mt-6 rounded border border-rose-250 bg-rose-50/50 p-4 animate-slide-up">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="mt-0.5 h-5 w-5 text-rose-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-800">Transaction Failed</h4>
                <p className="mt-1 text-xs text-rose-700">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
