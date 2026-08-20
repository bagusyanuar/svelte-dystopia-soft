---
name: svelte5-best-practices
description: Svelte 5 runes-mode syntax and best practices for this component library. Load before creating or editing any .svelte or .svelte.ts file — this project targets Svelte 5 with runes mode forced project-wide, and Svelte 4 patterns (export let, $:, createEventDispatcher, slots-first) must not be used for new code.
---

# Svelte 5 best practices for this library

This project runs **Svelte ^5.56** with runes mode **forced** for all non-`node_modules` files (see [vite.config.ts](../../../vite.config.ts) `compilerOptions.runes`). Every component in `src/lib` must use Svelte 5 runes syntax — never Svelte 4 legacy reactivity.

## Reactivity: runes only

- **State**: `let count = $state(0);` — never `export let count = 0;` for local mutable state, never a plain `let` expecting reactivity outside runes mode.
- **Derived values**: `const double = $derived(count * 2);` — never `$: double = count * 2;`. For multi-statement derivations, use `$derived.by(() => { ... })`.
- **Side effects**: `$effect(() => { ... })` — only for actual side effects (DOM APIs, subscriptions, logging, syncing to an external system). Do **not** use `$effect` to compute a value that could be `$derived` — that's the most common Svelte 5 anti-pattern.
- **Props**: `let { variant = 'default', children, ...rest }: ButtonProps = $props();` (type imported from the colocated `.types.ts` file) — never `export let variant = 'default';`.
- **Two-way bindable props** (component needs to let a consumer `bind:` a prop): `let { value = $bindable() }: Props = $props();`. Use sparingly — only when two-way binding is genuinely the right API, not by default.

## Props typing

Define `Props` in a dedicated colocated `ComponentName.types.ts` file, not inline in the `.svelte` file (see [naming-convention](../naming-convention/SKILL.md)) — this is a fixed rule for every component in this library, regardless of how simple the props are:

```ts
// Button.types.ts
import type { Snippet } from 'svelte';

export interface ButtonProps {
	variant?: 'default' | 'outline' | 'ghost';
	disabled?: boolean;
	children: Snippet;
}
```

```svelte
<!-- Button.svelte -->
<script lang="ts">
	import type { ButtonProps } from './Button.types';

	let { variant = 'default', disabled = false, children }: ButtonProps = $props();
</script>
```

This matters more here than in a typical app — `Props` types are part of the public API surface consumers see in their editor, and a separate file lets [src/lib/index.ts](../../../src/lib/index.ts) re-export the type cleanly (`export type { ButtonProps } from './components/button/Button.types';`) without needing a `<script module>` block just to expose a type.

## Events

- Use property-style event attributes: `onclick={handleClick}`, `oninput={handleInput}` — not the Svelte 4 `on:click={handleClick}` directive syntax.
- For custom component "events" (parent needs to react to child behavior), prefer a **callback prop** (`onSelect?: (item: Item) => void`) over `createEventDispatcher`. Callback props are simpler, type-safe, and the Svelte 5-recommended pattern — don't reach for `createEventDispatcher` in new code.
- Event modifiers (`on:click|preventDefault`) are gone — call `event.preventDefault()` inside the handler instead.

## Content projection: snippets over slots

- For passing markup into a component, prefer **snippets** (`{#snippet}` / `{@render}`) over the legacy `<slot>` for anything beyond a single simple default slot:
  ```svelte
  <!-- Component.svelte -->
  <script lang="ts">
  	let { header, children }: { header?: Snippet; children: Snippet } = $props();
  </script>

  {#if header}{@render header()}{/if}
  {@render children()}
  ```
- Named multi-slot patterns (`<slot name="...">`) from Svelte 4 should be rewritten as snippet props when touched — don't add new named slots to library components.
- A single default `children` snippet is the standard way to accept child content; type it as `Snippet` from `'svelte'`.

## Component structure conventions for this library

- One component per folder in `src/lib/components`, colocated with its `.types.ts`, `.svelte.spec.ts`, and `.stories.svelte` — full layout in [naming-convention](../naming-convention/SKILL.md).
- Export every public component/util (and its `Props` type) through [src/lib/index.ts](../../../src/lib/index.ts) — see project [CLAUDE.md](../../../CLAUDE.md) for the public-API rule.
- Keep components headless-friendly where reasonable: accept a `class` prop and merge it with internal classes (e.g. via `clsx`/`tailwind-merge` if added as a dependency) so consumers can override styling without fighting specificity.
- Avoid `$effect` for anything that runs once on mount only to set initial state that could instead be computed inline or via `$derived`.

## What to avoid (explicit anti-patterns)

- `export let` for props, `$:` reactive statements, `createEventDispatcher`, `on:event` directive syntax, `<slot>` for new multi-section components, stores (`writable`/`readable`) as the default state mechanism inside components (runes replace this for local/component state — stores are still fine for cross-component/global shared state, but don't reach for them by default).
- `$effect` used to derive/copy state (`$effect(() => { copy = source })`) — use `$derived` instead.
- Untyped `$props()` destructuring without a `Props` interface in a library component.
- Defining `Props` inline in the `.svelte` file instead of in the colocated `.types.ts` file.
