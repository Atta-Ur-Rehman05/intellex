import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, FileText, Sparkles, Folder, ArrowRight, 
  CornerDownLeft, Plus, Settings, UserPlus, HardDrive, 
  Clock, Shield, X, Compass, ExternalLink, Zap, Terminal, Hash
} from 'lucide-react';
import { searchSpecs } from '../../design-system/searchSpecs';
import { cn } from '../../lib/utils';

export const GlobalSearchModal = ({
  isOpen,
  onClose,
  onSelectResult,
  onOpenFullSearch,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'chunks' | 'threads' | 'actions'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Global hotkeys (⌘K, Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose?.();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Sample threads for search
  const threadsData = [
    {
      id: 'thread-soc2',
      title: 'Summarize SOC2 compliance audit results & vector isolation guarantees',
      preview: 'Sarah Chen: Based on Section 4.2, all embeddings generated via text-embedding-3-large...',
      time: '12m ago',
      messagesCount: 8,
      collection: 'Security & Compliance'
    },
    {
      id: 'thread-rag',
      title: 'How does vector chunking handle overlap with Cohere Rerank v3?',
      preview: 'David Kim: Top-50 candidates are re-scored using Cohere Rerank v3 with k=60 smoothing...',
      time: '2h ago',
      messagesCount: 14,
      collection: 'Engineering Specs'
    },
    {
      id: 'thread-pricing',
      title: 'Cloud spend variance and AWS egress actuals breakdown',
      preview: 'Elena Rostova: Vector DB spend rose from $32k to $42k following Frankfurt cluster deployment...',
      time: '1d ago',
      messagesCount: 6,
      collection: 'Financial Audits'
    }
  ];

  // Filter corpus chunks
  const filteredChunks = searchSpecs.corpus.filter(chunk => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      chunk.docTitle.toLowerCase().includes(q) ||
      chunk.heading.toLowerCase().includes(q) ||
      chunk.snippet.toLowerCase().includes(q) ||
      chunk.collection.toLowerCase().includes(q)
    );
  });

  // Filter threads
  const filteredThreads = threadsData.filter(thread => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      thread.title.toLowerCase().includes(q) ||
      thread.preview.toLowerCase().includes(q) ||
      thread.collection.toLowerCase().includes(q)
    );
  });

  // Filter actions
  const filteredActions = searchSpecs.quickActions.filter(act => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      act.label.toLowerCase().includes(q) ||
      act.category.toLowerCase().includes(q)
    );
  });

  // Compose all indexed items according to active filter
  const allItems = [];

  if (activeFilter === 'all' || activeFilter === 'chunks') {
    filteredChunks.slice(0, 5).forEach(chunk => {
      allItems.push({
        id: chunk.id,
        type: 'chunk',
        title: chunk.docTitle,
        subtitle: chunk.heading,
        snippet: chunk.snippet,
        badge: `${Math.round(chunk.similarity * 100)}% match`,
        similarity: chunk.similarity,
        collection: chunk.collection,
        page: chunk.page,
        raw: chunk
      });
    });
  }

  if (activeFilter === 'all' || activeFilter === 'threads') {
    filteredThreads.slice(0, 3).forEach(thread => {
      allItems.push({
        id: thread.id,
        type: 'thread',
        title: thread.title,
        subtitle: thread.preview,
        time: thread.time,
        messagesCount: thread.messagesCount,
        collection: thread.collection,
        raw: thread
      });
    });
  }

  if (activeFilter === 'all' || activeFilter === 'actions') {
    filteredActions.forEach(action => {
      allItems.push({
        id: action.id,
        type: 'action',
        title: action.label,
        shortcut: action.shortcut,
        category: action.category,
        path: action.path,
        raw: action
      });
    });
  }

  // Handle keyboard navigation (arrows, enter)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : 0));
      scrollActiveIntoView();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : allItems.length - 1));
      scrollActiveIntoView();
    } else if (e.key === 'Enter' && allItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(allItems[selectedIndex]);
    }
  };

  const scrollActiveIntoView = () => {
    setTimeout(() => {
      const activeEl = listRef.current?.querySelector('[data-active="true"]');
      activeEl?.scrollIntoView({ block: 'nearest' });
    }, 10);
  };

  const handleSelect = (item) => {
    if (item.type === 'action') {
      onNavigate?.(item.path);
    } else if (item.type === 'chunk') {
      onSelectResult?.(item.raw);
    } else if (item.type === 'thread') {
      onNavigate?.('chat', { threadId: item.id });
    }
    onClose?.();
  };

  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-brand-500/25 text-brand-300 font-medium px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Container */}
      <div 
        className="relative w-full max-w-2xl bg-surface border border-border-default rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-subtle gap-3 bg-surface">
          <Search className="w-5 h-5 text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documents, vector chunks, AI threads, or run command..."
            className="w-full bg-transparent text-sm text-primary placeholder:text-secondary focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 text-secondary hover:text-primary rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-secondary bg-surface-elevated rounded border border-border-default">
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border-subtle bg-canvas/60 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveFilter('all'); setSelectedIndex(0); }}
            className={cn(
              "px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer",
              activeFilter === 'all' 
                ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" 
                : "text-secondary hover:text-primary hover:bg-surface-hover"
            )}
          >
            All Results
          </button>
          <button
            onClick={() => { setActiveFilter('chunks'); setSelectedIndex(0); }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer",
              activeFilter === 'chunks' 
                ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" 
                : "text-secondary hover:text-primary hover:bg-surface-hover"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Knowledge Chunks ({filteredChunks.length})
          </button>
          <button
            onClick={() => { setActiveFilter('threads'); setSelectedIndex(0); }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer",
              activeFilter === 'threads' 
                ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" 
                : "text-secondary hover:text-primary hover:bg-surface-hover"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Threads ({filteredThreads.length})
          </button>
          <button
            onClick={() => { setActiveFilter('actions'); setSelectedIndex(0); }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer",
              activeFilter === 'actions' 
                ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" 
                : "text-secondary hover:text-primary hover:bg-surface-hover"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            Actions ({filteredActions.length})
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-secondary">
              <Search className="w-8 h-8 mx-auto mb-2.5 opacity-30 text-secondary" />
              <p className="text-sm font-medium text-primary">No matching items found</p>
              <p className="text-xs text-secondary mt-1">
                Try searching for "vector isolation", "SOC2", "AWS egress", or "RRF"
              </p>
            </div>
          ) : (
            allItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  data-active={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                    isSelected
                      ? "bg-brand-500/10 border-brand-500/30 text-primary shadow-xs"
                      : "border-transparent text-secondary hover:bg-surface-hover hover:text-primary"
                  )}
                >
                  {/* Leading Icon */}
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'chunk' && (
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'thread' && (
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'action' && (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Zap className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-primary truncate">
                        {highlightMatch(item.title, query)}
                      </h4>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30 shrink-0">
                          {item.badge}
                        </span>
                      )}
                      {item.shortcut && (
                        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-secondary border border-border-default shrink-0">
                          {item.shortcut}
                        </kbd>
                      )}
                      {item.time && (
                        <span className="text-[10px] text-secondary shrink-0">
                          {item.time}
                        </span>
                      )}
                    </div>

                    {item.subtitle && (
                      <p className="text-[11px] font-medium text-secondary truncate mt-0.5">
                        {highlightMatch(item.subtitle, query)}
                      </p>
                    )}

                    {item.snippet && (
                      <p className="text-[11px] text-secondary line-clamp-1 mt-1 font-mono text-[10px] opacity-80">
                        "{highlightMatch(item.snippet, query)}"
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-secondary">
                      {item.collection && (
                        <span className="flex items-center gap-1">
                          <Folder className="w-3 h-3 text-secondary" />
                          {item.collection}
                        </span>
                      )}
                      {item.page && (
                        <span className="text-secondary">• {item.page}</span>
                      )}
                      {item.messagesCount && (
                        <span className="text-secondary">• {item.messagesCount} messages</span>
                      )}
                    </div>
                  </div>

                  {/* Enter prompt indicator on selection */}
                  {isSelected && (
                    <div className="shrink-0 flex items-center self-center text-brand-400">
                      <CornerDownLeft className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions & shortcuts */}
        <div className="px-4 py-2.5 bg-surface-elevated border-t border-border-subtle flex items-center justify-between text-xs text-secondary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-canvas rounded border border-border-default">↑</kbd>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-canvas rounded border border-border-default">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-canvas rounded border border-border-default">↵</kbd>
              <span>select</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-canvas rounded border border-border-default">esc</kbd>
              <span>close</span>
            </span>
          </div>

          {/* Full workbench button */}
          <button
            type="button"
            onClick={() => {
              onOpenFullSearch?.(query);
              onClose?.();
            }}
            className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer group"
          >
            <span>Open in Full Search Workbench</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
