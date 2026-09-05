/**
 * Knowva Information Architecture, Sitemap & User Journey Flows
 * Brand: Knowva ("Your AI Knowledge Workspace")
 * Enterprise Multi-Tenant Architecture
 */

export const informationArchitecture = {
  // 1. Multi-Tier Sitemap
  sitemap: {
    tiers: [
      {
        id: 'marketing',
        name: 'Tier 1: Public & Marketing',
        description: 'SEO-optimized landing pages, pricing tiers, social proof, and enterprise conversion funnels.',
        access: 'Public / Anonymous',
        routes: [
          { path: '/', name: 'Landing & Product Hero', desc: 'Live interactive product preview, value proposition, social proof, and primary CTA.', priority: 'P0' },
          { path: '/features', name: 'Product Features', desc: 'Deep dive into AI search, vector ingestion, Notion-like docs, and team collaboration.', priority: 'P1' },
          { path: '/pricing', name: 'Pricing & Seat Calculator', desc: 'Tier comparison (Free, Pro, Enterprise) with monthly/annual billing toggle and seat slider.', priority: 'P0' },
          { path: '/security', name: 'Enterprise Security & Compliance', desc: 'SOC2 Type II, GDPR, HIPAA compliance, data residency, and zero-data retention policies.', priority: 'P1' },
          { path: '/contact', name: 'Enterprise Sales & Demo', desc: 'Lead capture form for enterprise custom deployments and SLAs.', priority: 'P2' },
        ]
      },
      {
        id: 'auth',
        name: 'Tier 2: Authentication & Onboarding',
        description: 'Secure entry points, SSO identity providers, magic links, and team creation wizard.',
        access: 'Anonymous / In-Flight Auth',
        routes: [
          { path: '/login', name: 'Sign In / Authentication', desc: 'Email/password, Google SSO, GitHub SSO, and Passwordless Magic Link option.', priority: 'P0' },
          { path: '/register', name: 'Sign Up / Registration', desc: 'Work email capture, password strength validation, and terms agreement.', priority: 'P0' },
          { path: '/verify-email', name: 'Email Verification', desc: '6-digit OTP code entry or tokenized activation banner.', priority: 'P1' },
          { path: '/forgot-password', name: 'Password Recovery', desc: 'Self-serve password reset link delivery with rate limiting.', priority: 'P1' },
          { path: '/onboarding/workspace', name: 'Workspace Creation Wizard', desc: 'Multi-step setup: Company name, workspace slug, team size, and data region.', priority: 'P0' },
          { path: '/onboarding/invite', name: 'Colleague Batch Invite', desc: 'Email comma-separated batch invites with pre-assigned RBAC roles.', priority: 'P1' },
        ]
      },
      {
        id: 'core',
        name: 'Tier 3: Core Protected Application',
        description: 'Multi-tenant knowledge workspace combining Notion, ChatGPT, Google Drive, and Linear workflows.',
        access: 'Authenticated (RBAC Scoped)',
        routes: [
          { path: '/w/:workspaceSlug/dashboard', name: 'Workspace Dashboard', desc: 'Storage meters, recent documents, active AI threads, team activity timeline.', priority: 'P0' },
          { path: '/w/:workspaceSlug/docs', name: 'Document Explorer', desc: 'Folder tree, multi-select action bar, grid/table view, file status badges.', priority: 'P0' },
          { path: '/w/:workspaceSlug/docs/view/:docId', name: 'Document Viewer & Preview', desc: 'PDF/Markdown rendered preview, version history, metadata inspector, and instant AI chat trigger.', priority: 'P0' },
          { path: '/w/:workspaceSlug/chat', name: 'AI Chat & RAG Canvas', desc: 'Conversational assistant, @doc context tagging, prompt suggestions, and left history drawer.', priority: 'P0' },
          { path: '/w/:workspaceSlug/chat/:threadId', name: 'Active Chat Session', desc: 'Streaming AI answers, inline citation badges [1], and click-to-source inspection.', priority: 'P0' },
          { path: '/w/:workspaceSlug/search', name: 'Global & Semantic Search', desc: 'Full-page Command-K hybrid search with faceted filters, relevancy scoring, and snippet previews.', priority: 'P0' },
          { path: '/w/:workspaceSlug/settings/team', name: 'Team & RBAC Administration', desc: 'Member directory, role assignments (Owner, Admin, Editor, Viewer), and invite management.', priority: 'P1' },
          { path: '/w/:workspaceSlug/settings/general', name: 'Workspace Settings', desc: 'Workspace logo, name, slug change, audit logs, and danger zone.', priority: 'P1' },
          { path: '/settings/profile', name: 'User Profile & Security', desc: 'Avatar upload, 2FA setup, active sessions, and password management.', priority: 'P1' },
          { path: '/settings/billing', name: 'Billing & Subscriptions', desc: 'Stripe subscription portal, seat counters, invoices, and payment methods.', priority: 'P1' },
          { path: '/settings/api-keys', name: 'Developer API Keys', desc: 'Scoped API tokens (Read, Write, Admin) for CLI and ingestion pipelines.', priority: 'P2' },
        ]
      }
    ]
  },

  // 2. Multi-Tenant Hierarchy Model
  hierarchy: [
    {
      level: 1,
      name: 'Account / Organization',
      scope: 'Global Tenant',
      desc: 'Top-level enterprise tenant. Contains billing contracts, master SSO configs (SAML/Okta), security policies, and domain verification.',
      icon: 'Building2',
      fields: ['accountId', 'orgName', 'billingPlan', 'ssoEnabled', 'complianceTier'],
      children: '1 : N Workspaces'
    },
    {
      level: 2,
      name: 'Workspace',
      scope: 'Collaborative Environment',
      desc: 'Dedicated division workspace (e.g. Engineering, Product, Legal, Marketing). Controls data isolation, vector index namespace, and team memberships.',
      icon: 'LayoutGrid',
      fields: ['workspaceId', 'slug', 'name', 'storageQuotaBytes', 'region', 'createdAt'],
      children: '1 : N Folders & Collections'
    },
    {
      level: 3,
      name: 'Folder / Collection',
      scope: 'Hierarchical Container',
      desc: 'Logical nested grouping of documents with inheritance of access controls, tags, and category taxonomies.',
      icon: 'Folder',
      fields: ['folderId', 'parentId', 'name', 'color', 'inheritedPermissions'],
      children: '1 : N Sub-folders or Documents'
    },
    {
      level: 4,
      name: 'Document / File',
      scope: 'Knowledge Entity',
      desc: 'Individual ingested asset (PDF, Markdown, Docx, Code file, Notion page, Web scrape). Contains source file, extracted text, and metadata.',
      icon: 'FileText',
      fields: ['docId', 'title', 'fileType', 'sizeBytes', 'embeddingStatus', 'version', 'ownerId'],
      children: '1 : N Vector Chunks & Embeddings'
    },
    {
      level: 5,
      name: 'Vector Chunks & Embeddings',
      scope: 'Semantic Representation',
      desc: 'Token-sized text chunks (512-1024 tokens) with 1536-dim vector embeddings, positional metadata (page, paragraph), and similarity index pointers.',
      icon: 'Cpu',
      fields: ['chunkId', 'tokenCount', 'embeddingVector', 'pageNumber', 'similarityScore', 'contentExcerpt'],
      children: 'Referenced by RAG Citations'
    }
  ],

  // 3. Critical User Journey Flows
  flows: [
    {
      id: 'flow-a',
      code: 'FLOW A',
      title: 'Document Ingestion & Vector Embedding',
      badge: 'Google Drive + Vector AI',
      color: 'from-blue-500 to-indigo-600',
      summary: 'End-to-end ingestion pipeline from drag-and-drop to vectorized searchability in under 10 seconds.',
      steps: [
        {
          id: 'step-1',
          name: 'Multi-File Drag & Drop',
          actor: 'User',
          action: 'Drags PDF, MD, or DOCX files onto the drop zone or selects via file picker.',
          ui: 'UploadDropzone with visual states: Idle, Drag-Over (pulsing border), Files Queued.',
          decision: 'File type valid & size under 50MB?',
          decisionPaths: { yes: 'Step 2: Client Pre-Flight Validation', no: 'Show toast error: Unsupported format or file too large.' }
        },
        {
          id: 'step-2',
          name: 'Direct Upload & Progress Tracking',
          actor: 'System / S3 Storage',
          action: 'Files are uploaded via pre-signed URLs with real-time percentage progress bar.',
          ui: 'UploadWizardModal showing file item progress, estimated time remaining, and Cancel button.',
          decision: 'Upload completed without network interruption?',
          decisionPaths: { yes: 'Step 3: Background Extraction & Vectorization', no: 'Retry mechanism (3 attempts) or prompt user to retry.' }
        },
        {
          id: 'step-3',
          name: 'Text Parsing, Chunking & Embeddings',
          actor: 'Backend Ingestion Worker',
          action: 'Server extracts text, parses AST, chunks text (512 tokens with 10% overlap), and generates OpenAI/Cohere embeddings.',
          ui: 'Document row displays status badge: "Processing" (amber spinning ring) ➔ "Indexed" (emerald check).',
          decision: 'Parsing successful and vector index written?',
          decisionPaths: { yes: 'Step 4: Folder Placement & Metadata Inspector', no: 'Mark status as "Embedding Failed" with diagnostic error drawer.' }
        },
        {
          id: 'step-4',
          name: 'Folder Placement & Tagging',
          actor: 'User / System',
          action: 'Document is automatically placed into target folder; AI auto-suggests 3 topic tags.',
          ui: 'Document Preview Drawer opens with editable tags, summary preview, and "Start AI Chat" button.',
          decision: 'User accepts auto-tags or modifies?',
          decisionPaths: { yes: 'Doc ready for instant RAG search and chat.', no: 'Doc remains saved with manual tags.' }
        }
      ]
    },
    {
      id: 'flow-b',
      code: 'FLOW B',
      title: 'RAG Query & Citation Traceability',
      badge: 'ChatGPT + Perplexity Citations',
      color: 'from-purple-500 to-pink-600',
      summary: 'Conversational synthesis grounded in verified enterprise documents with clickable citations.',
      steps: [
        {
          id: 'step-1',
          name: 'User Prompt with Context Tagging',
          actor: 'User',
          action: 'User types natural language question in chat input, optionally typing "@doc" to target specific files.',
          ui: 'ChatInputBox with auto-expanding textarea, mention popover menu, and prompt template chips.',
          decision: 'Specific doc mentioned (@doc)?',
          decisionPaths: { yes: 'Filter vector search strictly to mentioned document IDs.', no: 'Perform hybrid search across entire workspace index.' }
        },
        {
          id: 'step-2',
          name: 'Vector Retrieval & Re-ranking',
          actor: 'Vector Search Engine',
          action: 'User prompt is vectorized. System executes hybrid search (BM25 lexical + Cosine dense similarity) and re-ranks top 5 chunks.',
          ui: 'AI Message bubble displays typing indicator: "Synthesizing from 3 documents...".',
          decision: 'Similarity score above threshold (> 0.78)?',
          decisionPaths: { yes: 'Step 3: Stream LLM response with citation anchors.', no: 'Fallback: "I could not find relevant context in your documents. Would you like a general answer?"' }
        },
        {
          id: 'step-3',
          name: 'Streaming Answer with Inline Citations',
          actor: 'AI Model (LLM)',
          action: 'Tokens stream in real-time with markdown formatting, syntax-highlighted code blocks, and inline badges [1], [2].',
          ui: 'AIMessageCanvas with typewriter streaming effect, copy button, and source cards row below response.',
          decision: 'Stream complete?',
          decisionPaths: { yes: 'Enable action toolbar (Copy, Share, Thumbs Up/Down, Regenerate).', no: 'Continue token buffering.' }
        },
        {
          id: 'step-4',
          name: 'Source Inspection Drawer',
          actor: 'User',
          action: 'User clicks on citation badge [1] or expandable source card.',
          ui: 'Right-hand CitationDrawer slides out showing the exact highlighted passage, page number, document name, and similarity score.',
          decision: 'User wants to explore original file?',
          decisionPaths: { yes: 'Click "Open Full Document" to view in split editor.', no: 'Close drawer and continue conversation.' }
        }
      ]
    },
    {
      id: 'flow-c',
      code: 'FLOW C',
      title: 'Team Onboarding & Granular RBAC',
      badge: 'Linear-grade Administration',
      color: 'from-emerald-500 to-teal-600',
      summary: 'Collaborator onboarding with strict role-based access control and audit trail logging.',
      steps: [
        {
          id: 'step-1',
          name: 'Create Workspace / Department Hub',
          actor: 'Workspace Owner / Admin',
          action: 'Admin defines workspace name, slug (e.g. knowva.app/w/engineering), and default security posture.',
          ui: 'WorkspaceSetupModal with real-time slug availability check and data region selector.',
          decision: 'Slug available and valid?',
          decisionPaths: { yes: 'Proceed to Step 2: Role and permission scoping.', no: 'Show inline error with auto-suggested alternatives.' }
        },
        {
          id: 'step-2',
          name: 'Configure Role Permissions (RBAC)',
          actor: 'Admin',
          action: 'Inspect and configure permissions matrix for 4 predefined tiers: Owner, Admin, Editor, Viewer.',
          ui: 'PermissionMatrixTable with toggle switches for Upload Docs, Delete Docs, AI Chat Access, API Access, Billing.',
          decision: 'Custom role needed or default presets?',
          decisionPaths: { yes: 'Create custom role with granular overrides.', no: 'Apply standard Editor / Viewer presets.' }
        },
        {
          id: 'step-3',
          name: 'Batch Email Invitations',
          actor: 'Admin',
          action: 'Pastes comma-separated colleague emails, assigns default role, and clicks "Send Invites".',
          ui: 'InviteModal with email chip parser, role dropdown selector, and copyable invite link button.',
          decision: 'Emails match enterprise domain restriction?',
          decisionPaths: { yes: 'Send personalized invitation emails with 7-day magic link.', no: 'Block non-whitelisted domains with warning.' }
        },
        {
          id: 'step-4',
          name: 'Acceptance, Onboarding & Audit Log',
          actor: 'Invitee & System',
          action: 'Colleague clicks magic link, sets password/SSO, and lands on Workspace Dashboard with welcome guide.',
          ui: 'AuditLogTable logs event: "user.joined" with IP address, timestamp, and inviter identity.',
          decision: 'First-time user?',
          decisionPaths: { yes: 'Display 30-second interactive workspace tour.', no: 'Directly show active workspace dashboard.' }
        }
      ]
    },
    {
      id: 'flow-d',
      code: 'FLOW D',
      title: 'Global Semantic Search to Action (⌘+K)',
      badge: 'Spotlight / Linear Command Palette',
      color: 'from-amber-500 to-orange-600',
      summary: 'Sub-50ms spotlight search combining keyword matching with conceptual AI understanding.',
      steps: [
        {
          id: 'step-1',
          name: 'Command-K Keyboard Shortcut Trigger',
          actor: 'User',
          action: 'User presses ⌘+K (Mac) or Ctrl+K (Windows) from anywhere in the platform.',
          ui: 'CommandPaletteOverlay smoothly animates in with search input, recent searches, and suggested shortcuts.',
          decision: 'Overlay triggered?',
          decisionPaths: { yes: 'Focus automatically set to search input; background dimmed.', no: 'Normal page interaction persists.' }
        },
        {
          id: 'step-2',
          name: 'Mode Selection: Semantic vs Keyword',
          actor: 'User / System',
          action: 'User toggles search mode pill: "Hybrid (Default)", "Semantic AI", or "Exact Keyword".',
          ui: 'SearchFilterBar with pill toggles and keyboard shortcut hints (Tab to cycle).',
          decision: 'Search mode selected?',
          decisionPaths: { yes: 'Execute search query using selected algorithm.', no: 'Defaults to Hybrid (Lexical + Dense Vector).' }
        },
        {
          id: 'step-3',
          name: 'Real-time Debounced Results with Facets',
          actor: 'Search Engine',
          action: 'As user types, results group instantly by category: Documents, Chat Threads, Folders, and Quick Actions.',
          ui: 'GroupedResultList with highlighted text match snippets, relevancy score badges (e.g. 98% Match), and file type icons.',
          decision: 'Results found?',
          decisionPaths: { yes: 'Render results with arrow key navigation (↑ / ↓).', no: 'Show empty state with "Ask AI to generate answer" CTA.' }
        },
        {
          id: 'step-4',
          name: 'Quick Action Execution',
          actor: 'User',
          action: 'User presses Enter to open document or uses hotkey (⌘+Enter) to immediately start AI chat session about the result.',
          ui: 'Command palette smoothly dismisses; user transitions to selected view with zero latency.',
          decision: 'User action chosen?',
          decisionPaths: { yes: 'Route to document, trigger chat, or execute action.', no: 'Press ESC to dismiss overlay.' }
        }
      ]
    }
  ],

  // 4. Navigation Taxonomy Matrix
  taxonomy: {
    sidebar: {
      title: 'Primary Sidebar Navigation (Persistent / Collapsible)',
      behavior: 'Pinned on desktop (260px), collapsed to icon-rail on laptop/tablet (64px), hidden in mobile drawer (slide-in).',
      sections: [
        { name: 'Workspace Header', items: ['Workspace Switcher Dropdown', 'Workspace Plan Badge (Pro/Enterprise)', 'Quick Search Trigger'] },
        { name: 'Core Navigation', items: ['Dashboard (Overview & Metrics)', 'Documents (Folder Explorer)', 'AI Chat (Conversations & Prompts)', 'Global Search (Cmd+K)'] },
        { name: 'Collections / Folders', items: ['Pinned Documents', 'Team Folders (Tree view)', 'Personal Drafts', 'Shared with me'] },
        { name: 'Footer Widgets', items: ['Storage Usage Meter (e.g. 14.2 GB / 50 GB)', 'Invite Members CTA', 'Settings & User Profile'] }
      ]
    },
    topNav: {
      title: 'Top Navigation Bar (Contextual & Dynamic)',
      items: [
        { name: 'Dynamic Breadcrumb Trail', rule: 'Workspace > Folder > Sub-folder > Document Title (each clickable with dropdown siblings)' },
        { name: 'Global Command Palette Trigger', rule: 'Clickable search bar with "⌘ + K" keyboard shortcut badge' },
        { name: 'Notification Bell', rule: 'Unread badge count, dropdown preview of mentions, ingestion completions, and invite requests' },
        { name: 'Help & Documentation', rule: 'Direct link to API docs, keyboard shortcuts cheat sheet, and support chat' },
        { name: 'User Avatar Menu', rule: 'Presence status indicator (Active, Away, DND), Profile, Preferences, Log Out' }
      ]
    },
    contextMenu: {
      title: 'Secondary Context Menus (Right-Click & Action Menus)',
      items: [
        { action: 'Start AI Chat from this doc', shortcut: '⌘ + Shift + C', icon: 'Sparkles' },
        { action: 'Add Tag / Category', shortcut: 'T', icon: 'Tag' },
        { action: 'Move to Folder...', shortcut: 'M', icon: 'FolderInput' },
        { action: 'Share & Permissions...', shortcut: 'S', icon: 'Share2' },
        { action: 'Version History', shortcut: 'V', icon: 'History' },
        { action: 'Download / Export', shortcut: 'E', icon: 'Download' },
        { action: 'Delete / Archive', shortcut: '⌫', icon: 'Trash2', destructive: true }
      ]
    }
  }
};
