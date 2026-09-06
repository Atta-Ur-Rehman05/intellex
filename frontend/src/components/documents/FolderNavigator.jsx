import React, { useState } from 'react';
import { 
  Folder, FolderPlus, FolderOpen, Code2, Shield, 
  Layers, FileSpreadsheet, MessageSquare, ChevronRight, 
  MoreVertical, Plus, HardDrive 
} from 'lucide-react';
import { documentSpecs } from '../../design-system/documentSpecs';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const FolderNavigator = ({
  activeFolderId = 'f-all',
  onSelectFolder,
  className
}) => {
  const [folders, setFolders] = useState(documentSpecs.collections);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('text-indigo-400');
  const { toast } = useToast();

  const getFolderIcon = (iconName, colorClass) => {
    switch (iconName) {
      case 'Code2': return <Code2 className={cn("w-4 h-4 shrink-0", colorClass)} />;
      case 'Shield': return <Shield className={cn("w-4 h-4 shrink-0", colorClass)} />;
      case 'Layers': return <Layers className={cn("w-4 h-4 shrink-0", colorClass)} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={cn("w-4 h-4 shrink-0", colorClass)} />;
      case 'MessageSquare': return <MessageSquare className={cn("w-4 h-4 shrink-0", colorClass)} />;
      default: return <Folder className={cn("w-4 h-4 shrink-0", colorClass)} />;
    }
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      count: 0,
      color: newFolderColor,
      icon: 'Folder',
      description: newFolderDesc.trim() || 'Custom user knowledge collection'
    };

    setFolders(prev => [...prev, newFolder]);
    setIsNewFolderModalOpen(false);
    setNewFolderName('');
    setNewFolderDesc('');

    toast({
      title: "Folder Collection Created",
      description: `Created "${newFolder.name}" with dedicated vector namespace.`,
      type: "success"
    });
    onSelectFolder?.(newFolder.id);
  };

  return (
    <aside className={cn("w-full md:w-64 shrink-0 bg-surface rounded-2xl border border-border-default p-4 shadow-xs flex flex-col justify-between space-y-4", className)}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">Collections</h3>
            <span className="text-[11px] text-secondary">Knowledge Partitions</span>
          </div>
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover border border-border-subtle transition-colors"
            title="Create New Collection"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Collections List */}
        <nav className="space-y-1">
          {folders.map((col) => {
            const isActive = activeFolderId === col.id;
            return (
              <button
                key={col.id}
                onClick={() => onSelectFolder?.(col.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group text-left",
                  isActive
                    ? "bg-brand-500/10 text-brand-400 font-semibold border border-brand-500/20 shadow-xs"
                    : "text-secondary hover:text-primary hover:bg-surface-hover border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getFolderIcon(col.icon, col.color)}
                  <span className="truncate">{col.name}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                  isActive ? "bg-brand-500/20 text-brand-400 font-bold" : "bg-canvas text-muted group-hover:text-secondary"
                )}>
                  {col.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Storage Footer Info */}
      <div className="p-3 rounded-xl bg-canvas border border-border-subtle text-xs space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted font-mono">Tenant Quota</span>
          <span className="text-brand-400 font-bold font-mono">25.9%</span>
        </div>
        <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full w-[25.9%]" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted">
          <span>64.8 GB used</span>
          <span>250 GB total</span>
        </div>
      </div>

      {/* New Folder Modal */}
      <Modal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        title="Create Knowledge Collection"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              leftIcon={<FolderPlus className="w-3.5 h-3.5" />}
            >
              Create Folder
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateFolder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Collection Name</label>
            <input
              type="text"
              required
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Sales Enablement & Decks"
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              value={newFolderDesc}
              onChange={(e) => setNewFolderDesc(e.target.value)}
              placeholder="Documents for enterprise sales collateral and RFP templates..."
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Color Accent</label>
            <div className="flex items-center gap-2">
              {[
                { label: 'Indigo', color: 'text-indigo-400', bg: 'bg-indigo-500' },
                { label: 'Emerald', color: 'text-emerald-400', bg: 'bg-emerald-500' },
                { label: 'Purple', color: 'text-purple-400', bg: 'bg-purple-500' },
                { label: 'Sky', color: 'text-sky-400', bg: 'bg-sky-500' },
                { label: 'Amber', color: 'text-amber-400', bg: 'bg-amber-500' }
              ].map((c) => (
                <button
                  type="button"
                  key={c.label}
                  onClick={() => setNewFolderColor(c.color)}
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center transition-all",
                    c.bg,
                    newFolderColor === c.color ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"
                  )}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </aside>
  );
};
