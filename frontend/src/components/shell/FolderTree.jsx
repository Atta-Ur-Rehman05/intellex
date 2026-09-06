import React, { useState } from 'react';
import { 
  Folder, FolderOpen, ChevronRight, FileText, 
  Plus, MoreHorizontal, FileCode, Shield, Sparkles 
} from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '../../lib/utils';

export const defaultFolderCollections = [
  {
    id: 'f-eng',
    name: 'Engineering Specs',
    color: 'text-indigo-400',
    count: 14,
    children: [
      { id: 'doc-arch', title: 'Architecture_2026.pdf', type: 'pdf' },
      { id: 'doc-rag', title: 'RAG_Pipeline.md', type: 'markdown' },
      { id: 'doc-api', title: 'Vector_API_Schema.json', type: 'json' },
    ]
  },
  {
    id: 'f-prod',
    name: 'Product Roadmaps',
    color: 'text-purple-400',
    count: 8,
    children: [
      { id: 'doc-q3', title: 'Q3_Deliverables.md', type: 'markdown' },
      { id: 'doc-pricing', title: 'Enterprise_Tier_Pricing.xlsx', type: 'sheet' },
    ]
  },
  {
    id: 'f-sec',
    name: 'Security & Compliance',
    color: 'text-emerald-400',
    count: 12,
    children: [
      { id: 'doc-soc2', title: 'SOC2_TypeII_Audit.pdf', type: 'pdf' },
      { id: 'doc-gdpr', title: 'GDPR_Data_Residency.docx', type: 'doc' },
    ]
  }
];

/**
 * FolderTree Component for Sidebar Navigation
 */
export const FolderTree = ({
  collections = defaultFolderCollections,
  activeDocumentId = 'doc-arch',
  onSelectDocument,
  onAddDocument,
  isCollapsed = false
}) => {
  const [openFolders, setOpenFolders] = useState({ 'f-eng': true });

  const toggleFolder = (folderId, e) => {
    e?.stopPropagation();
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-1">
        {collections.map(folder => (
          <Tooltip key={folder.id} content={`${folder.name} (${folder.count} files)`} placement="right">
            <button
              onClick={() => onSelectDocument?.(folder.children[0]?.id)}
              className="w-9 h-9 rounded-lg hover:bg-surface-hover flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
              aria-label={folder.name}
            >
              <Folder className={cn("w-4 h-4", folder.color)} />
            </button>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {collections.map(folder => {
        const isOpen = !!openFolders[folder.id];

        return (
          <div key={folder.id} className="space-y-0.5">
            {/* Folder Header Row */}
            <div
              onClick={() => toggleFolder(folder.id)}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2 truncate">
                <ChevronRight className={cn("w-3 h-3 text-muted transition-transform duration-150 shrink-0", isOpen && "rotate-90")} />
                {isOpen ? (
                  <FolderOpen className={cn("w-3.5 h-3.5 shrink-0", folder.color)} />
                ) : (
                  <Folder className={cn("w-3.5 h-3.5 shrink-0", folder.color)} />
                )}
                <span className="truncate">{folder.name}</span>
              </div>

              <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-muted">{folder.count}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddDocument?.(folder.id);
                  }}
                  className="p-0.5 rounded hover:bg-surface text-secondary hover:text-primary transition-colors cursor-pointer"
                  aria-label={`Add document to ${folder.name}`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Folder Nested Documents */}
            {isOpen && folder.children && (
              <div className="pl-5 pr-1 space-y-0.5 border-l border-border-subtle ml-3.5 my-0.5">
                {folder.children.map(doc => {
                  const isActive = doc.id === activeDocumentId;

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => onSelectDocument?.(doc.id, doc.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1 rounded-md text-xs text-left transition-colors cursor-pointer truncate group",
                        isActive
                          ? "bg-brand-500/10 text-brand-400 font-semibold"
                          : "text-secondary hover:text-primary hover:bg-surface-hover"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className={cn("w-3 h-3 shrink-0", isActive ? "text-brand-500" : "text-muted group-hover:text-secondary")} />
                        <span className="truncate">{doc.title}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
