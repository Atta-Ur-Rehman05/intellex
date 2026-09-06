import React from 'react';
import { 
  UploadCloud, Sparkles, RefreshCw, UserPlus, 
  Search, Plus, ArrowUpRight 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export const QuickActionsBar = ({ onOpenUpload, onNewChat, onSync, onInvite }) => {
  const { toast } = useToast();

  const handleDefaultSync = () => {
    if (onSync) {
      onSync();
    } else {
      toast({
        title: "Syncing Knowledge Connectors",
        description: "Scanning Notion workspaces and Google Drive for new documents...",
        type: "info"
      });
      setTimeout(() => {
        toast({
          title: "Sync Complete",
          description: "4 Notion pages and 2 PDF whitepapers indexed with fresh vector embeddings.",
          type: "success"
        });
      }, 1500);
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-default p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Left side: Context greeting & fast status */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-primary tracking-tight">Acme AI Global Knowledge Base</h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              RAG Engine Live
            </span>
          </div>
          <p className="text-xs text-secondary">
            1,428 documents • 842.5k vectors • text-embedding-3-large
          </p>
        </div>
      </div>

      {/* Right side: Action Triggers */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDefaultSync}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-secondary" />}
          className="text-xs"
        >
          <span className="hidden sm:inline">Sync</span> Sources
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onInvite}
          leftIcon={<UserPlus className="w-3.5 h-3.5 text-secondary" />}
          className="text-xs"
        >
          Invite Team
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenUpload}
          leftIcon={<UploadCloud className="w-3.5 h-3.5 text-brand-400" />}
          className="text-xs font-medium"
        >
          Upload Docs
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewChat}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-white" />}
          className="text-xs font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xs"
        >
          New AI Thread
        </Button>
      </div>
    </div>
  );
};
