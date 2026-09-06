import { useState } from 'react';
import {
  LayoutDashboard, FileText, Sparkles, Search, Settings,
  Smartphone, Tablet, Monitor, Laptop, Hand, Keyboard as KeyboardIcon,
  Check
} from 'lucide-react';
import { Badge } from './Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { cn } from '../../lib/utils';

/**
 * MobileBottomNav — live demonstration of the ≤md bottom navigation bar.
 * 5 destinations, 56px targets, center AI Chat raised FAB, badge dots.
 */
const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'docs', label: 'Docs', icon: FileText, badge: 3 },
  { id: 'chat', label: 'Chat', icon: Sparkles, isAi: true },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'settings', label: 'Settings', icon: Settings, badge: 0 },
];

export const MobileBottomNav = ({ activeId = 'chat', onNavigate, showLabels = true }) => {
  const [active, setActive] = useState(activeId);

  const handleNav = (id) => {
    setActive(id);
    onNavigate?.(id);
  };

  return (
    <nav
      aria-label="Primary mobile navigation"
      className={cn(
        "flex items-stretch justify-around bg-surface/95 backdrop-blur-md border-t border-border-default",
        "px-2 pb-[env(safe-area-inset-bottom)]"
      )}
      style={{ minWidth: 320 }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        const isCenter = item.isAi;

        if (isCenter) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              aria-label="AI Chat and RAG"
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center -mt-5 px-4 cursor-pointer group"
            >
              <span
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all",
                  "bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600",
                  isActive
                    ? "shadow-brand-500/40 scale-105 ring-2 ring-brand-400/50"
                    : "shadow-brand-500/25 group-hover:scale-105"
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </span>
              {showLabels && (
                <span className={cn("text-[10px] font-semibold mt-1", isActive ? "text-brand-400" : "text-secondary")}>
                  {item.label}
                </span>
              )}
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNav(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 py-2 min-w-[56px] cursor-pointer transition-colors",
              isActive ? "text-brand-500" : "text-muted hover:text-secondary"
            )}
          >
            <span className="relative">
              <Icon className="w-5 h-5" />
              {item.badge > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
                  aria-label={`${item.badge} pending`}
                >
                  {item.badge}
                </span>
              )}
            </span>
            {showLabels && (
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            )}
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-brand-500" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

/**
 * ResponsiveShowcase — breakpoint matrix + touch target audit + mobile keyboard spec
 */
const bpIcons = { Mobile: Smartphone, Tablet: Tablet, Laptop: Laptop, Desktop: Monitor };

export const ResponsiveShowcase = () => {
  const [touched, setTouched] = useState(null);

  const breakpoints = [
    { name: 'Mobile', range: '375–639px', tailwind: 'sm', sidebar: 'Off-canvas drawer + bottom nav', layout: 'Single-column feed', chat: 'Composer docks above keyboard' },
    { name: 'Tablet', range: '768–1023px', tailwind: 'md/lg', sidebar: 'Icon rail (68px)', layout: '2-column widgets', chat: 'History collapses to sheet' },
    { name: 'Laptop', range: '1024–1279px', tailwind: 'lg', sidebar: 'Persistent 260px', layout: '3-column dashboard', chat: 'History sidebar 280px' },
    { name: 'Desktop', range: '1280px+', tailwind: 'xl/2xl', sidebar: 'Persistent + 3-pane split', layout: 'Full split-view', chat: 'History + canvas + citations' },
  ];

  const touchTargets = [
    { el: 'Bottom nav item', spec: '56×56px', note: 'Including 10px label zone' },
    { el: 'Chat send button', spec: '44×44px', note: 'Visual 36px + 4px invisible pad' },
    { el: 'Table row action', spec: '44×44px', note: 'iconSm buttons + p-2 wrapper' },
    { el: 'Citation badge [1]', spec: '44×44px hit', note: '28px visual, hit area via ::before' },
    { el: 'Card kebab menu', spec: '44×44px', note: 'MoreVertical iconSm' },
  ];

  return (
    <div className="space-y-6">
      {/* Breakpoint Adaptation Matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Breakpoint Adaptation Matrix</CardTitle>
              <CardDescription>How every layout region adapts across the four Knowva viewport tiers</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border-default text-secondary">
                  <th className="px-3 py-2.5 font-semibold">Tier</th>
                  <th className="px-3 py-2.5 font-semibold">Range</th>
                  <th className="px-3 py-2.5 font-semibold">Prefix</th>
                  <th className="px-3 py-2.5 font-semibold">Sidebar</th>
                  <th className="px-3 py-2.5 font-semibold">Layout</th>
                  <th className="px-3 py-2.5 font-semibold">Chat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {breakpoints.map((bp) => {
                  const BIcon = bpIcons[bp.name];
                  return (
                    <tr key={bp.name} className="hover:bg-surface-hover/40 transition-colors">
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-2 font-semibold text-primary">
                          <BIcon className="w-4 h-4 text-brand-400" />
                          {bp.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono text-secondary">{bp.range}</td>
                      <td className="px-3 py-3"><Badge size="sm" variant="brand">{bp.tailwind}</Badge></td>
                      <td className="px-3 py-3 text-secondary">{bp.sidebar}</td>
                      <td className="px-3 py-3 text-secondary">{bp.layout}</td>
                      <td className="px-3 py-3 text-secondary">{bp.chat}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Device Frame with Bottom Nav */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Mobile Testbed — Bottom Navigation & Drawer</CardTitle>
              <CardDescription>Tap destinations: 56px targets, center Chat FAB, badge counts on Docs</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Phone frame */}
            <div className="mx-auto lg:mx-0 shrink-0">
              <div className="w-[340px] h-[600px] rounded-[2.5rem] border-[10px] border-slate-800 dark:border-slate-700 bg-canvas overflow-hidden relative shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 dark:bg-slate-700 rounded-b-2xl z-10" />

                {/* Status bar */}
                <div className="h-10 flex items-center justify-between px-6 pt-2 text-[10px] font-mono text-secondary">
                  <span>18:46</span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-1.5 rounded-sm bg-secondary" />
                    <span className="inline-block w-4 h-1.5 rounded-sm bg-border-default" />
                  </span>
                </div>

                {/* App content area */}
                <div className="px-4 pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-primary">Dashboard</div>
                      <div className="text-[10px] text-secondary">Acme Enterprise</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-brand-400">SC</span>
                    </div>
                  </div>
                  <div className="h-20 rounded-xl bg-gradient-to-br from-brand-600/15 via-purple-500/10 to-transparent border border-purple-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-brand-400">Mobile viewport preview</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-16 rounded-xl bg-surface border border-border-default p-2">
                        <div className="text-[8px] font-mono text-muted uppercase">Metric {i + 1}</div>
                        <div className="text-xs font-bold text-primary mt-1">—</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom nav docked with safe-area */}
                <div className="absolute bottom-0 left-0 right-0">
                  <MobileBottomNav activeId="dashboard" />
                </div>
              </div>
              <p className="text-center text-[10px] text-muted mt-2 font-mono">
                safe-area-inset-bottom respected · haptic on tab change
              </p>
            </div>

            {/* Mobile keyboard spec */}
            <div className="flex-1 space-y-4 min-w-0">
              <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-3">
                <div className="flex items-center gap-2">
                  <KeyboardIcon className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-primary">Chat Input — Keyboard Considerations</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Viewport uses interactive-widget=resizes-content — composer never hidden by keyboard",
                    "visualViewport listener pads composer bottom; scroll pins to newest message",
                    "Textarea auto-grows to 40vh max; font-size 1rem prevents iOS zoom-on-focus",
                    "Send button 44×44px replaces Enter-on-mobile; Enter sends / Shift+Enter newline on desktop",
                    "Suggestion chips auto-hide while keyboard open to reclaim vertical space",
                    "Safe-area insets applied to composer + bottom nav on notched devices",
                  ].map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-xs text-secondary">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Drawer spec */}
              <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-3">
                <div className="flex items-center gap-2">
                  <Hand className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-primary">Off-Canvas Drawer Behavior</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Edge-swipe (right → left, 80px threshold) or hamburger opens drawer at 60fps",
                    "Backdrop: black/60 + blur-xs; tap or ESC closes; body scroll locked",
                    "Focus trap cycles within drawer; route change auto-closes",
                    "Width 288px (w-72) max 85vw on small phones",
                  ].map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-xs text-secondary">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Touch Target Audit */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Touch Target Audit — Interactive Playground</CardTitle>
              <CardDescription>
                Minimum 44×44px (WCAG 2.5.5). Tap any control to see its hit-area footprint.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 p-4 rounded-xl bg-canvas border border-border-default">
            {touchTargets.map((t) => (
              <button
                key={t.el}
                type="button"
                onClick={() => setTouched(t.el)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <span
                  className={cn(
                    "w-11 h-11 rounded-lg border-2 border-dashed flex items-center justify-center transition-all",
                    touched === t.el
                      ? "border-brand-500 bg-brand-500/10 scale-110"
                      : "border-border-strong group-hover:border-brand-400/60"
                  )}
                  title="44×44px minimum target"
                >
                  <span className="text-[9px] font-mono font-bold text-secondary">44²</span>
                </span>
                <span className="text-[10px] font-semibold text-primary text-center max-w-[90px]">{t.el}</span>
                <span className="text-[9px] font-mono text-muted">{t.spec}</span>
              </button>
            ))}
          </div>
          {touched && (
            <p className="text-xs text-secondary text-center animate-in fade-in duration-150">
              <span className="font-semibold text-primary">{touched}</span> — visual element may render smaller,
              but the invisible hit boundary is padded to meet the 44px floor. {touchTargets.find(t => t.el === touched)?.note}.
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="success">WCAG 2.5.5 AAA</Badge>
            <Badge variant="info">Apple HIG 44pt</Badge>
            <Badge variant="brand">Material 48dp</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
