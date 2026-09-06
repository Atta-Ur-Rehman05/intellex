import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Sparkles, Settings, Sparkles as LogoIcon,
  Sun, Moon, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { cn } from '../../lib/utils.js';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/documents', label: 'Documents', icon: FileText },
  { to: '/app/chat', label: 'AI Chat', icon: Sparkles, isAi: true },
  { to: '/app/settings', label: 'Settings', icon: Settings, end: true },
];

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { resolved, setMode } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRouteChange = () => setIsMobileNavOpen(false);

  const SidebarContent = (
    <>
      {/* Brand header */}
      <div className="p-4 flex items-center gap-2.5 border-b border-border-subtle">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <LogoIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-primary tracking-tight">Knowva</div>
          <div className="text-[10px] text-muted font-mono truncate">AI Knowledge Workspace</div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Primary">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={handleRouteChange}
              className={({ isActive }) =>
                cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 group",
                  isActive
                    ? item.isAi
                      ? "bg-gradient-to-r from-brand-600/15 via-purple-600/15 to-pink-600/15 text-brand-400 font-semibold border border-purple-500/30 shadow-xs"
                      : "bg-brand-600 text-white font-semibold shadow-xs"
                    : "text-secondary hover:text-primary hover:bg-surface-hover"
                )
              }
            >
              <Icon className={cn("w-4 h-4 shrink-0", item.isAi && "text-purple-400")} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: user profile menu */}
      <div className="p-3 border-t border-border-subtle" ref={profileRef}>
        <button
          type="button"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer text-left"
        >
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-primary truncate">{user?.name || 'User'}</div>
            <div className="text-[10px] text-muted truncate">{user?.email}</div>
          </div>
          <ChevronRight className={cn("w-3.5 h-3.5 text-muted transition-transform", isProfileOpen && "rotate-90")} />
        </button>

        {isProfileOpen && (
          <div className="mt-1.5 p-1.5 rounded-xl bg-surface border border-border-default shadow-lg animate-in fade-in zoom-in-95 duration-150" role="menu">
            <button
              type="button"
              role="menuitem"
              onClick={() => { setIsProfileOpen(false); navigate('/app/settings'); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen w-full flex overflow-hidden bg-canvas text-primary">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 h-full bg-surface border-r border-border-default flex-col select-none">
        {SidebarContent}
      </aside>

      {/* Mobile off-canvas drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 bg-surface border-r border-border-default flex flex-col animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute top-3.5 right-3 p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover z-10 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="h-14 px-4 sm:px-6 bg-surface/85 backdrop-blur-md border-b border-border-default flex items-center justify-between gap-3 z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-xl border border-border-default text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Mobile brand */}
            <div className="md:hidden flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white">
                <LogoIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-primary">Knowva</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-border-default bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer shadow-2xs"
              aria-label="Toggle theme"
            >
              {resolved === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Connected</span>
            </div>
          </div>
        </header>

        {/* Route content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
