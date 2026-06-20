'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { stellar } from '@/lib/stellar';
import { FiCheck, FiCopy, FiCreditCard, FiLogOut } from 'react-icons/fi';

const walletOptions = [
  { id: 'freighter', label: 'Freighter', note: 'Browser extension' },
  { id: 'xbull', label: 'xBull', note: 'Extension / WalletConnect' },
  { id: 'albedo', label: 'Albedo', note: 'Link-based wallet' },
];

export default function WalletButton() {
  const { publicKey, isConnected, balance, loading, error, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isConnected) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {/* Balance display */}
        <div className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {balance} XLM
        </div>

        {/* Address and copy button */}
        <button
          onClick={handleCopy}
          className="btn-secondary h-10 px-3 text-xs flex items-center gap-1.5"
          title="Copy address"
        >
          {copied ? (
            <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <FiCopy className="h-3.5 w-3.5" />
          )}
          <span className="font-mono">{stellar.formatAddress(publicKey || '', 4, 4)}</span>
        </button>

        {/* Disconnect button */}
        <button
          onClick={disconnect}
          className="btn-secondary h-10 px-3 flex items-center justify-center"
          title="Disconnect"
        >
          <FiLogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        disabled={loading}
        className="btn-primary h-10 px-4 flex items-center gap-2 uppercase tracking-wider text-xs"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <FiCreditCard className="h-4 w-4" />
        )}
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {dropdownOpen && !loading && (
        <div className="absolute right-0 top-12 z-50 w-60 rounded border border-slate-200 bg-white p-2 shadow-xl animate-slide-up">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => {
                setDropdownOpen(false);
                connect(wallet.id);
              }}
              className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-black">{wallet.label}</p>
                <p className="text-xs text-slate-500">{wallet.note}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && !dropdownOpen && (
        <p className="absolute right-0 top-12 mt-1 max-w-xs text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
