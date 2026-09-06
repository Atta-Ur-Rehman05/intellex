import { useState } from 'react';
import {
  Sun, Moon, Monitor, Languages, Bell, Mail, Calendar,
  Zap, Shield, CreditCard, AtSign, FileText, Sparkles,
  ShieldCheck, Check, Inbox, Save
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { useToast } from '../ui/Toast';
import { settingsSpecs } from '../../design-system/settingsSpecs';
import { cn } from '../../lib/utils';

const themeIcons = { light: Sun, dark: Moon, system: Monitor };
const notifIcons = {
  at: AtSign, doc: FileText, ai: Sparkles, shield: ShieldCheck,
  calendar: Calendar, zap: Zap, billing: CreditCard, security: Shield,
};

export const PreferencesTab = ({ onThemeChange }) => {
  const { toast } = useToast();
  const spec = settingsSpecs;

  const [appearance, setAppearance] = useState('dark');
  const [language, setLanguage] = useState('en-US');
  const [channelEnabled, setChannelEnabled] = useState({ inapp: true, email: true });
  const [notifState, setNotifState] = useState(() => {
    const initial = {};
    Object.entries(spec.notifications.items).forEach(([channel, items]) => {
      items.forEach((it) => { initial[`${channel}:${it.id}`] = it.enabled; });
    });
    return initial;
  });

  const applyAppearance = (mode) => {
    setAppearance(mode);
    onThemeChange?.(mode === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode);
    toast({
      title: `Appearance: ${spec.appearance.themes.find((t) => t.id === mode)?.label}`,
      description: mode === 'system' ? "Syncing with your OS appearance preference." : "Theme applied across Knowva.",
      type: "success",
    });
  };

  const toggleChannel = (channelId, next) => {
    setChannelEnabled((prev) => ({ ...prev, [channelId]: next }));
    if (!next) {
      setNotifState((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (key.startsWith(`${channelId}:`)) updated[key] = false;
        });
        return updated;
      });
    } else {
      setNotifState((prev) => {
        const updated = { ...prev };
        spec.notifications.items[channelId].forEach((it) => {
          updated[`${channelId}:${it.id}`] = true;
        });
        return updated;
      });
    }
    const label = spec.notifications.channels.find((c) => c.id === channelId)?.label;
    toast({ title: `${label} ${next ? 'enabled' : 'muted'}`, type: next ? "success" : "info" });
  };

  const toggleItem = (channelId, itemId, locked) => {
    if (locked) return;
    setNotifState((prev) => ({ ...prev, [`${channelId}:${itemId}`]: !prev[`${channelId}:${itemId}`] }));
  };

  return (
    <div className="space-y-6">
      {/* ============ APPEARANCE ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Choose how Knowva looks. System Sync follows your OS setting.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {spec.appearance.themes.map((t) => {
              const TIcon = themeIcons[t.id];
              const isActive = appearance === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyAppearance(t.id)}
                  className={cn(
                    "relative p-4 rounded-xl border text-left transition-all cursor-pointer space-y-3",
                    isActive
                      ? "bg-brand-500/8 border-brand-500/50 shadow-xs ring-1 ring-brand-500/30"
                      : "bg-surface border-border-default hover:border-border-strong"
                  )}
                  aria-pressed={isActive}
                >
                  {/* Mini preview */}
                  <div className={cn(
                    "h-14 rounded-lg border overflow-hidden flex flex-col",
                    t.id === 'light' ? "bg-slate-100 border-slate-300" : t.id === 'dark' ? "bg-slate-950 border-slate-700" : "bg-gradient-to-r from-slate-100 to-slate-950 border-slate-400"
                  )}>
                    <div className={cn(
                      "h-3.5 border-b flex items-center gap-1 px-1.5",
                      t.id === 'light' ? "bg-white border-slate-200" : t.id === 'dark' ? "bg-slate-900 border-slate-800" : "border-slate-300"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", t.id === 'light' ? "bg-slate-300" : "bg-slate-700")} />
                      <span className={cn("w-1.5 h-1.5 rounded-full", t.id === 'light' ? "bg-slate-300" : "bg-slate-700")} />
                    </div>
                    <div className="flex-1 flex items-end gap-1 p-1.5">
                      <span className={cn("w-2/3 h-2 rounded-sm", t.id === 'light' ? "bg-brand-500" : "bg-brand-500")} />
                      <span className={cn("w-1/3 h-2 rounded-sm", t.id === 'light' ? "bg-slate-300" : "bg-slate-700")} />
                      <span className={cn("w-1/4 h-2 rounded-sm", t.id === 'light' ? "bg-amber-400" : "bg-amber-500")} />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <TIcon className={cn("w-4 h-4 shrink-0", isActive ? "text-brand-400" : "text-secondary")} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-primary">{t.label}</p>
                        <p className="text-[11px] text-muted leading-snug">{t.description}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="p-1 rounded-full bg-brand-500 text-white shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ============ LANGUAGE ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Interface language for menus, AI responses, and date formats</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <Select
              label="Interface Language"
              value={language}
              onChange={(v) => {
                setLanguage(v);
                toast({ title: "Language updated", description: "Interface switched successfully.", type: "success" });
              }}
              options={spec.languages}
              helperText="AI chat replies continue in whatever language you write in."
            />
            <div className="p-3.5 rounded-xl bg-subtle/50 border border-border-subtle space-y-1.5">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">Live Preview</p>
              <p className="text-xs text-primary font-semibold">Documents · Chats · Settings</p>
              <p className="text-xs text-secondary">Last synced: 6 Sept 2026, 18:04</p>
              <div className="flex gap-1.5 pt-1">
                <Badge variant="brand" size="sm">EN</Badge>
                <Badge size="sm">Beta: DE</Badge>
                <Badge size="sm">Beta: JA</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============ NOTIFICATION CHANNELS ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Master switches — turning a channel off mutes every event below it</CardDescription>
              </div>
            </div>
            <Badge variant="info" dot>Real-time</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {spec.notifications.channels.map((channel) => {
            const CIcon = channel.id === 'inapp' ? Bell : Mail;
            const isOn = channelEnabled[channel.id];
            return (
              <div key={channel.id} className="space-y-3">
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-surface border border-border-default">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      isOn ? "bg-brand-500/12 text-brand-400" : "bg-surface-hover text-muted"
                    )}>
                      <CIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primary">{channel.label}</p>
                      <p className="text-xs text-secondary">{channel.description}</p>
                    </div>
                  </div>
                  <Switch checked={isOn} onChange={(next) => toggleChannel(channel.id, next)} />
                </div>

                {/* Event matrix under each channel */}
                <div className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-2.5 transition-opacity",
                  !isOn && "opacity-50 pointer-events-none"
                )}>
                  {spec.notifications.items[channel.id].map((item) => {
                    const NIcon = notifIcons[item.icon];
                    const itemKey = `${channel.id}:${item.id}`;
                    const enabled = notifState[itemKey];
                    return (
                      <div
                        key={itemKey}
                        className={cn(
                          "flex items-start justify-between gap-3 p-3 rounded-xl border transition-colors",
                          enabled ? "bg-surface border-border-default" : "bg-subtle/40 border-border-subtle"
                        )}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={cn(
                            "p-1.5 rounded-lg shrink-0 mt-0.5",
                            enabled ? "bg-surface-hover text-primary" : "bg-surface-hover/50 text-muted"
                          )}>
                            <NIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-primary">{item.label}</span>
                              {item.locked && <Badge variant="warning" size="sm">Always on</Badge>}
                            </div>
                            <p className="text-[11px] text-secondary leading-snug mt-0.5">{item.description}</p>
                          </div>
                        </div>
                        <Switch
                          size="sm"
                          checked={enabled}
                          locked={item.locked}
                          onChange={() => toggleItem(channel.id, item.id, item.locked)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="text-xs text-muted flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5" />
              Billing receipts and security alerts stay on for compliance.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast({ title: "Preferences saved", description: "Notification matrix stored for this account.", type: "success" })}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
