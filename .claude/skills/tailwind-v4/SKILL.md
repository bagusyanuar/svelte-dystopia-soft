---
name: tailwind-v4
description: Tailwind CSS v4 syntax and best practices for this Svelte component library. Load before writing or editing any Tailwind classes, CSS files (@import/@theme/@plugin), or when adding new components — v4 syntax differs significantly from v3 and this project targets v4.3 only.
---

# Tailwind v4 in this project

This repo uses **Tailwind CSS v4.3** (`@tailwindcss/vite` + `@tailwindcss/typography`), configured CSS-first in [src/routes/layout.css](src/routes/layout.css):

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';
```

There is **no `tailwind.config.js`**. Do not create one, and do not write v3-style config unless the user explicitly asks for a JS config (v4 still supports it via `@config`, but it's not the default here).

## Config is CSS, not JS

- Import Tailwind with `@import 'tailwindcss';` — never `@tailwind base; @tailwind components; @tailwind utilities;` (that's v3).
- Register plugins with `@plugin "plugin-name";` directly in CSS — never `plugins: [...]` in a config file.
- Custom design tokens (colors, fonts, spacing, breakpoints) go in an `@theme` block in CSS:
  ```css
  @theme {
  	--color-brand: oklch(0.6 0.2 250);
  	--font-display: 'Inter', sans-serif;
  	--breakpoint-3xl: 120rem;
  }
  ```
  This replaces `theme.extend.colors` etc. from `tailwind.config.js`. Tokens become both CSS variables (`var(--color-brand)`) and utility classes (`bg-brand`) automatically.
- Need a fully custom source scan or legacy JS config? Use `@source "../path"` / `@config "./tailwind.config.js"` inside the CSS file — don't fall back to a standalone config setup silently.

## Breaking changes vs. v3 (don't assume old defaults)

- **Default border/ring color** is now `currentColor`, not `gray-200`/`blue-500`. Always specify a color explicitly (`border-slate-200`) instead of relying on old implicit defaults.
- **Default ring width** is `1px`, not `3px`. If a component needs the old look, use `ring-3` explicitly.
- **`shrink-0`/`grow`** are the canonical names now; `flex-shrink-0`/`flex-grow` still work but prefer the short form in new code.
- Preflight resets are stricter (buttons/inputs inherit font styles more aggressively) — check form elements visually after adding them.
- Modern-browser-only output (uses native CSS cascade layers, `@property`, color-mix()). Don't add PostCSS-based fallbacks for older browsers unless asked.

## Component library specifics (important — this is not a regular app)

Since `src/lib` ships to npm consumers, two things matter that don't matter in a normal app:

1. **Don't rely on `@apply` heavily inside library components.** Keep utility classes directly in markup. Consumers may override via `class` props / `clsx`, and inlined utilities are easier for them to read, override, and for their own Tailwind build to tree-shake correctly.
2. **Consumers' Tailwind won't see classes inside `node_modules` by default.** Tailwind v4's automatic source detection skips `.gitignore`d paths and `node_modules`. If a consumer app installs this package and uses Tailwind, their utilities used only inside our compiled `dist/` components won't be generated unless they add:
   ```css
   @source "../node_modules/dystopia-soft-lib/dist";
   ```
   Mention this requirement in the README/docs when finalizing the library — it's a common silent breakage for published Tailwind component libraries. Do not assume it "just works" like a same-repo app.

## Arbitrary values & variants

- Arbitrary values: `bg-[#1da1f2]`, `w-[calc(100%-2rem)]` — unchanged from v3, still fine.
- Container queries are built-in now (no plugin needed): `@container`, `@lg:flex`.
- Data attribute / ARIA variants: `data-[state=open]:block`, `aria-[expanded=true]:rotate-180` — encourage these over custom JS class toggling for component state styling.

## When editing CSS files in this repo

- Keep `@import 'tailwindcss';` and `@plugin` declarations at the top of `layout.css` (or wherever the entry stylesheet lives).
- New design tokens go in `@theme`, not scattered `:root` custom properties, unless the value is intentionally not a Tailwind-exposed token.
- Run `npm run dev` and visually check components using Tailwind classes — v4 syntax errors in `@theme`/`@plugin` can fail silently in some setups, so don't assume correctness without seeing it render.
