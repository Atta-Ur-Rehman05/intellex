import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Search, Bell, Sun, Moon, Sparkles, 
  ChevronRight, User, Settings, LogOut, Shield, 
  Check, Command, Laptop, ExternalLink, HelpCircle 
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { cn } from '../../lib/utils';

/**
 * TopNav Component - Knowva App Shell
 */
export const TopNav = ({
  breadcrumbItems = [{ id: 'dashboard', label: 'Dashboard' }],
  onOpenCommandPalette,
  onToggleMobileDrawer,
  theme = 'dark',
  onToggleTheme,
  currentUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.ai',
    role: 'Owner',
    presence: 'online'
  },
  className
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userPresence, setUserPresence] = useState(currentUser.presence || 'online');
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "h-16 px-4 sm:px-6 bg-surface/85 backdrop-blur-md border-b border-border-default flex items-center justify-between gap-4 select-none z-20",
        className
      )}
    >
      {/* Left Area: Mobile Drawer Trigger + Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3 truncate">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileDrawer}
          className="md:hidden p-2 rounded-xl border border-border-default hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
          aria-label="Open mobile navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs Trail */}
        <div className="hidden sm:flex items-center truncate">
          <Breadcrumbs
            items={breadcrumbItems}
            showHomeIcon={false}
          />
        </div>

        {/* Mobile View Title Fallback */}
        <div className="sm:hidden font-bold text-sm text-primary truncate">
          {breadcrumbItems[breadcrumbItems.length - 1]?.label || 'Knowva'}
        </div>
      </div>

      {/* Right Area: Search Trigger + Notifications + Theme + Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Command Palette Trigger Button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-default bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-all duration-150 cursor-pointer shadow-2xs group text-xs"
        >
          <Search className="w-3.5 h-3.5 text-muted group-hover:text-primary" />
          <span className="hidden md:inline">Quick Search...</span>
          <kbd className="inline-flex items-center px-1.5 py-0.2 rounded bg-surface-hover border border-border-subtle text-[10px] font-mono text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Notification Center Bell */}
        <NotificationCenter />

        {/* Quick Theme Toggle */}
        <Tooltip content={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="bottom">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-border-default bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer shadow-2xs"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </Tooltip>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer border border-transparent hover:border-border-default"
          >
            <Avatar
              name={currentUser.name}
              size="sm"
              presence={userPresence}
            />
            <span className="hidden lg:inline text-xs font-semibold text-primary truncate max-w-[100px]">
              {currentUser.name}
            </span>
          </button>

          {/* User Profile Popover */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border-default rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md">
              {/* Profile Card Header */}
              <div className="p-3 border-b border-border-subtle flex items-center gap-3">
                <Avatar name={currentUser.name} size="md" presence={userPresence} />
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-primary truncate">{currentUser.name}</span>
                    <Badge variant="brand" size="sm">{currentUser.role}</Badge>
                  </div>
                  <p className="text-[11px] text-muted truncate mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="p-2 border-b border-border-subtle space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-semibold px-1">
                  Availability
                </span>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[
                    { id: 'online', label: 'Online', color: 'bg-emerald-500' },
                    { id: 'busy', label: 'Busy', color: 'bg-amber-500' },
                    { id: 'offline', label: 'Away', color: 'bg-slate-400' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setUserPresence(st.id)}
                      className={cn(
                        "px-2 py-1 rounded-md text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer justify-center",
                        userPresence === st.id ? "bg-surface-hover font-semibold text-primary border border-border-subtle" : "text-secondary hover:text-primary"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", st.color)} />
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="py-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full px-3 py-2 text-xs text-primary hover:bg-surface-hover rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-secondary" />
                  <span>Profile & Security</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full px-3 py-2 text-xs text-primary hover:bg-surface-hover rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-secondary" />
                  <span>Preferences</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full px-3 py-2 text-xs text-primary hover:bg-surface-hover rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Command className="w-3.5 h-3.5 text-secondary" />
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-muted">?</kbd>
                </button>
              </div>

              {/* Log Out Destructive Action */}
              <div className="pt-1 mt-1 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Knowva</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
