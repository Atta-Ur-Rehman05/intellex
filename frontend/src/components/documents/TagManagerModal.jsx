import React, { useState } from 'react';
import { Tag, Plus, X, Shield, Check, Hash } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { documentSpecs } from '../../design-system/documentSpecs';

export const TagManagerModal = ({
  isOpen,
  onClose,
  onSaveTags
}) => {
  const [tags, setTags] = useState(documentSpecs.tags);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-brand-500/10 text-brand-400 border-brand-500/20');
  const { toast } = useToast();

  const colorOptions = [
    { label: 'Brand Indigo', class: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
    { label: 'Emerald', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { label: 'Purple', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { label: 'Sky Blue', class: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    { label: 'Rose Red', class: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { label: 'Amber', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  ];

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagLabel.trim()) return;

    const formattedLabel = newTagLabel.trim().replace(/\s+/g, '-').toLowerCase();
    const newTag = {
      id: `tag-${Date.now()}`,
      label: formattedLabel,
      color: selectedColor
    };

    setTags(prev => [...prev, newTag]);
    setNewTagLabel('');
    toast({
      title: "Taxonomy Tag Created",
      description: `Created #${newTag.label} for document vector classification.`,
      type: "success"
    });
  };

  const handleDeleteTag = (tagId) => {
    setTags(prev => prev.filter(t => t.id !== tagId));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Knowledge Taxonomy & Tag Manager"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Create New Tag */}
        <form onSubmit={handleAddTag} className="p-4 rounded-xl bg-canvas border border-border-default space-y-3">
          <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-brand-400" />
            <span>Create New Taxonomy Tag</span>
          </h4>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Hash className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                placeholder="e.g. quarterly-okr, api-v2"
                className="w-full pl-8.5 pr-3 py-1.5 rounded-lg bg-surface border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={!newTagLabel.trim()}
              className="text-xs shrink-0"
            >
              Add Tag
            </Button>
          </div>

          {/* Color Presets */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-muted font-mono shrink-0">Color:</span>
            {colorOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSelectedColor(opt.class)}
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all cursor-pointer",
                  opt.class,
                  selectedColor === opt.class ? "ring-2 ring-brand-500" : "opacity-80 hover:opacity-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </form>

        {/* Existing Tags Grid */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-secondary font-mono">
            Active Workspace Tags ({tags.length})
          </span>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {tags.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-mono font-medium group",
                  t.color
                )}
              >
                <span>#{t.label}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteTag(t.id)}
                  className="text-muted hover:text-rose-400 p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
