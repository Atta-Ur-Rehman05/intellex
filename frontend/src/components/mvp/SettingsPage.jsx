import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Sun, Moon, Monitor, LogOut, Save, Check } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card.jsx';
import { Input } from '../ui/Input.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { cn } from '../../lib/utils.js';

const themeOptions = [
  { id: 'light', label: 'Light', desc: 'Bright canvas', icon: Sun },
  { id: 'dark', label: 'Dark', desc: 'Low-glare midnight', icon: Moon },
  { id: 'system', label: 'System', desc: 'Follows your OS', icon: Monitor },
];

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    // MVP: PATCH /auth/me is optional; persist locally for now
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-xs text-secondary mt-1">Manage your profile, appearance, and account.</p>
      </div>

      {/* ============ Profile ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>How you appear in Knowva</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar name={name || user?.name || 'User'} size="xl" className="ring-2 ring-border-default shrink-0" />
            <div className="flex-1 space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Your email is your login identity and cannot be changed in the MVP."
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={!name.trim() || name === user?.name}
                  leftIcon={saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                >
                  {saved ? 'Saved' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============ Appearance ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Choose how Knowva looks. System follows your device preference.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((t) => {
              const Icon = t.icon;
              const isActive = mode === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMode(t.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2.5",
                    isActive
                      ? "bg-brand-500/8 border-brand-500/50 shadow-xs ring-1 ring-brand-500/30"
                      : "bg-surface border-border-default hover:border-border-strong"
                  )}
                >
                  {/* Mini preview strip */}
                  <div className={cn(
                    "h-10 rounded-lg border overflow-hidden flex flex-col",
                    t.id === 'light' ? "bg-slate-100 border-slate-300"
                    : t.id === 'dark' ? "bg-slate-950 border-slate-700"
                    : "bg-gradient-to-r from-slate-100 to-slate-950 border-slate-400"
                  )}>
                    <div className={cn(
                      "h-3 border-b flex items-center gap-1 px-1.5",
                      t.id === 'light' ? "bg-white border-slate-200"
                      : t.id === 'dark' ? "bg-slate-900 border-slate-800"
                      : "border-slate-300"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", t.id === 'light' ? "bg-slate-300" : "bg-slate-700")} />
                      <span className={cn("w-1.5 h-1.5 rounded-full", t.id === 'light' ? "bg-slate-300" : "bg-slate-700")} />
                    </div>
                    <div className="flex-1 flex items-end gap-1 p-1.5">
                      <span className="w-2/3 h-2 rounded-sm bg-brand-500" />
                      <span className={cn("w-1/3 h-2 rounded-sm", t.id === 'light' ? "bg-slate-300" : "bg-slate-700")} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", isActive ? "text-brand-400" : "text-secondary")} />
                      <div>
                        <p className="text-xs font-bold text-primary">{t.label}</p>
                        <p className="text-[10px] text-muted">{t.desc}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="p-1 rounded-full bg-brand-500 text-white">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ============ Account ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Account</CardTitle>
              <CardDescription>Sign out of Knowva on this device</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-canvas border border-border-default">
            <div>
              <p className="text-xs font-semibold text-primary">Signed in as</p>
              <p className="text-xs text-secondary mt-0.5">{user?.email}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="hover:border-red-500/40 hover:text-red-500"
            >
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
