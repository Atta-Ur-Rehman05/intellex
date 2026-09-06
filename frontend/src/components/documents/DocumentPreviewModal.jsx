import React, { useState } from 'react';
import { 
  X, FileText, Sparkles, MessageSquare, Copy, 
  Check, ExternalLink, ShieldCheck, Download, 
  ArrowUpRight, Layers, Tag 
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { documentSpecs } from '../../design-system/documentSpecs';

export const DocumentPreviewModal = ({
  isOpen,
  onClose,
  document,
  onChatWithDoc
}) => {
  const [selectedChunkId, setSelectedChunkId] = useState(document?.chunks?.[0]?.id || null);
  const [copiedChunkId, setCopiedChunkId] = useState(null);
  const { toast } = useToast();

  if (!document) return null;

  const activeChunk = document.chunks?.find(c => c.id === selectedChunkId) || document.chunks?.[0];

  const handleCopyChunk = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedChunkId(id);
    toast({
      title: "Chunk Text Copied",
      description: "Vector chunk text copied to clipboard for prompt injection.",
      type: "success"
    });
    setTimeout(() => setCopiedChunkId(null), 2000);
  };

  const handleQueryChunk = (chunk) => {
    onClose();
    if (onChatWithDoc) {
      onChatWithDoc({
        ...document,
        activeChunk: chunk
      });
    } else {
      toast({
        title: "Starting AI Chat on Chunk",
        description: `Loaded Chunk #${chunk.index} (${chunk.tokens} tokens) as active context.`,
        type: "brand"
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-muted font-mono">
            <span>{document.size}</span>
            <span>•</span>
            <span>{document.chunksCount} Vector Chunks</span>
            <span>•</span>
            <span>{document.tokensTotal.toLocaleString()} Tokens</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onChatWithDoc?.(document);
              }}
              leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              className="bg-brand-600 hover:bg-brand-500 text-white"
            >
              Ask AI about Document
            </Button>
          </div>
        </div>
      }
    >
      {/* Split Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
        {/* Left Pane: Full Document Text & Metadata (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Document Header Metadata Card */}
          <div className="p-4 rounded-xl bg-canvas border border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Avatar src={document.avatar} alt={document.uploadedBy} size="xs" />
              <span className="font-semibold text-primary">{document.uploadedBy}</span>
              <span className="text-muted">• {document.updatedAt}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {document.tags?.map((tId) => {
                const tagObj = documentSpecs.tags.find(t => t.id === tId);
                if (!tagObj) return null;
                return (
                  <span key={tId} className={cn("text-[10px] font-mono px-2 py-0.5 rounded border", tagObj.color)}>
                    #{tagObj.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Formatted Reader Preview */}
          <div className="flex-1 p-5 rounded-xl bg-canvas border border-border-default overflow-y-auto max-h-[380px] font-sans text-xs text-primary leading-relaxed space-y-3 select-text">
            <div className="whitespace-pre-line">
              {document.contentPreview || "Document contents preview loading..."}
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Partition isolated in Qdrant Vector Engine. Zero data retention active.</span>
          </div>
        </div>

        {/* Right Pane: AST Vector Chunk Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border-default p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <h4 className="text-xs font-bold text-primary tracking-tight">AST Vector Chunks</h4>
              </div>
              <span className="text-[10px] font-mono text-muted">
                {document.chunks?.length || 0} Chunks Indexed
              </span>
            </div>

            {/* Chunks List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {document.chunks?.map((chunk) => {
                const isSelected = selectedChunkId === chunk.id || (!selectedChunkId && chunk.index === 1);
                return (
                  <div
                    key={chunk.id}
                    onClick={() => setSelectedChunkId(chunk.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5",
                      isSelected
                        ? "bg-brand-500/10 border-brand-500 shadow-xs ring-1 ring-brand-500/20"
                        : "bg-canvas border-border-subtle hover:border-border-default"
                    )}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold font-mono text-primary">Chunk #{chunk.index}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-brand-400">{chunk.tokens} tokens</span>
                        <span className="text-muted">•</span>
                        <span className="text-emerald-400 font-semibold">{chunk.similarity * 100}% sim</span>
                      </div>
                    </div>
                    <p className="text-[11px] font-medium text-secondary line-clamp-1">{chunk.heading}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Chunk Detailed View */}
          {activeChunk && (
            <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary font-mono">Chunk #{activeChunk.index} Payload</span>
                <button
                  onClick={() => handleCopyChunk(activeChunk.text, activeChunk.id)}
                  className="text-muted hover:text-primary flex items-center gap-1 text-[10px] font-mono"
                >
                  {copiedChunkId === activeChunk.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedChunkId === activeChunk.id ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-surface border border-border-subtle text-[11px] text-secondary line-clamp-3 font-mono">
                "{activeChunk.text}"
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQueryChunk(activeChunk)}
                leftIcon={<Sparkles className="w-3 h-3 text-brand-400" />}
                className="w-full text-xs h-7.5"
              >
                Query RAG on this Chunk
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
