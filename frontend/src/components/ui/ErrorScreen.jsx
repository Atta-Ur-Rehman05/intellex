import {
  ShieldAlert, FileQuestion, ServerCrash, Wrench,
  ArrowLeft, ExternalLink, RotateCcw, Bell, WifiOff
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '../../lib/utils';

/**
 * ErrorScreen — full-route HTTP error takeover (403 / 404 / 500 / 503)
 * Centered layout, ≤3 actions, illustrative SVG per code, never dead-ends.
 */
const illustrations = {
  403: (
    <svg viewBox="0 0 200 140" className="w-full h-full" aria-hidden="true">
      <rect x="58" y="46" width="84" height="70" rx="10" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <path d="M70 96 L70 84 Q70 72 82 72 Q94 72 94 84 L94 96" className="stroke-amber-500" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M74 96 L74 86 Q74 78 82 78 Q90 78 90 86 L90 96" className="stroke-amber-500/60" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="60" r="2.5" className="fill-border-strong" />
      <circle cx="108" cy="60" r="2.5" className="fill-border-strong" />
      <path d="M30 120 L42 120 M158 120 L170 120 M36 128 L164 128" className="stroke-border-subtle" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 5" />
      <circle cx="52" cy="36" r="10" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="2" />
      <path d="M52 31 L52 36 M52 39 L52 41" className="stroke-amber-500" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  404: (
    <svg viewBox="0 0 200 140" className="w-full h-full" aria-hidden="true">
      <path d="M40 100 C40 70 70 50 100 50 C130 50 160 70 160 100" className="stroke-border-strong" strokeWidth="2" fill="none" strokeDasharray="6 6" />
      <path d="M100 50 L100 116" className="stroke-border-strong" strokeWidth="2" />
      <circle cx="100" cy="124" r="3" className="fill-border-strong" />
      <circle cx="72" cy="106" r="12" className="fill-brand-500/10 stroke-brand-500/40" strokeWidth="2" />
      <path d="M67 106 L71 110 L77 103" className="stroke-brand-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M146 30 L146 44 M139 37 L153 37" className="stroke-brand-400" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="146" cy="37" r="16" className="fill-none stroke-brand-500/30" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M52 26 L64 26 M58 20 L58 32" className="stroke-border-default" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  500: (
    <svg viewBox="0 0 200 140" className="w-full h-full" aria-hidden="true">
      <rect x="64" y="30" width="72" height="88" rx="8" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <rect x="76" y="46" width="48" height="10" rx="3" className="fill-red-500/15" />
      <rect x="76" y="64" width="48" height="10" rx="3" className="fill-red-500/10" />
      <rect x="76" y="82" width="32" height="10" rx="3" className="fill-red-500/5" />
      <path d="M80 34 L74 22 M120 34 L126 22" className="stroke-red-400" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 20 Q64 12 72 16 M140 20 Q136 12 128 16" className="stroke-red-400/60" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="106" r="4" className="fill-red-400" />
      <path d="M96 110 Q100 116 104 110" className="stroke-red-400/70" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M44 124 L156 124" className="stroke-border-subtle" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
    </svg>
  ),
  503: (
    <svg viewBox="0 0 200 140" className="w-full h-full" aria-hidden="true">
      <rect x="70" y="44" width="60" height="44" rx="10" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <path d="M92 54 L108 54 L118 64 L108 64 L108 78 L92 78 L92 64 L82 64 Z" className="fill-sky-500/15 stroke-sky-500/50" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="86" cy="98" r="9" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <circle cx="114" cy="98" r="9" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <circle cx="86" cy="98" r="2.5" className="fill-sky-500" />
      <circle cx="114" cy="98" r="2.5" className="fill-sky-500" />
      <path d="M30 66 L58 66 M142 66 L170 66" className="stroke-sky-400/50" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      <circle cx="48" cy="54" r="2" className="fill-amber-400" />
      <circle cx="152" cy="80" r="2.5" className="fill-amber-400/60" />
      <path d="M40 116 L160 116" className="stroke-border-subtle" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
    </svg>
  ),
};

const errorMeta = {
  403: { icon: ShieldAlert, title: "Access forbidden", tone: "text-red-500", badgeVariant: "error" },
  404: { icon: FileQuestion, title: "Page not found", tone: "text-amber-500", badgeVariant: "warning" },
  500: { icon: ServerCrash, title: "Something went wrong", tone: "text-red-500", badgeVariant: "error" },
  503: { icon: Wrench, title: "Scheduled maintenance", tone: "text-sky-500", badgeVariant: "info" },
};

export const ErrorScreen = ({
  code = 404,
  message,
  incidentId,
  onPrimaryAction,
  onSecondaryAction,
  className
}) => {
  const meta = errorMeta[code] || errorMeta[404];
  const Icon = meta.icon;
  const is500 = code === 500;
  const is503 = code === 503;

  const defaults = {
    403: "You don't have permission to view this workspace. Your role may have changed, or the resource belongs to another tenant.",
    404: "The document or route you're looking for was moved, renamed, or deleted by another member.",
    500: "An internal error occurred on our side. Your data is safe — the incident has been logged and our team is on it.",
    503: "We're upgrading vector index shards to improve retrieval latency. Expected back online by 02:00 UTC.",
  };

  return (
    <div
      className={cn(
        "min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-12 max-w-lg mx-auto",
        className
      )}
      role="alert"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className={cn("w-8 h-8", meta.tone)} />
        <span className="font-mono text-6xl font-bold tracking-tighter text-primary/15 select-none">
          {code}
        </span>
      </div>

      {/* Illustration */}
      <div className="w-56 h-39 mb-4 shrink-0">
        {illustrations[code] || illustrations[404]}
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-primary">{meta.title}</h1>
      <p className="text-sm text-secondary leading-relaxed mt-2.5">
        {message || defaults[code]}
      </p>

      {incidentId && (
        <Badge variant={meta.badgeVariant} className="mt-3 font-mono">
          {incidentId}
        </Badge>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-7">
        {is500 ? (
          <Button variant="primary" onClick={onPrimaryAction} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Retry
          </Button>
        ) : is503 ? (
          <Button variant="primary" onClick={onPrimaryAction} leftIcon={<ExternalLink className="w-4 h-4" />}>
            View Status Page
          </Button>
        ) : (
          <Button variant="primary" onClick={onPrimaryAction} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        )}

        {is503 ? (
          <Button variant="secondary" onClick={onSecondaryAction} leftIcon={<Bell className="w-4 h-4" />}>
            Get Email Updates
          </Button>
        ) : (
          <Button variant="ghost" onClick={onSecondaryAction} leftIcon={<ExternalLink className="w-4 h-4" />}>
            {code === 404 ? "Search Knowledge Base" : code === 403 ? "Contact Workspace Owner" : "View Status Page"}
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * OfflineBanner — sticky contextual banner for network-disconnected state.
 * Persists across routes until connectivity is restored.
 */
export const OfflineBanner = ({ queuedChanges = 0, onRetry, className }) => (
  <div
    className={cn(
      "sticky top-16 z-30 w-full px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/25 backdrop-blur-md",
      "flex items-center justify-between gap-3 text-amber-600 dark:text-amber-400",
      className
    )}
    role="status"
    aria-live="polite"
  >
    <div className="flex items-center gap-2.5 min-w-0">
      <WifiOff className="w-4 h-4 shrink-0" />
      <p className="text-xs font-semibold truncate">
        You're offline — {queuedChanges} {queuedChanges === 1 ? 'change' : 'changes'} queued, will sync automatically
      </p>
    </div>
    <Button variant="ghost" size="sm" onClick={onRetry} className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 shrink-0">
      Retry Connection
    </Button>
  </div>
);
