import { PROPOSAL_STATUS_COLORS, PROPOSAL_STATUS_LABELS } from '@/lib/constants';

interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  const norm = status.toLowerCase();
  const colors = PROPOSAL_STATUS_COLORS[norm] || {
    bg: 'bg-zinc-800 border border-zinc-700',
    text: 'text-zinc-300',
    dot: 'bg-zinc-500',
  };
  const label = PROPOSAL_STATUS_LABELS[norm] || status;

  return (
    <span className={`status-badge ${colors.bg} ${colors.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}
