import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CommandPalette } from './CommandPalette';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

/**
 * AppShell Component - Knowva Master Application Layout
 */
export const AppShell = ({
  children,
  currentRoute = 'dashboard',
  onRouteChange,
  activeDocumentTitle = 'Architecture_2026.pdf',
  theme = 'dark',
  onToggleTheme,
  className
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState('ws-acme');
  const [activeDoc, setActiveDoc] = useState({ id: 'doc-arch', title: activeDocumentTitle });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const { toast } = useToast();

  // Keyboard shortcut listener for ⌘B (toggle sidebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Breadcrumb items based on current active state
  const routeLabels = {
    dashboard: 'Dashboard',
    docs: 'Document Explorer',
    chat: 'AI Chat & RAG',
    search: 'Semantic Search',
    activity: 'Activity Feed',
    settings: 'Workspace Settings',
  };

  const breadcrumbItems = [
    { id: 'ws', label: currentWorkspaceId === 'ws-acme' ? 'Acme Enterprise' : currentWorkspaceId === 'ws-ai-lab' ? 'Applied AI Lab' : 'Legal & Compliance' },
    { id: currentRoute, label: routeLabels[currentRoute] || 'Dashboard' },
    ...(currentRoute === 'docs' && activeDoc ? [{ id: activeDoc.id, label: activeDoc.title, badge: 'v2.1' }] : [])
  ];

  const handleNavChange = (navId) => {
    if (navId === 'search') {
      setIsCommandPaletteOpen(true);
      return;
    }
    onRouteChange?.(navId);
    setIsMobileDrawerOpen(false);
  };

  const handleSelectDocument = (docId, title) => {
    setActiveDoc({ id: docId, title: title || 'Document' });
    onRouteChange?.('docs');
    setIsMobileDrawerOpen(false);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    toast({
      title: "Invitation Dispatched",
      description: `Invited ${inviteEmail} to workspace as ${inviteRole}.`,
      type: "success"
    });

    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  return (
    <div className={cn("h-screen w-full flex overflow-hidden bg-canvas text-primary", className)}>
      {/* Desktop Persistent / Collapsible Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar
          activeNavId={currentRoute}
          onNavChange={handleNavChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeDocumentId={activeDoc.id}
          onSelectDocument={handleSelectDocument}
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={setCurrentWorkspaceId}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
        />
      </div>

      {/* Mobile Off-Canvas Drawer (Slide out with dark backdrop) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            <Sidebar
              activeNavId={currentRoute}
              onNavChange={handleNavChange}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileDrawerOpen(false)}
              activeDocumentId={activeDoc.id}
              onSelectDocument={handleSelectDocument}
              currentWorkspaceId={currentWorkspaceId}
              onWorkspaceChange={(wsId) => {
                setCurrentWorkspaceId(wsId);
                setIsMobileDrawerOpen(false);
              }}
              onOpenInviteModal={() => {
                setIsMobileDrawerOpen(false);
                setIsInviteModalOpen(true);
              }}
              className="w-full h-full shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Main Right Content Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNav
          breadcrumbItems={breadcrumbItems}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen(true)}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-canvas">
          {children}
        </main>
      </div>

      {/* Global ⌘K Command Palette Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectItem={(item) => {
          if (item.type === 'PDF' || item.type === 'Markdown' || item.type === 'JSON') {
            handleSelectDocument(item.id, item.title);
          } else if (item.id === 'act-chat') {
            onRouteChange?.('chat');
          } else if (item.id === 'act-invite') {
            setIsInviteModalOpen(true);
          } else if (item.id === 'act-settings') {
            onRouteChange?.('settings');
          }
          toast({
            title: `Navigated to ${item.title}`,
            description: item.section || "Command executed",
            type: "info"
          });
        }}
      />

      {/* Colleague Batch Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Teammates to Knowva"
        description="Invited colleagues will receive instant access to this workspace based on RBAC permissions."
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <Input
            label="Work Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            helperText="Enter comma-separated emails for batch invitations."
            autoFocus
          />

          <Select
            label="Initial RBAC Role"
            value={inviteRole}
            onChange={setInviteRole}
            options={[
              { value: 'admin', label: 'Security Admin', badge: 'Manage' },
              { value: 'editor', label: 'Knowledge Editor (Upload & Chat)', badge: 'Write' },
              { value: 'viewer', label: 'Read-only Viewer', badge: 'Read' },
            ]}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
            <Button variant="secondary" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!inviteEmail.trim()}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
