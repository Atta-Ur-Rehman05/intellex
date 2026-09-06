import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, FileText, Sparkles, Folder, ArrowRight, 
  CornerDownLeft, Plus, Settings, UserPlus, HardDrive, 
  Clock, Shield, X, Compass 
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const samplePaletteData = {
  documents: [
    { id: 'doc-arch', title: 'Architecture_2026.pdf', category: 'Engineering Specs', type: 'PDF' },
    { id: 'doc-rag', title: 'RAG_Pipeline.md', category: 'Engineering Specs', type: 'Markdown' },
    { id: 'doc-q3', title: 'Q3_Deliverables.md', category: 'Product Roadmaps', type: 'Markdown' },
    { id: 'doc-soc2', title: 'SOC2_TypeII_Audit.pdf', category: 'Security & Compliance', type: 'PDF' },
    { id: 'doc-api', title: 'Vector_API_Schema.json', category: 'Engineering Specs', type: 'JSON' },
  ],
  chats: [
    { id: 'chat-rag', title: 'How does vector chunking handle overlap?', time: '2h ago' },
    { id: 'chat-soc2', title: 'Summarize SOC2 compliance audit results', time: 'Yesterday' },
    { id: 'chat-pricing', title: 'Generate seat comparison between Pro and Enterprise', time: 'May 10' },
  ],
  actions: [
    { id: 'act-upload', title: 'Upload New Document', icon: Plus, shortcut: '⌘U' },
    { id: 'act-chat', title: 'Start New AI Conversation', icon: Sparkles, shortcut: '⌘N' },
    { id: 'act-invite', title: 'Invite Colleague to Workspace', icon: UserPlus, shortcut: '⌘I' },
    { id: 'act-settings', title: 'Open Workspace Settings', icon: Settings, shortcut: '⌘,' },
  ]
};

/**
 * CommandPalette Component (Spotlight ⌘K Modal)
 */
export const CommandPalette = ({
  isOpen,
  onClose,
  onSelectItem
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose?.();
        else onSelectItem?.({ type: 'open_palette' });
      }
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectItem]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Filtered lists
  const filteredDocs = samplePaletteData.documents.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase()) || 
    d.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChats = samplePaletteData.chats.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = samplePaletteData.actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    ...filteredDocs.map(d => ({ ...d, section: 'Documents' })),
    ...filteredChats.map(c => ({ ...c, section: 'AI Conversations' })),
    ...filteredActions.map(a => ({ ...a, section: 'Quick Actions' })),
  ];

  const handleArrowKeys = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter' && allItems[selectedIndex]) {
      e.preventDefault();
      onSelectItem?.(allItems[selectedIndex]);
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Command Palette Spotlight Box */}
      <div 
        className="relative w-full max-w-2xl bg-surface border border-border-default rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        onKeyDown={handleArrowKeys}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-border-default gap-3">
          <Search className="w-5 h-5 text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search documents, or ask AI..."
            className="w-full bg-transparent text-primary placeholder:text-muted text-sm outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-secondary hover:text-primary hover:bg-surface-hover"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold text-muted bg-surface-hover border border-border-subtle rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-secondary text-xs">
              <Compass className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-primary">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-muted mt-1">Try searching for &lsquo;Architecture&rsquo;, &lsquo;Upload&rsquo;, or &lsquo;Settings&rsquo;</p>
            </div>
          ) : (
            <>
              {/* Documents Section */}
              {filteredDocs.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">
                    Documents ({filteredDocs.length})
                  </div>
                  {filteredDocs.map((doc, idx) => {
                    const globalIdx = idx;
                    const isSelected = selectedIndex === globalIdx;

                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          onSelectItem?.(doc);
                          onClose?.();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={cn(
                          "w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between text-left transition-colors cursor-pointer",
                          isSelected ? "bg-brand-500/10 text-brand-400 font-semibold" : "hover:bg-surface-hover text-primary"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-secondary shrink-0" />
                          <span className="truncate">{doc.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-hover text-muted border border-border-subtle">
                            {doc.category}
                          </span>
                        </div>
                        <CornerDownLeft className={cn("w-3.5 h-3.5 opacity-0 shrink-0", isSelected && "opacity-100 text-brand-500")} />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* AI Chats Section */}
              {filteredChats.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-border-subtle">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">
                    AI Conversations ({filteredChats.length})
                  </div>
                  {filteredChats.map((chat, idx) => {
                    const globalIdx = filteredDocs.length + idx;
                    const isSelected = selectedIndex === globalIdx;

                    return (
                      <button
                        key={chat.id}
                        type="button"
                        onClick={() => {
                          onSelectItem?.(chat);
                          onClose?.();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={cn(
                          "w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between text-left transition-colors cursor-pointer",
                          isSelected ? "bg-purple-500/10 text-purple-300 font-semibold" : "hover:bg-surface-hover text-primary"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted">{chat.time}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Actions Section */}
              {filteredActions.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-border-subtle">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">
                    Quick Actions
                  </div>
                  {filteredActions.map((act, idx) => {
                    const globalIdx = filteredDocs.length + filteredChats.length + idx;
                    const isSelected = selectedIndex === globalIdx;
                    const Icon = act.icon;

                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => {
                          onSelectItem?.(act);
                          onClose?.();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={cn(
                          "w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between text-left transition-colors cursor-pointer",
                          isSelected ? "bg-brand-500/10 text-brand-400 font-semibold" : "hover:bg-surface-hover text-primary"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className="w-4 h-4 text-secondary shrink-0" />
                          <span className="truncate">{act.title}</span>
                        </div>
                        {act.shortcut && (
                          <kbd className="text-[10px] font-mono text-muted">{act.shortcut}</kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-surface-hover/50 border-t border-border-default flex items-center justify-between text-[11px] text-secondary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface border border-border-default rounded text-[10px] font-mono">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface border border-border-default rounded text-[10px] font-mono">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-muted font-mono">Knowva Neural Index</span>
        </div>
      </div>
    </div>
  );
};
