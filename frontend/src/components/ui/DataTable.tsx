'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({ data, columns, emptyMessage = 'No data' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-zinc-700">
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-zinc-100">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((item, i) => (
            <tr key={i} className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
