# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

## Project purpose

This is a **Svelte component/utility library** (`dystopia-soft-lib`), scaffolded with `sv create --template library`. The end goal is to publish it to npm as a reusable package for other Svelte projects to install and import — this repo is **not** an application.

## Directory model — read this first

This is the single most important thing to understand before editing anything here.

- **`src/lib/`** — the actual library source. Everything exported from here (via `src/lib/index.ts`) is the public API shipped to npm consumers. Treat this as production code with a stable, external contract.
- **`src/routes/`** — a throwaway SvelteKit app used only for local dev/demo/preview (`npm run dev`) and for Playwright e2e tests. It is **never published**. Do not add real library logic here — only demo usage of what's already exported from `src/lib`.
- **`src/stories/`** — Storybook stories for visually developing and documenting components in isolation. Same rule: showcase only, not part of the shipped package.
- **`dist/`** — build output of `svelte-package`, generated from `src/lib/`. This is what actually gets published. Never hand-edit; it's regenerated on build.

### Build vs. publish (don't confuse these)

- `vite build` builds the full SvelteKit demo app (routes included) — used to validate the app still works, output not published.
- `npm run prepack` → runs `svelte-package` — packages **only `src/lib`** into `dist/`.
- `package.json` `"files"` field whitelists only `dist` for npm publish. Routes/stories build output never ships, no matter what.

When asked to "add a feature to the library," it belongs in `src/lib/`. When asked to "show/demo/test it visually," that goes in `src/routes/` or `src/stories/`.

## Code style & UI conventions

Svelte 5 runes syntax, Tailwind v4 syntax, and the "SaaS Soft Minimalist" design theme are covered by skills (`svelte5-best-practices`, `tailwind-v4`, `design-theme` in `.claude/skills/`) — they auto-load when writing/editing component or style code, so rules aren't duplicated here.

## Public API discipline

- `src/lib/index.ts` is the single entry point / barrel file. Every component, function, type, or util meant for consumers must be explicitly re-exported here. If it's not exported from `index.ts`, it's not public API — don't rely on deep imports from consumer code or examples.
- Before removing or renaming anything exported from `index.ts`, treat it as a breaking change (semver major). Prefer additive changes; deprecate before removing when possible.
- Keep the public surface intentional and minimal — don't export internal helpers "just in case."

## Testing

- **Unit / component tests**: Vitest, colocated as `*.spec.ts` (server/node) or `*.svelte.spec.ts` (browser, via `@vitest/browser-playwright`). See `src/lib/vitest-examples/` for the pattern.
- **E2E tests**: Playwright, under `src/routes/demo/playwright`, run against the demo app.
- **Storybook interaction tests**: wired through `@storybook/addon-vitest`.
- Run `npm run test` for the full suite (unit + e2e), or `npm run test:unit` for just Vitest.
- New library features added to `src/lib` should get a colocated spec file, not just a routes/demo page.

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
4. Verify `src/lib/index.ts` exports match what's intended to be public.

## Things to avoid

- Don't put library logic in `src/routes/` — it silently won't ship and consumers can't use it.
- Don't add heavy runtime dependencies to `src/lib` without checking `peerDependencies` — keep the published package lean; consumers already have Svelte.
- Don't hand-edit files under `dist/` — it's generated.
