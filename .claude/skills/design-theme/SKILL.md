---
name: design-theme
description: Design theme rules for "SaaS Soft Minimalist UI" — this library's visual language (color, radius, shadow, spacing, typography, interaction states). Load before creating or editing any component in src/lib, writing Tailwind classes, or making any visual/styling decision.
---

# Design theme rules — SaaS Soft Minimalist UI

These rules define the visual language for every component built in `src/lib`. Applies to all new and edited components. Goal: consistent, calm, low-contrast SaaS aesthetic (think Linear / Notion / Stripe Dashboard), not a generic Tailwind default look.

## Color — semantic tokens only

**A component must never name a raw palette shade.** No `bg-slate-50`, no `text-slate-700`, no `bg-white`, no `text-rose-400`. A hardcoded shade is invisible to every theme: it ships as a literal class into `dist/`, so no consumer theme and not even the built-in dark theme can touch it. Use the semantic utilities generated from [src/lib/index.css](../../../src/lib/index.css):

| Utility                                                       | Role                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------- |
| `bg-surface`                                                  | Base surface of a control or card                        |
| `bg-surface-subtle`                                           | Recessed/filled surface, resting hover on ghost controls |
| `bg-surface-hover`                                            | Hover step above `surface-subtle`                        |
| `border-border` / `border-border-hover`                       | Resting and hover border                                 |
| `text-foreground`                                             | Headings, primary text                                   |
| `text-foreground-soft`                                        | Labels, control text                                     |
| `text-foreground-muted`                                       | Body copy                                                |
| `text-foreground-subtle`                                      | Secondary/supporting copy                                |
| `text-foreground-faint`                                       | Placeholders, decorative icons                           |
| `bg-primary` / `bg-primary-hover` / `text-primary-foreground` | The one accent, for primary actions                      |
| `ring-ring`                                                   | Focus rings                                              |
| `text-danger` / `border-danger-border`                        | Invalid and destructive states                           |

Rules that still hold on top of the token list:

- **The accent is used sparingly** — primary buttons, active/selected states, focus rings, links. Never for large fills, backgrounds, or decoration. One accent hue for the whole library; don't introduce a second "for variety."
- **Text contrast has a floor.** `foreground-faint` is placeholder/icon weight only — it does not pass WCAG AA as body text. Paragraph copy stops at `foreground-subtle`.
- **Every new token needs a dark value too.** Add it to `:root`, `[data-theme='dark']`, and the `@theme inline` map in the same edit, or dark mode silently breaks for that one color.
- Both themes avoid pure black and pure white as text-on-background pairs; the darkest surface is a blue-tinted near-black, not `#000`.

### Adding a token

Only add one when an existing role genuinely doesn't fit — a bigger palette is harder to theme, not easier. Tailwind **silently emits nothing** for a utility whose token doesn't exist, so a typo like `bg-surface-subtel` produces no CSS and no error. After touching tokens, confirm the utility actually compiles rather than trusting the class name to look right.

## Radius

- Default component radius: **`rounded-lg` (~8px)**. Use this for buttons, inputs, cards, dropdowns — anything with visible edges.
- Small inline elements (badges, chips, tags): `rounded-md` or `rounded-full` depending on shape intent.
- Never use `rounded-none` or sharp corners unless the user explicitly asks for a specific component to break the pattern.
- Don't mix radius sizes within the same component (e.g. a card with `rounded-lg` shouldn't contain a button with `rounded-sm`).

## Shadow & elevation

- Shadows are **soft and shallow** — `shadow-sm` for resting state, `shadow-md` at most for popovers/dropdowns/modals. Never `shadow-lg`/`shadow-xl`/`shadow-2xl` — those read as heavy/skeuomorphic, not minimalist.
- Prefer a **thin neutral border** (`border border-border`) over shadow for simple separation (cards, list items). Reserve shadow for elements that float above content (menus, tooltips, modals).
- No colored shadows unless deliberately asked for a glow effect on an interactive element (rare, opt-in only).

## Spacing & layout

- Generous internal padding — default component padding starts at `p-4`, not `p-2`. Cramped spacing breaks the "soft" feel.
- Consistent spacing scale: stick to Tailwind's default scale (`4`, `6`, `8`, `12`...) — don't invent arbitrary pixel paddings like `p-[13px]`.
- Vertical rhythm between stacked elements: prefer `gap-*` on flex/grid containers over manual margins on children.

## Typography

- Sans-serif only, clean system/UI font stack unless the user specifies a custom font via `@theme { --font-sans: ... }`.
- Headings use `font-medium` or `font-semibold` — avoid `font-bold`/`font-black`, which reads harsh against this soft aesthetic.
- Body text: `text-foreground-muted`/`text-foreground-subtle`, not full-contrast `text-foreground`, for anything non-heading — keeps hierarchy soft.
- Font sizes step gently: `text-sm` for body/UI, `text-base` sparingly, headings scale up through `text-lg`/`xl`/`2xl` — avoid jumping straight to large sizes for emphasis.

## Interaction states

- Transitions: subtle and quick — `transition-colors duration-150` (or `transition` shorthand) on interactive elements. No bouncy/elastic easing, no long (>300ms) transitions for basic hover/focus.
- Hover state: slight background/border tint shift (e.g. `hover:bg-surface-subtle`, `hover:border-border-hover`), not a strong color jump.
- Focus state: visible focus ring using the accent color (`focus-visible:ring-2 focus-visible:ring-ring`) — never remove focus outlines outright (accessibility).
- Disabled state: reduce opacity (`opacity-50`) + `cursor-not-allowed`, don't just gray out inconsistently.

## What to avoid (explicit anti-patterns)

- Sharp corners, hard drop shadows, saturated primary colors, dense/cramped padding, bold/black font weights, gradients (unless explicitly requested), skeuomorphic depth (embossed/inset effects), pure black/white.
- Don't pull in a second accent color "for variety." One accent hue, used sparingly, is the whole point of this style.
- Don't hardcode hex/rgb colors directly in component markup — always go through `@theme` tokens so the whole library re-themes from one place.

## The accent is teal — and the stop was chosen for contrast, not looks

The brand accent is Tailwind's **teal**, set on `--primary` / `--primary-hover` / `--ring` in [src/lib/index.css](../../../src/lib/index.css). The specific stops are load-bearing; don't "correct" them to a more vivid teal:

| Theme | Token             | Stop     | Contrast                     |
| ----- | ----------------- | -------- | ---------------------------- |
| light | `--primary`       | teal-700 | 5.39:1 vs white text — AA ✓  |
| light | `--primary-hover` | teal-800 | 7.53:1 vs white text         |
| dark  | `--primary`       | teal-400 | 10.81:1 vs dark surface text |
| dark  | `--primary-hover` | teal-300 | 13.71:1 vs dark surface text |

`teal-500` reaches only **2.42:1** against white and `teal-600` only **3.66:1** — both fail WCAG AA's 4.5:1 for button text, even though they read as the more "obviously teal" choice. Light and dark also invert deliberately: light is a dark fill with white text, dark is a light fill with dark text.

If the brand color ever changes again, re-run the contrast math before picking stops rather than matching by eye, and update both the `:root` and `[data-theme='dark']` blocks. Nothing in any component changes.
