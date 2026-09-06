/**
 * Knowva Design System - Application Shell & Navigation Specifications (Stage 4)
 * Brand: Knowva ("Your AI Knowledge Workspace")
 */

export const shellSpecs = {
  version: "1.0.0",
  stage: "Stage 4: App Shell & Global Navigation",
  geometry: {
    sidebar: {
      expandedWidth: "260px",
      collapsedWidth: "68px",
      mobileDrawerWidth: "288px (max 85vw)",
      transitionDuration: "300ms ease-in-out",
      zIndex: 30,
    },
    topNav: {
      height: "64px (h-16)",
      backdropBlur: "backdrop-blur-md",
      backgroundOpacity: "bg-surface/85",
      zIndex: 20,
    },
    commandPalette: {
      maxWidth: "672px (max-w-2xl)",
      topOffset: "64px - 96px",
      maxHeight: "384px (max-h-96)",
      zIndex: 50,
    },
    notificationCenter: {
      popoverWidth: "320px - 384px (w-80 sm:w-96)",
      maxHeight: "320px",
      zIndex: 50,
    }
  },
  breakpoints: [
    {
      viewport: "Desktop (>= 1024px)",
      sidebarMode: "Persistent (260px expanded or 68px collapsed via ⌘B toggle)",
      topNavMode: "Full breadcrumb trail, quick search bar with ⌘K badge, notifications, theme toggle, and profile avatar with name.",
      commandPalette: "Triggered via ⌘K, Ctrl+K, or search trigger button.",
    },
    {
      viewport: "Tablet (768px - 1023px)",
      sidebarMode: "Auto-collapses to 68px icon-rail with hover tooltips; can expand on demand.",
      topNavMode: "Breadcrumbs truncate middle items; compact search button.",
      commandPalette: "Available via search icon or shortcut.",
    },
    {
      viewport: "Mobile (< 768px)",
      sidebarMode: "Off-canvas drawer hidden by default; slides out from left on hamburger menu tap with 60% dark backdrop.",
      topNavMode: "Hamburger button, active section title, quick search icon, notifications bell, and avatar.",
      commandPalette: "Full-width spotlight modal adjusted for mobile keyboard.",
    }
  ],
  keyboardShortcuts: [
    { key: "⌘ + K / Ctrl + K", description: "Toggle Global Command Palette spotlight search", scope: "Global" },
    { key: "⌘ + B / Ctrl + B", description: "Toggle Sidebar expanded (260px) vs collapsed (68px)", scope: "Global" },
    { key: "Esc", description: "Close Command Palette, Modals, or Notification Popover", scope: "Global" },
    { key: "↑ / ↓", description: "Navigate items in Command Palette or Dropdown lists", scope: "Command Palette" },
    { key: "Enter", description: "Select highlighted item in Command Palette", scope: "Command Palette" },
    { key: "?", description: "Open keyboard shortcuts help cheat sheet", scope: "Global" },
  ],
  ariaLandmarks: [
    { element: "header (TopNav)", role: "banner", label: "Top Application Header with breadcrumbs and user tools" },
    { element: "aside (Sidebar)", role: "navigation", label: "Primary workspace navigation and folder collections" },
    { element: "main (Viewport)", role: "main", label: "Primary application workspace view" },
    { element: "div (CommandPalette)", role: "dialog", label: "Command Palette spotlight dialog (aria-modal='true')" },
    { element: "nav (Breadcrumbs)", role: "navigation", label: "Breadcrumb trail showing active hierarchy path" },
  ]
};
