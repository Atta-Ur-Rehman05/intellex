import React from 'react';
import { 
  Sliders, Filter, RefreshCw, Layers, ShieldCheck, 
  Clock, Database, Check, ChevronDown 
} from 'lucide-react';
import { searchSpecs } from '../../design-system/searchSpecs';
import { cn } from '../../lib/utils';

export const SearchFacets = ({
  searchMode = 'hybrid',
  onChangeSearchMode,
  similarityThreshold = 0.80,
  onChangeSimilarity,
  selectedFormats = ['all'],
  onToggleFormat,
  selectedClassification = 'all',
  onChangeClassification,
  selectedCollection = 'all',
  onChangeCollection,
  dateRange = 'all',
  onChangeDateRange,
  onResetFilters,
  className
}) => {
  const formats = [
    { id: 'pdf', label: 'PDF Documents' },
    { id: 'notion', label: 'Notion & Markdown' },
    { id: 'code', label: 'Source Code' },
    { id: 'sheet', label: 'Spreadsheets' },
    { id: 'media', label: 'Meeting Audio' },
  ];

  const collections = [
    { id: 'all', label: 'All Collections' },
    { id: 'f-eng', label: 'Engineering Specs' },
    { id: 'f-sec', label: 'Security & Compliance' },
    { id: 'f-fin', label: 'Financial Audits' },
    { id: 'f-cust', label: 'Customer Intelligence' },
  ];

  return (
    <aside className={cn("w-full md:w-68 shrink-0 bg-surface rounded-2xl border border-border-default p-4 sm:p-5 shadow-xs space-y-5 text-xs select-none", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-brand-400" />
          <h3 className="font-bold text-primary uppercase tracking-wider text-[11px] font-mono">
            Faceted Filters
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] text-muted hover:text-brand-400 transition-colors flex items-center gap-1 font-mono"
          title="Reset All Filters"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Search Engine Mode */}
      <div className="space-y-2">
        <label className="font-bold text-primary block font-mono text-[11px] uppercase tracking-wider text-muted">
          Search Algorithm
        </label>
        <div className="space-y-1">
          {searchSpecs.modes.map((mode) => {
            const isSelected = searchMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onChangeSearchMode?.(mode.id)}
                className={cn(
                  "w-full px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer",
                  isSelected
                    ? "bg-brand-500/10 border-brand-500 text-brand-400 font-semibold ring-1 ring-brand-500/20"
                    : "bg-canvas border-border-subtle text-secondary hover:text-primary hover:border-border-default"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-xs">{mode.name}</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-surface border border-border-subtle">
                    {mode.badge}
                  </span>
                </div>
                <p className="text-[10px] text-muted line-clamp-2 leading-tight">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Cosine Similarity Threshold Slider */}
      <div className="space-y-2 pt-2 border-t border-border-subtle">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-primary font-mono text-[11px] uppercase tracking-wider text-muted">
            Min Similarity
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {(similarityThreshold * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min={0.70}
          max={0.99}
          step={0.01}
          value={similarityThreshold}
          onChange={(e) => onChangeSimilarity?.(parseFloat(e.target.value))}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-muted font-mono">
          <span>70% (Broad)</span>
          <span>99% (Strict)</span>
        </div>
      </div>

      {/* 3. File Formats Checkboxes */}
      <div className="space-y-2 pt-2 border-t border-border-subtle">
        <label className="font-bold text-primary block font-mono text-[11px] uppercase tracking-wider text-muted">
          Format Types
        </label>
        <div className="space-y-1.5">
          {formats.map((fmt) => {
            const isChecked = selectedFormats.includes('all') || selectedFormats.includes(fmt.id);
            return (
              <label
                key={fmt.id}
                className="flex items-center gap-2 cursor-pointer text-secondary hover:text-primary transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleFormat?.(fmt.id)}
                  className="rounded border-border-default text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span className="text-xs">{fmt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Security Classification Radios */}
      <div className="space-y-2 pt-2 border-t border-border-subtle">
        <label className="font-bold text-primary block font-mono text-[11px] uppercase tracking-wider text-muted">
          Security Policy
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'All Classifications' },
            { id: 'confidential', label: 'Confidential (Tenant Only)' },
            { id: 'internal', label: 'Internal Shared' },
            { id: 'public', label: 'Public Knowledge' }
          ].map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 cursor-pointer text-secondary hover:text-primary transition-colors py-0.5"
            >
              <input
                type="radio"
                name="classification"
                checked={selectedClassification === c.id}
                onChange={() => onChangeClassification?.(c.id)}
                className="border-border-default text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <span className="text-xs">{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Collections Selector */}
      <div className="space-y-1.5 pt-2 border-t border-border-subtle">
        <label className="font-bold text-primary block font-mono text-[11px] uppercase tracking-wider text-muted">
          Collection Scope
        </label>
        <select
          value={selectedCollection}
          onChange={(e) => onChangeCollection?.(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
        >
          {collections.map((col) => (
            <option key={col.id} value={col.id}>{col.label}</option>
          ))}
        </select>
      </div>

      {/* 6. Date Range Selector */}
      <div className="space-y-1.5 pt-2 border-t border-border-subtle">
        <label className="font-bold text-primary block font-mono text-[11px] uppercase tracking-wider text-muted">
          Date Ingested
        </label>
        <select
          value={dateRange}
          onChange={(e) => onChangeDateRange?.(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
        >
          <option value="all">Anytime</option>
          <option value="24h">Past 24 Hours</option>
          <option value="7d">Past 7 Days</option>
          <option value="30d">Past 30 Days</option>
        </select>
      </div>
    </aside>
  );
};
