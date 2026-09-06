import { useState } from 'react';
import {
  Code2, Accessibility, Keyboard, Check, Copy, Landmark,
  Palette, Ruler
} from 'lucide-react';
import { Badge } from './Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { edgeCaseSpecs } from '../../design-system/edgeCaseSpecs';
import { cn } from '../../lib/utils';

/**
 * DeveloperHandoffPanel — token naming convention, ARIA landmarks,
 * screen reader rules, and the keyboard shortcuts cheat sheet.
 */
export const DeveloperHandoffPanel = () => {
  const [copied, setCopied] = useState(null);
  const [activeSection, setActiveSection] = useState('tokens');

  const copy = (text, key) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  const sections = [
    { id: 'tokens', label: 'Token Convention', icon: Palette },
    { id: 'aria', label: 'ARIA Landmarks', icon: Accessibility },
    { id: 'shortcuts', label: 'Keyboard Cheat Sheet', icon: Keyboard },
    { id: 'sr', label: 'Screen Reader Rules', icon: Landmark },
  ];

  const tokenExample = `:root {
  /* Naming: --{category}-{concept}-{variant}-{state?} */
  --color-surface-primary: #ffffff;
  --color-surface-primary-dark: #0f172a;
  --color-brand-500: #6366f1;
  --color-feedback-error: #dc2626;

  --spacing-xs: 2px;   /* 8pt scale only */
  --spacing-sm: 4px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --radius-md: 8px;
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08);
  --font-sans: 'Inter', ...;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --z-modal: 50;
}`;

  return (
    <div className="space-y-6">
      {/* Section switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-subtle border border-border-default overflow-x-auto no-scrollbar">
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "bg-surface-elevated text-primary shadow-sm font-semibold"
                  : "text-muted hover:text-secondary hover:bg-surface-elevated/50"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive && "text-brand-500")} />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ============ TOKEN CONVENTION ============ */}
      {activeSection === 'tokens' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-brand-500" />
                <div>
                  <CardTitle>CSS Token Naming Convention</CardTitle>
                  <CardDescription>
                    Pattern: <code className="font-mono text-brand-400 text-xs">--{'{category}'}-{'{concept}'}-{'{variant}'}-{'{state?'}</code>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Token table */}
                <div className="space-y-2.5">
                  {edgeCaseSpecs.handoff.tokenNaming.categories.map((cat) => (
                    <button
                      key={cat.example}
                      type="button"
                      onClick={() => copy(cat.example, cat.example)}
                      className="w-full flex items-start justify-between gap-3 p-3 rounded-xl bg-canvas border border-border-default hover:border-brand-500/40 transition-all text-left cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <code className="text-xs font-mono font-semibold text-primary group-hover:text-brand-400 transition-colors block truncate">
                          {cat.example}
                        </code>
                        <p className="text-[11px] text-secondary mt-1">{cat.mapsTo}</p>
                        <p className="text-[10px] text-muted mt-0.5">{cat.note}</p>
                      </div>
                      <span className="shrink-0 mt-0.5">
                        {copied === cat.example ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted group-hover:text-secondary transition-colors" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Live CSS example */}
                <div className="rounded-xl bg-slate-950 border border-slate-700/60 overflow-hidden h-fit">
                  <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-700/60 bg-slate-900">
                    <span className="text-[10px] font-mono text-slate-400">tokens.css</span>
                    <button
                      type="button"
                      onClick={() => copy(tokenExample, 'full-block')}
                      className="text-[10px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copied === 'full-block' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === 'full-block' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-4 text-[10.5px] leading-relaxed text-slate-300 font-mono overflow-x-auto"><code>{tokenExample}</code></pre>
                </div>
              </div>

              {/* Rules */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <p className="text-xs font-bold text-primary">Review Rules (fail the PR if violated)</p>
                <ul className="space-y-1.5">
                  {edgeCaseSpecs.handoff.tokenNaming.rules.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-secondary">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============ ARIA LANDMARKS ============ */}
      {activeSection === 'aria' && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>ARIA Roles & Screen Reader Landmarks</CardTitle>
                <CardDescription>
                  Every route announces: banner → complementary → main → contentinfo with skip-link first
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[680px]">
                <thead>
                  <tr className="border-b border-border-default text-secondary">
                    <th className="px-3 py-2.5 font-semibold">Element</th>
                    <th className="px-3 py-2.5 font-semibold">Role</th>
                    <th className="px-3 py-2.5 font-semibold">Announced As</th>
                    <th className="px-3 py-2.5 font-semibold">Shortcut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {edgeCaseSpecs.handoff.ariaLandmarks.map((l) => (
                    <tr key={l.element} className="hover:bg-surface-hover/40 transition-colors">
                      <td className="px-3 py-3 font-mono text-[11px] text-primary">{l.element}</td>
                      <td className="px-3 py-3">
                        <Badge size="sm" variant="brand">{l.role}</Badge>
                      </td>
                      <td className="px-3 py-3 text-secondary">{l.label}</td>
                      <td className="px-3 py-3">
                        {l.shortcuts && l.shortcuts !== 'none' ? (
                          <kbd className="px-1.5 py-0.5 rounded bg-surface-hover border border-border-default font-mono text-[10px] text-primary">
                            {l.shortcuts}
                          </kbd>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ KEYBOARD CHEAT SHEET ============ */}
      {activeSection === 'shortcuts' && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-brand-500" />
                <div>
                  <CardTitle>Keyboard Shortcuts Cheat Sheet</CardTitle>
                  <CardDescription>
                    Open anywhere with <kbd className="px-1.5 py-0.5 rounded bg-surface-hover border border-border-default font-mono text-[10px]">?</kbd> (Shift+/) when no input is focused
                  </CardDescription>
                </div>
              </div>
              <Badge variant="info" dot>Press ? to open</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {edgeCaseSpecs.handoff.keyboardShortcuts.map((sc, idx) => (
                <div
                  key={sc.keys}
                  className={cn(
                    "flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg transition-colors",
                    idx % 2 === 0 ? "bg-transparent" : "bg-surface-hover/30",
                    "hover:bg-surface-hover/60"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <kbd className="shrink-0 px-2 py-1 rounded-md bg-surface border border-border-default border-b-2 border-b-border-strong font-mono text-[11px] font-bold text-primary shadow-xs select-none">
                      {sc.keys}
                    </kbd>
                    <span className="text-xs text-secondary truncate">{sc.action}</span>
                  </div>
                  <span className="text-[9px] font-mono text-muted uppercase tracking-wide shrink-0">{sc.context}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/20 flex items-start gap-2.5">
              <Ruler className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <p className="text-xs text-secondary leading-relaxed">
                Shortcuts using single letters (c, n, g-d) are suppressed while any input,
                textarea, or contenteditable region is focused. ESC always closes the topmost
                layer first: modal → drawer → palette → dropdown.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ SCREEN READER RULES ============ */}
      {activeSection === 'sr' && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Screen Reader Rules</CardTitle>
                <CardDescription>NVDA / JAWS / VoiceOver conformance checklist — blocks release if red</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {edgeCaseSpecs.handoff.screenReader.rules.map((rule, i) => (
              <div key={rule} className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-border-default">
                <span className="shrink-0 w-6 h-6 rounded-lg bg-brand-500/10 border border-brand-500/25 flex items-center justify-center font-mono text-[10px] font-bold text-brand-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xs text-secondary leading-relaxed pt-0.5">{rule}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="success">NVDA 2024.1</Badge>
              <Badge variant="success">JAWS 2024</Badge>
              <Badge variant="success">VoiceOver iOS 17</Badge>
              <Badge variant="success">TalkBack 14</Badge>
              <Badge variant="brand">WCAG 2.1 AA target</Badge>
              <Badge variant="info">AAA aspirational</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeveloperHandoffPanel;
