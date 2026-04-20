import type { ExceptionItem } from '../types';

interface SummaryCardsProps {
  items: ExceptionItem[];
}

export function SummaryCards({ items }: SummaryCardsProps) {
  const total = items.length;
  const open = items.filter((i) => i.status !== 'Resolved').length;
  const resolved = items.filter((i) => i.status === 'Resolved').length;
  const pendingEscalation = items.filter((i) => i.status === 'Pending Escalation').length;

  const cards = [
    { label: 'Total Items', value: total, color: 'border-gray-300 bg-white' },
    { label: 'Open', value: open, color: 'border-blue-300 bg-blue-50' },
    { label: 'Resolved', value: resolved, color: 'border-green-300 bg-green-50' },
    {
      label: 'Pending Escalation',
      value: pendingEscalation,
      color: 'border-red-300 bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-lg border p-5 ${card.color}`}>
          <p className="text-sm font-medium text-gray-600">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
