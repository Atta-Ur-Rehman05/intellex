export const teamSpecs = {
  roles: {
    owner: { label: 'Owner', level: 4, description: 'Full workspace control including billing and deletion' },
    admin: { label: 'Admin', level: 3, description: 'Manage members, permissions, and all content' },
    editor: { label: 'Editor', level: 2, description: 'Upload, edit, and chat with documents' },
    viewer: { label: 'Viewer', level: 1, description: 'Read-only access to shared documents and chat' },
  },

  permissions: [
    { key: 'upload_docs', label: 'Upload Documents', owner: true, admin: true, editor: true, viewer: false },
    { key: 'delete_docs', label: 'Delete Documents', owner: true, admin: true, editor: false, viewer: false },
    { key: 'ai_chat', label: 'AI Chat Access', owner: true, admin: true, editor: true, viewer: true },
    { key: 'invite_members', label: 'Invite Members', owner: true, admin: true, editor: false, viewer: false },
    { key: 'manage_roles', label: 'Manage Roles', owner: true, admin: true, editor: false, viewer: false },
    { key: 'billing_access', label: 'Billing & Plans', owner: true, admin: false, editor: false, viewer: false },
    { key: 'audit_logs', label: 'View Audit Logs', owner: true, admin: true, editor: false, viewer: false },
    { key: 'workspace_settings', label: 'Workspace Settings', owner: true, admin: true, editor: false, viewer: false },
    { key: 'delete_workspace', label: 'Delete Workspace', owner: true, admin: false, editor: false, viewer: false },
    { key: 'transfer_ownership', label: 'Transfer Ownership', owner: true, admin: false, editor: false, viewer: false },
  ],

  memberColumns: [
    { key: 'avatar', label: '', width: '48px', sortable: false },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastActive', label: 'Last Active', sortable: true },
    { key: 'actions', label: '', width: '60px', sortable: false },
  ],

  statuses: {
    active: { label: 'Active', color: 'success' },
    pending: { label: 'Pending', color: 'warning' },
    suspended: { label: 'Suspended', color: 'error' },
  },

  auditEventTypes: [
    { key: 'member.invited', label: 'Member Invited', category: 'members' },
    { key: 'member.removed', label: 'Member Removed', category: 'members' },
    { key: 'member.role_changed', label: 'Role Changed', category: 'members' },
    { key: 'doc.uploaded', label: 'Document Uploaded', category: 'documents' },
    { key: 'doc.deleted', label: 'Document Deleted', category: 'documents' },
    { key: 'doc.shared', label: 'Document Shared', category: 'documents' },
    { key: 'chat.started', label: 'Chat Session Started', category: 'chat' },
    { key: 'settings.updated', label: 'Settings Updated', category: 'workspace' },
    { key: 'billing.changed', label: 'Plan Changed', category: 'billing' },
    { key: 'auth.login', label: 'Login', category: 'security' },
    { key: 'auth.logout', label: 'Logout', category: 'security' },
  ],

  mockMembers: [
    { id: '1', name: 'Sarah Chen', email: 'sarah.chen@acme.ai', role: 'owner', status: 'active', lastActive: '2 min ago', avatar: 'SC' },
    { id: '2', name: 'Marcus Rivera', email: 'marcus.r@acme.ai', role: 'admin', status: 'active', lastActive: '1 hr ago', avatar: 'MR' },
    { id: '3', name: 'Aisha Patel', email: 'aisha.p@acme.ai', role: 'editor', status: 'active', lastActive: '3 hrs ago', avatar: 'AP' },
    { id: '4', name: "James O'Brien", email: 'james.ob@acme.ai', role: 'viewer', status: 'active', lastActive: '1 day ago', avatar: 'JO' },
    { id: '5', name: 'Lin Wei', email: 'lin.wei@acme.ai', role: 'editor', status: 'pending', lastActive: 'Never', avatar: 'LW' },
    { id: '6', name: 'David Kim', email: 'david.kim@acme.ai', role: 'viewer', status: 'pending', lastActive: 'Never', avatar: 'DK' },
  ],

  mockAuditLogs: [
    { id: '1', event: 'member.invited', user: 'Sarah Chen', target: 'lin.wei@acme.ai', timestamp: '2026-09-06T14:30:00Z', category: 'members' },
    { id: '2', event: 'doc.uploaded', user: 'Marcus Rivera', target: 'Q3_Financial_Report.pdf', timestamp: '2026-09-06T13:15:00Z', category: 'documents' },
    { id: '3', event: 'member.role_changed', user: 'Sarah Chen', target: 'Aisha Patel → Editor', timestamp: '2026-09-06T11:00:00Z', category: 'members' },
    { id: '4', event: 'settings.updated', user: 'Marcus Rivera', target: 'Workspace name changed', timestamp: '2026-09-06T09:45:00Z', category: 'workspace' },
    { id: '5', event: 'doc.deleted', user: 'Aisha Patel', target: 'draft_notes_v1.txt', timestamp: '2026-09-05T16:20:00Z', category: 'documents' },
    { id: '6', event: 'auth.login', user: "James O'Brien", target: 'Chrome / Windows', timestamp: '2026-09-05T14:10:00Z', category: 'security' },
    { id: '7', event: 'chat.started', user: 'Aisha Patel', target: 'Contract Analysis Thread', timestamp: '2026-09-05T10:30:00Z', category: 'chat' },
    { id: '8', event: 'billing.changed', user: 'Sarah Chen', target: 'Pro → Enterprise', timestamp: '2026-09-04T08:00:00Z', category: 'billing' },
  ],
};