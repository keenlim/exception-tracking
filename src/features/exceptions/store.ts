import { generateSeedData } from './seed-data';
import type { ExceptionItem, ExceptionStatus, Remark } from './types';

const STORAGE_KEY = 'cpf_exceptions';
const SEEDED_KEY = 'cpf_seeded';

export function initStore(): void {
  if (!localStorage.getItem(SEEDED_KEY)) {
    const seed = generateSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    localStorage.setItem(SEEDED_KEY, '1');
  }
}

export function resetStore(): void {
  const seed = generateSeedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  localStorage.setItem(SEEDED_KEY, '1');
}

export function getItems(): ExceptionItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ExceptionItem[];
  } catch {
    return [];
  }
}

export function saveItems(items: ExceptionItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function updateItemStatus(
  id: string,
  newStatus: ExceptionStatus,
  by: string,
  note?: string,
  resolutionNotes?: string
): ExceptionItem[] {
  const items = getItems();
  const updated = items.map((item) => {
    if (item.id !== id) return item;
    const historyEntry = {
      timestamp: new Date().toISOString(),
      from: item.status,
      to: newStatus,
      by,
      note,
    };
    return {
      ...item,
      status: newStatus,
      history: [...item.history, historyEntry],
      ...(newStatus === 'Resolved'
        ? { resolution_notes: resolutionNotes, resolved_at: new Date().toISOString() }
        : {}),
    };
  });
  saveItems(updated);
  return updated;
}

export function addRemark(id: string, text: string, by: string): ExceptionItem[] {
  const items = getItems();
  const remark: Remark = {
    id: Math.random().toString(36).slice(2, 10),
    text,
    by,
    timestamp: new Date().toISOString(),
  };
  const updated = items.map((item) =>
    item.id === id ? { ...item, remarks: [...item.remarks, remark] } : item
  );
  saveItems(updated);
  return updated;
}

export function appendItems(newItems: ExceptionItem[]): ExceptionItem[] {
  const existing = getItems();
  const merged = [...existing, ...newItems];
  saveItems(merged);
  return merged;
}
