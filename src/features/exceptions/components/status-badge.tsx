import type { ExceptionStatus } from '../types';

const STATUS_STYLES: Record<ExceptionStatus, string> = {
  New: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Contacting Member': 'bg-orange-100 text-orange-800',
  'Pending Escalation': 'bg-red-100 text-red-800',
  Resolved: 'bg-green-100 text-green-800',
};

interface StatusBadgeProps {
  status: ExceptionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
