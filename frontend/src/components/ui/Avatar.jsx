import React from 'react';
import { Sparkles, Crown, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from './Tooltip';

/**
 * Avatar Component - Knowva Design System
 * 
 * Presence: 'online' | 'busy' | 'offline' | 'ai'
 * Roles: 'owner' | 'admin' | 'member'
 * Sizes: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export const Avatar = ({
  src,
  name = "User",
  size = 'md',
  presence,
  role,
  className
}) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const presenceSizes = {
    xs: "w-1.5 h-1.5 ring-1",
    sm: "w-2 h-2 ring-1.5",
    md: "w-2.5 h-2.5 ring-2",
    lg: "w-3 h-3 ring-2",
    xl: "w-4 h-4 ring-2",
  };

  const presenceColors = {
    online: "bg-emerald-500",
    busy: "bg-amber-500",
    offline: "bg-slate-400",
    ai: "bg-gradient-to-tr from-brand-500 to-purple-500 animate-pulse",
  };

  const roleBadges = {
    owner: <Crown className="w-2.5 h-2.5 text-amber-400" />,
    admin: <Shield className="w-2.5 h-2.5 text-brand-400" />,
  };

  return (
    <div className={cn("relative inline-block shrink-0 select-none", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold tracking-tight overflow-hidden border border-border-default bg-surface-hover text-primary shadow-xs",
          sizes[size] || sizes.md
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {/* Presence Indicator */}
      {presence && (
        <span
          aria-label={`Presence: ${presence}`}
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-surface",
            presenceSizes[size] || presenceSizes.md,
            presenceColors[presence] || presenceColors.offline
          )}
        />
      )}

      {/* Role Badge Indicator */}
      {role && roleBadges[role] && (
        <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-surface border border-border-default shadow-xs flex items-center justify-center">
          {roleBadges[role]}
        </span>
      )}
    </div>
  );
};

/**
 * AvatarGroup Component - Stacked Avatars with +N Overflow Counter
 */
export const AvatarGroup = ({
  users = [],
  max = 4,
  size = 'md',
  className
}) => {
  const visibleUsers = users.slice(0, max);
  const overflowCount = users.length - max;
  const remainingNames = overflowCount > 0 ? users.slice(max).map(u => u.name).join(', ') : '';

  return (
    <div className={cn("flex items-center -space-x-2.5 overflow-hidden p-0.5", className)}>
      {visibleUsers.map((user, idx) => (
        <Tooltip key={user.id || idx} content={`${user.name} (${user.role || 'Member'})`}>
          <div className="hover:z-20 hover:scale-105 transition-transform duration-150">
            <Avatar
              src={user.src}
              name={user.name}
              size={size}
              presence={user.presence}
              role={user.role}
              className="ring-2 ring-canvas"
            />
          </div>
        </Tooltip>
      ))}

      {overflowCount > 0 && (
        <Tooltip content={`+${overflowCount} more: ${remainingNames}`}>
          <div className="relative inline-flex items-center justify-center rounded-full bg-surface-hover border border-border-default text-secondary font-mono font-semibold text-xs h-10 w-10 ring-2 ring-canvas select-none hover:z-20 hover:scale-105 transition-transform">
            +{overflowCount}
          </div>
        </Tooltip>
      )}
    </div>
  );
};
