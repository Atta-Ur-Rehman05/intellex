import { FileUp, Sparkles, RotateCcw, Settings, UserPlus, Copy, ExternalLink, BookOpen, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

/**
 * EmptyState Component - Knowva Design System
 *
 * Illustrated, informative, action-oriented placeholder for zero-data surfaces.
 * Anatomy: illustration (140px) → title → context → primary + secondary actions.
 */
const illustrations = {
  'no-documents': (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden="true">
      <rect x="28" y="18" width="88" height="72" rx="10" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <path d="M52 100 L92 100" className="stroke-border-strong" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 108 L100 108" className="stroke-border-subtle" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 42 L100 42 M44 56 L88 56 M44 70 L96 70" className="stroke-border-default" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 5" />
      <circle cx="118" cy="78" r="20" className="fill-brand-500/10 stroke-brand-500/40" strokeWidth="2" />
      <path d="M110 78 L126 78 M118 70 L118 86" className="stroke-brand-500" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  'no-chats': (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden="true">
      <rect x="36" y="16" width="88" height="56" rx="14" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <path d="M56 88 L56 76 L76 76" className="fill-surface-hover stroke-border-strong" strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 34 L110 34 M50 46 L96 46" className="stroke-border-default" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 5" />
      <circle cx="124" cy="42" r="14" className="fill-brand-500/10 stroke-brand-500/40" strokeWidth="2" />
      <path d="M124 36 C121 36 119 38 119 40.5 C119 42 120 43 121 44 C122 44.5 122 45 122 46 L126 46 C126 45 126 44.5 127 44 C128 43 129 42 129 40.5 C129 38 127 36 124 36 Z" className="fill-brand-500" />
      <path d="M122 48 L126 48" className="stroke-brand-500" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 100 L116 100" className="stroke-border-subtle" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 6" />
    </svg>
  ),
  'no-search-results': (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden="true">
      <circle cx="66" cy="50" r="26" className="fill-surface-hover stroke-border-strong" strokeWidth="2.5" />
      <path d="M86 70 L102 86" className="stroke-border-strong" strokeWidth="4" strokeLinecap="round" />
      <path d="M54 44 Q66 32 78 44" className="stroke-border-default" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 56 Q64 66 80 56" className="stroke-border-default" strokeWidth="2" strokeLinecap="round" />
      <circle cx="120" cy="38" r="12" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="2" />
      <path d="M120 31 L120 38 M120 41 L120 43" className="stroke-amber-500" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M112 90 L148 90" className="stroke-border-subtle" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6" />
      <path d="M118 99 L142 99" className="stroke-border-subtle" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6" />
    </svg>
  ),
  'no-notifications': (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden="true">
      <path d="M64 28 C50 28 44 40 44 54 L44 66 L36 80 L92 80 L84 66 L84 54 C84 40 78 28 64 28 Z" className="fill-surface-hover stroke-border-strong" strokeWidth="2" strokeLinejoin="round" />
      <path d="M74 92 Q74 102 64 102 Q54 102 54 92" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <path d="M104 48 L136 80 M136 48 L104 80" className="stroke-red-400/70" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="112" cy="30" r="3" className="fill-brand-400" />
      <circle cx="126" cy="22" r="2" className="fill-brand-300" />
      <circle cx="40" cy="34" r="2" className="fill-amber-400" />
    </svg>
  ),
  'no-team-members': (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden="true">
      <circle cx="56" cy="40" r="14" className="fill-surface-hover stroke-border-strong" strokeWidth="2" />
      <path d="M32 96 Q32 66 56 66 Q80 66 80 96" className="fill-surface-hover stroke-border-strong" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="98" cy="46" r="10" className="fill-surface-hover/60 stroke-border-default" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M82 94 Q84 72 98 72 Q112 72 114 94" className="fill-none stroke-border-default" strokeWidth="2" strokeDasharray="3 3" strokeLinejoin="round" />
      <circle cx="126" cy="78" r="16" className="fill-brand-500/10 stroke-brand-500/40" strokeWidth="2" />
      <path d="M119 78 L124 83 L133 73" className="stroke-brand-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const actionIcons = {
  'UploadCloud': FileUp,
  'Sparkles': Sparkles,
  'RotateCcw': RotateCcw,
  'Settings': Settings,
  'UserPlus': UserPlus,
  'Copy': Copy,
  'ExternalLink': ExternalLink,
  'BookOpen': BookOpen,
  'HelpCircle': HelpCircle,
};

export const EmptyState = ({
  illustration = 'no-documents',
  title,
  description,
  primaryAction,
  secondaryAction,
  size = 'md',
  className,
}) => {
  const PrimaryIcon = primaryAction?.icon ? actionIcons[primaryAction.icon] : null;
  const SecondaryIcon = secondaryAction?.icon ? actionIcons[secondaryAction.icon] : null;
  const sizes = {
    sm: { box: 'w-28 h-20', title: 'text-sm', desc: 'text-xs' },
    md: { box: 'w-40 h-30', title: 'text-base', desc: 'text-xs' },
    lg: { box: 'w-52 h-39', title: 'text-lg', desc: 'text-sm' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-10 px-6 max-w-md mx-auto",
        className
      )}
      role="region"
      aria-label={title}
    >
      {/* Illustration */}
      <div className={cn(s.box, "mb-5 shrink-0")}>
        {illustrations[illustration] || illustrations['no-documents']}
      </div>

      {/* Title & Context */}
      <h4 className={cn(s.title, "font-bold text-primary tracking-tight")}>{title}</h4>
      {description && (
        <p className={cn(s.desc, "text-secondary leading-relaxed mt-1.5 max-w-sm")}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          {primaryAction && (
            <Button
              variant={primaryAction.variant || 'primary'}
              size="sm"
              onClick={primaryAction.onClick}
              leftIcon={PrimaryIcon && <PrimaryIcon className="w-3.5 h-3.5" />}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'ghost'}
              size="sm"
              onClick={secondaryAction.onClick}
              leftIcon={SecondaryIcon && <SecondaryIcon className="w-3.5 h-3.5" />}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
