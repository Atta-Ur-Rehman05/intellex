import React from 'react';
import { 
  FileText, Layers, FileCode, FileSpreadsheet, 
  Music, Sparkles, MessageSquare, Download, 
  Eye, MoreVertical, CheckCircle2, Loader2, Shield 
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { documentSpecs } from '../../design-system/documentSpecs';

export const DocumentGrid = ({
  documents = [],
  onSelectDoc,
  onInspectChunks,
  onChatWithDoc,
  onDownloadDoc,
  onDeleteDoc
}) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-400" />;
      case 'notion': return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'code': return <FileCode className="w-5 h-5 text-amber-400" />;
      case 'sheet': return <FileSpreadsheet className="w-5 h-5 text-sky-400" />;
      case 'media': return <Music className="w-5 h-5 text-purple-400" />;
      default: return <FileText className="w-5 h-5 text-brand-400" />;
    }
  };

  const getStatusBadge = (status, chunksCount) => {
    switch (status) {
      case 'vectorized':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {chunksCount} chunks
          </span>
        );
      case 'indexing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-400" />
            Embedding...
          </span>
        );
      case 'synced':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Synced
          </span>
        );
      default:
        return null;
    }
  };

  const getClassificationBadge = (classification) => {
    const item = documentSpecs.classifications.find(c => c.id === classification);
    if (!item) return null;
    return (
      <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-md border font-medium", item.color)}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group bg-surface rounded-2xl border border-border-default p-5 shadow-xs hover:border-brand-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
        >
          <div>
            {/* Top Row: File Icon & Status Badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="h-10 w-10 rounded-xl bg-canvas border border-border-default flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getFileIcon(doc.type)}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {getStatusBadge(doc.status, doc.chunksCount)}
              </div>
            </div>

            {/* Title & Classification */}
            <div className="space-y-1.5 mb-2.5">
              <h4 
                onClick={() => onInspectChunks?.(doc)}
                className="text-sm font-bold text-primary group-hover:text-brand-400 transition-colors cursor-pointer line-clamp-1"
                title={doc.title}
              >
                {doc.title}
              </h4>
              <div className="flex items-center gap-2">
                {getClassificationBadge(doc.classification)}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {doc.tags?.map((tId) => {
                const tagObj = documentSpecs.tags.find(t => t.id === tId);
                if (!tagObj) return null;
                return (
                  <span
                    key={tId}
                    className={cn("text-[10px] font-mono px-2 py-0.5 rounded border font-medium", tagObj.color)}
                  >
                    #{tagObj.label}
                  </span>
                );
              })}
            </div>

            {/* Citations & Size Info */}
            <div className="flex items-center justify-between text-xs py-2 border-y border-border-subtle text-secondary font-mono">
              <div className="flex items-center gap-1 text-purple-400">
                <Sparkles className="w-3 h-3" />
                <span>{doc.citationsCount} citations</span>
              </div>
              <div className="text-muted">
                {doc.size} • {doc.tokensTotal.toLocaleString()} tokens
              </div>
            </div>
          </div>

          {/* Card Footer: Author & Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar src={doc.avatar} alt={doc.uploadedBy} size="xs" />
              <div className="min-w-0">
                <span className="text-xs font-medium text-primary block truncate">{doc.uploadedBy}</span>
                <span className="text-[10px] text-muted block truncate">{doc.updatedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onInspectChunks?.(doc)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                className="text-xs h-7 px-2"
                title="Preview Document & Inspect Chunks"
              >
                Inspect
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onChatWithDoc?.(doc)}
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                className="text-xs h-7 px-2 bg-brand-600 hover:bg-brand-500 text-white"
                title="Ask AI about this Document"
              >
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
