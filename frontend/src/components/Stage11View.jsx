import { useState } from 'react';
import {
  User, CreditCard, Database, ShieldCheck,
  Lock, Terminal, Zap
} from 'lucide-react';
import { AccountSettingsPage } from './settings/AccountSettingsPage';
import { settingsSpecs } from '../design-system/settingsSpecs';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { cn } from '../lib/utils';

export const Stage11View = ({ theme, onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'specs'

  const subTabs = [
    { id: 'live', label: '1. Live Settings Experience', icon: User },
    { id: 'specs', label: '2. Security & Billing Specs', icon: Database },
  ];

  const specCards = [
    {
      icon: Lock,
      title: "Password & 2FA Policy",
      items: [
        `Minimum ${settingsSpecs.passwordPolicy.minLength} chars · uppercase · number · special`,
        `Entropy scoring: ${settingsSpecs.passwordPolicy.entropyLabels.join(' → ')}`,
        "TOTP primary · SMS fallback · WebAuthn (Enterprise)",
        `${settingsSpecs.twoFactor.recoveryCodesTotal} single-use recovery codes · regenerable`,
      ],
    },
    {
      icon: ShieldCheck,
      title: "Session & SSO Rules",
      items: [
        "Password change revokes all other sessions instantly",
        "Connected accounts: Google · GitHub · Okta SAML (Enterprise)",
        "Per-device session list with individual revoke controls",
        "SSO scopes shown inline (openid, read:user, …)",
      ],
    },
    {
      icon: CreditCard,
      title: "Billing Rules",
      items: [
        "Upgrades pro-rated immediately; downgrades at cycle end",
        "Seat meter warning thresholds: 70% amber · 90% red",
        "Cards tokenized — raw PAN/CVC never stored",
        "Invoice history with PDF export per row + bulk ZIP",
      ],
    },
    {
      icon: Terminal,
      title: "API Key Governance",
      items: [
        `Scopes: Read / Write / Admin (admin implies read+write)`,
        "SHA-256 hashed at rest · plaintext shown once at creation",
        `Limits: ${settingsSpecs.apiKeys.rateLimits.perKey} · ${settingsSpecs.apiKeys.rateLimits.perWorkspace}`,
        "HMAC-SHA256 request signing · 90-day rotation policy",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border-default">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-brand-600 text-white shadow-xs font-semibold"
                    : "text-secondary hover:text-primary hover:bg-surface-hover"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-secondary")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <Badge variant="brand" dot>Stage 11: Account Settings</Badge>
      </div>

      {/* Tab 1: Live Experience */}
      {activeTab === 'live' && (
        <AccountSettingsPage theme={theme} onThemeChange={onToggleTheme} />
      )}

      {/* Tab 2: Specs */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specCards.map((card) => (
              <div key={card.title} className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <card.icon className="w-4 h-4 text-brand-400" />
                  {card.title}
                </h3>
                <ul className="text-xs text-secondary space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-500/70 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Integration map */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-500" />
                <div>
                  <CardTitle>Cross-Stage Integration Map</CardTitle>
                  <CardDescription>Where Stage 11 components hook into the wider Knowva product</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: "Stage 5 · Pricing Page", detail: "Plan cards mirror marketingAuthSpecs pricingTiers (Starter $0 / Pro $19 / Enterprise $49)" },
                  { label: "Stage 10 · RBAC Matrix", detail: "billing_access permission gates the Billing tab for non-Owner roles" },
                  { label: "Stage 10 · Audit Log", detail: "Every 2FA, key, plan, and password change emits audit events" },
                  { label: "Stage 8 · AI Chat", detail: "Admin-scoped keys power POST /v1/chat/completions pipelines" },
                  { label: "Stage 4 · App Shell", detail: "Preferences theme toggle syncs with global dark/light state" },
                  { label: "Stage 6 · Dashboard", detail: "Seat usage meter feeds workspace capacity forecasting widgets" },
                ].map((m) => (
                  <div key={m.label} className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-1">
                    <p className="text-xs font-bold text-primary">{m.label}</p>
                    <p className="text-[11px] text-secondary leading-relaxed">{m.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Switch back to live */}
          <div className="flex justify-center pt-2">
            <Button
              variant="ai"
              onClick={() => setActiveTab('live')}
              leftIcon={<User className="w-4 h-4" />}
            >
              Open Live Settings Testbed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
