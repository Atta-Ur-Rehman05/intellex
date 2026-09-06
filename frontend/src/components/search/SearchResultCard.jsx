import React, { useState } from 'react';
import { 
  FileText, Layers, FileCode, FileSpreadsheet, 
  Music, Sparkles, MessageSquare, Copy, 
  Check, ArrowUpRight, Eye, ShieldCheck 
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const SearchResultCard = ({
  result,
  searchQuery = '',
  isSelected = false,
  onSelect,
  onChatWithResult,
  onInspectResult
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(result.snippet);
    setCopied(true);
    toast({
      title: "Excerpt Copied",
      description: "Vector chunk text copied to clipboard.",
      type: "success"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-400" />;
      case 'notion': return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'code': return <FileCode className="w-4 h-4 text-amber-400" />;
      case 'sheet': return <FileSpreadsheet className="w-4 h-4 text-sky-400" />;
      case 'media': return <Music className="w-4 h-4 text-purple-400" />;
      default: return <FileText className="w-4 h-4 text-brand-400" />;
    }
  };

  // Helper to highlight matching query terms
  const renderHighlightedText = (text, query) => {
    if (!query.trim()) return text;
    const words = query.trim().split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return text;

    const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const isMatch = words.some(w => w.toLowerCase() === part.toLowerCase());
      return isMatch ? (
        <mark key={idx} className="bg-brand-500/25 text-brand-300 font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      );
    });
  };

  return (
    <div
      onClick={() => onSelect?.(result)}
      className={cn(
        "p-4 sm:p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-3.5 group text-left",
        isSelected
          ? "bg-surface border-brand-500 shadow-md ring-1 ring-brand-500/30"
          : "bg-surface/80 border-border-default hover:bg-surface hover:border-brand-500/40 hover:shadow-xs"
      )}
    >
      <div>
        {/* Top Meta: Source Document & Similarity Metric */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-canvas border border-border-default flex items-center justify-center shrink-0">
              {getFileIcon(result.type)}
            </div>
            <span className="text-xs font-bold text-primary truncate max-w-[200px] sm:max-w-xs group-hover:text-brand-400 transition-colors">
              {result.docTitle}
            </span>
          </div>

          {/* Cosine Match Badge */}
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Sparkles className="w-3 h-3" />
            <span>{(result.similarity * 100).toFixed(0)}% Match</span>
          </div>
        </div>

        {/* Section Heading & Location */}
        <div className="flex items-center gap-2 text-[11px] text-muted font-mono mb-2">
          <span className="text-brand-400 font-semibold">{result.heading}</span>
          <span>•</span>
          <span>{result.page}</span>
          <span>•</span>
          <span>{result.tokens} tokens</span>
        </div>

        {/* Highlighted Chunk Snippet */}
        <p className="text-xs text-secondary leading-relaxed select-text line-clamp-3 font-sans">
          "{renderHighlightedText(result.snippet, searchQuery)}"
        </p>
      </div>

      {/* Card Footer: Author, Citations & Action Triggers */}
      <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-muted">
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-canvas border border-border-subtle">
            {result.collection}
          </span>
          <span className="text-[11px] font-mono text-purple-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {result.citationsCount} citations
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-hover transition-colors"
            title="Copy Excerpt"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onInspectResult?.(result)}
            leftIcon={<Eye className="w-3 h-3" />}
            className="text-[11px] h-7 px-2"
          >
            Inspect
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onChatWithResult?.(result)}
            leftIcon={<MessageSquare className="w-3 h-3 text-white" />}
            className="text-[11px] h-7 px-2.5 bg-brand-600 hover:bg-brand-500 text-white"
          >
            Ask AI
          </Button>
        </div>
      </div>
    </div>
  );
};
