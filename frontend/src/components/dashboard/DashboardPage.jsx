import React, { useState } from 'react';
import { 
  LayoutDashboard, BarChart3, HardDrive, FileText, 
  Sparkles, Activity, Plus, UploadCloud, 
  MessageSquare, UserPlus, CheckCircle2, ShieldCheck,
  Search, SlidersHorizontal
} from 'lucide-react';
import { QuickActionsBar } from './QuickActionsBar';
import { WorkspaceMetrics } from './WorkspaceMetrics';
import { StorageBreakdown } from './StorageBreakdown';
import { RecentFilesTable } from './RecentFilesTable';
import { RecentChatsGrid } from './RecentChatsGrid';
import { ActivityFeed } from './ActivityFeed';
import { AnalyticsDeepDive } from './AnalyticsDeepDive';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const DashboardPage = ({ onNavigateToChat, onNavigateToDocs }) => {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'analytics'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    toast({
      title: "Generating Neural Vector Embeddings",
      description: "Parsing chunks with 1536-dimension OpenAI embeddings...",
      type: "info"
    });

    setTimeout(() => {
      setIsUploading(false);
      setIsUploadModalOpen(false);
      toast({
        title: "Document Ingested Successfully",
        description: "New vectors indexed into tenant partition. Ready for RAG search.",
        type: "success"
      });
    }, 1500);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    toast({
      title: "Invitation Dispatched",
      description: `Sent ${inviteRole} workspace invite to ${inviteEmail}.`,
      type: "success"
    });
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Quick Actions & Status Greeting Bar */}
      <QuickActionsBar
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onNewChat={onNavigateToChat}
        onInvite={() => setIsInviteModalOpen(true)}
      />

      {/* 2. Dashboard View Sub-Tabs (Overview vs Analytics) */}
      <div className="flex items-center justify-between border-b border-border-default pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={cn(
              "flex items-center gap-2 py-2 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 -mb-1",
              activeSubTab === 'overview'
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-secondary hover:text-primary"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Workspace Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={cn(
              "flex items-center gap-2 py-2 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 -mb-1",
              activeSubTab === 'analytics'
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-secondary hover:text-primary"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Telemetry & Performance</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time vector sync: Active</span>
        </div>
      </div>

      {/* 3. Tab Content */}
      {activeSubTab === 'overview' ? (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <WorkspaceMetrics />

          {/* Visual Multi-Segment Storage Breakdown */}
          <StorageBreakdown />

          {/* Recent Knowledge Documents Table */}
          <RecentFilesTable
            onChatWithFile={onNavigateToChat}
            onOpenFile={onNavigateToDocs}
          />

          {/* Bottom Grid: Recent AI RAG Threads & Live Activity Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent AI Threads (7 Cols on desktop) */}
            <div className="lg:col-span-7">
              <RecentChatsGrid onOpenChat={onNavigateToChat} />
            </div>

            {/* Live Activity Audit Feed (5 Cols on desktop) */}
            <div className="lg:col-span-5">
              <ActivityFeed />
            </div>
          </div>
        </div>
      ) : (
        /* Analytics & Telemetry Deep Dive */
        <AnalyticsDeepDive />
      )}

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Knowledge Documents"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateUpload}
              loading={isUploading}
              leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
            >
              Start Vector Ingestion
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-6 rounded-xl border-2 border-dashed border-brand-500/40 bg-brand-500/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-500/10 transition-colors">
            <UploadCloud className="w-8 h-8 text-brand-400 mb-2" />
            <h4 className="text-sm font-semibold text-primary">Drop files here or click to browse</h4>
            <p className="text-xs text-secondary mt-1 max-w-xs">
              Supports PDF, DOCX, Markdown, Notion exports, CSV, and code files up to 100 MB.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface-hover border border-border-subtle flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-secondary">Zero-retention encryption active: Embeddings isolated to tenant.</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Invite Team Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Collaborator"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendInvite}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Send Invite
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Work Email</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@acme.ai"
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Permission Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
            >
              <option value="Admin">Admin (Full workspace control & billing)</option>
              <option value="Editor">Editor (Ingest documents & edit prompts)</option>
              <option value="Viewer">Viewer (RAG search and chat queries only)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
