import React, { useState, useMemo } from 'react';
import { Search, MoreHorizontal, Shield, UserMinus, Mail, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';
import { teamSpecs } from '../../design-system/teamSpecs';

export const MembersTable = ({ members = teamSpecs.mockMembers, onInvite, onRemove, onChangeRole }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey] || '';
        const bv = b[sortKey] || '';
        const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [members, search, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const statusColor = (status) => {
    const s = teamSpecs.statuses[status];
    if (!s) return 'neutral';
    return s.color;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border-default bg-surface text-primary placeholder:text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>
        <Button onClick={onInvite} size="sm">
          <Mail className="w-4 h-4 mr-1.5" />
          Invite Members
        </Button>
      </div>

      <div className="border border-border-default rounded-xl overflow-hidden bg-surface-elevated">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-surface-subtle">
              {teamSpecs.memberColumns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider",
                    col.sortable && "cursor-pointer hover:text-primary select-none"
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <ChevronDown className={cn("w-3 h-3 transition-transform", sortOrder === 'asc' && "rotate-180")} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={teamSpecs.memberColumns.length} className="px-4 py-12 text-center text-muted">
                  No members found
                </td>
              </tr>
            ) : (
              filtered.map(member => (
                <tr key={member.id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="px-4 py-3">
                    <Avatar fallback={member.avatar} size="sm" />
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">{member.name}</td>
                  <td className="px-4 py-3 text-secondary">{member.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral" className="capitalize">{teamSpecs.roles[member.role]?.label || member.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColor(member.status)}>{teamSpecs.statuses[member.status]?.label || member.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-secondary text-xs">{member.lastActive}</td>
                  <td className="px-4 py-3 relative">
                    {member.role !== 'owner' && (
                      <>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                          className="p-1.5 rounded-md hover:bg-surface-subtle text-muted hover:text-primary transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenuId === member.id && (
                          <div className="absolute right-4 top-full mt-1 w-44 rounded-lg border border-border-default bg-surface-elevated shadow-xl z-10 py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => { onChangeRole?.(member.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-primary hover:bg-surface-subtle transition-colors"
                            >
                              <Shield className="w-3.5 h-3.5" />
                              Change Role
                            </button>
                            <button
                              onClick={() => { onRemove?.(member.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error-base hover:bg-error-bgLight dark:hover:bg-error-bgDark transition-colors"
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                              Remove Member
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-muted text-right">
        {filtered.length} of {members.length} members
      </div>
    </div>
  );
};
