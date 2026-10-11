---
name: design-theme
description: Design theme rules for "SaaS Compact Minimalist UI" — this library's visual language (color, radius, shadow, spacing, typography, interaction states), migrated toward Linear's density model. Load before creating or editing any component in src/lib, writing Tailwind classes, or making any visual/styling decision.
---

# Design theme rules — SaaS Compact Minimalist UI

These rules define the visual language for every component built in `src/lib`. Applies to all new and edited components. Goal: calm, low-contrast SaaS aesthetic with Linear's density — compact controls, border-driven separation, near-flat elevation — not the airier "generous padding" look this library used before, and not a generic Tailwind default look either.

**Migration status:** this revision is the new target for anything created or edited from now on. Most of the 25 existing components still carry the older, looser spacing — they haven't been touched yet. Don't treat an existing component's current classes as precedent; follow this document instead, and see `docs/component-roadmap.md` ("Rencana refactor: migrasi visual ke gaya Linear") for the rollout plan. When you edit an existing component for an unrelated reason, it's fine to leave its spacing as-is unless the task is specifically about density.

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

- Default radius for interactive controls (buttons, inputs, checkboxes, badges, menu items): **`rounded-md` (~6px)**. Tighter than a big surface, still visibly rounded — not sharp.
- Larger surfaces (card, dialog, popover panel): **`rounded-lg` (~8px)** — one step up from controls, never past it.
- Small inline elements (badges, chips, tags): `rounded-md`, or `rounded-full` only when the shape is deliberately pill-like (a count badge, a status dot's container).
- `rounded-lg` is the ceiling for the whole library. Never use `rounded-none` or sharp corners unless the user explicitly asks for a specific component to break the pattern.
- Don't mix radius sizes within the same component (e.g. a card shell using `rounded-lg` shouldn't contain a button using `rounded-sm`).
- These map straight to Tailwind's own `--radius-md`/`--radius-lg` theme variables — no library-specific radius token exists or is needed. If the two-step scale above ever needs to move as a unit, override `--radius-md`/`--radius-lg` once in `@theme` in `src/lib/index.css`, not per component.

## Shadow & elevation

- **Resting, in-flow elements (card, list item, static row) get no shadow at all.** Separation comes from `border border-border`, full stop — this is the biggest visual shift from the old "soft shadow everywhere" look.
- Shadow is reserved for elements that float **above** content: popover, dropdown, tooltip, dialog, toast. Even there, cap it at `shadow-sm` — never `shadow-md`/`shadow-lg`/`shadow-xl`/`shadow-2xl`. A flatter shadow plus a `border border-border` on the floating panel itself reads as "lifted" without looking heavy.
- No colored shadows unless deliberately asked for a glow effect on an interactive element (rare, opt-in only).
- These are Tailwind's own `--shadow-sm` theme variable — no custom shadow token exists or is needed.

## Spacing & layout

Density is the core of this theme now — controls read as compact, not "airy." Use the named spacing scale from `src/lib/index.css` instead of picking a padding number by feel:

| Utility (generated)                | Token                | Value  | Role                                                    |
| ----------------------------------- | --------------------- | ------ | -------------------------------------------------------- |
| `px-control-x`                      | `--spacing-control-x` | `1rem`   | Button/input horizontal padding                          |
| `py-control-y`                      | `--spacing-control-y` | `0.5rem` | Button/input vertical padding                            |
| `p-compact` / `px-compact` / `py-compact` | `--spacing-compact`   | `0.75rem` | Dense rows: list items, menu items, popover content       |
| `p-surface`                         | `--spacing-surface`   | `1.5rem` | Card/dialog surface padding — the roomiest padding in the library, still tighter than the old default |
| `gap-tight`                         | `--spacing-tight`     | `0.375rem` | Icon-to-label gaps                                       |
| `gap-cozy`                          | `--spacing-cozy`      | `0.5rem` | Default inter-element gap                                 |
| `gap-loose`                         | `--spacing-loose`     | `0.75rem` | Looser stacks: form fields, list rows                     |

