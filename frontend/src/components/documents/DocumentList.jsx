import React, { useState } from 'react';
import { 
  FileText, Layers, FileCode, FileSpreadsheet, 
  Music, Sparkles, MessageSquare, Download, 
  Eye, MoreVertical, CheckCircle2, Loader2, 
  RefreshCw, Tag, Trash2 
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { documentSpecs } from '../../design-system/documentSpecs';

export const DocumentList = ({
  documents = [],
  onInspectChunks,
  onChatWithDoc,
  onDownloadDoc,
  onDeleteDoc,
  onBatchAction
}) => {
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map(d => d.id));
    }
  };

  const toggleSelectDoc = (id, e) => {
    e?.stopPropagation();
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-400" />;
      case 'notion': return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'code': return <FileCode className="w-4 h-4 text-amber-400" />;
      case 'sheet': return <FileSpreadsheet className="w-4 h-4 text-sky-400" />;
      case 'media': return <Music className="w-4 h-4 text-purple-400" />;
      default: return <FileText className="w-4 h-4 text-brand-400" />;
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
    <div className="bg-surface rounded-2xl border border-border-default shadow-xs overflow-hidden">
      {/* Batch Selection Bar (Conditional) */}
      {selectedDocIds.length > 0 && (
        <div className="bg-brand-600/10 border-b border-brand-500/20 p-3 px-4 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-400 font-mono">
              {selectedDocIds.length} {selectedDocIds.length === 1 ? 'document' : 'documents'} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBatchAction?.('reindex', selectedDocIds)}
              leftIcon={<RefreshCw className="w-3 h-3 text-secondary" />}
              className="text-xs h-7"
            >
              Re-index Vectors
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBatchAction?.('export', selectedDocIds)}
              leftIcon={<Download className="w-3 h-3 text-secondary" />}
              className="text-xs h-7"
            >
              Export
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onBatchAction?.('delete', selectedDocIds)}
              leftIcon={<Trash2 className="w-3 h-3" />}
              className="text-xs h-7"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-hover/60 border-b border-border-subtle text-muted uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedDocIds.length === documents.length && documents.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-border-default text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 font-semibold">Document Title</th>
              <th className="py-3 px-4 font-semibold">Vector Status</th>
              <th className="py-3 px-4 font-semibold hidden md:table-cell">Security Policy</th>
              <th className="py-3 px-4 font-semibold hidden lg:table-cell">Size & Tokens</th>
              <th className="py-3 px-4 font-semibold hidden sm:table-cell">AI Citations</th>
              <th className="py-3 px-4 font-semibold hidden xl:table-cell">Author</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {documents.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);
              return (
                <tr
                  key={doc.id}
                  className={cn(
                    "hover:bg-surface-hover/70 transition-colors group cursor-pointer",
                    isSelected && "bg-brand-500/5"
                  )}
                  onClick={() => onInspectChunks?.(doc)}
                >
                  {/* Select Checkbox */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => toggleSelectDoc(doc.id, e)}
                      className="rounded border-border-default text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </td>

                  {/* Title & Icon */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-canvas border border-border-default flex items-center justify-center shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-primary block truncate max-w-xs sm:max-w-md group-hover:text-brand-400 transition-colors">
                          {doc.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {doc.tags?.slice(0, 2).map((tId) => {
                            const tagObj = documentSpecs.tags.find(t => t.id === tId);
                            if (!tagObj) return null;
                            return (
                              <span key={tId} className="text-[9px] font-mono text-muted">
                                #{tagObj.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(doc.status, doc.chunksCount)}
                  </td>

                  {/* Classification */}
                  <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                    {getClassificationBadge(doc.classification)}
                  </td>

                  {/* Size & Tokens */}
                  <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap font-mono text-secondary">
                    <div>{doc.size}</div>
                    <div className="text-[10px] text-muted">{doc.tokensTotal.toLocaleString()} tokens</div>
                  </td>

                  {/* Citations */}
                  <td className="py-3.5 px-4 hidden sm:table-cell whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Sparkles className="w-3 h-3" />
                      {doc.citationsCount}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="py-3.5 px-4 hidden xl:table-cell whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar src={doc.avatar} alt={doc.uploadedBy} size="xs" />
                      <div>
                        <div className="font-medium text-primary">{doc.uploadedBy}</div>
                        <div className="text-[10px] text-muted">{doc.updatedAt}</div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onInspectChunks?.(doc)}
                        className="text-xs h-7 px-2"
                      >
                        Inspect
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onChatWithDoc?.(doc)}
                        className="text-xs h-7 px-2.5 bg-brand-600 hover:bg-brand-500 text-white"
                      >
                        Ask AI
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {documents.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-secondary text-xs">
                  No documents found in this collection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
