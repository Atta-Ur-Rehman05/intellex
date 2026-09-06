import React, { useState } from 'react';
import { AlertTriangle, Trash2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export const DangerZone = ({ workspaceName, onTransferOwnership, onDeleteWorkspace }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);

  const canDelete = deleteInput === workspaceName;

  return (
    <Card className="border-error-base/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-error-base" />
          <div>
            <CardTitle className="text-error-base">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions that affect all workspace members and data</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border-default bg-surface-subtle space-y-3">
            <div className="flex items-start gap-3">
              <ArrowRightLeft className="w-5 h-5 text-warning-base mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary">Transfer Ownership</h4>
                <p className="text-xs text-secondary mt-0.5">Transfer full ownership to another admin member. You will be demoted to Admin.</p>
              </div>
            </div>
            {!showTransfer ? (
              <Button variant="secondary" size="sm" onClick={() => setShowTransfer(true)}>
                Transfer Ownership
              </Button>
            ) : (
              <div className="space-y-2 pt-2">
                <Input
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  placeholder="new-owner@company.com"
                  type="email"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!transferEmail.includes('@')}
                    onClick={() => { onTransferOwnership?.(transferEmail); setShowTransfer(false); setTransferEmail(''); }}
                  >
                    Confirm Transfer
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowTransfer(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg border border-error-base/30 bg-error-bgLight dark:bg-error-bgDark space-y-3">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-error-base mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary">Delete Workspace</h4>
                <p className="text-xs text-secondary mt-0.5">Permanently delete this workspace, all documents, embeddings, chat history, and member access. This cannot be undone.</p>
              </div>
            </div>
            {!confirmDelete ? (
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                Delete Workspace
              </Button>
            ) : (
              <div className="space-y-2 pt-2">
                <label className="block text-xs text-secondary">
                  Type <span className="font-mono font-bold text-error-base">{workspaceName}</span> to confirm:
                </label>
                <Input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={workspaceName}
                />
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={!canDelete}
                    onClick={() => { onDeleteWorkspace?.(); setConfirmDelete(false); setDeleteInput(''); }}
                  >
                    Permanently Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setConfirmDelete(false); setDeleteInput(''); }}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
