import React from 'react';
import { 
  X, Sparkles, FileText, ExternalLink, ShieldCheck, 
  Copy, Check, ArrowUpRight 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const CitationDrawer = ({
  isOpen,
  onClose,
  citation,
  onNavigateToDocs
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const { toast } = useToast();

  if (!isOpen || !citation) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(citation.snippet);
    setIsCopied(true);
    toast({
      title: "Citation Copied",
      description: "Source excerpt copied to clipboard.",
      type: "success"
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md h-full bg-surface border-l border-border-default shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center font-mono font-bold text-xs border border-brand-500/20">
                {citation.badge || `[${citation.id}]`}
              </span>
              <div>
                <h3 className="text-sm font-bold text-primary">Verifiable Vector Citation</h3>
                <span className="text-[11px] text-muted font-mono">{citation.page}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Document Header Card */}
          <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400 shrink-0" />
              <h4 className="text-xs font-bold text-primary truncate">{citation.title}</h4>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted">Cosine Match</span>
              <span className="text-emerald-400 font-bold">
                {(citation.similarity * 100).toFixed(0)}% Confidence
              </span>
            </div>
          </div>

          {/* Matched Excerpt Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-secondary uppercase tracking-wider text-[10px] font-mono">
                Indexed Chunk Payload
              </span>
              <button
                onClick={handleCopy}
                className="text-muted hover:text-primary flex items-center gap-1 text-[11px] font-mono"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? "Copied" : "Copy Excerpt"}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-canvas border border-border-default text-xs text-primary font-serif leading-relaxed italic select-text">
              "{citation.snippet}"
            </div>
          </div>

          {/* Security & Isolation Guarantee */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Partition Isolation Active</span>
              <p className="text-[11px] text-secondary">
                This chunk was retrieved strictly within the tenant's isolated vector namespace. Zero data is shared across external enterprise boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border-default space-y-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onNavigateToDocs?.(citation.docId);
            }}
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            className="w-full text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white"
          >
            Open Source Document in Explorer
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="w-full text-xs"
          >
            Close Citation
          </Button>
        </div>
      </div>
    </div>
  );
};
