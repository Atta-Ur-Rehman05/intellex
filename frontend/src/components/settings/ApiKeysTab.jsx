import { useState, useMemo } from 'react';
import {
  Key, KeyRound, Plus, Copy, Check, Eye, Terminal,
  ShieldCheck, Clock, AlertTriangle, RefreshCw, Lock, Activity
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table } from '../ui/Table';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal, ConfirmDialog } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { settingsSpecs } from '../../design-system/settingsSpecs';
import { cn } from '../../lib/utils';

const scopeStyles = {
  read: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
  write: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
  admin: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
};

const generateKeyString = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `kv_live_${seg(4)}${seg(4)}${seg(4)}${seg(4)}${seg(4)}`;
};

export const ApiKeysTab = () => {
  const { toast } = useToast();
  const spec = settingsSpecs.apiKeys;

  const [keys, setKeys] = useState(spec.keys);
  const [isGenOpen, setIsGenOpen] = useState(false);
  const [genName, setGenName] = useState('');
  const [genScopes, setGenScopes] = useState(['read']);
  const [genExpiry, setGenExpiry] = useState('90');
  const [genStep, setGenStep] = useState('config'); // 'config' | 'reveal'
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);

  const [revokeId, setRevokeId] = useState(null);
  const [revealedKeys, setRevealedKeys] = useState({});

  const toggleScope = (scopeId) => {
    setGenScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((s) => s !== scopeId)
        : scopeId === 'admin' ? ['read', 'write', 'admin'] : [...prev, scopeId]
    );
  };

  const handleGenerate = () => {
    const keyString = generateKeyString();
    setGeneratedKey(keyString);
    setGenStep('reveal');
    setCopied(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(generatedKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinishCreation = () => {
    const newKey = {
      id: `k${keys.length + 1}`,
      name: genName || 'Untitled Key',
      maskedKey: `${generatedKey.slice(0, 11)}••••••••${generatedKey.slice(-4)}`,
      fullKey: generatedKey,
      scopes: genScopes,
      created: 'Just now',
      createdISO: '2026-09-06',
      lastUsed: 'Never',
      status: 'active',
    };
    setKeys((prev) => [newKey, ...prev]);
    setIsGenOpen(false);
    setGenStep('config');
    setGenName('');
    setGenScopes(['read']);
    setGenExpiry('90');
    toast({
      title: "API key created",
      description: `${newKey.name} is live. Store the secret now — it will not be shown again.`,
      type: "success",
    });
  };

  const handleRevoke = () => {
    const target = keys.find((k) => k.id === revokeId);
    setKeys((prev) => prev.map((k) => (k.id === revokeId ? { ...k, status: 'revoked' } : k)));
    setRevokeId(null);
    toast({
      title: "Key revoked",
      description: `${target.name} can no longer authenticate. Applications will receive 401.`,
      type: "warning",
    });
  };

  const handleToggleReveal = (keyId) => {
    setRevealedKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const keyColumns = useMemo(() => [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "p-1.5 rounded-lg shrink-0",
            row.status === 'active' ? "bg-brand-500/10 text-brand-400" : "bg-surface-hover text-muted"
          )}>
            <Key className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={cn("font-semibold truncate", row.status === 'active' ? "text-primary" : "text-muted line-through")}>
                {row.name}
              </span>
              {revealedKeys[row.id] && row.fullKey && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(row.fullKey).catch(() => {});
                    toast({ title: "Copied", description: "Secret copied to clipboard.", type: "success" });
                  }}
                  className="p-0.5 rounded text-brand-400 hover:text-brand-300 cursor-pointer"
                  aria-label="Copy secret"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-[10px] font-mono text-muted">
              {revealedKeys[row.id] && row.fullKey ? row.fullKey : row.maskedKey}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'scopes',
      header: 'Scopes',
      sortable: false,
      render: (scopes) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {scopes.map((s) => (
            <span key={s} className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase", scopeStyles[s])}>
              {s}
            </span>
          ))}
        </div>
      ),
    },
    { key: 'created', header: 'Created', sortable: true, render: (v) => <span className="text-secondary">{v}</span> },
    {
      key: 'lastUsed',
      header: 'Last Used',
      sortable: false,
      render: (v, row) => (
        <span className={cn(row.status === 'active' ? "text-secondary" : "text-muted")}>{v}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (v) => v === 'active'
        ? <Badge variant="success" size="sm" dot>Active</Badge>
        : <Badge variant="error" size="sm" dot>Revoked</Badge>,
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      cellClassName: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.fullKey && (
            <Button
              variant="ghost"
              size="iconSm"
              onClick={(e) => { e.stopPropagation(); handleToggleReveal(row.id); }}
              aria-label={revealedKeys[row.id] ? "Hide secret" : "Reveal secret once"}
              title={revealedKeys[row.id] ? "Hide secret" : "Reveal secret"}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={row.status !== 'active'}
            onClick={(e) => {
              e.stopPropagation();
              setRevokeId(row.id);
            }}
            className="text-xs hover:text-red-500 disabled:opacity-40"
          >
            Revoke
          </Button>
        </div>
      ),
    },
  ], [revealedKeys, toast]);

  return (
    <div className="space-y-6">
      {/* ============ USAGE STATS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Requests · 30d", value: spec.stats.requests30d, icon: Activity, tone: "text-brand-400 bg-brand-500/10" },
          { label: "Failure Rate", value: spec.stats.failureRate, icon: AlertTriangle, tone: "text-emerald-500 bg-emerald-500/10" },
          { label: "Active Keys", value: String(keys.filter((k) => k.status === 'active').length), icon: KeyRound, tone: "text-sky-500 bg-sky-500/10" },
          { label: "Rotation Policy", value: "90 days", icon: RefreshCw, tone: "text-purple-400 bg-purple-500/10" },
        ].map((s) => (
          <Card key={s.label} variant="subtle" className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl shrink-0", s.tone)}>
                <s.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted truncate">{s.label}</p>
                <p className="text-lg font-bold text-primary tracking-tight">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ============ KEY MANAGEMENT TABLE ============ */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Programmatic access to <span className="font-mono text-brand-400">{spec.baseUrl}</span>
                </CardDescription>
              </div>
            </div>
            <Button size="sm" onClick={() => setIsGenOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Generate Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table
            columns={keyColumns}
            data={keys}
            selectable={false}
            pageSize={5}
            emptyMessage="No API keys — generate one to integrate Knowva"
          />
          <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-secondary leading-relaxed">
              Secrets are <strong className="text-primary">SHA-256 hashed at rest</strong> and shown in full only once at creation.
              Revealing an existing key again is disabled after the first 10 minutes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ============ SECURITY & LIMITS ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Rate Limits & Signing</CardTitle>
              <CardDescription>Guardrails applied to every key regardless of scope</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Activity, label: "Per-key throughput", value: spec.rateLimits.perKey },
              { icon: Clock, label: "Workspace quota", value: spec.rateLimits.perWorkspace },
              { icon: KeyRound, label: "Request signing", value: spec.rateLimits.signing },
              { icon: RefreshCw, label: "Rotation policy", value: spec.rateLimits.rotation },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between p-3.5 rounded-xl bg-canvas border border-border-default">
                <div className="flex items-center gap-2.5 min-w-0">
                  <r.icon className="w-4 h-4 text-secondary shrink-0" />
                  <span className="text-xs font-semibold text-primary">{r.label}</span>
                </div>
                <span className="text-xs font-mono text-brand-400 font-semibold text-right">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">Try it:</span>
            {spec.endpoints.map((ep) => (
              <span key={ep} className="text-[10px] font-mono px-2 py-1 rounded-md bg-surface border border-border-default text-secondary">
                {ep}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ============ GENERATOR MODAL ============ */}
      <Modal
        isOpen={isGenOpen}
        onClose={() => { setIsGenOpen(false); setGenStep('config'); }}
        title={genStep === 'config' ? "Generate API Key" : "Secret Created"}
        description={genStep === 'config'
          ? "Name the key, pick its scopes, and set an expiration."
          : "Copy this secret now — it will never be displayed again."}
        size="md"
      >
        {genStep === 'config' ? (
          <div className="space-y-5">
            <Input
              label="Key Name"
              value={genName}
              onChange={(e) => setGenName(e.target.value)}
              placeholder="e.g. Production RAG Pipeline"
              leftIcon={<Key className="w-4 h-4" />}
              helperText="Use a descriptive name — you'll identify it in logs and audit trails."
              autoFocus
            />

            {/* Scope selection */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-primary select-none">Scopes</span>
              <p className="text-xs text-muted -mt-1 mb-2">Scopes can never be widened later — create a new key instead.</p>
              <div className="space-y-2.5">
                {spec.scopes.map((s) => {
                  const isSel = genScopes.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleScope(s.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                        isSel ? "bg-brand-500/8 border-brand-500/40" : "bg-surface border-border-default hover:border-border-strong"
                      )}
                      aria-pressed={isSel}
                    >
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5",
                        isSel ? "bg-brand-600 border-brand-600" : "border-border-strong"
                      )}>
                        {isSel && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase", scopeStyles[s.id])}>
                            {s.label}
                          </span>
                          {s.id === 'admin' && <Badge variant="error" size="sm">Danger</Badge>}
                        </div>
                        <p className="text-xs text-secondary mt-1 leading-relaxed">{s.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Select
              label="Expiration"
              value={genExpiry}
              onChange={setGenExpiry}
              options={spec.expiryOptions}
              helperText="Expired keys auto-revoke at 00:00 UTC on their expiry date."
            />

            <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-border-subtle">
              <Button variant="secondary" size="sm" onClick={() => setIsGenOpen(false)}>Cancel</Button>
              <Button
                size="sm"
                disabled={!genName.trim() || genScopes.length === 0}
                onClick={handleGenerate}
                leftIcon={<KeyRound className="w-3.5 h-3.5" />}
              >
                Generate Secret
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Reveal box */}
            <div className="relative p-4 rounded-xl bg-canvas border-2 border-dashed border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="success" dot>Live secret · {genName}</Badge>
                <div className="flex items-center gap-1.5">
                  {spec.scopes.filter((s) => genScopes.includes(s.id)).map((s) => (
                    <span key={s.id} className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase", scopeStyles[s.id])}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs sm:text-sm text-primary bg-surface border border-border-default rounded-lg px-3 py-2.5 break-all select-all">
                  {generatedKey}
                </code>
                <Button
                  variant={copied ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleCopyKey}
                  leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-[11px] text-muted flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                Treat it like a password. Stored hashed, displayed once, expires in {spec.expiryOptions.find((o) => o.value === genExpiry)?.label.toLowerCase()}.
              </p>
            </div>

            {/* curl example */}
            <div className="rounded-xl bg-slate-950 border border-slate-700/60 overflow-hidden">
              <div className="flex items-center gap-2 px-3.5 py-2 border-b border-slate-700/60 bg-slate-900">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-mono text-slate-400">Quickstart · first request</span>
              </div>
              <pre className="p-3.5 text-[11px] leading-relaxed text-slate-300 font-mono overflow-x-auto"><code>{`curl ${spec.baseUrl}/documents \\
  -H "Authorization: Bearer ${generatedKey.slice(0, 16)}…" \\
  -H "X-Knowva-Signature: $SIGNATURE"`}</code></pre>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-border-subtle">
              <Button variant="secondary" size="sm" onClick={() => setGenStep('config')}>Back to Setup</Button>
              <Button size="sm" variant="ai" onClick={handleFinishCreation} leftIcon={<Check className="w-3.5 h-3.5" />}>
                I've Stored It — Activate Key
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============ REVOKE CONFIRM ============ */}
      <ConfirmDialog
        isOpen={revokeId !== null}
        onClose={() => setRevokeId(null)}
        onConfirm={handleRevoke}
        title="Revoke API Key"
        message={`Type the key name to confirm permanent revocation. Any application using "${keys.find((k) => k.id === revokeId)?.name || ''}" will immediately receive 401 Unauthorized.`}
        confirmLabel="Revoke Key"
      />
    </div>
  );
};
