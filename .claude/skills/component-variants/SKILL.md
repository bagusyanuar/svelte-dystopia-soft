---
name: component-variants
description: How to use class-variance-authority (cva), tailwind-merge, and clsx for component styling and variant props in this library. Load before creating a component that has a variant/size/style prop, or when merging a consumer-provided class prop with internal classes.
---

# Component variants: cva + tailwind-merge + clsx

This library uses three small packages together for styling, all in `dependencies` (not `devDependencies` — consumers need them at runtime):

- **`clsx`** — conditionally join class strings.
- **`tailwind-merge`** — resolve conflicting Tailwind classes (e.g. `p-2` vs `p-4`) by keeping the last one, instead of both landing in the DOM.
- **`class-variance-authority` (cva)** — define a component's style variants (e.g. `variant`, `size`) as a typed config, instead of manual conditionals.

## The `cn()` utility

A shared `cn()` helper already exists at [src/lib/utils/cn.ts](../../../src/lib/utils/cn.ts) and is exported from the library's public API:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

**Always use `cn()`** (never raw template-string class concatenation) whenever a component merges its own internal classes with a consumer-provided `class` prop:

```svelte
<div class={cn('rounded-lg border border-border p-4', className)}>
```

This is what makes components "headless-friendly" (see [svelte5-best-practices](../svelte5-best-practices/SKILL.md)) — a consumer's override class always wins over the internal default, with no specificity fights or duplicate conflicting utilities.

## Variant definitions: `cva()`

Every component with more than one visual variant (e.g. `variant`, `size`) defines its variants with `cva()` in a **colocated `ComponentName.variants.ts` file** — same colocation rule as `.types.ts` (see [naming-convention](../naming-convention/SKILL.md)):

```
components/
  button/
    Button.svelte
    Button.types.ts
    Button.variants.ts     <- cva() config
    Button.svelte.spec.ts
    Button.stories.svelte
```

```ts
// Button.variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
				outline: 'border border-border bg-transparent hover:bg-surface-subtle',
				ghost: 'bg-transparent hover:bg-surface-subtle'
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-4 text-sm',
				lg: 'h-12 px-6 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
```

```ts
// Button.types.ts
import type { Snippet } from 'svelte';
import type { ButtonVariantProps } from './Button.variants.js';

export interface ButtonProps extends ButtonVariantProps {
	class?: string;
	disabled?: boolean;
	children: Snippet;
}
```

```svelte
<!-- Button.svelte -->
<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { buttonVariants } from './Button.variants.js';
	import type { ButtonProps } from './Button.types.js';

	let { variant, size, class: className, disabled, children, ...rest }: ButtonProps = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), className)} {disabled} {...rest}>
	{@render children()}
</button>
```

## Rules

- Colors, radius, shadow, spacing values used inside `cva()` variant strings must still follow [design-theme](../design-theme/SKILL.md) (soft shadows, `rounded-lg`, muted accent, etc.) — `cva` is a structuring tool, not an excuse to bypass the theme rules.
- Every component that accepts a `class` prop passes it through `cn()` as the **last** argument, so consumer overrides always win.
- Don't hand-roll variant logic with ternaries/object-lookups when `cva` already covers the case — use `cva` for any prop that maps to a class string, even with just two options, for consistency across the library.
- A component with **no** variants (only one visual style) doesn't need a `.variants.ts` file or `cva` — plain `cn('...', className)` in the component is enough. Don't add `cva` where there's nothing to vary.
