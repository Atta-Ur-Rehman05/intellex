import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Filter, MoreVertical, 
  MessageSquare, ExternalLink, Download, Trash2, 
  CheckCircle2, Loader2, Sparkles, Layers, 
  FileCode, Database, Music, FileSpreadsheet 
} from 'lucide-react';
import { dashboardSpecs } from '../../design-system/dashboardSpecs';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useToast } from '../ui/Toast';

export const RecentFilesTable = ({ onChatWithFile, onOpenFile }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pdf' | 'notion' | 'code' | 'sheet'
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filterTabs = [
    { id: 'all', label: 'All Files', count: dashboardSpecs.recentFiles.length },
    { id: 'pdf', label: 'PDFs', count: 2 },
    { id: 'notion', label: 'Notion', count: 1 },
    { id: 'code', label: 'Code', count: 1 },
    { id: 'sheet', label: 'Sheets', count: 1 },
  ];

  const filteredFiles = useMemo(() => {
    return dashboardSpecs.recentFiles.filter(file => {
      const matchesType = activeFilter === 'all' || file.type === activeFilter;
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            file.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'vectorized':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Vectorized
          </span>
        );
      case 'indexing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
            Embedding...
          </span>
        );
      case 'synced':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Synced
          </span>
        );
      default:
        return null;
    }
  };

  const handleAction = (action, file) => {
    if (action === 'chat') {
      if (onChatWithFile) {
        onChatWithFile(file);
      } else {
        toast({
          title: "Starting AI Chat",
          description: `Initialized RAG context focused on "${file.name}" (${file.chunks} chunks).`,
          type: "brand"
        });
      }
    } else if (action === 'preview') {
      toast({
        title: "Previewing Document",
        description: `Opening reader for ${file.name}.`,
        type: "info"
      });
    } else if (action === 'download') {
      toast({
        title: "Download Started",
        description: `Exporting ${file.name} with vector metadata.`,
        type: "success"
      });
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-default shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-border-default space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-primary tracking-tight">Recent Knowledge Documents</h3>
            <p className="text-xs text-secondary mt-0.5">
              Live index of ingested enterprise files, vector partitions, and citation counts.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recent files..."
              className="w-full pl-8.5 pr-3 py-1.5 rounded-lg bg-canvas border border-border-default text-xs text-primary placeholder:text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                activeFilter === tab.id
                  ? "bg-brand-600 text-white font-semibold shadow-xs"
                  : "bg-surface-hover text-secondary hover:text-primary hover:bg-surface-hover/80 border border-border-subtle"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn(
                "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                activeFilter === tab.id ? "bg-white/20 text-white" : "bg-canvas text-muted"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-hover/60 border-b border-border-subtle text-muted uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Document Name</th>
              <th className="py-3 px-4 font-semibold">Vector Status</th>
              <th className="py-3 px-4 font-semibold hidden md:table-cell">Size & Chunks</th>
              <th className="py-3 px-4 font-semibold hidden sm:table-cell">AI Citations</th>
              <th className="py-3 px-4 font-semibold hidden lg:table-cell">Uploaded By</th>
              <th className="py-3 px-4 text-right font-semibold">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredFiles.map((file) => (
              <tr 
                key={file.id} 
                className="hover:bg-surface-hover/70 transition-colors group"
              >
                {/* File Name & Icon */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-canvas border border-border-default flex items-center justify-center shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-primary block truncate max-w-xs sm:max-w-sm">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-muted block truncate">
                        {file.category}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(file.status)}
                </td>

                {/* Size & Chunks */}
                <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap font-mono text-secondary">
                  <div>{file.size}</div>
                  <div className="text-[10px] text-muted">{file.chunks} vector chunks</div>
                </td>

                {/* Citations */}
                <td className="py-3.5 px-4 hidden sm:table-cell whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Sparkles className="w-3 h-3" />
                    {file.citations} citations
                  </span>
                </td>

                {/* Uploaded By */}
                <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Avatar src={file.avatar} alt={file.uploadedBy} size="xs" />
                    <div>
                      <div className="font-medium text-primary">{file.uploadedBy}</div>
                      <div className="text-[10px] text-muted">{file.updatedAt}</div>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction('chat', file)}
                      leftIcon={<MessageSquare className="w-3.5 h-3.5 text-brand-400" />}
                      className="text-xs h-7 px-2 text-brand-400 hover:text-brand-300"
                    >
                      <span className="hidden sm:inline">Ask AI</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction('download', file)}
                      className="text-xs h-7 w-7 p-0 text-secondary hover:text-primary"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredFiles.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-secondary text-xs">
                  No documents found matching "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
