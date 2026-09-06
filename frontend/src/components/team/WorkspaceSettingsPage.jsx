import React, { useState } from 'react';
import { Users, Shield, Building2, Activity } from 'lucide-react';
import { MembersTable } from './MembersTable';
import { InviteMembersModal } from './InviteMembersModal';
import { PermissionMatrix } from './PermissionMatrix';
import { WorkspaceProfileForm } from './WorkspaceProfileForm';
import { DangerZone } from './DangerZone';
import { AuditLogTimeline } from './AuditLogTimeline';
import { cn } from '../../lib/utils';

const tabs = [
  { key: 'members', label: 'Members', icon: Users },
  { key: 'permissions', label: 'Roles & Permissions', icon: Shield },
  { key: 'profile', label: 'Workspace Profile', icon: Building2 },
  { key: 'audit', label: 'Audit Log', icon: Activity },
];

export const WorkspaceSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Team & Workspace Settings</h1>
        <p className="text-xs text-secondary mt-1">Manage team members, roles, workspace configuration, and audit logs.</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-surface-subtle border border-border-default overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              activeTab === tab.key
                ? "bg-surface-elevated text-primary shadow-sm"
                : "text-muted hover:text-secondary hover:bg-surface-elevated/50"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'members' && (
          <MembersTable
            onInvite={() => setInviteOpen(true)}
            onRemove={(id) => console.log('Remove:', id)}
            onChangeRole={(id) => console.log('Change role:', id)}
          />
        )}
        {activeTab === 'permissions' && <PermissionMatrix />}
        {activeTab === 'profile' && <WorkspaceProfileForm />}
        {activeTab === 'audit' && <AuditLogTimeline />}
      </div>

      {activeTab === 'members' && (
        <DangerZone
          workspaceName="Acme Corp"
          onTransferOwnership={(email) => console.log('Transfer to:', email)}
          onDeleteWorkspace={() => console.log('Delete workspace')}
        />
      )}

      <InviteMembersModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={(data) => console.log('Invite:', data)}
      />
    </div>
  );
};
