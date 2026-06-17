import { FiInbox } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-850 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <FiInbox className="h-4 w-4 text-white" />
          <span>GovVault — DAO Governance with Quadratic Voting & Treasury Executor</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>Built for RiseIn Level 3 — Orange Belt</span>
        </div>
      </div>
    </footer>
  );
}
