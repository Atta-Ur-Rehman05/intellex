import React, { useState } from 'react';
import { Sparkles, BookOpen, ArrowRight, Tag, Search, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { chatSpecs } from '../../design-system/chatSpecs';
import { cn } from '../../lib/utils';

export const PromptLibraryModal = ({
  isOpen,
  onClose,
  onSelectPrompt
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'Security & Compliance', label: 'Security' },
    { id: 'Engineering & Architecture', label: 'Engineering' },
    { id: 'Finance & Cloud Costs', label: 'Finance' },
    { id: 'Legal & Contracts', label: 'Legal' },
    { id: 'Executive Briefing', label: 'Executive' }
  ];

  const filteredPrompts = chatSpecs.promptLibrary.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise Prompt Template Library"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Search & Categories Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompt templates..."
              className="w-full pl-8.5 pr-3 py-2 rounded-xl bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                  activeCategory === c.id
                    ? "bg-brand-600 text-white font-semibold shadow-xs"
                    : "bg-surface text-secondary hover:text-primary border border-border-subtle"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredPrompts.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectPrompt?.(item.prompt);
                onClose();
              }}
              className="p-4 rounded-xl bg-surface border border-border-default hover:border-brand-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-brand-400 font-mono mb-1">
                  <span>{item.category}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-xs font-bold text-primary mb-1 group-hover:text-brand-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-secondary line-clamp-3 leading-relaxed">
                  "{item.prompt}"
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-border-subtle">
                {item.tags.map((t) => (
                  <span key={t} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-canvas border border-border-subtle text-muted">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredPrompts.length === 0 && (
            <div className="col-span-2 py-8 text-center text-xs text-muted">
              No matching prompt templates found.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