- **Don't default to `p-4`/`p-6` picked by feel** — reach for `p-compact`/`p-surface` first, and only fall back to a raw Tailwind number (still off the standard scale — `2`, `3`, `4`...) when none of the named roles fit.
- Vertical rhythm between stacked elements: prefer `gap-*` (the named scale above, or a raw Tailwind gap number as fallback) on flex/grid containers over manual margins on children.
- These tokens exist and compile today, but most existing components haven't been migrated onto them yet (they still use literal `p-3`/`px-4`/`gap-2`) — see the migration status note above. Use the named scale in anything you write or touch now regardless of what surrounding code still does.

## Typography

- Sans-serif only, clean system/UI font stack unless the user specifies a custom font via `@theme { --font-sans: ... }`.
- Headings use `font-medium` or `font-semibold` — avoid `font-bold`/`font-black`, which reads harsh against this aesthetic.
- Body text: `text-foreground-muted`/`text-foreground-subtle`, not full-contrast `text-foreground`, for anything non-heading — keeps hierarchy calm even at tighter density.
- Font sizes step gently: `text-sm` for body/UI, `text-base` sparingly, headings scale up through `text-lg`/`xl`/`2xl` — avoid jumping straight to large sizes for emphasis.
- **Line-height runs tighter than Tailwind's relaxed default** — density applies to text, not just padding. Use `leading-snug` for UI text/labels and `leading-tight` for headings; reserve the default `leading-normal` for longer-form body copy where tight lines would hurt readability (e.g. `typography` component's prose content).

## Interaction states

- Transitions: subtle and quick — `transition-colors duration-150` (or `transition` shorthand) on interactive elements. No bouncy/elastic easing, no long (>300ms) transitions for basic hover/focus.
- Hover state: slight background/border tint shift (e.g. `hover:bg-surface-subtle`, `hover:border-border-hover`), not a strong color jump.
- Focus state: visible focus ring using the accent color (`focus-visible:ring-2 focus-visible:ring-ring`) — never remove focus outlines outright (accessibility).
- Disabled state: reduce opacity (`opacity-50`) + `cursor-not-allowed`, don't just gray out inconsistently.

## What to avoid (explicit anti-patterns)

- Sharp corners past `rounded-lg`, hard/heavy drop shadows (`shadow-md` and up), shadow on a resting/in-flow element instead of a border, saturated primary colors, bold/black font weights, gradients (unless explicitly requested), skeuomorphic depth (embossed/inset effects), pure black/white.
- **Loose/airy padding picked by feel** (`p-4`/`p-6`/`p-8` as a default reach) — this was the old theme's signature and is now the anti-pattern. Use the named spacing scale above.
- Don't pull in a second accent color "for variety." One accent hue, used sparingly, is the whole point of this style.
- Don't hardcode hex/rgb colors directly in component markup — always go through `@theme` tokens so the whole library re-themes from one place.

## The accent is teal — and the stop was chosen for contrast, not looks

The brand accent is Tailwind's **teal**, set on `--primary` / `--primary-hover` / `--ring` in [src/lib/index.css](../../../src/lib/index.css). The specific stops are load-bearing; don't "correct" them to a more vivid teal:

| Theme | Token             | Stop     | Contrast                     |
| ----- | ----------------- | -------- | ---------------------------- |
| light | `--primary`       | teal-700 | 5.39:1 vs white text — AA ✓  |
| light | `--primary-hover` | teal-800 | 7.53:1 vs white text         |
| dark  | `--primary`       | teal-solid | 5.39:1 vs white text — AA ✓  |
| dark  | `--primary-hover` | teal-solid-hover | 4.8:1 vs white text — AA ✓  |

Both light and dark maintain solid fills with crisp white text (`oklch(100% 0 0)`), avoiding washed-out/bleached pastels on hover while fully clearing WCAG AA contrast.

If the brand color ever changes again, re-run the contrast math before picking stops rather than matching by eye, and update both the `:root` and `[data-theme='dark']` blocks. Nothing in any component changes.
