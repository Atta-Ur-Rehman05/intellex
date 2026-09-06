import React from 'react';
import { Check, X, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { teamSpecs } from '../../design-system/teamSpecs';

export const PermissionMatrix = () => {
  const roleKeys = ['owner', 'admin', 'editor', 'viewer'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-500" />
          <div>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Granular access control for workspace resources and administration</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider min-w-[200px]">
                  Permission
                </th>
                {roleKeys.map(key => (
                  <th key={key} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider min-w-[100px]">
                    <Badge variant={key === 'owner' ? 'brand' : 'neutral'} className="capitalize">
                      {teamSpecs.roles[key].label}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {teamSpecs.permissions.map((perm) => (
                <tr key={perm.key} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-primary">{perm.label}</td>
                  {roleKeys.map(role => {
                    const allowed = perm[role];
                    return (
                      <td key={role} className="px-4 py-3 text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success-bgLight dark:bg-success-bgDark">
                            <Check className="w-3.5 h-3.5 text-success-base" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-subtle">
                            <X className="w-3.5 h-3.5 text-muted" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/30">
          <p className="text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-brand-600 dark:text-brand-400">Note:</span> Role changes take effect immediately. Owners cannot be demoted — transfer ownership first from the Danger Zone below.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
