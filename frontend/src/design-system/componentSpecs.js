/**
 * Knowva Design System - Component Library Specifications (Stage 3)
 * Brand: Knowva ("Your AI Knowledge Workspace")
 * 
 * Detailed specification covering states, variants, micro-interactions,
 * accessibility standards (WCAG 2.1 AA/AAA), and design token mappings.
 */

export const componentSpecs = {
  version: "1.0.0",
  stage: "Stage 3: Core Reusable Component Library",
  categories: [
    {
      id: "inputs-controls",
      title: "1. Inputs & Controls",
      description: "Foundational interactive elements for user inputs, triggering actions, state toggles, and contextual feedback.",
      components: [
        {
          name: "Button",
          tag: "Atom",
          desc: "Multi-purpose interactive trigger with 6 visual variants, 4 sizes, and active loading state.",
          variants: ["primary", "secondary", "ghost", "destructive", "outline", "ai"],
          sizes: ["sm (32px)", "md (36px)", "lg (44px)", "icon (36x36px)"],
          states: ["Default", "Hover", "Active/Pressed (scale 0.98)", "Focus-visible", "Disabled (50% opacity)", "Loading (inline spinner)"],
          accessibility: {
            ariaRoles: "role='button', aria-busy='true' when loading",
            keyboard: "Enter or Spacebar triggers click",
            focusRing: "2px brand-500 offset with 2px canvas spacing",
            wcag: "WCAG AAA contrast on primary (#FFFFFF on #4F46E5 = 5.4:1 AA+; text 15.8:1)"
          },
          motion: "Transition all 150ms ease-out, scale spring 0.98 on active press"
        },
        {
          name: "Form Inputs (Text & Password)",
          tag: "Molecule",
          desc: "Single-line inputs with integrated floating labels, left/right icons, error alerts, and eye visibility toggle.",
          variants: ["standard", "password-toggle", "with-leading-icon", "with-trailing-icon"],
          sizes: ["md (40px height)"],
          states: ["Default", "Hover", "Focus (ring-2 brand-500)", "Error (border-red-500, aria-invalid)", "Disabled"],
          accessibility: {
            ariaRoles: "aria-invalid='true', aria-describedby for error/helper text, aria-label for eye toggle",
            keyboard: "Standard text editing, Tab navigation",
            focusRing: "ring-2 brand-500 with smooth border highlight",
            wcag: "Placeholder meets 4.5:1 AA contrast against dark/light surfaces"
          },
          motion: "Border color transition 150ms ease-in-out"
        },
        {
          name: "Search Input",
          tag: "Molecule",
          desc: "Dedicated search bar with search icon, instant clear button, and keyboard shortcut badge (⌘K).",
          variants: ["default", "compact"],
          sizes: ["40px height"],
          states: ["Empty", "Filled (shows clear X)", "Focused", "Disabled"],
          accessibility: {
            ariaRoles: "role='searchbox', aria-label='Search documents, chats, or commands'",
            keyboard: "Esc clears input or closes dropdown",
            focusRing: "ring-2 brand-500",
            wcag: "High contrast icon and badge against canvas"
          },
          motion: "Clear button fade-in on text presence"
        },
        {
          name: "Select / Dropdown",
          tag: "Molecule",
          desc: "Custom accessible dropdown select with inline search filter, category icons, and check indicators.",
          variants: ["single-select", "searchable-select"],
          sizes: ["40px trigger height, max 224px dropdown height"],
          states: ["Closed", "Open", "Hover item", "Active item", "Selected item", "Disabled"],
          accessibility: {
            ariaRoles: "role='listbox', role='option', aria-expanded, aria-haspopup='listbox'",
            keyboard: "Arrow Down / Up navigates options, Enter selects, Esc dismisses",
            focusRing: "ring-2 brand-500 on trigger",
            wcag: "Selected item highlighted with brand-500/10 background and check icon"
          },
          motion: "Spring dropdown entrance (zoom-in-95, fade-in, 150ms)"
        },
        {
          name: "Badges & Tags",
          tag: "Atom",
          desc: "Metadata indicators for file statuses, embedding stages, counts, and removable filter chips.",
          variants: ["brand", "neutral", "success", "warning", "error", "info", "ai-sparkle"],
          sizes: ["sm (text-10px)", "md (text-12px)", "lg (text-12px bold)"],
          states: ["Static badge", "Interactive tag with remove (X) button", "Pulse dot indicator"],
          accessibility: {
            ariaRoles: "aria-label for tags with remove action",
            keyboard: "Focusable remove button with Esc/Enter trigger",
            focusRing: "ring-1 on dismiss button",
            wcag: "Contrast compliant tinted borders and backgrounds"
          },
          motion: "Hover background transition 150ms"
        },
        {
          name: "Tooltip",
          tag: "Atom",
          desc: "Non-intrusive contextual hint rendered on mouse hover and keyboard focus.",
          variants: ["top", "bottom", "left", "right"],
          sizes: ["compact text-xs"],
          states: ["Hidden", "Entering (200ms delay)", "Visible", "Exiting"],
          accessibility: {
            ariaRoles: "role='tooltip', aria-describedby",
            keyboard: "Triggers on focus, dismisses on blur or Escape",
            focusRing: "None (renders over anchor)",
            wcag: "White text on Slate-900 background (15:1 AAA contrast)"
          },
          motion: "Fade-in + 95% zoom-in transition 150ms"
        },
        {
          name: "Tabs & Breadcrumbs",
          tag: "Molecule",
          desc: "Navigation controls supporting line-underline and segmented pill styles with animated indicators.",
          variants: ["line tabs", "pill tabs", "hierarchical breadcrumb with truncation"],
          sizes: ["sm", "md"],
          states: ["Active (animated underline/pill)", "Inactive", "Hover", "Disabled"],
          accessibility: {
            ariaRoles: "role='tablist', role='tab', aria-selected='true', aria-current='page'",
            keyboard: "Arrow Left / Right cycles tabs",
            focusRing: "Focus visible on tab buttons",
            wcag: "Active tab has brand-500 high contrast indicator"
          },
          motion: "Framer Motion layout spring (stiffness: 450, damping: 35)"
        }
      ]
    },
    {
      id: "containers-overlays",
      title: "2. Containers & Overlays",
      description: "Structural content grouping, depth elevation, modal dialogs, contextual menus, and notification toasts.",
      components: [
        {
          name: "Card",
          tag: "Organism",
          desc: "Universal container for content modules, statistics cards, document previews, and AI widgets.",
          variants: ["standard", "interactive (lift on hover)", "ai (border glow)", "elevated"],
          sizes: ["Modular (Header, Content, Footer)"],
          states: ["Static", "Hover (elevates -2px, increases shadow)", "Active"],
          accessibility: {
            ariaRoles: "article or section role when standalone",
            keyboard: "Focusable if clickable (interactive variant)",
            focusRing: "ring-2 brand-500 on focus",
            wcag: "Border-subtle / default provides 3:1 boundary contrast"
          },
          motion: "Smooth -2px translate-y on interactive hover"
        },
        {
          name: "Modal & ConfirmDialog",
          tag: "Organism",
          desc: "Accessible backdrop overlay for critical confirmations, form wizards, and fullscreen inspectors.",
          variants: ["confirm-dialog", "form-modal", "fullscreen-preview"],
          sizes: ["sm (448px)", "md (512px)", "lg (672px)", "fullscreen (95vw)"],
          states: ["Entering (backdrop fade, modal zoom-in-95)", "Open", "Exiting"],
          accessibility: {
            ariaRoles: "role='dialog', aria-modal='true', aria-labelledby, aria-describedby",
            keyboard: "Escape key dismisses dialog, Tab trapped inside modal",
            focusRing: "Focus automatically placed on initial primary element",
            wcag: "Dark backdrop 60% with blur ensures underlying canvas isolation"
          },
          motion: "Spring zoom 95% -> 100% with backdrop opacity 200ms"
        },
        {
          name: "Notification Toasts",
          tag: "Molecule",
          desc: "Floating bottom-right feedback stack for operations, errors, and live AI ingestion tracking.",
          variants: ["success", "warning", "error", "info", "ai-processing (with gradient shimmer bar)"],
          sizes: ["max-w-sm (384px)"],
          states: ["Entering (slide up from +20px)", "Visible", "Exiting (slide down)", "Auto-dismiss"],
          accessibility: {
            ariaRoles: "aria-live='polite', role='status'",
            keyboard: "Close button tab accessible",
            focusRing: "Focus ring on dismiss action",
            wcag: "Semantic colored icons + high contrast text"
          },
          motion: "Framer Motion layout transition with slide-up entrance"
        },
        {
          name: "Dropdown & ContextMenu",
          tag: "Molecule",
          desc: "Contextual floating menus triggered by action button or right-click pointer position.",
          variants: ["standard popover", "right-click context menu"],
          sizes: ["w-56 (224px)"],
          states: ["Closed", "Open", "Item Hover", "Destructive item", "Divider separator"],
          accessibility: {
            ariaRoles: "role='menu', role='menuitem', aria-haspopup='true'",
            keyboard: "Keyboard shortcut hints displayed (e.g. ⌘E, Del)",
            focusRing: "Item hover/focus highlight",
            wcag: "Destructive actions colored with red-600/400"
          },
          motion: "Fade-in + zoom-in-95, 150ms backdrop-blur-lg"
        }
      ]
    },
    {
      id: "data-presentation",
      title: "3. Data Presentation",
      description: "Information-dense layouts including enterprise data tables, team avatar presence, and syntax-highlighted code blocks.",
      components: [
        {
          name: "DataTable",
          tag: "Organism",
          desc: "Enterprise data grid with column sorting, row select checkboxes, bulk action bar, pagination, and empty states.",
          variants: ["standard grid", "with bulk actions toolbar", "empty state"],
          sizes: ["5-25 items per page pagination"],
          states: ["Unselected", "Selected row (brand-500/5 tint)", "Select all current", "Column sorted asc/desc"],
          accessibility: {
            ariaRoles: "role='table', role='row', role='columnheader', aria-sort",
            keyboard: "Tab navigation through checkboxes and sort triggers",
            focusRing: "Checkbox focus ring brand-500",
            wcag: "Table borders adhere to 3:1 contrast against surface"
          },
          motion: "Bulk bar slides down on selection; row hover 150ms"
        },
        {
          name: "Avatar & AvatarGroup",
          tag: "Molecule",
          desc: "User identity visualization with auto-initials fallback, presence status dots (online/busy/ai), and stacked group with +N counter.",
          variants: ["single avatar", "avatar with presence dot", "avatar with role crown/shield", "AvatarGroup with +N overflow"],
          sizes: ["xs (24px)", "sm (32px)", "md (40px)", "lg (48px)", "xl (64px)"],
          states: ["Image loaded", "Fallback initials", "Hover avatar (lifts and reveals tooltip)"],
          accessibility: {
            ariaRoles: "img role with alt text, aria-label for presence status",
            keyboard: "Focusable in interactive groups with tooltip reveal",
            focusRing: "ring-2 brand-500 on hover/focus",
            wcag: "High contrast initials against slate background"
          },
          motion: "Scale 105% on hover with z-index elevation"
        },
        {
          name: "CodeBlock & MarkdownViewer",
          tag: "Organism",
          desc: "Code display with line numbers, language badge, one-click copy button with instant check feedback, and Notion/ChatGPT markdown preview.",
          variants: ["dark terminal theme", "markdown document preview with citations [1]"],
          sizes: ["Responsive font-mono 12px/13px"],
          states: ["Default code", "Copied confirmation feedback", "Line hovered"],
          accessibility: {
            ariaRoles: "pre, code, aria-label='Copy code to clipboard'",
            keyboard: "Copy button focusable and Enter/Space triggerable",
            focusRing: "Focus ring on copy button",
            wcag: "Code text meets AAA contrast (Slate-200 on Slate-950)"
          },
          motion: "Checkmark bounce transition 200ms"
        }
      ]
    }
  ]
};
