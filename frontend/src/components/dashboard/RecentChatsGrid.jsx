import React from 'react';
import { 
  Sparkles, MessageSquare, ArrowUpRight, Share2, 
  ExternalLink, FileText, CheckCircle2, Bot 
} from 'lucide-react';
import { dashboardSpecs } from '../../design-system/dashboardSpecs';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const RecentChatsGrid = ({ onOpenChat }) => {
  const { toast } = useToast();

  const handleResume = (chat) => {
    if (onOpenChat) {
      onOpenChat(chat);
    } else {
      toast({
        title: "Resuming AI Discussion",
        description: `Loaded "${chat.title}" with active vector context.`,
        type: "brand"
      });
    }
  };

  const handleShare = (chat, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + `/chat/${chat.id}`);
    toast({
      title: "Link Copied",
      description: `Share link for "${chat.title}" copied to clipboard.`,
      type: "success"
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-primary tracking-tight">Recent AI RAG Threads</h3>
          <p className="text-xs text-secondary">
            Continuous intelligent conversations citing verified knowledge base vectors.
          </p>
        </div>
        <span className="text-xs font-mono text-muted">
          {dashboardSpecs.recentChats.length} active threads
        </span>
      </div>

      {/* Grid of Chat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dashboardSpecs.recentChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleResume(chat)}
            className="group bg-surface rounded-2xl border border-border-default p-5 shadow-xs hover:border-brand-500/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Top Meta: Model & Timestamp */}
              <div className="flex items-center justify-between text-xs mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {chat.model}
                  </span>
                  <span className="text-[10px] text-muted font-mono">• {chat.messagesCount} msgs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted">{chat.timestamp}</span>
                  <button
                    onClick={(e) => handleShare(chat, e)}
                    className="text-secondary hover:text-primary p-1 rounded hover:bg-surface-hover transition-colors"
                    title="Share Thread"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Title */}
              <h4 className="text-sm font-bold text-primary group-hover:text-brand-400 transition-colors line-clamp-1 mb-2">
                {chat.title}
              </h4>

              {/* Snippet Preview */}
              <div className="p-3 rounded-xl bg-canvas border border-border-subtle text-xs text-secondary leading-relaxed mb-3">
                "{chat.snippet}"
              </div>

              {/* Referenced Citations */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted font-mono uppercase tracking-wider text-[10px]">Citations & Sources</span>
                  <span className="text-emerald-400 font-mono font-semibold text-[10px]">
                    {(chat.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {chat.sources.map((src, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-surface-hover border border-border-subtle text-secondary truncate max-w-[200px]"
                    >
                      <FileText className="w-2.5 h-2.5 text-brand-400 shrink-0" />
                      <span className="truncate">{src}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer: Action Button */}
            <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-brand-400 font-medium flex items-center gap-1 group-hover:underline">
                <span>Continue conversation</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <span className="text-[10px] text-muted font-mono">Zero retention verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
