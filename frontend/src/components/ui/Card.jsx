import { cn } from '../../lib/utils';

/**
 * Card Component - Knowva Design System
 * 
 * Variants:
 * - standard: Flat surface with subtle border
 * - interactive: Clickable with hover lift and border highlight
 * - ai: Gradient border glow and subtle intelligence backdrop
 * - elevated: Elevated shadow for modals and popovers
 */
export const Card = ({
  children,
  variant = 'standard',
  className,
  onClick,
  ...props
}) => {
  const isClickable = Boolean(onClick);

  const variants = {
    standard: "bg-surface border-border-default shadow-xs",
    interactive: "bg-surface border-border-default hover:border-brand-500/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200",
    ai: "bg-surface border border-purple-500/30 shadow-lg shadow-purple-500/5 relative overflow-hidden ai-border-glow",
    elevated: "bg-elevated border-border-default shadow-lg",
    subtle: "bg-subtle/50 border-border-subtle shadow-none",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border transition-colors",
        variants[variant] || variants.standard,
        isClickable && variant === 'standard' && "cursor-pointer hover:border-border-strong",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("p-5 pb-3 flex flex-col space-y-1.5", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn("text-base font-semibold leading-none tracking-tight text-primary", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn("text-xs text-secondary leading-relaxed", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn("p-5 pt-0", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn("p-5 pt-0 flex items-center justify-between border-t border-border-subtle mt-4", className)} {...props}>
    {children}
  </div>
);
