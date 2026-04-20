import { useState } from 'react';
import {
  ExceptionDetailPanel,
  ExceptionsTable,
  SummaryCards,
  getItems,
  initStore,
} from '@/features/exceptions';
import type { ExceptionItem, ExceptionStatus } from '@/features/exceptions';
import { TEAM_MEMBERS } from '@/features/exceptions';

initStore();

const ALL_STATUSES: ExceptionStatus[] = [
  'New',
  'In Progress',
  'Contacting Member',
  'Pending Escalation',
  'Resolved',
];

export function DashboardPage() {
  const [items, setItems] = useState<ExceptionItem[]>(() => getItems());
  const [selectedItem, setSelectedItem] = useState<ExceptionItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');

  const filtered = items.filter((item) => {
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterAssignee && item.assigned_to !== filterAssignee) return false;
    return true;
  });

  function handleUpdate(updated: ExceptionItem[]) {
    setItems(updated);
    if (selectedItem) {
      const fresh = updated.find((i) => i.id === selectedItem.id) ?? null;
      setSelectedItem(fresh);
    }
  }

  const currentUser = TEAM_MEMBERS[0];

  return (
    <div className="max-w-site mx-auto w-full px-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">All exception items across the team.</p>

      <div className="mt-6">
        <SummaryCards items={items} />
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Assignees</option>
          {TEAM_MEMBERS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {(filterStatus || filterAssignee) && (
          <button
            onClick={() => {
              setFilterStatus('');
              setFilterAssignee('');
            }}
            className="rounded-md border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="mt-4">
        <ExceptionsTable items={filtered} onRowClick={setSelectedItem} />
      </div>

      {selectedItem && (
        <ExceptionDetailPanel
          item={selectedItem}
          currentUser={currentUser}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
