import React, { useState } from 'react';
import { 
  Sliders, Box, Database, ShieldCheck, Sparkles, Send, 
  Search, Eye, Trash2, CheckCircle2, AlertTriangle, AlertCircle, 
  Info, ExternalLink, Download, Tag as TagIcon, Plus, 
  ChevronRight, RefreshCw, Copy, Check, Terminal, FileText, 
  Layers, MessageSquare, Compass, Shield, User, Clock,
  CornerDownRight, ArrowRight, BookOpen, Monitor
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input, PasswordInput, SearchInput, Textarea } from './ui/Input';
import { Select } from './ui/Select';
import { Badge, Tag } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { Tabs } from './ui/Tabs';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Modal, ConfirmDialog } from './ui/Modal';
import { useToast } from './ui/Toast';
import { DropdownMenu, ContextMenu } from './ui/DropdownMenu';
import { Table } from './ui/Table';
import { Avatar, AvatarGroup } from './ui/Avatar';
import { CodeBlock, MarkdownViewer } from './ui/CodeBlock';
import { componentSpecs } from '../design-system/componentSpecs';
import { cn } from '../lib/utils';

export const Stage3View = () => {
  const [activeTab, setActiveTab] = useState('inputs');
  const { toast } = useToast();

  // Inputs Demo State
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textInputVal, setTextInputVal] = useState('Enterprise Knowledge Base');
  const [searchVal, setSearchVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('SuperSecretPass123!');
  const [textareaVal, setTextareaVal] = useState('Knowva unifies vector semantic search across enterprise Notion, Drive, and Slack channels.');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [tags, setTags] = useState([
    { id: '1', label: 'SOC2 Compliant', count: 14 },
    { id: '2', label: 'Vector Index', count: 8 },
    { id: '3', label: 'RAG Pipeline', count: 23 },
    { id: '4', label: 'OpenAI Embeddings', count: 5 },
  ]);
  const [lineTabVal, setLineTabVal] = useState('overview');
  const [pillTabVal, setPillTabVal] = useState('all');

  // Containers Demo State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Specs Search State
  const [specCategoryFilter, setSpecCategoryFilter] = useState('all');
  const [specSearchQuery, setSpecSearchQuery] = useState('');

  // Sample Documents for DataTable
  const [documents, setDocuments] = useState([
    { id: '1', title: 'Enterprise_Architecture_2026.pdf', type: 'PDF', size: '4.2 MB', sizeBytes: 4200000, status: 'ready', owner: 'Sarah Chen', role: 'owner', updated: '10 mins ago' },
    { id: '2', title: 'RAG_Vector_Ingestion_Pipeline.md', type: 'Markdown', size: '128 KB', sizeBytes: 128000, status: 'ready', owner: 'Alex Rivera', role: 'admin', updated: '2 hours ago' },
    { id: '3', title: 'SOC2_Security_Compliance_Audit.docx', type: 'Docx', size: '1.8 MB', sizeBytes: 1800000, status: 'embedding', owner: 'David Kim', role: 'editor', updated: 'Yesterday' },
    { id: '4', title: 'Semantic_Search_Schema_v3.json', type: 'JSON', size: '45 KB', sizeBytes: 45000, status: 'ready', owner: 'Elena Rostova', role: 'editor', updated: '3 days ago' },
    { id: '5', title: 'Knowva_Brand_Guidelines_v2.pdf', type: 'PDF', size: '14.5 MB', sizeBytes: 14500000, status: 'failed', owner: 'Marcus Vance', role: 'member', updated: 'May 12' },
    { id: '6', title: 'LLM_Prompt_Templates_Enterprise.md', type: 'Markdown', size: '84 KB', sizeBytes: 84000, status: 'ready', owner: 'Sarah Chen', role: 'owner', updated: 'May 8' },
    { id: '7', title: 'Employee_Knowledge_Onboarding.pdf', type: 'PDF', size: '3.1 MB', sizeBytes: 3100000, status: 'ready', owner: 'David Kim', role: 'editor', updated: 'April 22' },
  ]);

  // Sample Team Members for Avatars
  const sampleUsers = [
    { id: '1', name: 'Sarah Chen', role: 'owner', presence: 'online' },
    { id: '2', name: 'Alex Rivera', role: 'admin', presence: 'online' },
    { id: '3', name: 'Elena Rostova', role: 'editor', presence: 'busy' },
    { id: '4', name: 'David Kim', role: 'editor', presence: 'offline' },
    { id: '5', name: 'Marcus Vance', role: 'member', presence: 'offline' },
    { id: '6', name: 'Knowva AI Agent', role: 'ai', presence: 'ai' },
  ];

  const subTabs = [
    { id: 'inputs', label: '1. Inputs & Controls', icon: Sliders },
    { id: 'containers', label: '2. Containers & Overlays', icon: Box },
    { id: 'data', label: '3. Data Presentation', icon: Database },
    { id: 'specs', label: '4. Component Specs & ARIA', icon: ShieldCheck },
  ];

  const sampleCodeSnippet = `// Knowva Ingestion & RAG Query Vector Service
import { KnowvaClient } from '@knowva/sdk';

const client = new KnowvaClient({
  apiKey: process.env.KNOWVA_API_KEY,
  workspace: 'engineering-core'
});

// Semantic Vector Query with Source Citations
export async function queryKnowledge(queryText) {
  const response = await client.rag.query({
    prompt: queryText,
    model: 'knowva-neural-v4',
    similarityThreshold: 0.82,
    includeCitations: true
  });
  
  return {
    answer: response.text,
    sources: response.citations
  };
}`;

  const sampleMarkdownContent = (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded bg-brand-500/10 text-brand-400">
          <Sparkles className="w-4 h-4" />
        </span>
        <h4 className="text-base font-bold text-primary">Knowva AI Synthesized Response</h4>
      </div>
      <p className="text-xs text-secondary leading-relaxed">
        Based on your indexed workspace documentation, the enterprise vector ingestion pipeline leverages chunking with overlap to guarantee zero context loss during semantic retrieval{" "}
        <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-brand-500/15 text-brand-400 font-mono text-[11px] font-semibold border border-brand-500/30 cursor-pointer hover:bg-brand-500/25">
          [1] Architecture_v2.pdf
        </span>
        .
      </p>
      <div className="p-3 rounded-lg bg-surface-hover border border-border-subtle text-xs space-y-1">
        <p className="font-semibold text-primary">Key Architectural Guarantees:</p>
        <ul className="list-disc list-inside text-secondary space-y-0.5">
          <li>SOC2 Type II compliant encryption at rest and in transit{" "}
            <span className="text-[10px] font-mono text-brand-400 font-semibold">[2] SOC2_Audit.docx</span>
          </li>
          <li>Sub-150ms semantic search latency across 500k+ vector embeddings</li>
          <li>Role-Based Access Control (RBAC) enforced at vector namespace query time</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border-default pb-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-brand-600 text-white shadow-xs font-semibold"
                    : "text-secondary hover:text-primary hover:bg-surface-hover"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-secondary")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INPUTS & CONTROLS                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'inputs' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Inputs & Controls</h2>
            <p className="text-sm text-secondary mt-1">
              Reusable interactive atoms and molecules with verified states, sizes, icons, and keyboard focus rings.
            </p>
          </div>

          {/* Section A: Buttons */}
          <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
              <div>
                <h3 className="text-base font-bold text-primary">Buttons System</h3>
                <p className="text-xs text-secondary">6 variants, 4 sizes, active scale feedback (0.98), and focus rings</p>
              </div>

              {/* State Controls */}
              <div className="flex items-center gap-4 bg-surface-hover p-2 rounded-lg border border-border-subtle text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={buttonLoading}
                    onChange={(e) => setButtonLoading(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-brand-600 accent-brand-600"
                  />
                  <span className="font-medium text-secondary">Loading State</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={buttonDisabled}
                    onChange={(e) => setButtonDisabled(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-brand-600 accent-brand-600"
                  />
                  <span className="font-medium text-secondary">Disabled State</span>
                </label>
              </div>
            </div>

            {/* Button Variants Grid */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Visual Variants</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading={buttonLoading} disabled={buttonDisabled}>
                  Primary Button
                </Button>
                <Button variant="secondary" isLoading={buttonLoading} disabled={buttonDisabled}>
                  Secondary Button
                </Button>
                <Button variant="ai" isLoading={buttonLoading} disabled={buttonDisabled} leftIcon={<Sparkles className="w-4 h-4 text-purple-200" />}>
                  AI Assistant
                </Button>
                <Button variant="outline" isLoading={buttonLoading} disabled={buttonDisabled}>
                  Outline Button
                </Button>
                <Button variant="ghost" isLoading={buttonLoading} disabled={buttonDisabled}>
                  Ghost Button
                </Button>
                <Button variant="destructive" isLoading={buttonLoading} disabled={buttonDisabled} leftIcon={<Trash2 className="w-4 h-4" />}>
                  Destructive
                </Button>
              </div>
            </div>

            {/* Button Sizes & Icon Configurations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-subtle">
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Button Sizes</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">Small (32px)</Button>
                  <Button variant="primary" size="md">Medium (36px)</Button>
                  <Button variant="primary" size="lg">Large (44px)</Button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Icon Buttons & Addons</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" size="icon" aria-label="Search">
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button variant="ai" size="icon" aria-label="AI Sparkle">
                    <Sparkles className="w-4 h-4" />
                  </Button>
                  <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                  <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Form Inputs & Select */}
          <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-primary">Form Inputs & Controls</h3>
              <p className="text-xs text-secondary">Labels, helper text, error validations, icons, and keyboard shortcuts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Text Input */}
              <Input
                label="Workspace Title"
                value={textInputVal}
                onChange={(e) => setTextInputVal(e.target.value)}
                placeholder="e.g. Acme Corporation"
                helperText="Appears on all team invitations and invoices."
                leftIcon={<BookOpen className="w-4 h-4" />}
              />

              {/* Password Input with Toggle */}
              <PasswordInput
                label="Master Encryption Key"
                value={passwordVal}
                onChange={(e) => setPasswordVal(e.target.value)}
                helperText="Click eye icon to toggle visibility."
              />

              {/* Search Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">Search Engine</label>
                <SearchInput
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onClear={() => setSearchVal('')}
                  placeholder="Search vector embeddings..."
                  shortcutKey="⌘K"
                />
                <p className="text-xs text-muted">Includes instant clear and keyboard shortcut badge.</p>
              </div>

              {/* Custom Searchable Select */}
              <Select
                label="Assignee Role (RBAC)"
                value={selectedRole}
                onChange={setSelectedRole}
                isSearchable={true}
                helperText="Select or search for an enterprise permission tier."
                options={[
                  { value: 'owner', label: 'Workspace Owner', icon: <Shield className="w-3.5 h-3.5 text-amber-500" />, badge: 'Full' },
                  { value: 'admin', label: 'Security Admin', icon: <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />, badge: 'Manage' },
                  { value: 'editor', label: 'Knowledge Editor', icon: <FileText className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Write' },
                  { value: 'viewer', label: 'Read-only Viewer', icon: <User className="w-3.5 h-3.5 text-slate-400" />, badge: 'Read' },
                ]}
              />

              {/* Input with Error State */}
              <Input
                label="Custom Subdomain Slug"
                defaultValue="invalid_slug#$@"
                error="Only lowercase letters, numbers, and hyphens allowed."
              />

              {/* Textarea */}
              <Textarea
                label="Workspace Description"
                value={textareaVal}
                onChange={(e) => setTextareaVal(e.target.value)}
                maxLength={200}
                rows={3}
                helperText="Summarize your team's knowledge scope."
              />
            </div>
          </div>

          {/* Section C: Badges, Tags, Tooltips, Tabs, Breadcrumbs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Badges & Tags */}
            <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-primary">Badges & Interactive Tags</h3>
                <p className="text-xs text-secondary">Semantic feedback colors and dismissible chips</p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Semantic Status Badges</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand" dot>Active Workspace</Badge>
                  <Badge variant="success" dot>Indexed (Ready)</Badge>
                  <Badge variant="warning" dot>Syncing (85%)</Badge>
                  <Badge variant="error" dot>Failed Ingestion</Badge>
                  <Badge variant="info" dot>Version 2.4</Badge>
                  <Badge variant="ai">AI Vectorized</Badge>
                  <Badge variant="neutral">Draft</Badge>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border-subtle">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Removable Filter Tags</span>
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <Tag
                      key={tag.id}
                      count={tag.count}
                      icon={<TagIcon className="w-3 h-3 text-secondary" />}
                      onRemove={() => setTags(tags.filter(t => t.id !== tag.id))}
                    >
                      {tag.label}
                    </Tag>
                  ))}
                  {tags.length === 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => setTags([
                        { id: '1', label: 'SOC2 Compliant', count: 14 },
                        { id: '2', label: 'Vector Index', count: 8 },
                      ])}
                    >
                      Reset Demo Tags
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tooltips & Navigation Controls */}
            <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-primary">Tooltips & Navigation Elements</h3>
                <p className="text-xs text-secondary">Hover hints, segmented control tabs, and breadcrumbs</p>
              </div>

              {/* Tooltip Placements */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Tooltip Placements</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip content="Tooltip Top Hint" placement="top">
                    <Button variant="secondary" size="sm">Top</Button>
                  </Tooltip>
                  <Tooltip content="Tooltip Bottom Hint" placement="bottom">
                    <Button variant="secondary" size="sm">Bottom</Button>
                  </Tooltip>
                  <Tooltip content="Tooltip Left Hint" placement="left">
                    <Button variant="secondary" size="sm">Left</Button>
                  </Tooltip>
                  <Tooltip content="Tooltip Right Hint" placement="right">
                    <Button variant="secondary" size="sm">Right</Button>
                  </Tooltip>
                </div>
              </div>

              {/* Tabs Demonstration */}
              <div className="space-y-3 pt-3 border-t border-border-subtle">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Segmented Pill Tabs</span>
                <div>
                  <Tabs
                    variant="pill"
                    activeTab={pillTabVal}
                    onChange={setPillTabVal}
                    tabs={[
                      { id: 'all', label: 'All Files', count: 48 },
                      { id: 'pdf', label: 'PDFs', count: 18 },
                      { id: 'markdown', label: 'Markdown', count: 24 },
                      { id: 'code', label: 'Code', count: 6 },
                    ]}
                  />
                </div>
              </div>

              {/* Breadcrumbs */}
              <div className="space-y-2 pt-3 border-t border-border-subtle">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Hierarchical Breadcrumbs</span>
                <Breadcrumbs
                  items={[
                    { id: 'ws', label: 'Acme Workspace' },
                    { id: 'eng', label: 'Engineering' },
                    { id: 'arch', label: 'Architecture' },
                    { id: 'doc', label: 'RAG_Pipeline.md', badge: 'v2.1' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONTAINERS & OVERLAYS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'containers' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Containers & Overlays</h2>
            <p className="text-sm text-secondary mt-1">
              Structural cards, dialog modals, toast notification dispatchers, and context menus.
            </p>
          </div>

          {/* Cards Showcase */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-primary">Card Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Standard Card */}
              <Card variant="standard">
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>Default surface container for dashboard feeds and widgets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-secondary">Balanced border-default with subtle shadow-xs.</p>
                </CardContent>
                <CardFooter>
                  <span className="text-[11px] text-muted">Updated 2m ago</span>
                  <Badge variant="neutral">Static</Badge>
                </CardFooter>
              </Card>

              {/* Interactive Card */}
              <Card variant="interactive" onClick={() => toast({ title: "Card Clicked", description: "Interactive card triggered navigation event.", type: "info" })}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Interactive Card</span>
                    <ArrowRight className="w-4 h-4 text-brand-400" />
                  </CardTitle>
                  <CardDescription>Hover over this card to observe the smooth -2px lift and border glow.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-secondary">Click to trigger an interactive callback.</p>
                </CardContent>
                <CardFooter>
                  <span className="text-[11px] text-brand-400 font-medium">Click to test</span>
                  <Badge variant="brand">Clickable</Badge>
                </CardFooter>
              </Card>

              {/* AI Glow Card */}
              <Card variant="ai">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Intelligence Card</span>
                  </CardTitle>
                  <CardDescription>Styled with gradient border glow and neural shimmer accents.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-secondary">Used for AI chat citations, summaries, and smart insights.</p>
                </CardContent>
                <CardFooter>
                  <span className="text-[11px] text-purple-400 font-medium">Auto-generated</span>
                  <Badge variant="ai">Neural</Badge>
                </CardFooter>
              </Card>

              {/* Elevated Card */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>High z-index visual layer for popovers and critical alerts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-secondary">Deep shadow-lg for floating inspection drawers.</p>
                </CardContent>
                <CardFooter>
                  <span className="text-[11px] text-muted">Level 3 Depth</span>
                  <Badge variant="info">Elevated</Badge>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Modals & Dialog Triggers */}
          <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-primary">Modals & Dialog Overlays</h3>
              <p className="text-xs text-secondary">Accessible modals with backdrop blur, body scroll lock, and ESC key dismiss</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={() => setIsFormModalOpen(true)}>
                Open Form Modal
              </Button>
              <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                Open Confirmation Dialog
              </Button>
              <Button variant="secondary" onClick={() => setIsFullscreenOpen(true)}>
                Open Fullscreen Preview
              </Button>
            </div>
          </div>

          {/* Toast Notification Triggers */}
          <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-primary">Notification Toast Dispatcher</h3>
              <p className="text-xs text-secondary">Stackable bottom-right alerts with auto-dismiss and AI ingestion status bar</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                onClick={() => toast({
                  title: "Document Ingested",
                  description: "Architecture_v2.pdf successfully split into 48 vector chunks.",
                  type: "success"
                })}
              >
                Trigger Success Toast
              </Button>

              <Button
                variant="secondary"
                leftIcon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
                onClick={() => toast({
                  title: "Storage Quota Warning",
                  description: "Workspace has reached 85% of allocated storage (8.5 GB / 10 GB).",
                  type: "warning"
                })}
              >
                Trigger Warning Toast
              </Button>

              <Button
                variant="secondary"
                leftIcon={<AlertCircle className="w-4 h-4 text-red-500" />}
                onClick={() => toast({
                  title: "Embedding Pipeline Error",
                  description: "OpenAI rate limit exceeded during batch vector calculation.",
                  type: "error"
                })}
              >
                Trigger Error Toast
              </Button>

              <Button
                variant="ai"
                leftIcon={<Sparkles className="w-4 h-4 text-purple-200" />}
                onClick={() => toast({
                  title: "AI Vector Ingestion in Progress",
                  description: "Calculating semantic embeddings for 3 newly uploaded documents...",
                  type: "ai-processing",
                  duration: 6000
                })}
              >
                Trigger AI Progress Toast
              </Button>
            </div>
          </div>

          {/* Dropdown & Context Menu Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Dropdown Menu */}
            <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-primary">Action Dropdown Menu</h3>
                <p className="text-xs text-secondary">Popover menu with category headers, icons, and keyboard shortcuts</p>
              </div>

              <div className="pt-2">
                <DropdownMenu
                  trigger={
                    <Button variant="secondary" rightIcon={<ChevronRight className="w-4 h-4 rotate-90" />}>
                      Document Actions Menu
                    </Button>
                  }
                  items={[
                    { type: 'header', label: 'Knowledge Actions' },
                    { id: 'chat', label: 'Start AI Chat with Doc', icon: MessageSquare, shortcut: '⌘J', onClick: () => toast({ title: "AI Chat Started", description: "Document context attached to chat session.", type: "ai-processing" }) },
                    { id: 'download', label: 'Download Raw File', icon: Download, shortcut: '⌘D', onClick: () => toast({ title: "Download Initiated", description: "Downloading file from cloud storage.", type: "info" }) },
                    { id: 'tag', label: 'Add Semantic Tag', icon: TagIcon, shortcut: '⌘T', onClick: () => {} },
                    { type: 'divider' },
                    { id: 'delete', label: 'Delete Document', icon: Trash2, shortcut: 'Del', variant: 'destructive', onClick: () => setIsConfirmOpen(true) },
                  ]}
                />
              </div>
            </div>

            {/* Right Click Context Menu */}
            <ContextMenu
              className="bg-surface-hover/50 rounded-xl border-2 border-dashed border-border-strong p-8 flex flex-col items-center justify-center text-center cursor-context-menu"
              items={[
                { id: 'inspect', label: 'Inspect Vector Chunks', icon: Database, shortcut: '⌥I', onClick: () => toast({ title: "Vector Inspector", description: "Opening chunk embeddings panel.", type: "info" }) },
                { id: 'copy-link', label: 'Copy Citation Link', icon: Copy, shortcut: '⌘C', onClick: () => toast({ title: "Link Copied", description: "Deep citation link copied to clipboard.", type: "success" }) },
                { type: 'divider' },
                { id: 'remove', label: 'Remove from Workspace', icon: Trash2, variant: 'destructive', onClick: () => setIsConfirmOpen(true) },
              ]}
            >
              <Database className="w-8 h-8 text-brand-400 mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-primary">Right-Click Context Menu Area</h4>
              <p className="text-xs text-secondary mt-1">Right-click anywhere inside this box to trigger the custom Knowva context menu.</p>
            </ContextMenu>
          </div>

          {/* Form Modal Instance */}
          <Modal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            title="Create Knowledge Workspace"
            description="Configure your enterprise namespace and data isolation settings."
          >
            <div className="space-y-4">
              <Input label="Workspace Name" placeholder="e.g. AI Research Group" defaultValue="Applied AI Laboratory" />
              <Select
                label="Primary Vector Region"
                value="us-east"
                options={[
                  { value: 'us-east', label: 'US East (N. Virginia) - Low Latency' },
                  { value: 'eu-west', label: 'EU West (Frankfurt) - GDPR Compliant' },
                  { value: 'ap-south', label: 'Asia Pacific (Tokyo) - ISO 27001' },
                ]}
              />
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border-subtle">
                <Button variant="secondary" size="sm" onClick={() => setIsFormModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={modalLoading}
                  onClick={() => {
                    setModalLoading(true);
                    setTimeout(() => {
                      setModalLoading(false);
                      setIsFormModalOpen(false);
                      toast({
                        title: "Workspace Created",
                        description: "Applied AI Laboratory is ready for document ingestion.",
                        type: "success"
                      });
                    }, 800);
                  }}
                >
                  Create Workspace
                </Button>
              </div>
            </div>
          </Modal>

          {/* Confirmation Dialog Instance */}
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              setIsConfirmOpen(false);
              toast({
                title: "Document Deleted",
                description: "The document and its vector embeddings have been purged.",
                type: "success"
              });
            }}
            title="Delete Document & Embeddings?"
            message="This action cannot be undone. All indexed vector chunks, citation links, and chat references associated with this file will be permanently deleted."
            confirmLabel="Delete Permanently"
          />

          {/* Fullscreen Preview Modal */}
          <Modal
            isOpen={isFullscreenOpen}
            onClose={() => setIsFullscreenOpen(false)}
            size="fullscreen"
            title="Document Viewer: Enterprise_Architecture_2026.pdf"
            description="Previewing rendered document content with verified semantic vector chunks."
          >
            <div className="h-[60vh] flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-surface-hover rounded-xl p-6 border border-border-subtle overflow-y-auto">
                <h4 className="text-base font-bold text-primary mb-3">Document Contents (Extracted Text)</h4>
                <p className="text-xs text-secondary leading-relaxed mb-4">
                  The Knowva platform combines a high-performance vector retrieval engine with multi-tenant workspace isolation. Each ingested document undergoes automatic chunking (512 tokens with 64 token overlap) and embedding generation via neural encoders.
                </p>
                <p className="text-xs text-secondary leading-relaxed">
                  Enterprise security policies strictly forbid third-party training on customer data. All embeddings are stored in tenant-isolated vector namespaces with cryptographic verification.
                </p>
              </div>
              <div className="w-full md:w-80 bg-surface rounded-xl p-4 border border-border-default space-y-4">
                <h5 className="text-xs font-bold text-primary font-mono uppercase tracking-wider">Metadata Inspector</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-muted">Total Chunks:</span>
                    <span className="font-semibold text-primary font-mono">48 chunks</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-muted">Vector Status:</span>
                    <Badge variant="success" size="sm">Indexed</Badge>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-muted">Embedding Model:</span>
                    <span className="font-mono text-primary">text-embed-3-large</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted">Size on Disk:</span>
                    <span className="font-mono text-primary">4.2 MB</span>
                  </div>
                </div>
                <Button variant="ai" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Chat with this Doc
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DATA PRESENTATION                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'data' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Data Presentation</h2>
            <p className="text-sm text-secondary mt-1">
              Enterprise sortable table with bulk actions, team avatars with presence indicators, and syntax-highlighted code blocks.
            </p>
          </div>

          {/* Section A: Enterprise DataTable */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-primary">Enterprise Document Explorer Table</h3>
                <p className="text-xs text-secondary">Sortable columns, multi-row selection, bulk action bar, and pagination</p>
              </div>
              <Badge variant="brand" dot>{documents.length} Total Files</Badge>
            </div>

            <Table
              data={documents}
              pageSize={4}
              columns={[
                {
                  key: 'title',
                  header: 'Document Name',
                  sortable: true,
                  render: (val, row) => (
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-surface-hover text-brand-400 border border-border-subtle">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-primary block hover:underline">{val}</span>
                        <span className="text-[10px] text-muted font-mono">{row.type} • {row.size}</span>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'status',
                  header: 'Vector Status',
                  sortable: true,
                  render: (status) => {
                    if (status === 'ready') return <Badge variant="success" dot size="sm">Indexed</Badge>;
                    if (status === 'embedding') return <Badge variant="warning" dot size="sm">Embedding</Badge>;
                    return <Badge variant="error" dot size="sm">Failed</Badge>;
                  }
                },
                {
                  key: 'owner',
                  header: 'Owner',
                  sortable: true,
                  render: (owner, row) => (
                    <div className="flex items-center gap-2">
                      <Avatar name={owner} size="xs" presence="online" />
                      <span className="text-xs font-medium text-primary">{owner}</span>
                    </div>
                  )
                },
                {
                  key: 'updated',
                  header: 'Last Modified',
                  sortable: true,
                  render: (updated) => (
                    <div className="flex items-center gap-1.5 text-secondary font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-muted" />
                      <span>{updated}</span>
                    </div>
                  )
                }
              ]}
              onRowClick={(row) => {
                toast({
                  title: "Document Selected",
                  description: `Opened inspector for ${row.title}`,
                  type: "info"
                });
              }}
            />
          </div>

          {/* Section B: Avatars & Avatar Groups */}
          <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-primary">Avatars, Presence & Team Groups</h3>
              <p className="text-xs text-secondary">Automatic initials fallback, presence dots (Online, Busy, AI Agent), and stacked groups</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Presence States */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Presence Status Dots</span>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar name="Sarah Chen" presence="online" size="md" />
                    <span className="text-[10px] text-emerald-500 font-medium">Online</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar name="Elena Rostova" presence="busy" size="md" />
                    <span className="text-[10px] text-amber-500 font-medium">Busy</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar name="David Kim" presence="offline" size="md" />
                    <span className="text-[10px] text-slate-400 font-medium">Offline</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar name="Knowva AI" presence="ai" size="md" />
                    <span className="text-[10px] text-purple-400 font-medium">AI Agent</span>
                  </div>
                </div>
              </div>

              {/* Roles Badges */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Role Indicators</span>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar name="Sarah Chen" role="owner" size="md" />
                    <span className="text-[10px] text-amber-400 font-medium">Owner (Crown)</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar name="Alex Rivera" role="admin" size="md" />
                    <span className="text-[10px] text-brand-400 font-medium">Admin (Shield)</span>
                  </div>
                </div>
              </div>

              {/* Stacked Avatar Group */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">Stacked Group (+N Overflow)</span>
                <div>
                  <AvatarGroup users={sampleUsers} max={4} size="md" />
                  <p className="text-[11px] text-muted mt-2">Hover over any avatar or the +2 overflow counter to see tooltips.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Code Block & Markdown Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Syntax Highlighted CodeBlock */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary">Syntax-Highlighted CodeBlock</h3>
                <span className="text-xs font-mono text-brand-400">sdk-rag-client.js</span>
              </div>
              <CodeBlock
                filename="knowva-vector-client.js"
                language="javascript"
                code={sampleCodeSnippet}
              />
            </div>

            {/* Markdown Viewer with Citations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary">Rich Markdown Viewer & Citations</h3>
                <span className="text-xs font-mono text-purple-400">AI Synthesized Canvas</span>
              </div>
              <div className="p-5 rounded-xl border border-purple-500/30 bg-surface shadow-md ai-border-glow">
                <MarkdownViewer content={sampleMarkdownContent} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COMPONENT SPECS & ARIA ACCESSIBILITY                               */}
      {/* ========================================================================= */}
      {activeTab === 'specs' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Component Specifications & Standards</h2>
            <p className="text-sm text-secondary mt-1">
              Production design specifications, WCAG 2.1 AA/AAA compliance ratings, ARIA landmarks, and micro-interaction curves.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['all', 'inputs-controls', 'containers-overlays', 'data-presentation'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSpecCategoryFilter(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                    specCategoryFilter === cat
                      ? "bg-brand-600 text-white font-semibold shadow-xs"
                      : "bg-surface text-secondary hover:text-primary border border-border-default"
                  )}
                >
                  {cat === 'all' ? 'All Categories' : cat === 'inputs-controls' ? 'Inputs & Controls' : cat === 'containers-overlays' ? 'Containers & Overlays' : 'Data Presentation'}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <SearchInput
                placeholder="Search component specs..."
                value={specSearchQuery}
                onChange={(e) => setSpecSearchQuery(e.target.value)}
                onClear={() => setSpecSearchQuery('')}
              />
            </div>
          </div>

          {/* Specifications Cards Matrix */}
          <div className="space-y-6">
            {componentSpecs.categories
              .filter(cat => specCategoryFilter === 'all' || cat.id === specCategoryFilter)
              .map((cat) => (
                <div key={cat.id} className="space-y-4">
                  <div className="pb-2 border-b border-border-default flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-primary">{cat.title}</h3>
                      <p className="text-xs text-secondary">{cat.description}</p>
                    </div>
                    <Badge variant="brand">{cat.components.length} Components</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.components
                      .filter(comp => 
                        !specSearchQuery || 
                        comp.name.toLowerCase().includes(specSearchQuery.toLowerCase()) ||
                        comp.desc.toLowerCase().includes(specSearchQuery.toLowerCase())
                      )
                      .map((comp) => (
                        <div
                          key={comp.name}
                          className="bg-surface rounded-xl border border-border-default p-5 shadow-xs space-y-4 hover:border-brand-500/40 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-primary">{comp.name}</h4>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-hover text-brand-400 border border-border-subtle">
                                  {comp.tag}
                                </span>
                              </div>
                              <p className="text-xs text-secondary mt-1 leading-relaxed">{comp.desc}</p>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-border-subtle text-xs">
                            <div>
                              <span className="font-semibold text-primary">Variants: </span>
                              <span className="text-secondary font-mono text-[11px]">
                                {comp.variants.join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-primary">States: </span>
                              <span className="text-secondary">{comp.states.join(' • ')}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-primary">ARIA & Accessibility: </span>
                              <p className="text-[11px] text-secondary font-mono mt-0.5">{comp.accessibility.ariaRoles}</p>
                              <p className="text-[11px] text-muted mt-0.5">Keyboard: {comp.accessibility.keyboard}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-primary">Micro-Interaction Motion: </span>
                              <p className="text-[11px] text-brand-400 font-mono mt-0.5">{comp.motion}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
