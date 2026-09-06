import { useState, useMemo } from 'react';
import {
  CreditCard, ArrowUpRight, ArrowDownRight, Calendar, Users, Check,
  Sparkles, Download, Plus, Trash2, Star, Zap, Receipt, FileText
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table } from '../ui/Table';
import { Modal, ConfirmDialog } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { settingsSpecs } from '../../design-system/settingsSpecs';
import { cn } from '../../lib/utils';

const cardBrandStyles = {
  Visa: "bg-gradient-to-br from-sky-600 via-sky-500 to-sky-700 text-white",
  Mastercard: "bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 text-white",
};

export const BillingTab = () => {
  const { toast } = useToast();
  const spec = settingsSpecs.billing;

  const [currentPlan, setCurrentPlan] = useState('pro');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [confirmPlan, setConfirmPlan] = useState(false);
  const [cycle, setCycle] = useState('annual');

  const [paymentMethods, setPaymentMethods] = useState(spec.paymentMethods);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [removeCardId, setRemoveCardId] = useState(null);
  const [newCard, setNewCard] = useState({ holder: '', number: '', exp: '', cvc: '' });
  const [planConfirmInput, setPlanConfirmInput] = useState('');

  const plan = spec.plans.find((p) => p.id === currentPlan);
  const seatUsedPct = Math.round((spec.seatUsage.used / spec.seatUsage.total) * 100);
  const priceOf = (p) => (cycle === 'annual' ? p.annual : p.monthly);
  const isUpgrade = (target) => spec.plans.findIndex((p) => p.id === target) > spec.plans.findIndex((p) => p.id === currentPlan);

  const seatMeterColor = seatUsedPct >= 90 ? "bg-red-500" : seatUsedPct >= 70 ? "bg-amber-500" : "bg-brand-500";

  const handleOpenPlanModal = (planId) => {
    setPendingPlan(planId);
    setConfirmPlan(false);
    setIsPlanModalOpen(true);
  };

  const handleConfirmPlanChange = () => {
    const target = spec.plans.find((p) => p.id === pendingPlan);
    setCurrentPlan(pendingPlan);
    setIsPlanModalOpen(false);
    setConfirmPlan(false);
    toast({
      title: `Switched to ${target.name}`,
      description: isUpgrade(pendingPlan)
        ? `New features unlocked immediately. Pro-rated charge of $${(priceOf(target) * spec.seatUsage.used).toFixed(2)} applied.`
        : `Downgrade takes effect at the end of the billing cycle (${spec.renewalDate}).`,
      type: isUpgrade(pendingPlan) ? "success" : "info",
    });
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const brand = newCard.number.startsWith('5') ? 'Mastercard' : 'Visa';
    const id = `pm-${paymentMethods.length + 1}`;
    setPaymentMethods((prev) => [
      ...prev,
      {
        id,
        brand,
        last4: newCard.number.replace(/\D/g, '').slice(-4) || '0000',
        exp: newCard.exp || '01/30',
        holder: newCard.holder || 'Sarah Chen',
        default: false,
      },
    ]);
    setIsAddCardOpen(false);
    setNewCard({ holder: '', number: '', exp: '', cvc: '' });
    toast({ title: "Card added", description: `${brand} •••• ${newCard.number.replace(/\D/g, '').slice(-4) || '0000'} saved for future invoices.`, type: "success" });
  };

  const handleRemoveCard = () => {
    const card = paymentMethods.find((c) => c.id === removeCardId);
    setPaymentMethods((prev) => prev.filter((c) => c.id !== removeCardId));
    if (card.default && paymentMethods.length > 1) {
      const next = paymentMethods.find((c) => c.id !== removeCardId);
      setPaymentMethods((prev) => prev.map((c) => ({ ...c, default: c.id === next.id })));
    }
    setRemoveCardId(null);
    toast({ title: "Payment method removed", description: `${card.brand} •••• ${card.last4} was deleted.`, type: "info" });
  };

  const handleSetDefault = (id) => {
    setPaymentMethods((prev) => prev.map((c) => ({ ...c, default: c.id === id })));
    toast({ title: "Default card updated", description: "Renewals will now charge this card.", type: "success" });
  };

  const invoiceColumns = useMemo(() => [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-surface-hover text-secondary shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-primary">{row.date}</p>
            <p className="text-[10px] font-mono text-muted">{row.number}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Billing Period',
      sortable: false,
      render: (v) => <span className="text-secondary">{v}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (v) => <span className="font-mono font-semibold text-primary">${v.toFixed(2)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (v) => (
        <Badge variant={v === 'paid' ? 'success' : 'warning'} dot>
          {v === 'paid' ? 'Paid' : 'Refunded'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      cellClassName: 'text-right',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toast({ title: "Invoice downloaded", description: `${row.number}.pdf is on its way to your downloads.`, type: "success" });
          }}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          PDF
        </Button>
      ),
    },
  ], [toast]);

  return (
    <div className="space-y-6">
      {/* ============ CURRENT PLAN CARD ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Plan summary */}
        <Card className="lg:col-span-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Workspace billing cycle and renewal</CardDescription>
                </div>
              </div>
              <Badge variant="brand" icon={<Star className="w-3 h-3" />}>Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-primary">{plan.name}</span>
                  <span className="text-xs text-muted">
                    · {cycle === 'annual' ? 'billed annually' : 'billed monthly'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-bold text-primary">${priceOf(plan)}</span>
                  <span className="text-xs text-secondary">/ seat / month</span>
                </div>
                <p className="text-xs text-secondary mt-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  Renews on <strong className="text-primary">{spec.renewalDate}</strong> · next invoice ${spec.nextInvoice.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast({ title: "Renewal cancelled", description: `Plan remains active until ${spec.renewalDate}, then moves to Starter.`, type: "warning" })}
                >
                  Cancel Renewal
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenPlanModal('enterprise')}
                  leftIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                >
                  Compare & Upgrade
                </Button>
              </div>
            </div>

            {/* Seat usage meter */}
            <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-primary">Seat Usage</span>
                </div>
                <span className={cn(
                  "text-xs font-mono font-semibold",
                  seatUsedPct >= 90 ? "text-red-500" : seatUsedPct >= 70 ? "text-amber-500" : "text-brand-400"
                )}>
                  {spec.seatUsage.used} / {spec.seatUsage.total} seats · {seatUsedPct}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-hover overflow-hidden" role="progressbar" aria-valuenow={seatUsedPct} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={cn("h-full rounded-full transition-all duration-500", seatMeterColor)}
                  style={{ width: `${seatUsedPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted">
                  ${spec.seatUsage.unitPrice}/seat/mo billed annually · add seats anytime, pro-rated.
                </p>
                <button
                  type="button"
                  onClick={() => toast({ title: "Seat picker opened", description: "Increase seats in the plan change dialog.", type: "info" })}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 underline underline-offset-2 cursor-pointer"
                >
                  + Add seats
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment method summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Charged on each renewal date</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.slice(0, 2).map((pm) => (
              <div
                key={pm.id}
                className={cn(
                  "relative p-3.5 rounded-xl border transition-all",
                  pm.default ? "border-brand-500/40 bg-brand-500/5" : "border-border-default bg-surface"
                )}
              >
                {pm.default && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-400 border border-brand-500/25">
                    DEFAULT
                  </span>
                )}
                <div className={cn("w-11 h-8 rounded-md mb-3 shadow-xs flex items-center justify-center", cardBrandStyles[pm.brand])}>
                  <span className="text-[8px] font-bold tracking-wider">{pm.brand.toUpperCase()}</span>
                </div>
                <p className="font-mono text-sm font-semibold text-primary">•••• •••• •••• {pm.last4}</p>
                <p className="text-[11px] text-secondary mt-1">{pm.holder} · exp {pm.exp}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setIsAddCardOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ============ AVAILABLE PLANS ============ */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>Upgrade instantly or schedule a downgrade at cycle end</CardDescription>
              </div>
            </div>
            {/* Cycle toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-hover border border-border-default">
              {['monthly', 'annual'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer",
                    cycle === c ? "bg-surface text-primary shadow-xs border border-border-default" : "text-secondary hover:text-primary"
                  )}
                >
                  {c === 'annual' ? 'Annual · Save 20%' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spec.plans.map((p) => {
              const isCurrent = p.id === currentPlan;
              const upgrade = isUpgrade(p.id);
              return (
                <div
                  key={p.id}
                  className={cn(
                    "relative p-5 rounded-2xl border flex flex-col gap-4 transition-all",
                    isCurrent
                      ? "bg-brand-500/5 border-brand-500/50 ring-1 ring-brand-500/30"
                      : "bg-surface border-border-default hover:border-border-strong"
                  )}
                >
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-4 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-xs">
                      CURRENT PLAN
                    </span>
                  )}
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-bold text-primary">{p.name}</h4>
                      {p.id === 'enterprise' && <Badge variant="ai" size="sm">SSO / SLA</Badge>}
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">{p.targetAudience}</p>
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-2xl font-bold text-primary">${priceOf(p)}</span>
                      <span className="text-[11px] text-secondary">/seat/mo</span>
                    </div>
                    <p className="text-[11px] font-mono text-brand-400 font-semibold">{p.seatLine}</p>
                  </div>

                  <ul className="space-y-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-secondary">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isCurrent ? 'secondary' : upgrade ? 'primary' : 'outline'}
                    size="sm"
                    disabled={isCurrent}
                    onClick={() => handleOpenPlanModal(p.id)}
                    leftIcon={upgrade ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    className="w-full"
                  >
                    {isCurrent ? 'Active' : upgrade ? `Upgrade to ${p.name}` : `Downgrade to ${p.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ============ PAYMENT METHODS ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Manage Payment Methods</CardTitle>
                <CardDescription>Knowva accepts major cards · SEPA and invoicing on Enterprise</CardDescription>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setIsAddCardOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={cn(
                  "p-4 rounded-xl border flex flex-col gap-3 transition-all",
                  pm.default ? "border-brand-500/40 bg-brand-500/5" : "border-border-default bg-surface hover:border-border-strong"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={cn("w-12 h-9 rounded-md shadow-xs flex items-center justify-center", cardBrandStyles[pm.brand])}>
                    <span className="text-[8px] font-bold tracking-wider">{pm.brand.toUpperCase()}</span>
                  </div>
                  {pm.default ? (
                    <Badge variant="brand" size="sm" dot>Default</Badge>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(pm.id)}
                      className="text-[10px] font-semibold text-brand-400 hover:text-brand-300 underline underline-offset-2 cursor-pointer"
                    >
                      Set default
                    </button>
                  )}
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-primary">•••• {pm.last4}</p>
                  <p className="text-[11px] text-secondary mt-0.5">{pm.holder} · exp {pm.exp}</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                  <span className="text-[10px] font-mono text-muted">Added {pm.id === 'pm-1' ? 'Apr 2026' : 'Aug 2026'}</span>
                  <button
                    type="button"
                    onClick={() => setRemoveCardId(pm.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    aria-label={`Remove ${pm.brand} card`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ============ INVOICE HISTORY ============ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-brand-500" />
              <div>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>Downloadable receipts for accounting and compliance</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast({ title: "Export started", description: "All invoices bundled as a ZIP archive.", type: "info" })}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table
            columns={invoiceColumns}
            data={spec.invoices}
            selectable={false}
            pageSize={5}
            emptyMessage="No invoices yet"
          />
        </CardContent>
      </Card>

      {/* ============ MODALS ============ */}
      {/* Plan Change Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => { setIsPlanModalOpen(false); setConfirmPlan(false); }}
        title={pendingPlan === 'starter' ? "Downgrade Plan" : "Upgrade Plan"}
        description={pendingPlan === 'starter' ? "Downgrades apply at the end of the current billing cycle." : "Upgrades apply immediately with pro-rated billing."}
        size="md"
      >
        {pendingPlan && (() => {
          const target = spec.plans.find((p) => p.id === pendingPlan);
          const upgrade = isUpgrade(pendingPlan);
          return (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border border-border-default bg-canvas space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold border", currentPlan === 'pro' ? "bg-brand-500/10 text-brand-400 border-brand-500/25" : "bg-surface-hover text-secondary border-border-default")}>
                      {plan.name}
                    </span>
                    <ArrowUpRight className={cn("w-4 h-4", upgrade ? "text-emerald-500" : "text-amber-500 rotate-90")} />
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                      {target.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-secondary">
                    ${priceOf(plan)}/mo → ${priceOf(target)}/mo
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {target.features.map((f) => (
                    <div key={f} className="flex items-start gap-1.5 text-secondary">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!confirmPlan ? (
                <>
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-secondary leading-relaxed">
                      {upgrade
                        ? `Your card ending ${paymentMethods.find((c) => c.default)?.last4} will be charged a pro-rated amount today for ${spec.seatUsage.used} seats.`
                        : `You will keep ${plan.name} features until ${spec.renewalDate}. Storage above 5 GB will become read-only.`}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-border-subtle">
                    <Button variant="secondary" size="sm" onClick={() => setIsPlanModalOpen(false)}>Keep {plan.name}</Button>
                    <Button
                      variant={upgrade ? 'primary' : 'destructive'}
                      size="sm"
                      onClick={() => setConfirmPlan(true)}
                    >
                      {upgrade ? `Continue to ${target.name}` : `Schedule Downgrade`}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2.5">
                    <p className="text-xs font-semibold text-primary">Confirm the change</p>
                    <p className="text-xs text-secondary leading-relaxed">
                      Type <span className="font-mono font-bold text-primary">{target.name.toUpperCase()}</span> to authorize this plan change.
                    </p>
                    <Input
                      placeholder={target.name.toUpperCase()}
                      aria-label="Plan name confirmation"
                      id="plan-confirm-input"
                      onChange={(e) => setPlanConfirmInput(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-border-subtle">
                    <Button variant="secondary" size="sm" onClick={() => setConfirmPlan(false)}>Back</Button>
                    <Button
                      variant={upgrade ? 'primary' : 'destructive'}
                      size="sm"
                      disabled={planConfirmInput !== target.name.toUpperCase()}
                      onClick={handleConfirmPlanChange}
                    >
                      {upgrade ? `Charge & Upgrade` : `Confirm Downgrade`}
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        title="Add Payment Method"
        description="Card details are tokenized — Knowva never stores raw numbers or CVC."
        size="sm"
      >
        <form onSubmit={handleAddCard} className="space-y-4">
          <Input
            label="Cardholder Name"
            value={newCard.holder}
            onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
            placeholder="Sarah Chen"
            required
          />
          <Input
            label="Card Number"
            value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/[^\d ]/g, '') })}
            placeholder="4242 4242 4242 4242"
            leftIcon={<CreditCard className="w-4 h-4" />}
            className="font-mono"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Expiry (MM/YY)"
              value={newCard.exp}
              onChange={(e) => setNewCard({ ...newCard, exp: e.target.value })}
              placeholder="04/28"
              className="font-mono"
              required
            />
            <Input
              label="CVC"
              type="password"
              value={newCard.cvc}
              onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="•••"
              className="font-mono"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-subtle">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsAddCardOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save Card</Button>
          </div>
        </form>
      </Modal>

      {/* Remove Card Confirm */}
      <ConfirmDialog
        isOpen={removeCardId !== null}
        onClose={() => setRemoveCardId(null)}
        onConfirm={handleRemoveCard}
        title="Remove Payment Method"
        message="Subscriptions tied to this card will move to your remaining default card. This cannot be undone."
        confirmLabel="Remove Card"
      />
    </div>
  );
};
