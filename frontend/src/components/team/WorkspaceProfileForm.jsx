import React, { useState } from 'react';
import { Save, Building2, Globe, MapPin, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export const WorkspaceProfileForm = ({ workspace, onSave }) => {
  const [form, setForm] = useState(workspace || {
    name: 'Acme Corp',
    slug: 'acme-corp',
    region: 'us-east-1',
    logoUrl: '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave?.(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-500" />
          <div>
            <CardTitle>Workspace Profile</CardTitle>
            <CardDescription>Public identity and data residency configuration</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border-default bg-surface-subtle flex items-center justify-center text-muted hover:border-brand-400 hover:text-brand-500 transition-colors cursor-pointer shrink-0">
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Workspace Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="My Organization"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted font-mono">knowva.ai/</span>
                  <Input
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="my-org"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
              <MapPin className="w-3 h-3 inline mr-1" />
              Data Residency Region
            </label>
            <select
              value={form.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border-default bg-surface text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            >
              <option value="us-east-1">US East (Virginia)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="eu-west-1">EU West (Ireland)</option>
              <option value="eu-central-1">EU Central (Frankfurt)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
            </select>
            <p className="text-xs text-muted mt-1.5">All documents and embeddings are stored and processed in this region. Changing regions requires a migration.</p>
          </div>

          <div className="flex justify-end pt-2 border-t border-border-default">
            <Button onClick={handleSave}>
              {saved ? (
                <>✓ Saved</>
              ) : (
                <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
