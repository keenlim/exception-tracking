import { useState } from 'react';
import { addRemark, updateItemStatus } from '../store';
import type { ExceptionItem, ExceptionStatus } from '../types';
import { StatusBadge } from './status-badge';

interface ExceptionDetailPanelProps {
  item: ExceptionItem;
  currentUser: string;
  onClose: () => void;
  onUpdate: (items: ExceptionItem[]) => void;
}

function formatTs(ts: string) {
  return new Date(ts).toLocaleString('en-SG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ExceptionDetailPanel({
  item,
  currentUser,
  onClose,
  onUpdate,
}: ExceptionDetailPanelProps) {
  const [remarkText, setRemarkText] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);

  function handleStatusChange(newStatus: ExceptionStatus, note?: string) {
    const updated = updateItemStatus(item.id, newStatus, currentUser, note);
    onUpdate(updated);
  }

  function handleAddRemark() {
    if (!remarkText.trim()) return;
    const updated = addRemark(item.id, remarkText.trim(), currentUser);
    setRemarkText('');
    onUpdate(updated);
  }

  function handleResolve() {
    if (!resolutionNotes.trim()) return;
    handleStatusChange('Resolved', resolutionNotes.trim());
    setShowResolveForm(false);
    setResolutionNotes('');
  }

  const canContact = item.status !== 'Contacting Member' && item.status !== 'Resolved';
  const canEscalate = item.status !== 'Pending Escalation' && item.status !== 'Resolved';
  const canResolve = item.status !== 'Resolved';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{item.member_name}</h2>
            <p className="font-mono text-sm text-gray-500">{item.member_id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 px-6 py-5">
          {/* Details */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Details
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Exception Type</dt>
                <dd className="font-medium text-gray-900">{item.exception_type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <StatusBadge status={item.status} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Assigned To</dt>
                <dd className="text-gray-900">{item.assigned_to}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Report Date</dt>
                <dd className="text-gray-900">{item.report_date}</dd>
              </div>
              {item.resolved_at && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Resolved At</dt>
                  <dd className="text-gray-900">{formatTs(item.resolved_at)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-700">
              {item.exception_details}
            </div>
            {item.resolution_notes && (
              <div className="mt-2 rounded bg-green-50 p-3 text-sm text-green-800">
                <span className="font-medium">Resolution: </span>
                {item.resolution_notes}
              </div>
            )}
          </section>

          {/* Actions */}
          {(canContact || canEscalate || canResolve) && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                {canContact && (
                  <button
                    onClick={() => handleStatusChange('Contacting Member')}
                    className="rounded-md bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-800 hover:bg-orange-200"
                  >
                    Contact Member
                  </button>
                )}
                {canEscalate && (
                  <button
                    onClick={() => handleStatusChange('Pending Escalation')}
                    className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Escalate
                  </button>
                )}
                {canResolve && !showResolveForm && (
                  <button
                    onClick={() => setShowResolveForm(true)}
                    className="rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-200"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              {showResolveForm && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter resolution notes…"
                    rows={3}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleResolve}
                      disabled={!resolutionNotes.trim()}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Confirm Resolution
                    </button>
                    <button
                      onClick={() => {
                        setShowResolveForm(false);
                        setResolutionNotes('');
                      }}
                      className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Add Remark */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Add Remark
            </h3>
            <div className="flex gap-2">
              <input
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRemark()}
                placeholder="Type a remark…"
                className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddRemark}
                disabled={!remarkText.trim()}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </section>

          {/* Remarks */}
          {item.remarks.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Remarks
              </h3>
              <div className="space-y-2">
                {[...item.remarks].reverse().map((r) => (
                  <div key={r.id} className="rounded bg-gray-50 p-3 text-sm">
                    <p className="text-gray-800">{r.text}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {r.by} · {formatTs(r.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* History */}
          {item.history.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Status History
              </h3>
              <ol className="space-y-2 text-sm">
                {[...item.history].reverse().map((h, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">{h.from}</span>
                        {' → '}
                        <span className="font-medium">{h.to}</span>
                      </p>
                      {h.note && <p className="text-gray-500">{h.note}</p>}
                      <p className="text-xs text-gray-400">
                        {h.by} · {formatTs(h.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
