import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, Check, Sparkles, HardDrive, UserPlus, 
  CheckCheck, AlertTriangle, Clock, ExternalLink 
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export const sampleNotifications = [
  {
    id: 'notif-1',
    title: 'Vector Ingestion Completed',
    description: 'Architecture_2026.pdf was successfully partitioned into 48 semantic chunks.',
    time: '5 mins ago',
    type: 'ai',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Storage Quota Alert',
    description: 'Workspace Acme Enterprise has reached 84% of total capacity.',
    time: '1 hour ago',
    type: 'warning',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Team Member Joined',
    description: 'Alex Rivera accepted your invitation to join Engineering Core.',
    time: 'Yesterday',
    type: 'team',
    unread: true,
  },
  {
    id: 'notif-4',
    title: 'SOC2 Compliance Scan',
    description: 'All zero-retention policies verified for AI query logs.',
    time: '3 days ago',
    type: 'system',
    unread: false,
  },
];

/**
 * NotificationCenter Component - Knowva App Shell
 */
export const NotificationCenter = ({
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread' | 'ai'
  const containerRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markItemRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filteredNotifications = notifications.filter(item => {
    if (filterTab === 'unread') return item.unread;
    if (filterTab === 'ai') return item.type === 'ai';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'ai':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'team':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Check className="w-3.5 h-3.5 text-brand-400" />;
    }
  };

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notification Center"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          "relative p-2 rounded-xl border transition-all duration-150 cursor-pointer text-secondary hover:text-primary",
          isOpen ? "bg-surface-hover border-brand-500/40 text-primary" : "bg-surface border-border-default hover:border-border-strong shadow-2xs"
        )}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-600 text-white text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-canvas shadow-xs animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Drawer */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-surface border border-border-default rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="p-4 pb-3 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-brand-500/15 text-brand-400 border border-brand-500/25">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Tabs Filter */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle bg-surface-hover/50 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'ai', label: 'AI Updates' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer font-medium",
                  filterTab === tab.id
                    ? "bg-surface text-primary shadow-xs font-semibold"
                    : "text-secondary hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted">
                No notifications in this category
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markItemRead(notif.id)}
                  className={cn(
                    "p-3.5 hover:bg-surface-hover/80 transition-colors cursor-pointer flex items-start gap-3 text-left",
                    notif.unread && "bg-brand-500/5"
                  )}
                >
                  <div className="p-2 rounded-lg bg-surface border border-border-subtle shrink-0 mt-0.5 shadow-2xs">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={cn("text-xs leading-snug truncate", notif.unread ? "font-bold text-primary" : "font-medium text-secondary")}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted font-mono whitespace-nowrap ml-2">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                      {notif.description}
                    </p>
                  </div>

                  {notif.unread && (
                    <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-border-subtle bg-surface text-center">
            <span className="text-[11px] text-muted font-mono">
              Notifications retained for 30 days
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
