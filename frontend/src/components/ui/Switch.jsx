
import { cn } from '../../lib/utils';

/**
 * Switch Component - Knowva Design System
 *
 * Accessible toggle with checked / unchecked states, disabled and loading modes.
 */
export const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  locked = false,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: { track: "w-8 h-4.5", knob: "w-3.5 h-3.5", translate: "translate-x-3.5" },
    md: { track: "w-10 h-5.5", knob: "w-4.5 h-4.5", translate: "translate-x-4.5" },
  };

  const s = sizes[size] || sizes.md;

  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled || locked}
      onClick={() => !disabled && !locked && onChange?.(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full border transition-all duration-200 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        s.track,
        checked
          ? "bg-brand-600 border-brand-500/50 shadow-xs shadow-brand-500/25"
          : "bg-surface-hover border-border-strong",
        (disabled || locked) && "opacity-60 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 rounded-full bg-white shadow-sm transition-transform duration-200",
          s.knob,
          checked ? s.translate : "translate-x-0"
        )}
      />
    </button>
  );

  if (!label && !description) return control;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary select-none">{label}</span>
          {locked && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-semibold">
              Required
            </span>
          )}
        </div>
        {description && <p className="text-xs text-secondary leading-relaxed">{description}</p>}
      </div>
      {control}
    </div>
  );
};

Switch.displayName = 'Switch';
