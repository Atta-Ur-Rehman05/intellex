/**
 * Knowva Design System - Marketing & Authentication Specifications (Stage 5)
 * Brand: Knowva ("Your AI Knowledge Workspace")
 */

export const marketingAuthSpecs = {
  version: "1.0.0",
  stage: "Stage 5: Public Marketing & Authentication Suite",
  pricingTiers: [
    {
      id: "free",
      name: "Starter",
      monthly: 0,
      annual: 0,
      targetAudience: "Individual engineers & personal knowledge bases",
      limits: { storage: "5 GB", workspaces: 1, aiQueriesPerMonth: 500 },
    },
    {
      id: "pro",
      name: "Team Pro",
      monthly: 19,
      annual: 15,
      discountBadge: "Save 20%",
      targetAudience: "Product & Engineering squads (2-50 seats)",
      limits: { storage: "50 GB", workspaces: 5, aiQueriesPerMonth: "Unlimited" },
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthly: 49,
      annual: 39,
      targetAudience: "SOC2-regulated organizations & enterprises",
      limits: { storage: "1 TB+", workspaces: "Unlimited", aiQueriesPerMonth: "Unlimited" },
      sla: "99.95% uptime & sub-80ms vector query SLA"
    }
  ],
  authSecurity: {
    passwordComplexity: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      entropyScores: ["Weak (1)", "Moderate (2)", "Strong (3)", "Excellent (4)"]
    },
    emailVerification: {
      codeLength: 6,
      expirationSeconds: 900, // 15 mins
      resendThrottleSeconds: 45,
      maxFailedAttempts: 5,
    },
    ssoProtocols: ["Google OAuth2 / OIDC", "GitHub OAuth", "SAML 2.0 (Okta, Azure AD, PingIdentity)"],
    zeroDataRetentionPolicy: "Client queries and vector chunk embeddings are strictly excluded from foundation model public training sets."
  },
  seoGuidelines: {
    titleTemplate: "%s | Knowva — Your AI Knowledge Workspace",
    metaDescription: "Enterprise AI Knowledge Management combining Notion collaborative documents, ChatGPT neural reasoning, and Google Drive multi-cloud ingestion with verified source citations.",
    openGraphType: "website",
    canonicalHost: "https://knowva.ai"
  }
};
