import { useState } from 'react';
import {
  ExceptionDetailPanel,
  ExceptionsTable,
  getItems,
  initStore,
} from '@/features/exceptions';
import type { ExceptionItem } from '@/features/exceptions';
import { TEAM_MEMBERS } from '@/features/exceptions';

initStore();

export function MyTasksPage() {
  const [currentUser, setCurrentUser] = useState<string>(TEAM_MEMBERS[0]);
  const [items, setItems] = useState<ExceptionItem[]>(() => getItems());
  const [selectedItem, setSelectedItem] = useState<ExceptionItem | null>(null);

  const myItems = items.filter((i) => i.assigned_to === currentUser);

  function handleUpdate(updated: ExceptionItem[]) {
    setItems(updated);
    if (selectedItem) {
      const fresh = updated.find((i) => i.id === selectedItem.id) ?? null;
      setSelectedItem(fresh);
    }
  }

  return (
    <div className="max-w-site mx-auto w-full px-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Tasks</h1>
      <p className="mt-1 text-sm text-gray-500">
        Exception items assigned to the selected team member.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Viewing as:</label>
        <select
          value={currentUser}
          onChange={(e) => {
            setCurrentUser(e.target.value);
            setSelectedItem(null);
          }}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TEAM_MEMBERS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-400">— {myItems.length} item(s)</span>
      </div>

      <div className="mt-4">
        <ExceptionsTable items={myItems} onRowClick={setSelectedItem} />
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
