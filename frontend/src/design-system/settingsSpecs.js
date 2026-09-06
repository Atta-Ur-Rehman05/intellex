export const settingsSpecs = {
  version: "1.0.0",
  stage: "Stage 11: Account Settings, Security, Billing & API Keys",

  profile: {
    name: "Sarah Chen",
    email: "sarah.chen@acme.ai",
    emailVerified: true,
    title: "Head of Knowledge Engineering",
    timezone: "Europe/London",
    memberSince: "March 2024",
  },

  timezones: [
    { value: "Europe/London", label: "GMT+0 — London" },
    { value: "Europe/Berlin", label: "GMT+1 — Berlin" },
    { value: "America/New_York", label: "GMT-5 — New York" },
    { value: "America/Los_Angeles", label: "GMT-8 — Los Angeles" },
    { value: "Asia/Singapore", label: "GMT+8 — Singapore" },
    { value: "Asia/Tokyo", label: "GMT+9 — Tokyo" },
  ],

  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    entropyLabels: ["Weak", "Moderate", "Strong", "Excellent"],
  },

  twoFactor: {
    enabled: true,
    method: "Authenticator App (TOTP)",
    lastVerified: "Sep 1, 2026 at 09:14 UTC",
    recoveryCodesTotal: 10,
    recoveryCodesRemaining: 8,
    methods: [
      { id: "totp", label: "Authenticator App (TOTP)", description: "Time-based one-time codes from Google Authenticator, 1Password, or Authy.", recommended: true },
      { id: "sms", label: "SMS Backup", description: "Fallback codes sent to +44 7700 ••• 471 for offline recovery." },
      { id: "webauthn", label: "Security Key (WebAuthn)", description: "Phishing-resistant hardware keys such as YubiKey or Titan.", enterpriseOnly: true },
    ],
  },

  connectedAccounts: [
    { id: "google", provider: "Google", handle: "sarah.chen@acme.ai", connected: true, scopes: ["openid", "profile", "email"], connectedAt: "Apr 2, 2026" },
    { id: "github", provider: "GitHub", handle: "@sarah-chen", connected: true, scopes: ["read:user", "user:email"], connectedAt: "Nov 14, 2025" },
    { id: "saml", provider: "Okta SAML 2.0", handle: null, connected: false, scopes: ["SSO"], enterpriseOnly: true },
  ],

  sessions: [
    { id: "s1", device: "MacBook Pro · Chrome 128", location: "London, UK", ip: "81.42.108.14", time: "Current session", current: true },
    { id: "s2", device: "iPhone 15 · Knowva iOS", location: "London, UK", ip: "81.42.108.20", time: "2 hours ago" },
    { id: "s3", device: "Windows 11 · Edge", location: "Manchester, UK", ip: "212.161.8.44", time: "Yesterday, 16:20" },
  ],

  appearance: {
    themes: [
      { id: "light", label: "Light", description: "Bright canvas optimized for daylight workspaces." },
      { id: "dark", label: "Dark", description: "Low-glare midnight palette for extended focus sessions." },
      { id: "system", label: "System Sync", description: "Follows your operating system appearance preference automatically." },
    ],
  },

  languages: [
    { value: "en-US", label: "English (US)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "de", label: "Deutsch" },
    { value: "fr", label: "Français" },
    { value: "es", label: "Español" },
    { value: "ja", label: "日本語" },
    { value: "zh-CN", label: "中文（简体）" },
    { value: "pt-BR", label: "Português (Brasil)" },
  ],

  notifications: {
    channels: [
      { id: "inapp", label: "In-app Notifications", description: "Real-time toasts and Activity Feed entries inside Knowva." },
      { id: "email", label: "Email Digests", description: "Summaries and alerts delivered to your primary inbox." },
    ],
    items: {
      inapp: [
        { id: "mentions", label: "Mentions & Replies", description: "Someone @mentions you in a comment or chat thread.", enabled: true, icon: "at" },
        { id: "shares", label: "Document Shares", description: "A colleague shares a document or folder with you.", enabled: true, icon: "doc" },
        { id: "ai", label: "AI Task Completion", description: "Long-running RAG jobs and exports finish processing.", enabled: true, icon: "ai" },
        { id: "roles", label: "Permission Changes", description: "Your role or workspace access is modified.", enabled: true, icon: "shield" },
      ],
      email: [
        { id: "daily", label: "Daily Knowledge Digest", description: "Every morning: overnight AI activity and trending documents.", enabled: false, icon: "calendar" },
        { id: "weekly", label: "Weekly AI Insights", description: "Monday summary of retrieval quality and top citation sources.", enabled: true, icon: "zap" },
        { id: "billing", label: "Billing & Invoices", description: "Receipts, failed payments, and seat limit warnings.", enabled: true, locked: true, icon: "billing" },
        { id: "security", label: "Security Alerts", description: "New sign-ins, 2FA changes, and API key revocations.", enabled: true, locked: true, icon: "security" },
      ],
    },
  },

  billing: {
    currency: "USD",
    currentCycle: "annual",
    renewalDate: "October 1, 2026",
    nextInvoice: { amount: 180.0, seats: 12 },
    seatUsage: { used: 12, total: 20, unitPrice: 15 },
    plans: [
      {
        id: "starter",
        name: "Starter",
        monthly: 0,
        annual: 0,
        seatLine: "1 seat",
        targetAudience: "Individual engineers & personal knowledge bases",
        features: ["1 workspace", "5 GB storage", "500 AI queries / month", "Community support"],
      },
      {
        id: "pro",
        name: "Team Pro",
        monthly: 19,
        annual: 15,
        seatLine: "Up to 50 seats",
        targetAudience: "Product & Engineering squads (2–50 seats)",
        features: ["Up to 50 seats", "50 GB storage", "Unlimited AI queries & citations", "Semantic hybrid search (RRF)", "Priority support"],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthly: 49,
        annual: 39,
        seatLine: "Unlimited seats",
        targetAudience: "SOC2-regulated organizations & enterprises",
        features: ["Unlimited workspaces & seats", "1 TB+ storage", "SSO / SAML 2.0 & SCIM", "99.95% uptime SLA", "Dedicated CSM & audit logs"],
      },
    ],
    paymentMethods: [
      { id: "pm-1", brand: "Visa", last4: "4242", exp: "04/28", holder: "Sarah Chen", default: true },
      { id: "pm-2", brand: "Mastercard", last4: "8219", exp: "11/27", holder: "Sarah Chen", default: false },
    ],
    invoices: [
      { id: "inv-1", dateISO: "2026-09-01", date: "Sep 1, 2026", number: "INV-2026-0087", period: "Annual · Oct 2025 – Sep 2026", amount: 180.0, status: "paid" },
      { id: "inv-2", dateISO: "2026-08-01", date: "Aug 1, 2026", number: "INV-2026-0074", period: "Seats top-up · 12 seats", amount: 180.0, status: "paid" },
      { id: "inv-3", dateISO: "2026-07-01", date: "Jul 1, 2026", number: "INV-2026-0061", period: "Monthly · 14 seats", amount: 210.0, status: "paid" },
      { id: "inv-4", dateISO: "2026-06-01", date: "Jun 1, 2026", number: "INV-2026-0048", period: "Monthly · 14 seats", amount: 210.0, status: "paid" },
      { id: "inv-5", dateISO: "2026-05-01", date: "May 1, 2026", number: "INV-2026-0035", period: "Monthly · 10 seats", amount: 120.0, status: "refunded" },
      { id: "inv-6", dateISO: "2026-04-01", date: "Apr 1, 2026", number: "INV-2026-0021", period: "Monthly · 10 seats", amount: 120.0, status: "paid" },
    ],
  },

  apiKeys: {
    scopes: [
      { id: "read", label: "Read", description: "List and read documents, folders, tags, and chat history. No mutations allowed." },
      { id: "write", label: "Write", description: "Upload documents, manage tags and folders, create and append chat threads." },
      { id: "admin", label: "Admin", description: "Full workspace control: members, billing, keys, and workspace deletion. Implies Read + Write." },
    ],
    expiryOptions: [
      { value: "30", label: "30 days" },
      { value: "60", label: "60 days" },
      { value: "90", label: "90 days (recommended)" },
      { value: "365", label: "1 year" },
      { value: "never", label: "No expiration" },
    ],
    keys: [
      { id: "k1", name: "Production RAG Pipeline", maskedKey: "kv_live_9f3e••••••••d21a", scopes: ["read", "write"], createdISO: "2026-06-12", created: "Jun 12, 2026", lastUsed: "2 hours ago", status: "active" },
      { id: "k2", name: "CI Metrics Export", maskedKey: "kv_live_c4a1••••••••77be", scopes: ["read"], createdISO: "2026-04-03", created: "Apr 3, 2026", lastUsed: "5 days ago", status: "active" },
      { id: "k3", name: "Legacy Admin Console", maskedKey: "kv_live_e7d2••••••••03ff", scopes: ["read", "write", "admin"], createdISO: "2025-12-19", created: "Dec 19, 2025", lastUsed: "3 months ago", status: "revoked" },
    ],
    stats: { requests30d: "128,540", failureRate: "0.02%" },
    rateLimits: {
      perKey: "600 req/min",
      perWorkspace: "5,000 req/day",
      signing: "HMAC-SHA256 request signing",
      rotation: "90-day rotation policy",
      storage: "SHA-256 hashed at rest · plaintext shown once",
    },
    baseUrl: "https://api.knowva.ai/v1",
    endpoints: ["GET /v1/documents", "POST /v1/documents", "POST /v1/chat/completions", "GET /v1/workspaces"],
  },
};
