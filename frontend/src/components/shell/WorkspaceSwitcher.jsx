import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, Check, ChevronDown, Plus, Sparkles, 
  Layers, Shield, ExternalLink, HardDrive, Users 
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export const defaultWorkspaces = [
  {
    id: 'ws-acme',
    name: 'Acme Enterprise',
    slug: 'acme-corp',
    plan: 'Enterprise',
    planVariant: 'brand',
    iconColor: 'from-indigo-600 to-brand-600',
    storageUsed: '8.4 GB',
    storageLimit: '100 GB',
    membersCount: 42,
    role: 'Owner'
  },
  {
    id: 'ws-ai-lab',
    name: 'Applied AI Laboratory',
    slug: 'applied-ai',
    plan: 'Pro',
    planVariant: 'ai',
    iconColor: 'from-purple-600 to-pink-600',
    storageUsed: '2.1 GB',
    storageLimit: '20 GB',
    membersCount: 12,
    role: 'Admin'
  },
  {
    id: 'ws-legal',
    name: 'Legal & Compliance',
    slug: 'legal-docs',
    plan: 'Enterprise',
    planVariant: 'brand',
    iconColor: 'from-emerald-600 to-teal-600',
    storageUsed: '14.8 GB',
    storageLimit: '100 GB',
    membersCount: 8,
    role: 'Editor'
  }
];

/**
 * WorkspaceSwitcher Component - Knowva App Shell
 */
export const WorkspaceSwitcher = ({
  workspaces = defaultWorkspaces,
  currentWorkspaceId = 'ws-acme',
  onWorkspaceChange,
  isCollapsed = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const dropdownRef = useRef(null);

  const activeWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    
    const newWs = {
      id: `ws-${Date.now()}`,
      name: newWorkspaceName.trim(),
      slug: newWorkspaceName.trim().toLowerCase().replace(/\s+/g, '-'),
      plan: 'Pro',
      planVariant: 'ai',
      iconColor: 'from-brand-600 to-sky-600',
      storageUsed: '0 GB',
      storageLimit: '20 GB',
      membersCount: 1,
      role: 'Owner'
    };

    onWorkspaceChange?.(newWs.id);
    setIsCreateModalOpen(false);
    setNewWorkspaceName('');
    setIsOpen(false);
  };

  if (isCollapsed) {
    return (
      <div className="relative flex justify-center w-full" ref={dropdownRef}>
        <Tooltip content={`${activeWorkspace.name} (${activeWorkspace.plan})`} placement="right">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20 hover:scale-105 transition-transform cursor-pointer"
            aria-label="Switch workspace"
          >
            {activeWorkspace.name.slice(0, 2).toUpperCase()}
          </button>
        </Tooltip>

        {isOpen && (
          <div className="absolute left-full top-0 ml-3 w-64 bg-surface border border-border-default rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-2 py-1.5 border-b border-border-subtle mb-1 text-[11px] font-mono uppercase tracking-wider text-muted">
              Switch Workspace
            </div>
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => {
                  onWorkspaceChange?.(ws.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full p-2 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer",
                  ws.id === currentWorkspaceId ? "bg-brand-500/10 text-brand-400 font-semibold" : "hover:bg-surface-hover text-primary"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={cn("w-6 h-6 rounded-md bg-gradient-to-br text-white flex items-center justify-center text-[10px] font-bold shrink-0", ws.iconColor)}>
                    {ws.name.slice(0, 1)}
                  </div>
                  <span className="truncate">{ws.name}</span>
                </div>
                {ws.id === currentWorkspaceId && <Check className="w-4 h-4 text-brand-500" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Active Workspace Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          "w-full p-2 rounded-xl border flex items-center justify-between transition-all duration-150 cursor-pointer text-left group",
          isOpen 
            ? "bg-surface-hover border-brand-500/50 ring-2 ring-brand-500/20" 
            : "bg-surface/80 hover:bg-surface-hover border-border-default hover:border-border-strong shadow-xs"
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0", activeWorkspace.iconColor)}>
            {activeWorkspace.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-primary truncate leading-tight">
                {activeWorkspace.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono text-muted truncate">
                {activeWorkspace.slug}.knowva.ai
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-500/10 text-brand-400 font-semibold border border-brand-500/20">
                {activeWorkspace.plan}
              </span>
            </div>
          </div>
        </div>

        <ChevronDown className={cn("w-4 h-4 text-secondary transition-transform duration-200 shrink-0 ml-1.5", isOpen && "rotate-180")} />
      </button>

      {/* Workspaces Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-border-default rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted flex items-center justify-between">
            <span>Workspaces</span>
            <span className="text-secondary">{workspaces.length} Available</span>
          </div>

          <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
            {workspaces.map((ws) => {
              const isActive = ws.id === currentWorkspaceId;
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    onWorkspaceChange?.(ws.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full p-2 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer group",
                    isActive ? "bg-brand-500/10 border border-brand-500/30" : "hover:bg-surface-hover border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={cn("w-7 h-7 rounded-md bg-gradient-to-br text-white flex items-center justify-center font-bold text-[11px] shrink-0", ws.iconColor)}>
                      {ws.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-xs font-semibold truncate", isActive ? "text-brand-400" : "text-primary")}>
                          {ws.name}
                        </span>
                        <span className="text-[9px] font-mono px-1 rounded bg-surface-hover text-muted border border-border-subtle">
                          {ws.plan}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted font-mono mt-0.5">
                        <span>{ws.storageUsed} used</span>
                        <span>•</span>
                        <span>{ws.membersCount} members</span>
                      </div>
                    </div>
                  </div>

                  {isActive && <Check className="w-4 h-4 text-brand-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 mt-1 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full p-2 text-xs rounded-lg text-secondary hover:text-primary hover:bg-surface-hover flex items-center gap-2 font-medium transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-surface-hover border border-border-default flex items-center justify-center text-secondary">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>Create New Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workspace"
        description="Provision a dedicated enterprise workspace with isolated vector namespaces."
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Core Research Lab"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            helperText="Custom domain will be generated automatically."
            autoFocus
          />
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!newWorkspaceName.trim()}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
