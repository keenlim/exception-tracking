import Papa from 'papaparse';
import { useRef, useState } from 'react';
import { appendItems, getItems, initStore } from '@/features/exceptions';
import type { ExceptionItem, ExceptionType } from '@/features/exceptions';
import { TEAM_MEMBERS } from '@/features/exceptions';

initStore();

const VALID_EXCEPTION_TYPES: ExceptionType[] = [
  'Contribution Shortfall',
  'Withdrawal Blocking',
  'Account Discrepancy',
  'Refund Pending',
  'Nomination Update Required',
];

const SAMPLE_CSV = `member_id,member_name,exception_type,exception_details,report_date
S9876543A,Tan Ah Kow,Contribution Shortfall,Employer did not submit contributions for Nov 2025,2026-04-10
T1234567B,Siti bte Omar,Withdrawal Blocking,Withdrawal blocked due to pending identity check,2026-04-11
S8765432C,Rajan Pillai,Account Discrepancy,OA balance mismatch detected during audit,2026-04-12`;

function downloadSample() {
  const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-exceptions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

interface ParseResult {
  added: number;
  errors: string[];
}

export function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function processFile(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const errors: string[] = [];
        const newItems: ExceptionItem[] = [];
        const existingCount = getItems().length;

        results.data.forEach((row, idx) => {
          const rowNum = idx + 2;
          const memberId = row['member_id']?.trim() ?? '';
          const memberName = row['member_name']?.trim() ?? '';
          const exceptionType = row['exception_type']?.trim() ?? '';
          const exceptionDetails = row['exception_details']?.trim() ?? '';
          const reportDate =
            row['report_date']?.trim() ?? new Date().toISOString().slice(0, 10);

          if (!memberId) {
            errors.push(`Row ${rowNum}: missing member_id`);
            return;
          }
          if (!memberName) {
            errors.push(`Row ${rowNum}: missing member_name`);
            return;
          }
          if (!VALID_EXCEPTION_TYPES.includes(exceptionType as ExceptionType)) {
            errors.push(
              `Row ${rowNum}: invalid exception_type "${exceptionType}". Must be one of: ${VALID_EXCEPTION_TYPES.join(', ')}`
            );
            return;
          }

          const assignedTo =
            TEAM_MEMBERS[(existingCount + newItems.length) % TEAM_MEMBERS.length] as string;

          newItems.push({
            id: Math.random().toString(36).slice(2, 10),
            member_id: memberId,
            member_name: memberName,
            exception_type: exceptionType as ExceptionType,
            exception_details: exceptionDetails,
            report_date: reportDate,
            status: 'New',
            assigned_to: assignedTo,
            remarks: [],
            history: [],
          });
        });

        if (newItems.length > 0) {
          appendItems(newItems);
        }

        setResult({ added: newItems.length, errors });

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
    });
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setResult({ added: 0, errors: ['Please upload a .csv file.'] });
      return;
    }
    setResult(null);
    processFile(file);
  }

  return (
    <div className="max-w-site mx-auto w-full px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Upload CSV</h1>
          <p className="mt-1 text-sm text-gray-500">
            Import exception items in bulk using a CSV file.
          </p>
        </div>
        <button
          onClick={downloadSample}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Download Sample CSV
        </button>
      </div>

      {/* Expected columns */}
      <div className="mt-6 rounded-lg border bg-gray-50 p-4 text-sm">
        <p className="mb-2 font-medium text-gray-700">Expected CSV columns:</p>
        <ul className="space-y-1 text-gray-600">
          <li>
            <code className="rounded bg-white px-1 font-mono text-xs">member_id</code> — NRIC
            format (e.g. S1234567A)
          </li>
          <li>
            <code className="rounded bg-white px-1 font-mono text-xs">member_name</code> — Full
            name
          </li>
          <li>
            <code className="rounded bg-white px-1 font-mono text-xs">exception_type</code> —
            One of: {VALID_EXCEPTION_TYPES.join(', ')}
          </li>
          <li>
            <code className="rounded bg-white px-1 font-mono text-xs">exception_details</code> —
            Short description
          </li>
          <li>
            <code className="rounded bg-white px-1 font-mono text-xs">report_date</code> — Date
            (YYYY-MM-DD)
          </li>
        </ul>
        <p className="mt-2 text-xs text-gray-400">
          Items are auto-assigned round-robin across the 5 team members.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
      >
        <p className="text-sm font-medium text-gray-700">
          Drag & drop a CSV file here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-400">.csv files only</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 rounded-lg border p-4">
          {result.added > 0 && (
            <p className="text-sm font-medium text-green-700">
              {result.added} item(s) added successfully.
            </p>
          )}
          {result.errors.length > 0 && (
            <div className={result.added > 0 ? 'mt-2' : ''}>
              <p className="text-sm font-medium text-red-700">
                {result.errors.length} error(s):
              </p>
              <ul className="mt-1 space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-xs text-red-600">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.added === 0 && result.errors.length === 0 && (
            <p className="text-sm text-gray-500">No valid rows found in the file.</p>
          )}
        </div>
      )}
    </div>
  );
}
