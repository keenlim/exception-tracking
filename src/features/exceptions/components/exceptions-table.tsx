import type { ExceptionItem } from '../types';
import { StatusBadge } from './status-badge';

interface ExceptionsTableProps {
  items: ExceptionItem[];
  onRowClick: (item: ExceptionItem) => void;
}

export function ExceptionsTable({ items, onRowClick }: ExceptionsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-white py-16 text-center text-gray-500">
        No items match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Member ID</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Member Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Exception Type</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Assigned To</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick(item)}
              className="cursor-pointer transition-colors hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.member_id}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{item.member_name}</td>
              <td className="px-4 py-3 text-gray-700">{item.exception_type}</td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-gray-700">{item.assigned_to}</td>
              <td className="px-4 py-3 text-gray-600">{item.report_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
