import React, { useState } from 'react';
import { 
  X, Sparkles, FileText, ExternalLink, ShieldCheck, 
  Copy, Check, MessageSquare, ArrowUpRight, Database, 
  Cpu, Layers 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const ResultPreviewPanel = ({
  result,
  onClose,
  onChatWithResult,
  onOpenInExplorer
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(result.snippet);
    setCopied(true);
    toast({
      title: "Chunk Excerpt Copied",
      description: "Copied vector chunk to clipboard.",
      type: "success"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full lg:w-96 shrink-0 bg-surface rounded-2xl border border-border-default p-5 shadow-lg flex flex-col justify-between space-y-5 text-xs select-text animate-in fade-in duration-150">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-canvas border border-border-default flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-brand-400" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-primary truncate max-w-[200px]">{result.docTitle}</h4>
              <span className="text-[10px] text-muted font-mono">{result.page}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cosine Match Progress Meter */}
        <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-secondary flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Cosine Similarity</span>
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              {(result.similarity * 100).toFixed(1)}%
            </span>
          </div>

          <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
              style={{ width: `${result.similarity * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted font-mono">
            <span>Threshold: &gt;70%</span>
            <span>Matched in 18ms</span>
          </div>
        </div>

        {/* Chunk Content Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold">
              Chunk #{result.chunkIndex} Text Payload
            </span>
            <button
              onClick={handleCopy}
              className="text-muted hover:text-primary flex items-center gap-1 text-[11px] font-mono"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-canvas border border-border-default font-serif text-xs text-primary leading-relaxed select-text italic max-h-52 overflow-y-auto">
            "{result.snippet}"
          </div>
        </div>

        {/* Technical Vector Ingestion Specs */}
        <div className="space-y-1.5 p-3 rounded-xl bg-surface-hover/70 border border-border-subtle text-[11px] font-mono">
          <div className="flex items-center justify-between text-muted">
            <span>Model:</span>
            <span className="text-primary font-semibold">text-embedding-3-large</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span>Vector Dimensions:</span>
            <span className="text-primary font-semibold">1,536-dim (L2 normalized)</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span>Token Length:</span>
            <span className="text-primary font-semibold">{result.tokens} tokens</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span>Tenant Namespace:</span>
            <span className="text-brand-400 font-semibold">acme-enterprise-qdrant</span>
          </div>
        </div>

        {/* Security & Isolation */}
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Zero customer data retention active on foundation APIs.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-border-subtle space-y-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onChatWithResult?.(result)}
          leftIcon={<MessageSquare className="w-3.5 h-3.5 text-white" />}
          className="w-full text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
        >
          Ask AI about this Result
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onOpenInExplorer?.(result.docId)}
          leftIcon={<ArrowUpRight className="w-3.5 h-3.5 text-secondary" />}
          className="w-full text-xs"
        >
          Open Document in Explorer
        </Button>
      </div>
    </div>
  );
};
