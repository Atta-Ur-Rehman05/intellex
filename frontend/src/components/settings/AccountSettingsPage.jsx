import { useState } from 'react';
import { User, Sliders, CreditCard, Key, ShieldCheck } from 'lucide-react';
import { ProfileSecurityTab } from './ProfileSecurityTab';
import { PreferencesTab } from './PreferencesTab';
import { BillingTab } from './BillingTab';
import { ApiKeysTab } from './ApiKeysTab';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

const tabs = [
  { key: 'profile', label: 'Profile & Security', icon: User },
  { key: 'preferences', label: 'Preferences', icon: Sliders },
  { key: 'billing', label: 'Billing & Plans', icon: CreditCard },
  { key: 'api', label: 'Developer API Keys', icon: Key },
];

export const AccountSettingsPage = ({ theme, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Account Settings</h1>
          <p className="text-xs text-secondary mt-1">
            Manage your identity, security, billing, and developer access across Knowva.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" dot>2FA Active</Badge>
          <Badge variant="brand">Team Pro · 12 seats</Badge>
        </div>
      </div>

      {/* Modular Tab Rail */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-subtle border border-border-default overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "bg-surface-elevated text-primary shadow-sm"
                  : "text-muted hover:text-secondary hover:bg-surface-elevated/50"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-brand-500" : "text-muted")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-200">
            <ProfileSecurityTab />
          </div>
        )}
        {activeTab === 'preferences' && (
          <div className="animate-in fade-in duration-200">
            <PreferencesTab theme={theme} onThemeChange={onThemeChange} />
          </div>
        )}
        {activeTab === 'billing' && (
          <div className="animate-in fade-in duration-200">
            <BillingTab />
          </div>
        )}
        {activeTab === 'api' && (
          <div className="animate-in fade-in duration-200">
            <ApiKeysTab />
          </div>
        )}
      </div>

      {/* Footer compliance note */}
      <div className="flex items-center gap-2 justify-center pt-2 pb-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <p className="text-[11px] text-muted">
          SOC 2 Type II · GDPR-ready · Every settings change is written to your workspace audit log.
        </p>
      </div>
    </div>
  );
};
