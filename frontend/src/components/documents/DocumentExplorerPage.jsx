import React, { useState, useMemo } from 'react';
import { 
  Folder, Search, Filter, LayoutGrid, List, 
  UploadCloud, Tag, Plus, RefreshCw, Sparkles, 
  ChevronRight, ArrowUpDown, Layers, ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';
import { FolderNavigator } from './FolderNavigator';
import { DocumentGrid } from './DocumentGrid';
import { DocumentList } from './DocumentList';
import { UploadWizardModal } from './UploadWizardModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { TagManagerModal } from './TagManagerModal';
import { documentSpecs } from '../../design-system/documentSpecs';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const DocumentExplorerPage = ({
  onNavigateToChat
}) => {
  const [documents, setDocuments] = useState(documentSpecs.documents);
  const [activeFolderId, setActiveFolderId] = useState('f-all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'pdf' | 'notion' | 'code' | 'sheet' | 'media'
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const { toast } = useToast();

  const activeCollection = documentSpecs.collections.find(c => c.id === activeFolderId) || documentSpecs.collections[0];

  // Filtering Logic
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesFolder = activeFolderId === 'f-all' || doc.collectionId === activeFolderId;
      const matchesType = typeFilter === 'all' || doc.type === typeFilter;
      const matchesClass = classificationFilter === 'all' || doc.classification === classificationFilter;
      const matchesTag = tagFilter === 'all' || doc.tags.includes(tagFilter);
      const matchesSearch = !searchQuery.trim() || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.contentPreview?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFolder && matchesType && matchesClass && matchesTag && matchesSearch;
    });
  }, [documents, activeFolderId, typeFilter, classificationFilter, tagFilter, searchQuery]);

  const handleUploadComplete = () => {
    // Add mock ingested document to state
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: 'Q4_Cloud_Security_Architecture.pdf',
      collectionId: activeFolderId === 'f-all' ? 'f-sec' : activeFolderId,
      type: 'pdf',
      size: '3.2 MB',
      chunksCount: 94,
      tokensTotal: 48100,
      citationsCount: 0,
      status: 'vectorized',
      classification: 'confidential',
      tags: ['tag-soc2', 'tag-arch'],
      uploadedBy: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      updatedAt: 'Just now',
      contentPreview: `# Q4 Cloud Security Architecture (Tenant Isolation Verified)

## Overview
This document outlines cryptographic vector partition security for customer multi-tenant clusters.`,
      chunks: [
        {
          id: `c-${Date.now()}-1`,
          index: 1,
          tokens: 502,
          similarity: 0.98,
          heading: 'Overview & Tenant Cryptographic Partitioning',
          text: 'This document outlines cryptographic vector partition security for customer multi-tenant clusters.'
        }
      ]
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleBatchAction = (action, ids) => {
    if (action === 'delete') {
      setDocuments(prev => prev.filter(d => !ids.includes(d.id)));
      toast({
        title: "Documents Deleted",
        description: `Removed ${ids.length} documents and tombstoned their vector chunks.`,
        type: "info"
      });
    } else if (action === 'reindex') {
      toast({
        title: "Re-indexing Vectors",
        description: `Queued ${ids.length} documents for 1536-dim embedding re-calculation.`,
        type: "success"
      });
    } else if (action === 'export') {
      toast({
        title: "Exporting Document Metadata",
        description: `Exported ${ids.length} document vectors with JSON metadata.`,
        type: "success"
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs Trail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-default">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted mb-1">
            <span>Workspace</span>
            <ChevronRight className="w-3 h-3 text-muted" />
            <span>Collections</span>
            <ChevronRight className="w-3 h-3 text-muted" />
            <span className="text-brand-400 font-bold">{activeCollection.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Document Explorer</h1>
            <Badge variant="brand" dot>{filteredDocuments.length} Indexed Files</Badge>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsTagModalOpen(true)}
            leftIcon={<Tag className="w-3.5 h-3.5 text-secondary" />}
            className="text-xs"
          >
            Manage Tags
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<UploadCloud className="w-3.5 h-3.5 text-white" />}
            className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
          >
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout (Folder Tree on Left, Document Area on Right) */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left-hand Folder Navigator */}
        <FolderNavigator
          activeFolderId={activeFolderId}
          onSelectFolder={setActiveFolderId}
        />

        {/* Right-hand Content Explorer */}
        <div className="flex-1 w-full space-y-4 min-w-0">
          {/* Controls Bar: Search, Filters, View Switcher */}
          <div className="bg-surface rounded-2xl border border-border-default p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${activeCollection.name}...`}
                  className="w-full pl-8.5 pr-3 py-1.5 rounded-lg bg-canvas border border-border-default text-xs text-primary placeholder:text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>

              {/* View Toggle (Grid vs List) */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="flex items-center p-1 rounded-lg bg-canvas border border-border-default">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-md transition-colors cursor-pointer",
                      viewMode === 'grid' ? "bg-surface text-brand-400 shadow-xs" : "text-muted hover:text-primary"
                    )}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded-md transition-colors cursor-pointer",
                      viewMode === 'list' ? "bg-surface text-brand-400 shadow-xs" : "text-muted hover:text-primary"
                    )}
                    title="Detailed List / Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle text-xs">
              {/* Type Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Formats' },
                  { id: 'pdf', label: 'PDFs' },
                  { id: 'notion', label: 'Notion' },
                  { id: 'code', label: 'Code' },
                  { id: 'sheet', label: 'Sheets' },
                  { id: 'media', label: 'Audio' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTypeFilter(t.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap",
                      typeFilter === t.id
                        ? "bg-brand-600 text-white font-semibold shadow-xs"
                        : "bg-canvas text-secondary hover:text-primary border border-border-subtle"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Classification Selector */}
              <select
                value={classificationFilter}
                onChange={(e) => setClassificationFilter(e.target.value)}
                className="px-2 py-1 rounded-md bg-canvas border border-border-subtle text-[11px] text-secondary focus:outline-none focus:border-brand-500"
              >
                <option value="all">Security: All</option>
                <option value="confidential">Confidential Only</option>
                <option value="internal">Internal Shared</option>
                <option value="public">Public Knowledge</option>
              </select>

              {/* Tag Selector */}
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-2 py-1 rounded-md bg-canvas border border-border-subtle text-[11px] text-secondary focus:outline-none focus:border-brand-500"
              >
                <option value="all">Tags: All</option>
                {documentSpecs.tags.map((t) => (
                  <option key={t.id} value={t.id}>#{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents View: Grid or List */}
          {viewMode === 'grid' ? (
            <DocumentGrid
              documents={filteredDocuments}
              onInspectChunks={(doc) => setPreviewDoc(doc)}
              onChatWithDoc={onNavigateToChat}
            />
          ) : (
            <DocumentList
              documents={filteredDocuments}
              onInspectChunks={(doc) => setPreviewDoc(doc)}
              onChatWithDoc={onNavigateToChat}
              onBatchAction={handleBatchAction}
            />
          )}
        </div>
      </div>

      {/* Upload Wizard Modal */}
      <UploadWizardModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Tag Manager Modal */}
      <TagManagerModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />

      {/* Split-pane Document Reader & AST Chunk Inspector Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          document={previewDoc}
          onChatWithDoc={onNavigateToChat}
        />
      )}
    </div>
  );
};
