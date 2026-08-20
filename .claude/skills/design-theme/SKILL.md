---
name: design-theme
description: Design theme rules for "SaaS Soft Minimalist UI" — this library's visual language (color, radius, shadow, spacing, typography, interaction states). Load before creating or editing any component in src/lib, writing Tailwind classes, or making any visual/styling decision.
---

# Design theme rules — SaaS Soft Minimalist UI

These rules define the visual language for every component built in `src/lib`. Applies to all new and edited components. Goal: consistent, calm, low-contrast SaaS aesthetic (think Linear / Notion / Stripe Dashboard), not a generic Tailwind default look.

Tokens should be defined via Tailwind v4 `@theme` (see [tailwind-v4 skill](../tailwind-v4/SKILL.md)), not scattered arbitrary values.

## Color

- **Neutral scale is the backbone.** Backgrounds, borders, and body text should come from Tailwind's `slate` or `zinc` scale — pick one and stay consistent across the whole library (don't mix `slate` and `gray` and `zinc`).
- **Accent color: TBD — placeholder set below.** Until decided, use a muted indigo as the working default:
  ```css
  @theme {
  	--color-accent-50: oklch(0.97 0.02 264);
  	--color-accent-500: oklch(0.58 0.14 264);
  	--color-accent-600: oklch(0.5 0.15 264);
  }
  ```
  Replace these three stops when the real brand color is picked — keep the accent to a single hue with light/base/dark stops, not a full 50–950 ramp. Flag this as unresolved when reviewing component work; don't silently invent a different accent.
- Accent color is used sparingly: primary buttons, active/selected states, focus rings, links. Not for large fills, backgrounds, or decorative use.
- Avoid saturated/loud colors anywhere (no `red-500`/`green-500` at full saturation for status — prefer muted variants, e.g. `rose-400`/`emerald-400`, or desaturate via `oklch` in `@theme`).
- No pure black (`#000`) or pure white (`#fff`) text/backgrounds. Use `slate-900`/`slate-950` and `slate-50`/`white` softened by neutral scale instead.

## Radius

- Default component radius: **`rounded-lg` (~8px)**. Use this for buttons, inputs, cards, dropdowns — anything with visible edges.
- Small inline elements (badges, chips, tags): `rounded-md` or `rounded-full` depending on shape intent.
- Never use `rounded-none` or sharp corners unless the user explicitly asks for a specific component to break the pattern.
- Don't mix radius sizes within the same component (e.g. a card with `rounded-lg` shouldn't contain a button with `rounded-sm`).

## Shadow & elevation

- Shadows are **soft and shallow** — `shadow-sm` for resting state, `shadow-md` at most for popovers/dropdowns/modals. Never `shadow-lg`/`shadow-xl`/`shadow-2xl` — those read as heavy/skeuomorphic, not minimalist.
- Prefer a **thin neutral border** (`border border-slate-200`) over shadow for simple separation (cards, list items). Reserve shadow for elements that float above content (menus, tooltips, modals).
- No colored shadows unless deliberately asked for a glow effect on an interactive element (rare, opt-in only).

## Spacing & layout

- Generous internal padding — default component padding starts at `p-4`, not `p-2`. Cramped spacing breaks the "soft" feel.
- Consistent spacing scale: stick to Tailwind's default scale (`4`, `6`, `8`, `12`...) — don't invent arbitrary pixel paddings like `p-[13px]`.
- Vertical rhythm between stacked elements: prefer `gap-*` on flex/grid containers over manual margins on children.

## Typography

- Sans-serif only, clean system/UI font stack unless the user specifies a custom font via `@theme { --font-sans: ... }`.
- Headings use `font-medium` or `font-semibold` — avoid `font-bold`/`font-black`, which reads harsh against this soft aesthetic.
- Body text: `text-slate-600`/`700` range, not full-contrast `slate-900`, for anything non-heading — keeps hierarchy soft.
- Font sizes step gently: `text-sm` for body/UI, `text-base` sparingly, headings scale up through `text-lg`/`xl`/`2xl` — avoid jumping straight to large sizes for emphasis.

## Interaction states

- Transitions: subtle and quick — `transition-colors duration-150` (or `transition` shorthand) on interactive elements. No bouncy/elastic easing, no long (>300ms) transitions for basic hover/focus.
- Hover state: slight background/border tint shift (e.g. `hover:bg-slate-50`, `hover:border-slate-300`), not a strong color jump.
- Focus state: visible focus ring using the accent color (`focus-visible:ring-2 focus-visible:ring-accent-500`) — never remove focus outlines outright (accessibility).
- Disabled state: reduce opacity (`opacity-50`) + `cursor-not-allowed`, don't just gray out inconsistently.

## What to avoid (explicit anti-patterns)

- Sharp corners, hard drop shadows, saturated primary colors, dense/cramped padding, bold/black font weights, gradients (unless explicitly requested), skeuomorphic depth (embossed/inset effects), pure black/white.
- Don't pull in a second accent color "for variety." One accent hue, used sparingly, is the whole point of this style.
- Don't hardcode hex/rgb colors directly in component markup — always go through `@theme` tokens so the whole library re-themes from one place.

## Open decision

Brand accent color is not finalized (see Color section above). When the user provides a real brand color, update the `--color-accent-*` stops in [src/lib/index.css](../../../src/lib/index.css) — the single shared theme source, also shipped to consumers, see [tailwind-v4](../tailwind-v4/SKILL.md) — and this rule stops being a placeholder.
