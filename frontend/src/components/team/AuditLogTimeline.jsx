import React, { useState, useMemo } from 'react';
import { Filter, Clock, User, FileText, MessageSquare, Settings, CreditCard, Shield, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { teamSpecs } from '../../design-system/teamSpecs';

const categoryIcons = {
  members: User,
  documents: FileText,
  chat: MessageSquare,
  workspace: Settings,
  billing: CreditCard,
  security: Shield,
};

export const AuditLogTimeline = ({ logs = teamSpecs.mockAuditLogs }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const users = useMemo(() => [...new Set(logs.map(l => l.user))], [logs]);
  const categories = useMemo(() => [...new Set(logs.map(l => l.category))], [logs]);

  const filtered = useMemo(() => {
    return logs.filter(l =>
      (filterCategory === 'all' || l.category === filterCategory) &&
      (filterUser === 'all' || l.user === filterUser)
    );
  }, [logs, filterCategory, filterUser]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-500" />
            <div>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Complete activity timeline for compliance and monitoring</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-md border border-border-default bg-surface text-primary focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted" />
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-md border border-border-default bg-surface text-primary focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Users</option>
              {users.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-0 relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border-default" />

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">No audit events match your filters</div>
          ) : (
            filtered.map((log, i) => {
              const Icon = categoryIcons[log.category] || Activity;
              return (
                <div key={log.id} className="relative flex gap-4 py-3 group">
                  <div className={cn(
                    "relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    "border-border-default bg-surface-elevated group-hover:border-brand-300"
                  )}>
                    <Icon className="w-4 h-4 text-secondary group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-primary">{log.user}</span>
                      <Badge variant="neutral" className="text-[10px] px-1.5 py-0">
                        {teamSpecs.auditEventTypes.find(t => t.key === log.event)?.label || log.event}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary mt-0.5 truncate">{log.target}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-muted" />
                      <span className="text-[10px] text-muted">{formatTime(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
