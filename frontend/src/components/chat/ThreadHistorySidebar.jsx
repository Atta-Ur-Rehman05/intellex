import React, { useState } from 'react';
import { 
  MessageSquarePlus, Search, MessageSquare, 
  Trash2, Edit2, Check, X, Pin, MoreVertical, 
  Clock, Sparkles 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export const ThreadHistorySidebar = ({
  threads = [],
  activeThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
  onRenameThread,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groups = [
    { id: 'today', label: 'Today', items: filteredThreads.filter(t => t.group === 'today') },
    { id: 'yesterday', label: 'Yesterday', items: filteredThreads.filter(t => t.group === 'yesterday') },
    { id: 'previous-7-days', label: 'Previous 7 Days', items: filteredThreads.filter(t => t.group === 'previous-7-days') }
  ];

  const handleStartRename = (thread, e) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditTitle(thread.title);
  };

  const handleSaveRename = (threadId, e) => {
    e?.stopPropagation();
    if (editTitle.trim()) {
      onRenameThread?.(threadId, editTitle.trim());
    }
    setEditingThreadId(null);
  };

  return (
    <aside className={cn("w-full md:w-72 shrink-0 bg-surface rounded-2xl border border-border-default p-4 shadow-xs flex flex-col justify-between space-y-4", className)}>
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* Top Header: New Thread CTA */}
        <Button
          variant="primary"
          size="sm"
          onClick={onNewThread}
          leftIcon={<MessageSquarePlus className="w-4 h-4" />}
          className="w-full text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-xs h-9"
        >
          New AI Thread
        </Button>

        {/* Search Threads */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-lg bg-canvas border border-border-default text-xs text-primary placeholder:text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Grouped Threads List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar min-h-0">
          {groups.map((group) => {
            if (group.items.length === 0) return null;
            return (
              <div key={group.id} className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted px-2">
                  {group.label}
                </span>

                <div className="space-y-1">
                  {group.items.map((thread) => {
                    const isActive = activeThreadId === thread.id;
                    const isEditing = editingThreadId === thread.id;

                    return (
                      <div
                        key={thread.id}
                        onClick={() => onSelectThread?.(thread.id)}
                        className={cn(
                          "group px-3 py-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2",
                          isActive
                            ? "bg-brand-500/10 border-brand-500/40 text-primary font-semibold shadow-2xs"
                            : "bg-surface border-transparent hover:bg-surface-hover hover:border-border-subtle text-secondary"
                        )}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-2 py-0.5 rounded bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500 font-normal"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(thread.id, e);
                                if (e.key === 'Escape') setEditingThreadId(null);
                              }}
                            />
                            <button
                              onClick={(e) => handleSaveRename(thread.id, e)}
                              className="text-emerald-400 p-1 hover:bg-surface-hover rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingThreadId(null)}
                              className="text-muted p-1 hover:bg-surface-hover rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0">
                              <MessageSquare className={cn(
                                "w-3.5 h-3.5 shrink-0",
                                isActive ? "text-brand-400" : "text-muted group-hover:text-primary"
                              )} />
                              <span className="truncate">{thread.title}</span>
                            </div>

                            {/* Hover Actions */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                              <button
                                onClick={(e) => handleStartRename(thread, e)}
                                className="p-1 rounded text-muted hover:text-primary hover:bg-surface transition-colors"
                                title="Rename Thread"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteThread?.(thread.id);
                                }}
                                className="p-1 rounded text-muted hover:text-rose-400 hover:bg-surface transition-colors"
                                title="Delete Thread"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredThreads.length === 0 && (
            <div className="py-8 text-center text-xs text-muted">
              No threads found.
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-xl bg-canvas border border-border-subtle text-[11px] text-muted space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Zero-Retention RAG</span>
        </div>
        <p className="text-secondary leading-snug">
          Prompts & retrieved vectors are encrypted in-memory and never cached for model training.
        </p>
      </div>
    </aside>
  );
};
