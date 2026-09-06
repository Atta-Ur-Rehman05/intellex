import React, { useState } from 'react';
import { Sparkles, FileText, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CitationBadge = ({ citation, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!citation) return null;

  return (
    <span className="relative inline-block align-baseline mx-0.5 select-none">
      <button
        type="button"
        onClick={() => onClick?.(citation)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md font-mono text-[10px] font-bold bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 border border-brand-500/30 hover:border-brand-500/50 transition-all cursor-pointer shadow-2xs group"
        title={`Source: ${citation.title} (${citation.page})`}
      >
        <Sparkles className="w-2.5 h-2.5 text-brand-400 group-hover:scale-110 transition-transform" />
        <span>{citation.badge || `[${citation.id}]`}</span>
      </button>

      {/* Hover popover preview */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xl bg-surface border border-border-default shadow-xl text-left z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-[10px] text-muted mb-1 pb-1 border-b border-border-subtle font-mono">
            <span className="text-brand-400 font-semibold">{citation.page}</span>
            <span className="text-emerald-400">{(citation.similarity * 100).toFixed(0)}% Match</span>
          </div>
          <p className="text-xs font-bold text-primary truncate mb-1">{citation.title}</p>
          <p className="text-[11px] text-secondary line-clamp-2 leading-tight">
            "{citation.snippet}"
          </p>
        </div>
      )}
    </span>
  );
};
