import React, { useState } from 'react';
import { X, Mail, Link2, Copy, Check, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { teamSpecs } from '../../design-system/teamSpecs';

export const InviteMembersModal = ({ isOpen, onClose, onInvite }) => {
  const [emails, setEmails] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('email');

  const parsedEmails = emails
    .split(/[\n,;]+/)
    .map(e => e.trim())
    .filter(e => e.length > 0 && e.includes('@'));

  const handleGenerateLink = () => {
    setInviteLink(`https://knowva.ai/invite/${btoa(selectedRole).slice(0, 12)}-${Date.now().toString(36)}`);
    setCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    onInvite?.({ emails: parsedEmails, role: selectedRole });
    setEmails('');
    setInviteLink('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Members" maxWidth="max-w-lg">
      <div className="space-y-5">
        <div className="flex gap-1 p-1 rounded-lg bg-surface-subtle border border-border-default">
          {[
            { key: 'email', label: 'Email Invite', icon: Mail },
            { key: 'link', label: 'Invite Link', icon: Link2 },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all",
                mode === tab.key
                  ? "bg-surface-elevated text-primary shadow-sm"
                  : "text-muted hover:text-secondary"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider">
            Initial Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(teamSpecs.roles).filter(([k]) => k !== 'owner').map(([key, role]) => (
              <button
                key={key}
                onClick={() => setSelectedRole(key)}
                className={cn(
                  "px-3 py-2.5 rounded-lg border text-xs font-medium transition-all text-left",
                  selectedRole === key
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400"
                    : "border-border-default bg-surface hover:border-brand-300 text-secondary"
                )}
              >
                <div className="font-semibold">{role.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5 leading-tight">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        {mode === 'email' ? (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider">
              Email Addresses
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder={"colleague@company.com\nteam.member@company.com"}
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border-default bg-surface text-primary placeholder:text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none font-mono"
            />
            {parsedEmails.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {parsedEmails.map((email, i) => (
                  <Badge key={i} variant="neutral" className="text-xs">{email}</Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider">
              Shareable Invite Link
            </label>
            {!inviteLink ? (
              <Button onClick={handleGenerateLink} variant="secondary" className="w-full justify-center">
                <Link2 className="w-4 h-4 mr-1.5" />
                Generate Invite Link
              </Button>
            ) : (
              <div className="flex gap-2">
                <input
                  readOnly
                  value={inviteLink}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-border-default bg-surface-subtle text-secondary font-mono truncate"
                />
                <Button onClick={handleCopyLink} variant="secondary" size="sm">
                  {copied ? <Check className="w-4 h-4 text-success-base" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            )}
            <p className="text-xs text-muted">
              Anyone with this link will join as <span className="font-medium text-secondary">{teamSpecs.roles[selectedRole]?.label}</span>. Link expires in 7 days.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {mode === 'email' && (
            <Button onClick={handleInvite} disabled={parsedEmails.length === 0}>
              <Users className="w-4 h-4 mr-1.5" />
              Send {parsedEmails.length > 0 ? `${parsedEmails.length} Invite${parsedEmails.length > 1 ? 's' : ''}` : 'Invites'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
