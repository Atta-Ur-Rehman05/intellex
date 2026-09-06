import { useState } from 'react';
import {
  User, Mail, Camera, CheckCircle2, Lock, ShieldCheck, Smartphone,
  KeyRound, Smartphone as Authenticator, MessageSquare, Fingerprint,
  Globe, GitBranch, Link2, Plus, RefreshCw, Trash2, ShieldAlert,
  BadgeCheck, XCircle
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input, PasswordInput } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Modal, ConfirmDialog } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { settingsSpecs } from '../../design-system/settingsSpecs';
import { cn } from '../../lib/utils';

const providerIcons = { google: Globe, github: GitBranch, saml: ShieldCheck };

export const ProfileSecurityTab = () => {
  const { toast } = useToast();
  const spec = settingsSpecs;

  const [profile, setProfile] = useState({
    name: spec.profile.name,
    title: spec.profile.title,
    email: spec.profile.email,
    timezone: spec.profile.timezone,
  });
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const [twoFA, setTwoFA] = useState(spec.twoFactor.enabled);
  const [twoFAMethod, setTwoFAMethod] = useState('totp');
  const [recovery, setRecovery] = useState(spec.twoFactor.recoveryCodesRemaining);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrScanned, setQRScanned] = useState(false);
  const [totpCode, setTotpCode] = useState(['', '', '', '', '', '']);
  const [isRecoveryModalOpen, setRecoveryModalOpen] = useState(false);

  const [connected, setConnected] = useState(
    Object.fromEntries(spec.connectedAccounts.map((a) => [a.id, a.connected]))
  );
  const [disconnectedProvider, setDisconnectedProvider] = useState(null);
  const [revokeSessionId, setRevokeSessionId] = useState(null);

  const sessions = spec.sessions;

  const handleProfileSave = () => {
    toast({ title: "Profile updated", description: "Your account details have been saved.", type: "success" });
  };

  const handleAvatarUpload = () => {
    setAvatarUploading(true);
    setTimeout(() => {
      setAvatarSrc('https://i.pravatar.cc/128?img=47');
      setAvatarUploading(false);
      toast({ title: "Avatar uploaded", description: "New profile photo is now live across the workspace.", type: "success" });
    }, 900);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    setPwLoading(true);
    setTimeout(() => {
      setPwLoading(false);
      setPwForm({ current: '', next: '', confirm: '' });
      toast({ title: "Password updated", description: "All other sessions were signed out for safety.", type: "success" });
    }, 900);
  };

  const handleTwoFAToggle = (next) => {
    setTwoFA(next);
    if (next) {
      setQRScanned(false);
      setTotpCode(['', '', '', '', '', '']);
      setQRModalOpen(true);
    } else {
      toast({ title: "Two-factor disabled", description: "Your account now relies on password + SSO only.", type: "warning" });
    }
  };

  const handleTotpVerify = () => {
    setQRModalOpen(false);
    setTwoFA(true);
    toast({ title: "2FA activated", description: "Authenticator app verified and enrolled.", type: "success" });
  };

  const handleRegenerateCodes = () => {
    setRecovery(spec.twoFactor.recoveryCodesTotal);
    setRecoveryModalOpen(false);
    toast({ title: "Recovery codes regenerated", description: "10 new single-use codes issued. Old codes are invalid.", type: "success" });
  };

  const handleConnect = (acc) => {
    setConnected((prev) => ({ ...prev, [acc.id]: true }));
    toast({ title: `${acc.provider} connected`, description: "You can now sign in with one click.", type: "success" });
  };

  const handleDisconnect = () => {
    const acc = spec.connectedAccounts.find((a) => a.id === disconnectedProvider);
    setConnected((prev) => ({ ...prev, [disconnectedProvider]: false }));
    setDisconnectedProvider(null);
    toast({ title: `${acc.provider} disconnected`, description: "Linked identity removed from this account.", type: "info" });
  };

  const handleRevokeSession = () => {
    toast({ title: "Session revoked", description: "The device was signed out of Knowva.", type: "success" });
    setRevokeSessionId(null);
  };

  const handleCodeInput = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...totpCode];
    next[idx] = digit;
    setTotpCode(next);
    if (digit && idx < 5) {
      const el = document.getElementById(`totp-${idx + 1}`);
      el?.focus();
    }
  };

  const totpComplete = totpCode.every((d) => d !== '');

  return (
    <div className="space-y-6">
      {/* ============ IDENTITY CARD ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Profile & Identity</CardTitle>
              <CardDescription>How you appear to teammates across the workspace</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar uploader */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <Avatar src={avatarSrc} name={profile.name} size="xl" className="ring-2 ring-border-default" />
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={avatarUploading}
                  className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  aria-label="Upload avatar"
                >
                  <Camera className={cn("w-5 h-5", avatarUploading && "animate-pulse")} />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="secondary" size="sm" onClick={handleAvatarUpload} isLoading={avatarUploading} leftIcon={<Camera className="w-3.5 h-3.5" />}>
                  Upload
                </Button>
                {avatarSrc && (
                  <Button variant="ghost" size="sm" onClick={() => setAvatarSrc(null)} aria-label="Remove avatar">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-muted text-center max-w-[140px]">PNG or JPG, at least 256×256px, max 2 MB</p>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Job Title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g. Head of Knowledge Engineering"
              />
              <div className="sm:col-span-2">
                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  leftIcon={<Mail className="w-4 h-4" />}
                  rightIcon={
                    spec.profile.emailVerified ? (
                      <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500" />
                    )
                  }
                  helperText={spec.profile.emailVerified ? "Verified — used for sign-in and security alerts." : "Verification required."}
                />
              </div>
              <Select
                label="Timezone"
                value={profile.timezone}
                onChange={(v) => setProfile({ ...profile, timezone: v })}
                options={spec.timezones}
              />
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-primary select-none">Member Since</span>
                <div className="h-10 px-3 flex items-center gap-2 rounded-lg bg-subtle border border-border-subtle text-sm text-secondary">
                  <Globe className="w-4 h-4 text-secondary" />
                  {spec.profile.memberSince}
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end pt-1">
                <Button onClick={handleProfileSave} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============ PASSWORD CARD ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Minimum {spec.passwordPolicy.minLength} characters · uppercase · number · special character
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <PasswordInput
                label="Current Password"
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                placeholder="••••••••••••"
                required
              />
            </div>
            <PasswordInput
              label="New Password"
              value={pwForm.next}
              onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
              placeholder="Enter a strong password"
              required
            />
            <PasswordInput
              label="Confirm New Password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              placeholder="Repeat the new password"
              error={pwForm.confirm && pwForm.confirm !== pwForm.next ? "Passwords do not match" : undefined}
              required
            />
            <div className="sm:col-span-2 flex items-center justify-between gap-4 pt-1">
              <p className="text-xs text-muted flex items-start gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                Changing your password signs out all other devices.
              </p>
              <Button type="submit" isLoading={pwLoading} disabled={!pwForm.current || !pwForm.next || pwForm.next !== pwForm.confirm}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ============ 2FA CARD ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  {twoFA
                    ? `Active via ${spec.twoFactor.method} · last verified ${spec.twoFactor.lastVerified}`
                    : "Add a second layer of protection beyond your password"}
                </CardDescription>
              </div>
            </div>
            {twoFA && <Badge variant="success" dot>Enabled</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Switch
            checked={twoFA}
            onChange={handleTwoFAToggle}
            label="Require a second factor at sign-in"
            description="Codes refresh every 30 seconds and stay valid even offline."
          />

          {/* Method selection (visible when enabled) */}
          {twoFA && (
            <div className="space-y-2.5 pt-1">
              {spec.twoFactor.methods.map((m) => {
                const icons = { totp: Authenticator, sms: MessageSquare, webauthn: Fingerprint };
                const MIcon = icons[m.id];
                const isActive = twoFAMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setTwoFAMethod(m.id)}
                    className={cn(
                      "w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                      isActive
                        ? "bg-brand-500/8 border-brand-500/40 shadow-xs"
                        : "bg-surface border-border-default hover:border-border-strong"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      isActive ? "bg-brand-500/15 text-brand-400" : "bg-surface-hover text-secondary"
                    )}>
                      <MIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-primary">{m.label}</span>
                        {m.recommended && <Badge variant="brand" size="sm">Recommended</Badge>}
                        {m.enterpriseOnly && <Badge variant="neutral" size="sm">Enterprise</Badge>}
                      </div>
                      <p className="text-xs text-secondary mt-0.5">{m.description}</p>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                      isActive ? "border-brand-500" : "border-border-strong"
                    )}>
                      {isActive && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                    </div>
                  </button>
                );
              })}

              {/* Recovery codes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-primary">Recovery Codes</p>
                    <p className="text-xs text-secondary">
                      {recovery} of {spec.twoFactor.recoveryCodesTotal} single-use codes remaining
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setRecoveryModalOpen(true)}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  View & Regenerate
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============ CONNECTED ACCOUNTS CARD ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Connected Accounts & SSO</CardTitle>
              <CardDescription>Link identity providers for one-click sign-in and SCIM provisioning</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {spec.connectedAccounts.map((acc) => {
            const PIcon = providerIcons[acc.id];
            const isConnected = connected[acc.id];
            return (
              <div
                key={acc.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors",
                  isConnected ? "bg-surface border-border-default" : "bg-subtle/50 border-border-subtle border-dashed"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={cn(
                    "p-2.5 rounded-xl shrink-0 border",
                    isConnected ? "bg-surface-hover border-border-default" : "bg-surface border-border-dashed"
                  )}>
                    <PIcon className={cn("w-5 h-5", acc.id === 'google' && "text-sky-500", acc.id === 'github' && "text-primary", acc.id === 'saml' && "text-amber-500")} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-primary">{acc.provider}</span>
                      {isConnected ? (
                        <Badge variant="success" size="sm" dot>Connected</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">Not linked</Badge>
                      )}
                      {acc.enterpriseOnly && <Badge variant="warning" size="sm">Enterprise plan required</Badge>}
                    </div>
                    <p className="text-xs text-secondary mt-0.5 truncate">
                      {isConnected
                        ? `${acc.handle} · since ${acc.connectedAt} · scopes: ${acc.scopes.join(', ')}`
                        : "Link this provider to enable single sign-on for your account."}
                    </p>
                  </div>
                </div>
                {isConnected ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDisconnectedProvider(acc.id)}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    className="hover:border-red-500/40 hover:text-red-500"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant={acc.enterpriseOnly ? "secondary" : "outline"}
                    size="sm"
                    disabled={acc.enterpriseOnly}
                    onClick={() => handleConnect(acc)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ============ ACTIVE SESSIONS CARD ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Devices currently signed into your account</CardDescription>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast({ title: "All other sessions revoked", description: "Only this browser remains signed in.", type: "success" })}
              leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
            >
              Revoke All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border-subtle rounded-xl border border-border-default overflow-hidden">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-surface">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    s.current ? "bg-emerald-500/10 text-emerald-500" : "bg-surface-hover text-secondary"
                  )}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-primary truncate">{s.device}</span>
                      {s.current && <Badge variant="success" size="sm">This device</Badge>}
                    </div>
                    <p className="text-xs text-secondary font-mono truncate">
                      {s.location} · {s.ip} · {s.time}
                    </p>
                  </div>
                </div>
                {!s.current && (
                  <Button variant="ghost" size="sm" onClick={() => setRevokeSessionId(s.id)} className="text-xs hover:text-red-500">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ============ MODALS ============ */}
      {/* 2FA QR Enrollment */}
      <Modal
        isOpen={isQRModalOpen}
        onClose={() => setQRModalOpen(false)}
        title="Set up Two-Factor Authentication"
        description="Scan the QR code with your authenticator app, then confirm the 6-digit code."
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setQRScanned(true)}
              className={cn(
                "p-3 rounded-xl border-2 transition-all cursor-pointer",
                qrScanned ? "border-emerald-500/50" : "border-border-default hover:border-brand-500/50"
              )}
              aria-label="Simulate scanning the QR code"
            >
              <svg viewBox="0 0 100 100" className="w-36 h-36" role="img" aria-label="TOTP QR code">
                <rect width="100" height="100" fill="currentColor" className="text-white" rx="4" />
                <g fill="currentColor" className="text-slate-900">
                  <rect x="8" y="8" width="24" height="24" rx="3" />
                  <rect x="68" y="8" width="24" height="24" rx="3" />
                  <rect x="8" y="68" width="24" height="24" rx="3" />
                  <rect x="14" y="14" width="12" height="12" fill="currentColor" className="text-white" />
                  <rect x="74" y="14" width="12" height="12" fill="currentColor" className="text-white" />
                  <rect x="14" y="74" width="12" height="12" fill="currentColor" className="text-white" />
                  <rect x="40" y="8" width="6" height="6" /><rect x="52" y="12" width="6" height="6" />
                  <rect x="44" y="22" width="8" height="8" /><rect x="58" y="26" width="6" height="6" />
                  <rect x="8" y="40" width="6" height="6" /><rect x="20" y="44" width="8" height="8" />
                  <rect x="34" y="38" width="6" height="6" /><rect x="46" y="44" width="10" height="10" />
                  <rect x="64" y="40" width="8" height="8" /><rect x="80" y="36" width="6" height="6" />
                  <rect x="88" y="44" width="6" height="6" /><rect x="40" y="58" width="8" height="8" />
                  <rect x="54" y="52" width="6" height="6" /><rect x="68" y="60" width="10" height="10" />
                  <rect x="84" y="56" width="8" height="8" /><rect x="8" y="56" width="6" height="6" />
                </g>
                {qrScanned && (
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="3" strokeDasharray="6 4" />
                )}
              </svg>
            </button>
          </div>
          <p className="text-xs text-center text-secondary">
            {qrScanned ? "Scanned — enter the current 6-digit code below." : "Tap the code to simulate a scan, or enter the key manually:"}
          </p>
          {!qrScanned && (
            <p className="text-center font-mono text-xs text-brand-400 bg-brand-500/8 border border-brand-500/20 rounded-lg py-2 select-all">
              JBSW Y3DP EHPK 3PXP
            </p>
          )}

          {qrScanned && (
            <div className="space-y-3">
              <div className="flex justify-center gap-2" dir="ltr">
                {totpCode.map((d, i) => (
                  <input
                    key={i}
                    id={`totp-${i}`}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !totpCode[i] && i > 0) {
                        document.getElementById(`totp-${i - 1}`)?.focus();
                      }
                    }}
                    className={cn(
                      "w-10 h-12 text-center text-lg font-mono font-bold rounded-xl border bg-surface text-primary outline-none transition-all",
                      d
                        ? "border-brand-500/50 ring-2 ring-brand-500/20"
                        : "border-border-default hover:border-border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    )}
                    aria-label={`Digit ${i + 1} of verification code`}
                  />
                ))}
              </div>
              <Button className="w-full" onClick={handleTotpVerify} disabled={!totpComplete}>
                Verify & Activate 2FA
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Recovery Codes Modal */}
      <Modal
        isOpen={isRecoveryModalOpen}
        onClose={() => setRecoveryModalOpen(false)}
        title="Recovery Codes"
        description="Each code works exactly once. Store them somewhere safe — not in this workspace."
        size="sm"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: spec.twoFactor.recoveryCodesTotal }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "font-mono text-xs px-3 py-2 rounded-lg border text-center select-all",
                  i < recovery
                    ? "bg-surface border-border-default text-primary"
                    : "bg-subtle/50 border-border-subtle text-muted line-through"
                )}
              >
                {i < recovery ? `${['4F9', '2B7', '8C1', '6D3', '1E5', '9A2', '5F8', '3G4', '7H6', '0J9'][i]}-XX${i}${i < recovery - 2 ? 'K' : 'Z'}` : 'USED'}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-subtle">
            <Button variant="secondary" size="sm" onClick={() => toast({ title: "Codes copied", description: "Recovery codes copied to clipboard.", type: "success" })}>
              Copy Codes
            </Button>
            <Button size="sm" onClick={handleRegenerateCodes} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Regenerate All
            </Button>
          </div>
        </div>
      </Modal>

      {/* Disconnect SSO Confirm */}
      <ConfirmDialog
        isOpen={disconnectedProvider !== null}
        onClose={() => setDisconnectedProvider(null)}
        onConfirm={handleDisconnect}
        title="Disconnect Provider"
        message={`This removes the linked ${spec.connectedAccounts.find((a) => a.id === disconnectedProvider)?.provider || ''} identity. You will still be able to sign in with your password.`}
        confirmLabel="Disconnect"
      />

      {/* Revoke Session Confirm */}
      <ConfirmDialog
        isOpen={revokeSessionId !== null}
        onClose={() => setRevokeSessionId(null)}
        onConfirm={handleRevokeSession}
        title="Revoke Session"
        message="The selected device will be immediately signed out and required to re-authenticate."
        confirmLabel="Revoke Session"
      />
    </div>
  );
};
