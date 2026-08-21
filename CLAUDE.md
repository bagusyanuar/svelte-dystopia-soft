# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

## Project purpose

This is a **Svelte component/utility library** (`@dystopia/soft-lib`), scaffolded with `sv create --template library`. The end goal is to publish it to npm as a reusable package for other Svelte projects to install and import — this repo is **not** an application.

## Directory model — read this first

This is the single most important thing to understand before editing anything here.

- **`src/lib/`** — the actual library source. Each component folder's `index.ts` is a public entry point (see Public API discipline below). Treat this as production code with a stable, external contract.
- **`src/routes/`** — a throwaway SvelteKit app used only for local dev/demo/preview (`npm run dev`) and for Playwright e2e tests. It is **never published**. Do not add real library logic here — only demo usage of what's already exported from `src/lib`.
- **Stories and specs** — colocated with their component inside `src/lib/components/<name>/`, not in a separate top-level directory. They build to `dist/` but are excluded from the npm tarball by the `files` field, so they never reach consumers.
- **`dist/`** — build output of `svelte-package`, generated from `src/lib/`. This is what actually gets published. Never hand-edit; it's regenerated on build.

### Build vs. publish (don't confuse these)

- `vite build` builds the full SvelteKit demo app (routes included) — used to validate the app still works, output not published.
- `npm run prepack` → runs `svelte-package` — packages **only `src/lib`** into `dist/`.
- `package.json` `"files"` whitelists `dist` and then subtracts `*.spec.*`, `*.stories.*`, and `vitest-examples` — colocated stories/tests build into `dist/` but must not ship. After adding a new kind of non-shipping file, run `npm pack --dry-run --ignore-scripts` and check it isn't in the tarball.

When asked to "add a feature to the library," it belongs in `src/lib/`. When asked to "show/demo/test it visually," that goes in the component's colocated `*.stories.svelte`, or in `src/routes/` for a full-app demo.

## Code style & UI conventions

Svelte 5 runes syntax, Tailwind v4 syntax, the "SaaS Soft Minimalist" design theme, and accessibility are covered by skills (`svelte5-best-practices`, `tailwind-v4`, `design-theme`, `accessibility` in `.claude/skills/`) — they auto-load when writing/editing component or style code, so rules aren't duplicated here.

## Public API discipline

This library is **subpath-only** — there is deliberately no root barrel and no `src/lib/index.ts`. Consumers import each component from its own path:

```ts
import { TextField } from '@dystopia/soft-lib/components/text-field';
import { cn } from '@dystopia/soft-lib/utils/cn';
```

- Each component folder's `index.ts` **is** its public entry point. Whatever it exports is public API; anything not re-exported there is internal. Use explicit named re-exports, never `export *` — see the per-component barrel section in the `naming-convention` skill.
- The `exports` map in `package.json` uses wildcards (`"./components/*"`, `"./utils/*"`), so a new component folder with an `index.ts` is publicly importable with **no `package.json` change**. That cuts both ways: don't add a folder under `src/lib/components` or `src/lib/utils` unless it's meant to be public.
- Importing the package root (`@dystopia/soft-lib`) fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`. That's intentional, not a bug — don't "fix" it by adding a `"."` export.
- Before removing or renaming a folder, a folder's `index.ts` export, or an `exports` path, treat it as a breaking change (semver major). Prefer additive changes; deprecate before removing when possible.
- Keep the public surface intentional and minimal — don't export internal helpers "just in case."

## Testing

- **Unit / component tests**: Vitest, colocated as `*.spec.ts` (server/node) or `*.svelte.spec.ts` (browser, via `@vitest/browser-playwright`). See `src/lib/vitest-examples/` for the pattern.
- **E2E tests**: Playwright, under `src/routes/demo/playwright`, run against the demo app.
- **Storybook interaction + a11y tests**: wired through `@storybook/addon-vitest`. Every story is checked by axe at `test: 'error'`, so an accessibility violation fails the run — see the `accessibility` skill.
- Run `npm run test` for the full suite (unit + e2e), or `npm run test:unit` for just Vitest.
- New library features added to `src/lib` should get a colocated spec file, not just a routes/demo page.
- `expect.requireAssertions` is on — a test with no assertion fails rather than silently passing.

### Test harness components (`*.spec.svelte`)

Some behavior can only be observed from _outside_ a component — chiefly whether a `bind:` prop actually propagates back to a consumer, and whether a `<Label for>` really focuses its field. Rendering the component alone can't show this: `render(PasswordField, …)` will happily pass while the binding is severed, because the value is still correct _inside_ the input.

For those, add a small harness component next to the spec that mounts the real thing and exposes the outer state:

```svelte
<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import PasswordField from './PasswordField.svelte';
	let value = $state('');
</script>

<PasswordField placeholder="Password" bind:value />
<output data-testid="outer-value">{value}</output>
```

The `.spec.` in the filename is **load-bearing**, not decoration:

- Vitest collects `*.svelte.spec.ts`, so a `*.spec.svelte` file is never picked up as a test file itself.
- `package.json` `files` excludes `*.spec.*`, so the harness builds into `dist/` but stays out of the npm tarball.

Name it after what it proves (`BindingHarness`, `AssociationHarness`), not after the component.

### What deserves a test

Prefer tests that would catch a **silent** break — one where every other signal stays green:

- Two-way bindings surviving a wrapper component.
- `type="button"` on a button inside a form (without it, the toggle submits the form).
- ARIA wiring: `for`/`id` association, `aria-hidden` on decorative markup.
- Consumer `class` actually overriding an internal one via `cn()`.

## Common commands

```sh
npm run dev              # dev server with routes/ as live preview of src/lib
npm run check             # svelte-kit sync + svelte-check (type checking)
npm run lint               # prettier --check + eslint
npm run format             # prettier --write
npm run test:unit          # vitest
npm run test:e2e           # playwright
npm run build               # builds demo app (not what gets published)
npm run prepack            # svelte-package -> builds dist/ (what gets published)
npm run storybook          # storybook dev server
```

## Before publishing checklist

Don't run `npm publish` automatically — always confirm with the user first. When asked to prep a release:

1. Bump `version` in `package.json` (semver: breaking export changes = major, new exports = minor, fixes = patch).
2. Ensure `package.json` `"name"`, `"license"`, `"repository"` fields are accurate (template placeholders may still be present).
3. Run `npm run lint`, `npm run check`, `npm run test`, and `npm run prepack` to make sure `dist/` builds cleanly and `publint` passes.
4. Verify each component folder's `index.ts` exports match what's intended to be public, and run `npm pack --dry-run --ignore-scripts` to confirm the tarball holds only what should ship.

## Things to avoid

- Don't put library logic in `src/routes/` — it silently won't ship and consumers can't use it.
- Don't add heavy runtime dependencies to `src/lib` without checking `peerDependencies` — keep the published package lean; consumers already have Svelte.
- Don't hand-edit files under `dist/` — it's generated.
