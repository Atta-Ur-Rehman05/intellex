/**
 * Knowva Design System — Stage 12
 * Empty States, Error States, Responsiveness & Developer Handoff
 *
 * Every interactive surface ships four states: loading, ideal, empty, error.
 * This spec is the single source of truth for all non-ideal states.
 */
export const edgeCaseSpecs = {
  version: "1.0.0",
  stage: "Stage 12: Edge Cases, Responsiveness & Developer Handoff",

  /* ================================================================
   * 1. EMPTY STATES — illustrated, informative, action-oriented
   * Anatomy: Illustration (140px) → Title (h4) → Context (body/secondary,
   * max 2 lines) → Primary Action + optional secondary link. Never dead-end.
   * ================================================================ */
  emptyStates: [
    {
      id: "no-documents",
      icon: "FolderOpen",
      title: "No documents yet",
      context: "Upload your first file or connect a cloud drive — Knowva will chunk, embed, and index it automatically.",
      primaryAction: { label: "Upload Document", icon: "UploadCloud", variant: "primary" },
      secondaryAction: { label: "Connect Google Drive", icon: "ExternalLink", variant: "ghost" },
      trigger: "Documents tab · zero rows AND zero folders",
      statHint: "Avg. upload-to-searchable: 38 seconds",
    },
    {
      id: "no-chats",
      icon: "MessageSquare",
      title: "Start your first conversation",
      context: "Ask anything about your knowledge base — every answer arrives with verified source citations.",
      primaryAction: { label: "New Chat", icon: "Sparkles", variant: "ai" },
      secondaryAction: { label: "Browse Prompt Library", icon: "BookOpen", variant: "ghost" },
      trigger: "AI Chat route · zero threads in history",
      statHint: "Suggested starter prompts render beneath the empty state",
    },
    {
      id: "no-search-results",
      icon: "SearchX",
      title: "No results found",
      context: "Try broader keywords, remove filters, or switch from Hybrid to Semantic-only retrieval.",
      primaryAction: { label: "Clear All Filters", icon: "RotateCcw", variant: "secondary" },
      secondaryAction: { label: "Search Tips", icon: "HelpCircle", variant: "ghost" },
      trigger: "Search route · query submitted · 0 hits across vectors + BM25",
      statHint: "Show which filters were active when the query missed",
    },
    {
      id: "no-notifications",
      icon: "BellOff",
      title: "You're all caught up",
      context: "Mentions, shares, and AI task completions will land here in real time.",
      primaryAction: { label: "Notification Settings", icon: "Settings", variant: "secondary" },
      secondaryAction: null,
      trigger: "NotificationCenter popover · empty feed",
      statHint: " celebratory tone is acceptable here — no error styling",
    },
    {
      id: "no-team-members",
      icon: "Users",
      title: "No members in this workspace",
      context: "Invite teammates and assign roles — Owners, Admins, Editors, and Viewers.",
      primaryAction: { label: "Invite Members", icon: "UserPlus", variant: "primary" },
      secondaryAction: { label: "Copy Invite Link", icon: "Copy", variant: "ghost" },
      trigger: "Team settings · zero non-owner members",
      statHint: "Owner is never listed as a 'member' — show them separately above",
    },
  ],

  /* ================================================================
   * 2a. HTTP ERROR SCREENS — full-route takeover, centered, ≤ 3 actions
   * ================================================================ */
  httpErrors: [
    {
      code: 403,
      icon: "ShieldAlert",
      title: "Access forbidden",
      context: "You don't have permission to view this workspace. Your role may have changed, or the resource belongs to another tenant.",
      primaryAction: "Back to Dashboard",
      secondaryAction: "Contact Workspace Owner",
      showSignIn: false,
      illustration: "shield-lock",
      tone: "error",
    },
    {
      code: 404,
      icon: "FileQuestion",
      title: "Page not found",
      context: "The document or route you're looking for was moved, renamed, or deleted by another member.",
      primaryAction: "Back to Dashboard",
      secondaryAction: "Search Knowledge Base",
      showSignIn: false,
      illustration: "map-fragment",
      tone: "warning",
    },
    {
      code: 500,
      icon: "ServerCrash",
      title: "Something went wrong",
      context: "An internal error occurred on our side. Your data is safe — the incident has been logged and our team is on it.",
      primaryAction: "Retry",
      secondaryAction: "View Status Page",
      showSignIn: false,
      illustration: "server-crash",
      tone: "error",
      incidentBadge: "Incident ID: KV-2026-0911 · auto-reported",
    },
    {
      code: 503,
      icon: "Wrench",
      title: "Scheduled maintenance",
      context: "We're upgrading vector index shards to improve retrieval latency. Expected back online by 02:00 UTC.",
      primaryAction: "View Status Page",
      secondaryAction: "Get Email Updates",
      showSignIn: false,
      illustration: "wrench",
      tone: "info",
      incidentBadge: "Window: 00:30 – 02:00 UTC · no data loss",
    },
  ],

  /* ================================================================
   * 2b. CONTEXTUAL ERRORS — inline banners / cards, keep user in flow,
   * always expose Retry. Never lose user input.
   * ================================================================ */
  contextualErrors: [
    {
      id: "network-disconnected",
      icon: "WifiOff",
      title: "You're offline",
      context: "Changes are queued locally and will sync the moment you reconnect. Streaming answers are paused.",
      actions: ["Retry Connection", "View Queued Changes"],
      pattern: "sticky top banner · persists across routes until online",
      dataSafety: "Drafts, half-sent messages, and upload progress preserved in IndexedDB",
    },
    {
      id: "upload-failed",
      icon: "UploadCloud",
      title: "Upload failed",
      context: "\"Q3_Financials.pdf\" couldn't finish uploading. The connection dropped at 64%.",
      actions: ["Retry Upload", "Remove", "Details"],
      pattern: "inline row error within upload wizard + toast fallback",
      dataSafety: "Resumable via tus.io — retry continues from 64%, not 0%",
      variants: ["connection", "file-too-large", "unsupported-format", "quota-exceeded", "virus-detected"],
    },
    {
      id: "embedding-failed",
      icon: "Cpu",
      title: "Embedding failed",
      context: "We couldn't generate vector embeddings for 2 of 5 chunks. The document stays searchable via keyword fallback.",
      actions: ["Retry Embedding", "View Failed Chunks"],
      pattern: "status badge flips to 'Needs Attention' on the doc row + detail modal",
      dataSafety: "Original file preserved; partial index committed for BM25 retrieval",
    },
    {
      id: "chat-generation-failed",
      icon: "Bot",
      title: "Generation failed",
      context: "The AI model timed out while composing this answer. Your question and retrieved sources are preserved.",
      actions: ["Regenerate Answer", "Retry with Another Model", "Copy Question"],
      pattern: "inline assistant bubble, styled error variant, replaces streaming placeholder",
      dataSafety: "Failed turn kept in thread history with retry affordance",
    },
  ],

  /* ================================================================
   * 2c. SKELETON SCREENS — shimmer placeholders matching final layout
   * Rule: skeleton must mirror the exact geometry of the loaded view.
   * Duration cap: show real content by 3s or swap to progress bar.
   * ================================================================ */
  skeletons: {
    principles: [
      "Shape-faithful: every skeleton block maps 1:1 to a real element (no generic spinners for structured layouts)",
      "Shimmer direction: left → right, 1.5s loop, ease-in-out",
      "Never skeleton text mid-line — block out whole lines and word-chips",
      "Dark mode: bg-surface-hover blocks with a +4% luminance sweep",
    ],
    variants: ["dashboard", "document-table", "chat-view", "search-results", "card-grid", "list-rows"],
    timing: { shimmerLoopMs: 1500, swapToProgressBarMs: 3000, ariaBusy: "aria-busy='true' on skeleton container" },
  },

  /* ================================================================
   * 3. RESPONSIVE SPECIFICATION
   * ================================================================ */
  responsive: {
    breakpoints: [
      { id: "sm", range: "375–639px", name: "Mobile", sidebar: "Off-canvas drawer + bottom nav bar", layout: "Single column feed", chat: "Full-width, composer docks above keyboard" },
      { id: "md", range: "768–1023px", name: "Tablet", sidebar: "Icon rail (68px) + expandable", layout: "2-column widgets", chat: "Thread history collapses to sheet" },
      { id: "lg", range: "1024–1279px", name: "Laptop", sidebar: "Persistent 260px", layout: "3-column dashboard", chat: "History sidebar 280px" },
      { id: "xl", range: "1280px+", name: "Desktop", sidebar: "Persistent 260px + optional 3-pane", layout: "Full split-view", chat: "History + canvas + citation drawer" },
    ],
    touchTargets: {
      minimum: "44×44px (WCAG 2.5.5 AAA; Apple HIG 44pt; Material 48dp)",
      implementation: "Visual hit area may be smaller (28px icon) — pad with `p-2` to reach 44px invisible boundary",
      examples: [
        { element: "Bottom nav items", size: "56×56px tap incl. label" },
        { element: "Chat send button", size: "44×44px" },
        { element: "Table row actions", size: "44×44px icon buttons" },
        { element: "Card kebab menus", size: "44×44px" },
        { element: "Citation badge [1]", size: "28px visual · 44px hit via ::before expansion" },
      ],
    },
    mobileKeyboard: {
      chatInputRules: [
        "Composer uses `interactive-widget=resizes-content` viewport meta — viewport shrinks, chat scroll pins to bottom",
        "Enter sends · Shift+Enter newline (physical keyboard); mobile shows dedicated send button (44px)",
        "Textarea max-height 40vh; auto-grow; never covered by keyboard — visualViewport API listener adjusts padding-bottom",
        "Suggestion chips hide while keyboard is open to save vertical space",
        "Safe-area insets: env(safe-area-inset-bottom) on composer and bottom nav",
        "iOS momentum scroll on message list; `-webkit-overflow-scrolling: touch`",
        "Prevent zoom-on-focus: input font-size ≥ 16px (our body scale is 16px/1rem)",
      ],
      bottomNavRules: [
        "5 destinations max: Dashboard, Docs, Chat (center, AI gradient, 56px raised FAB style), Search, Settings",
        "Hidden ≥ md breakpoint; drawer + top hamburger handles tablet+",
        "Active state: brand-500 icon + label caption; inactive: muted",
        "Badge counts (docs pending, unread notifications) render as 16px dots on icons",
        "Haptic: 10ms light impact on tab change (native wrapper only)",
      ],
      drawerRules: [
        "Swipe edge-right → left reveals drawer (80px drag threshold, 60fps transform)",
        "Backdrop blur-xs + black/60; ESC and backdrop tap close",
        "Body scroll lock while open; focus trap cycles within drawer",
        "Route change auto-closes drawer",
      ],
    },
  },

  /* ================================================================
   * 4. DEVELOPER HANDOFF
   * ================================================================ */
  handoff: {
    tokenNaming: {
      convention: "--{category}-{concept}-{variant}-{state?}",
      categories: [
        { prefix: "--color", example: "--color-surface-primary", mapsTo: "bg-surface / #0F172A dark · #FFFFFF light", note: "Semantic, never raw hex in components" },
        { prefix: "--color", example: "--color-brand-500", mapsTo: "#6366F1", note: "Raw scale allowed only in token definitions" },
        { prefix: "--color", example: "--color-feedback-error", mapsTo: "#DC2626 light · #EF4444 dark", note: "Theme-aware via .dark override" },
        { prefix: "--spacing", example: "--spacing-md (16px)", mapsTo: "space-4", note: "8pt scale only: xs(2) sm(4) md(16) lg(24) xl(32) 2xl(48)" },
        { prefix: "--radius", example: "--radius-lg (12px)", mapsTo: "rounded-lg", note: "xs 3 · sm 6 · md 8 · lg 12 · xl 16 · full" },
        { prefix: "--shadow", example: "--shadow-md", mapsTo: "0 4px 6px -1px rgba(0,0,0,0.08)…", note: "Dark variants append -dark" },
        { prefix: "--font", example: "--font-sans / --font-mono", mapsTo: "Inter / JetBrains Mono", note: "Never import fonts ad-hoc" },
        { prefix: "--ease", example: "--ease-spring", mapsTo: "cubic-bezier(0.34,1.56,0.64,1)", note: "Motion durations: instant 100ms → deliberate 400ms" },
        { prefix: "--z", example: "--z-modal (50) / --z-toast (60)", mapsTo: "z-50 / z-[60]", note: "Layer cake: base 0 · dropdown 30 · sticky 20 · drawer 40 · modal 50 · toast 60" },
      ],
      rules: [
        "Components consume semantic tokens only — raw hex/px values fail review",
        "New tokens require a tokens.js entry + CSS var pair (light + dark)",
        "Tailwind arbitrary values only for one-off layouts (grid-cols), never colors",
        "Dark mode: define override under .dark, never in media query (user toggle wins)",
      ],
    },

    ariaLandmarks: [
      { element: "<header>", role: "banner", label: "Primary top navigation — TopNav component", shortcuts: "none" },
      { element: "<aside> / Sidebar", role: "complementary", label: "Workspace navigation sidebar", shortcuts: "⌘B toggle collapse" },
      { element: "<nav> in Sidebar", role: "navigation", label: "Workspace routes (Dashboard, Documents, AI Chat, Search, Settings)", shortcuts: "g then d/c/s keys" },
      { element: "<main>", role: "main", label: "Active route content", shortcuts: "none — skip link jumps here" },
      { element: "Search trigger", role: "searchbox", label: "Search documents, chats, or commands", shortcuts: "⌘K opens palette" },
      { element: "NotificationCenter", role: "dialog + aria-live=polite", label: "Notifications popover", shortcuts: "n" },
      { element: "Thread history", role: "navigation + aria-label='Chat thread history'", label: "Past AI conversations", shortcuts: "⌘/" },
      { element: "Chat message list", role: "log + aria-live=polite", label: "Streaming AI answers announced incrementally", shortcuts: "none" },
      { element: "Citation drawer", role: "dialog + aria-modal", label: "Source citations for the current answer", shortcuts: "c" },
      { element: "Command palette", role: "dialog (modal)", label: "Global spotlight search", shortcuts: "⌘K / Ctrl+K" },
      { element: "Modals", role: "dialog + aria-modal + focus trap", label: "-labelledby modal title, aria-describedby body", shortcuts: "ESC closes" },
      { element: "Toasts", role: "status + aria-live=polite", label: "Transient feedback, auto-dismiss 4s", shortcuts: "swipe dismiss (mobile)" },
      { element: "Tables", role: "table/row/columnheader + aria-sort", label: "Sortable columns announce direction", shortcuts: "Enter on row opens" },
      { element: "Skip link", role: "navigation", label: "Skip to main content — first focusable element", shortcuts: "Tab once from page load" },
    ],

    screenReader: {
      rules: [
        "Every icon-only button MUST have aria-label — no exceptions",
        "Loading regions: aria-busy=true + visually hidden 'Loading documents…' text",
        "Skeletons: aria-hidden=true (decorative) — announce via parent aria-busy",
        "Streaming chat: aria-live=polite on message log; chunk throttled to 1 announcement/sec",
        "Error banners: role=alert (assertive) only for blockers; otherwise role=status",
        "Empty states: heading + action are real focusable elements, never aria-hidden",
        "Focus states: visible ring-2 ring-brand-500 ring-offset-2 on ALL interactive elements",
        "Touch/click targets duplicated for keyboard: Enter + Space both activate",
        "Drag-drop zones: keyboard alternative always provided (Browse files button)",
      ],
    },

    keyboardShortcuts: [
      { keys: "⌘K / Ctrl+K", action: "Open global command palette (spotlight search)", context: "App-wide" },
      { keys: "⌘B / Ctrl+B", action: "Toggle sidebar collapse (desktop) / drawer (mobile)", context: "App shell" },
      { keys: "⌘/ / Ctrl+/", action: "Toggle chat thread history sidebar", context: "AI Chat" },
      { keys: "Enter", action: "Send chat message", context: "Chat composer (not streaming)" },
      { keys: "Shift+Enter", action: "New line in composer", context: "Chat composer" },
      { keys: "ESC", action: "Close topmost layer: modal → drawer → palette → dropdown", context: "App-wide, layered" },
      { keys: "c", action: "Open citation drawer for latest answer", context: "AI Chat (no input focused)" },
      { keys: "n", action: "Toggle notification center", context: "App shell (no input focused)" },
      { keys: "g d", action: "Go to Dashboard", context: "Sequential go-to prefix: g then d" },
      { keys: "g c", action: "Go to AI Chat", context: "Sequential: g then c" },
      { keys: "g s", action: "Go to Search", context: "Sequential: g then s" },
      { keys: "g w", action: "Go to Workspace Settings", context: "Sequential: g then w" },
      { keys: "? (Shift+/)", action: "Open this keyboard cheat sheet", context: "App-wide (no input focused)" },
      { keys: "Cmd/Ctrl+Shift+L", action: "Toggle light/dark theme", context: "App-wide" },
      { keys: "↑ / ↓", action: "Navigate palette & dropdown results; ↑ recalls last prompt in composer", context: "Palette, selects, composer" },
      { keys: "Tab", action: "Advance focus ring; first Tab from page load hits skip-link", context: "App-wide" },
    ],
  },
};
