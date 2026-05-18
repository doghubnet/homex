import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  getRowKey: (row: T) => string;
  empty?: string;
}

export function DataTable<T>({ columns, data, getRowKey, empty = 'No records found.' }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
          <thead className="bg-stone-100 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-3 font-black ${column.className ?? ''}`}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.length ? data.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-orange-50/40">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 align-top ${column.className ?? ''}`}>{column.render(row)}</td>
                ))}
              </tr>
            )) : (
              <tr><td className="px-4 py-10 text-center text-slate-500" colSpan={columns.length}>{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
