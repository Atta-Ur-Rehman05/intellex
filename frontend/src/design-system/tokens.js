/**
 * Knowva Design System Token Architecture
 * Brand: Knowva ("Your AI Knowledge Workspace")
 * Attributes: Intelligent, Trustworthy, Minimal, Professional, Premium, AI-first.
 * 
 * Strict WCAG 2.1 AA/AAA contrast adherence.
 */

export const tokens = {
  brand: {
    name: "Knowva",
    tagline: "Your AI Knowledge Workspace",
    attributes: ["Intelligent", "Trustworthy", "Minimal", "Professional", "Premium", "AI-first"],
  },

  // 1. Color Palette & Semantics
  colors: {
    // Primary Brand Scale (Electric Indigo / Sapphire AI)
    brand: {
      50:  { hex: "#EEF2FF", hsl: "hsl(226, 100%, 97%)", name: "brand-50" },
      100: { hex: "#E0E7FF", hsl: "hsl(226, 100%, 94%)", name: "brand-100" },
      200: { hex: "#C7D2FE", hsl: "hsl(228, 96%, 89%)",  name: "brand-200" },
      300: { hex: "#A5B4FC", hsl: "hsl(230, 94%, 82%)",  name: "brand-300" },
      400: { hex: "#818CF8", hsl: "hsl(234, 89%, 74%)",  name: "brand-400" },
      500: { hex: "#6366F1", hsl: "hsl(239, 84%, 67%)",  name: "brand-500", role: "Primary Interactive" },
      600: { hex: "#4F46E5", hsl: "hsl(243, 75%, 59%)",  name: "brand-600", role: "Primary Hover / Accent" },
      700: { hex: "#4338CA", hsl: "hsl(244, 58%, 51%)",  name: "brand-700" },
      800: { hex: "#3730A3", hsl: "hsl(244, 55%, 41%)",  name: "brand-800" },
      900: { hex: "#312E81", hsl: "hsl(242, 47%, 34%)",  name: "brand-900" },
      950: { hex: "#1E1B4B", hsl: "hsl(243, 47%, 20%)",  name: "brand-950" },
    },

    // Neutral Scale (High-precision Slate)
    neutral: {
      50:  { hex: "#F8FAFC", hsl: "hsl(210, 40%, 98%)", name: "slate-50", role: "Canvas (Light)" },
      100: { hex: "#F1F5F9", hsl: "hsl(210, 40%, 96%)", name: "slate-100", role: "Surface Subtle" },
      200: { hex: "#E2E8F0", hsl: "hsl(214, 32%, 91%)", name: "slate-200", role: "Border Subtle" },
      300: { hex: "#CBD5E1", hsl: "hsl(213, 27%, 84%)", name: "slate-300", role: "Border Default" },
      400: { hex: "#94A3B8", hsl: "hsl(215, 20%, 65%)", name: "slate-400", role: "Text Disabled" },
      500: { hex: "#64748B", hsl: "hsl(215, 16%, 47%)", name: "slate-500", role: "Text Muted" },
      600: { hex: "#475569", hsl: "hsl(215, 19%, 35%)", name: "slate-600", role: "Text Secondary" },
      700: { hex: "#334155", hsl: "hsl(217, 19%, 27%)", name: "slate-700", role: "Dark Border Strong" },
      800: { hex: "#1E293B", hsl: "hsl(215, 28%, 17%)", name: "slate-800", role: "Dark Surface Elevated" },
      900: { hex: "#0F172A", hsl: "hsl(222, 47%, 11%)", name: "slate-900", role: "Dark Surface" },
      950: { hex: "#070B14", hsl: "hsl(223, 47%, 5%)",  name: "slate-950", role: "Dark Canvas" },
    },

    // Semantic Feedback Colors
    feedback: {
      success: {
        light: "#10B981",
        base: "#059669",
        dark: "#047857",
        bgLight: "#ECFDF5",
        bgDark: "rgba(16, 185, 129, 0.12)",
        label: "Success (Embedding complete, Doc saved)",
      },
      warning: {
        light: "#F59E0B",
        base: "#D97706",
        dark: "#B45309",
        bgLight: "#FFFBEB",
        bgDark: "rgba(245, 158, 11, 0.12)",
        label: "Warning (Quota near limit, Pending invite)",
      },
      error: {
        light: "#EF4444",
        base: "#DC2626",
        dark: "#B91C1C",
        bgLight: "#FEF2F2",
        bgDark: "rgba(239, 68, 68, 0.12)",
        label: "Error (Failed ingestion, Auth error)",
      },
      info: {
        light: "#0EA5E9",
        base: "#0284C7",
        dark: "#0369A1",
        bgLight: "#F0F9FF",
        bgDark: "rgba(14, 165, 233, 0.12)",
        label: "Info (Syncing data, Version update)",
      },
    },

    // AI & Intelligence Accents (Violet / Cyan / Shimmer)
    ai: {
      glow: "rgba(99, 102, 241, 0.25)",
      sparkle: "#8B5CF6",
      cyan: "#06B6D4",
      gradient: "linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)",
      glowBorder: "rgba(168, 85, 247, 0.35)",
    },

    // WCAG 2.1 AA/AAA Contrast Ratios Matrix
    contrast: [
      { element: "Light Canvas vs Text Primary", foreground: "#0F172A", background: "#FFFFFF", ratio: "15.8:1", rating: "AAA" },
      { element: "Light Canvas vs Text Secondary", foreground: "#475569", background: "#FFFFFF", ratio: "7.1:1", rating: "AAA" },
      { element: "Light Canvas vs Brand-600", foreground: "#4F46E5", background: "#FFFFFF", ratio: "5.4:1", rating: "AA" },
      { element: "Dark Canvas vs Text Primary", foreground: "#F8FAFC", background: "#070B14", ratio: "18.2:1", rating: "AAA" },
      { element: "Dark Canvas vs Text Secondary", foreground: "#94A3B8", background: "#070B14", ratio: "8.6:1", rating: "AAA" },
      { element: "Dark Canvas vs Brand-400", foreground: "#818CF8", background: "#070B14", ratio: "6.8:1", rating: "AAA" },
      { element: "Button Primary (White on Brand-600)", foreground: "#FFFFFF", background: "#4F46E5", ratio: "5.4:1", rating: "AA" },
    ]
  },

  // 2. Typography System
  typography: {
    fonts: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace",
    },
    scale: {
      display: {
        fontSize: "2.5rem", // 40px
        lineHeight: "3rem", // 48px
        letterSpacing: "-0.03em",
        fontWeight: "800",
        usage: "Hero headlines, high-impact marketing display",
      },
      h1: {
        fontSize: "2rem", // 32px
        lineHeight: "2.5rem", // 40px
        letterSpacing: "-0.025em",
        fontWeight: "700",
        usage: "Page headers, primary workspace titles",
      },
      h2: {
        fontSize: "1.5rem", // 24px
        lineHeight: "2rem", // 32px
        letterSpacing: "-0.02em",
        fontWeight: "600",
        usage: "Section titles, modal headers",
      },
      h3: {
        fontSize: "1.25rem", // 20px
        lineHeight: "1.75rem", // 28px
        letterSpacing: "-0.015em",
        fontWeight: "600",
        usage: "Card titles, drawer headers, group labels",
      },
      h4: {
        fontSize: "1rem", // 16px
        lineHeight: "1.5rem", // 24px
        letterSpacing: "-0.01em",
        fontWeight: "600",
        usage: "Sub-headings, table headers, widget titles",
      },
      bodyLg: {
        fontSize: "1rem", // 16px
        lineHeight: "1.5rem", // 24px
        letterSpacing: "-0.005em",
        fontWeight: "400",
        usage: "Chat messages, document content, intro text",
      },
      body: {
        fontSize: "0.875rem", // 14px
        lineHeight: "1.25rem", // 20px
        letterSpacing: "0em",
        fontWeight: "400",
        usage: "Standard body text, form labels, list items",
      },
      bodyMedium: {
        fontSize: "0.875rem", // 14px
        lineHeight: "1.25rem", // 20px
        letterSpacing: "0em",
        fontWeight: "500",
        usage: "Buttons, interactive chips, table row titles",
      },
      caption: {
        fontSize: "0.75rem", // 12px
        lineHeight: "1rem", // 16px
        letterSpacing: "0.01em",
        fontWeight: "500",
        usage: "Badges, metadata tags, timestamps, tooltips",
      },
      codeMono: {
        fontSize: "0.8125rem", // 13px
        lineHeight: "1.25rem", // 20px
        letterSpacing: "-0.01em",
        fontWeight: "500",
        fontFamily: "'JetBrains Mono', monospace",
        usage: "Code blocks, citation IDs [1], API keys, regex filters",
      }
    }
  },

  // 3. 8-Point Spacing Scale & Layout Grid
  spacing: [
    { token: "space-0.5", px: "2px", rem: "0.125rem", usage: "Hairline offsets, badge internal padding" },
    { token: "space-1",   px: "4px", rem: "0.25rem",  usage: "Tight chip gap, micro-margins" },
    { token: "space-2",   px: "8px", rem: "0.5rem",   usage: "Icon button padding, list item vertical padding" },
    { token: "space-3",   px: "12px", rem: "0.75rem", usage: "Input field padding, dropdown item padding" },
    { token: "space-4",   px: "16px", rem: "1rem",    usage: "Base spacing: Card internal padding, stack gaps" },
    { token: "space-6",   px: "24px", rem: "1.5rem",  usage: "Container gutters, modal inner body padding" },
    { token: "space-8",   px: "32px", rem: "2rem",    usage: "Section spacing, dashboard widget gaps" },
    { token: "space-12",  px: "48px", rem: "3rem",    usage: "Page header margins, major layout separation" },
    { token: "space-16",  px: "64px", rem: "4rem",    usage: "Landing page hero vertical margins" },
  ],

  breakpoints: [
    { name: "Mobile", range: "375px - 640px", prefix: "sm", desc: "Phone viewports, collapsible mobile drawer, single-column feed" },
    { name: "Tablet", range: "768px - 1024px", prefix: "md/lg", desc: "iPads/tablets, icon-only collapsed sidebar, 2-column dashboard" },
    { name: "Laptop", range: "1024px - 1280px", prefix: "xl", desc: "Compact laptops, persistent sidebar, 3-column split view" },
    { name: "Desktop", range: "1440px+", prefix: "2xl", desc: "Wide workstation monitors, full document split + AI drawer" },
  ],

  // 4. Elevation, Radii & Motion
  radii: [
    { token: "rounded-xs", px: "3px", usage: "Tags, sub-badges, checkboxes" },
    { token: "rounded-sm", px: "6px", usage: "Code blocks, citation chips, tooltips" },
    { token: "rounded-md", px: "8px", usage: "Buttons, text inputs, dropdown menus" },
    { token: "rounded-lg", px: "12px", usage: "Cards, floating dialogs, modals" },
    { token: "rounded-xl", px: "16px", usage: "Dashboard containers, upload dropzone" },
    { token: "rounded-full", px: "9999px", usage: "Avatars, pill badges, command palette pill" },
  ],

  shadows: {
    light: [
      { name: "shadow-xs", css: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", usage: "Subtle buttons, input focus states" },
      { name: "shadow-sm", css: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)", usage: "Cards, table rows on hover" },
      { name: "shadow-md", css: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)", usage: "Dropdown menus, popovers" },
      { name: "shadow-lg", css: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)", usage: "Modals, preview drawers" },
      { name: "shadow-xl", css: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)", usage: "Command-K Palette, AI Chat drawer" },
    ],
    dark: [
      { name: "shadow-xs-dark", css: "0 1px 2px 0 rgba(0, 0, 0, 0.4)", usage: "Dark subtle elevation" },
      { name: "shadow-sm-dark", css: "0 2px 4px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)", usage: "Dark cards with inner highlight" },
      { name: "shadow-md-dark", css: "0 6px 12px -2px rgba(0, 0, 0, 0.6), 0 3px 6px -3px rgba(0, 0, 0, 0.4)", usage: "Dark dropdowns & popovers" },
      { name: "shadow-lg-dark", css: "0 12px 24px -4px rgba(0, 0, 0, 0.7), 0 4px 8px -4px rgba(0, 0, 0, 0.5)", usage: "Dark modals with glow edge" },
      { name: "shadow-ai-glow", css: "0 0 24px -4px rgba(99, 102, 241, 0.35), 0 8px 16px -4px rgba(168, 85, 247, 0.2)", usage: "AI Chat response active glow" },
    ]
  },

  motion: {
    durations: {
      instant: "100ms", // Micro-hover, active click
      fast: "150ms",    // Tooltip, chip toggle, button state
      normal: "250ms",  // Dropdowns, popovers, accordion
      deliberate: "400ms", // Modal open, sidebar drawer collapse
    },
    easings: {
      easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Modals, menus entering
      easeInOutCubic: "cubic-bezier(0.65, 0, 0.35, 1)",      // Sidebar drawer expanding
      springGentle: "cubic-bezier(0.34, 1.56, 0.64, 1)",    // Micro-bounces, badges, like buttons
    }
  }
};
