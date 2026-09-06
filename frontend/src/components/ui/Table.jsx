import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, 
  ChevronRight, Trash2, Download, Tag, Search, MoreHorizontal 
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '../../lib/utils';

/**
 * Enterprise Table Component - Knowva Design System
 * 
 * Supports sorting, pagination, bulk selection, bulk actions, and empty states.
 */
export const Table = ({
  columns = [],
  data = [],
  selectable = true,
  onRowClick,
  bulkActions,
  pageSize = 5,
  emptyMessage = "No documents found",
  className
}) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Bulk Selection
  const allCurrentPageSelected = paginatedData.length > 0 && paginatedData.every(row => selectedIds.has(row.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    const newSelected = new Set(selectedIds);
    if (allCurrentPageSelected) {
      paginatedData.forEach(row => newSelected.delete(row.id));
    } else {
      paginatedData.forEach(row => newSelected.add(row.id));
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className={cn("w-full bg-surface border border-border-default rounded-xl shadow-xs overflow-hidden flex flex-col", className)}>
      {/* Bulk Action Toolbar */}
      {selectable && someSelected && (
        <div className="px-4 py-2.5 bg-brand-500/10 border-b border-brand-500/20 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-400">
              {selectedIds.size} {selectedIds.size === 1 ? 'item' : 'items'} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {bulkActions || (
              <>
                <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Export
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Tag className="w-3.5 h-3.5" />}>
                  Tag
                </Button>
                <Button variant="destructive" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                  Delete
                </Button>
              </>
            )}
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-secondary hover:text-primary underline ml-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-default bg-surface-hover/50 text-secondary font-medium select-none">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all current rows"
                    className="w-4 h-4 rounded border-border-strong text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      "px-4 py-3 text-secondary tracking-tight font-semibold",
                      col.sortable && "cursor-pointer hover:text-primary transition-colors",
                      col.className
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-muted">
                          {isSorted ? (
                            sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-brand-500" /> : <ChevronDown className="w-3.5 h-3.5 text-brand-500" />
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-4 py-12 text-center text-muted"
                >
                  <p className="text-sm">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selectedIds.has(row.id);

                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "transition-colors hover:bg-surface-hover/60",
                      isSelected && "bg-brand-500/5",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {selectable && (
                      <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelectRow(row.id, e)}
                          aria-label={`Select row ${row.id}`}
                          className="w-4 h-4 rounded border-border-strong text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3 text-primary", col.cellClassName)}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-border-default flex items-center justify-between text-xs text-secondary bg-surface">
        <div>
          Showing <span className="font-semibold text-primary">{Math.min(sortedData.length, (currentPage - 1) * pageSize + 1)}</span> to{" "}
          <span className="font-semibold text-primary">{Math.min(sortedData.length, currentPage * pageSize)}</span> of{" "}
          <span className="font-semibold text-primary">{sortedData.length}</span> results
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1 rounded-md border border-border-default hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-primary"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-mono font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-1 rounded-md border border-border-default hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-primary"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
