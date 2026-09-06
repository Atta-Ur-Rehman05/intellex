import React from 'react';
import { 
  LayoutDashboard, FileText, Sparkles, Search, 
  Activity, Settings, Users, HardDrive, ChevronLeft, 
  ChevronRight, UserPlus, HelpCircle, PanelLeftClose, PanelLeftOpen, User
} from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { FolderTree } from './FolderTree';
import { Tooltip } from '../ui/Tooltip';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export const primaryNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'docs', label: 'Documents', icon: FileText, path: '/docs', count: 48 },
  { id: 'chat', label: 'AI Chat & RAG', icon: Sparkles, path: '/chat', isAi: true, badge: 'Neural' },
  { id: 'search', label: 'Semantic Search', icon: Search, path: '/search', shortcut: '⌘K' },
  { id: 'activity', label: 'Activity Feed', icon: Activity, path: '/activity' },
  { id: 'settings', label: 'Workspace Settings', icon: Settings, path: '/settings' },
  { id: 'account-settings', label: 'Account Settings', icon: User, path: '/account-settings' },
];

/**
 * Sidebar Component - Knowva App Shell
 */
export const Sidebar = ({
  activeNavId = 'dashboard',
  onNavChange,
  isCollapsed = false,
  onToggleCollapse,
  activeDocumentId,
  onSelectDocument,
  currentWorkspaceId = 'ws-acme',
  onWorkspaceChange,
  onOpenInviteModal,
  className
}) => {
  return (
    <aside
      className={cn(
        "h-full bg-surface border-r border-border-default flex flex-col justify-between transition-all duration-300 select-none z-30",
        isCollapsed ? "w-[68px]" : "w-[260px]",
        className
      )}
    >
      {/* Upper Area: Workspace Switcher + Primary Nav + Folders */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Workspace Switcher Header */}
        <div className="p-3 border-b border-border-subtle flex items-center justify-between">
          <WorkspaceSwitcher
            currentWorkspaceId={currentWorkspaceId}
            onWorkspaceChange={onWorkspaceChange}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5 no-scrollbar">
          {/* Primary Navigation Routes */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">
                Workspace
              </div>
            )}

            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavId === item.id;

              const navButton = (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavChange?.(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl transition-all duration-150 cursor-pointer group text-xs",
                    isCollapsed ? "h-10 w-10 justify-center mx-auto p-0" : "px-3 py-2",
                    isActive
                      ? item.isAi
                        ? "bg-gradient-to-r from-brand-600/15 via-purple-600/15 to-pink-600/15 text-brand-400 font-semibold border border-purple-500/30 shadow-xs"
                        : "bg-brand-600 text-white font-semibold shadow-xs"
                      : "text-secondary hover:text-primary hover:bg-surface-hover"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={cn(
                      "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
                      isActive 
                        ? item.isAi ? "text-purple-400 animate-pulse" : "text-white" 
                        : item.isAi ? "text-purple-400" : "text-secondary group-hover:text-primary"
                    )} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 ml-2">
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className={cn(
                          "text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold",
                          isActive ? "bg-white/20 text-white" : "bg-surface-hover text-muted"
                        )}>
                          {item.count}
                        </span>
                      )}
                      {item.shortcut && (
                        <kbd className="text-[10px] font-mono text-muted">{item.shortcut}</kbd>
                      )}
                    </div>
                  )}
                </button>
              );

              return isCollapsed ? (
                <Tooltip key={item.id} content={item.label} placement="right">
                  {navButton}
                </Tooltip>
              ) : (
                navButton
              );
            })}
          </div>

          {/* Knowledge Collections (Folder Tree) */}
          <div className="space-y-1 pt-1 border-t border-border-subtle">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">
                <span>Collections</span>
                <span>3 Folders</span>
              </div>
            )}

            <FolderTree
              isCollapsed={isCollapsed}
              activeDocumentId={activeDocumentId}
              onSelectDocument={onSelectDocument}
            />
          </div>
        </div>
      </div>

      {/* Bottom Area: Storage Usage Widget, Invite Button & Collapse Toggle */}
      <div className="p-3 border-t border-border-subtle space-y-2 bg-surface">
        {/* Storage Widget (expanded only) */}
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-surface-hover border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-primary font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-brand-400" />
                <span>Storage</span>
              </div>
              <span className="text-[10px] font-mono text-secondary">8.4% used</span>
            </div>

            {/* Storage Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-border-default overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 w-[8.4%]" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted font-mono pt-0.5">
              <span>8.4 GB of 100 GB</span>
              <button className="text-brand-400 hover:underline font-semibold cursor-pointer">
                Upgrade
              </button>
            </div>
          </div>
        ) : (
          <Tooltip content="Storage: 8.4 GB / 100 GB (8.4%)" placement="right">
            <div className="w-10 h-10 mx-auto rounded-lg bg-surface-hover flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer">
              <HardDrive className="w-4 h-4 text-brand-400" />
            </div>
          </Tooltip>
        )}

        {/* Quick Invite Button */}
        {!isCollapsed ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs"
            leftIcon={<UserPlus className="w-3.5 h-3.5 text-brand-400" />}
            onClick={onOpenInviteModal}
          >
            Invite Members
          </Button>
        ) : (
          <Tooltip content="Invite Members" placement="right">
            <button
              onClick={onOpenInviteModal}
              className="w-10 h-10 mx-auto rounded-lg bg-surface-hover hover:bg-brand-500/10 hover:text-brand-400 flex items-center justify-center text-secondary transition-colors cursor-pointer"
              aria-label="Invite Members"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </Tooltip>
        )}

        {/* Collapse / Expand Toggle Button */}
        <div className="flex items-center justify-between pt-1">
          {!isCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-muted hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <PanelLeftClose className="w-3.5 h-3.5" />
                <span>Collapse Sidebar</span>
              </div>
              <kbd className="text-[10px] font-mono">⌘B</kbd>
            </button>
          ) : (
            <Tooltip content="Expand Sidebar (⌘B)" placement="right">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-10 h-8 mx-auto rounded-lg text-muted hover:text-primary hover:bg-surface-hover flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  );
};
