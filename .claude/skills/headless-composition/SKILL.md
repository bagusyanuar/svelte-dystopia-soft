---
name: headless-composition
description: API composition rules for building semi-headless, shadcn-style components — attribute forwarding, the child-snippet (asChild) pattern, data-attribute state styling, and DOM ref exposure. Load before creating any new component in src/lib, or when a component needs to expose behavior/state to a consumer beyond simple props.
---

# Headless composition

This library aims for a **semi-headless, shadcn-style** API: components ship with sane default markup and styling ([design-theme](../design-theme/SKILL.md), [component-variants](../component-variants/SKILL.md)), but a consumer can always override structure, styling, or the rendered element without forking the component. This skill covers the composition rules that make that possible — distinct from _how things look_ (design-theme) and _how variants are styled_ (component-variants).

## Always forward unrecognized attributes

Every component destructures only the props it actually uses, then spreads the rest onto the root element — never let unrecognized attributes be silently dropped:

```svelte
<script lang="ts">
	let { variant, size, class: className, children, ...restProps }: ButtonProps = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
	{@render children()}
</button>
```

`Props` types should extend the relevant HTML element attributes (e.g. `HTMLButtonAttributes` from `svelte/elements`) instead of hand-listing `onclick`, `id`, `aria-*`, etc. one by one.

## The `child` snippet pattern (asChild equivalent)

Svelte has no `asChild` prop like React/Radix. The idiomatic Svelte 5 equivalent (used by headless libraries like bits-ui) is a `child` snippet: if the consumer provides one, the component hands it the computed props/state and renders _nothing_ of its own markup — the consumer supplies the actual element.

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		child,
		children,
		class: className,
		...restProps
	}: {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		children?: Snippet;
	} & ButtonProps = $props();

	const mergedProps = $derived({ class: cn(buttonVariants(), className), ...restProps });
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
```

Use this only for components where consumers plausibly need a different underlying element or a wrapping library component (e.g. `Button` rendered as a router `<Link>`). Don't add a `child` snippet to every component by default — that's over-genericizing (see the AI-slop section in [svelte5-best-practices](../svelte5-best-practices/SKILL.md)). Add it when there's a concrete case for swapping the element.

## State via data-attributes, not internal classes

Any component with visual state (open/closed, active, selected, checked) exposes that state as a `data-*` attribute on the DOM node, so consumers can hook their own CSS without depending on the library's internal class names:

```svelte
<div data-state={open ? 'open' : 'closed'} data-disabled={disabled ? '' : undefined}>
```

Internal `cva` variants can also select on these (`data-[state=open]:bg-surface-subtle`), but the attribute must be present regardless of whether the consumer uses the built-in styling.

## Expose the underlying DOM element

When a consumer might need direct DOM access (focus management, measuring, animation libraries), accept a bindable element ref prop:

```ts
let { ref = $bindable(null), ...rest }: ButtonProps & { ref?: HTMLButtonElement | null } = $props();
```

```svelte
<button bind:this={ref} {...rest}>
```

Only add this when there's a real reason a consumer would need the node — not on every component by default.

## Snippet props for content override

Beyond the default `children` snippet, expose additional named snippet props (`icon`, `header`, etc.) only for genuinely optional/replaceable sections of a component — not as a way to make every piece of markup swappable. See [svelte5-best-practices](../svelte5-best-practices/SKILL.md) for snippet syntax.

## Nested/internal parts: decorative slots vs. compound components

Some components have internal sub-parts (e.g. `TextField` with a prefix icon and suffix button around the `<input>`). Whether that sub-part gets its own exported component depends on whether it has standalone identity:

- **Decorative/dependent parts** (a prefix icon slot, a suffix button slot inside `TextField`) are **not** independently meaningful — don't turn them into separate exported components or add a flat class prop per part (`prefixClass`, `suffixClass`, `containerClass`, ...). That's prop explosion (see AI-slop section in [svelte5-best-practices](../svelte5-best-practices/SKILL.md)) in a different shape. Instead:
  - Expose the part's **content** as a snippet prop: `prefix?: Snippet`, `suffix?: Snippet`.
  - Expose **styling** for all internal parts through one structured prop: `classes?: { container?: string; input?: string; prefix?: string; suffix?: string }`, merged internally with `cn()` per slot.
  ```svelte
  <script lang="ts">
  	let { prefix, suffix, classes, children, ...restProps }: TextFieldProps = $props();
  </script>

  <div
  	class={cn('flex items-center gap-2 rounded-lg border border-border p-2', classes?.container)}
  >
  	{#if prefix}<span class={cn('text-foreground-faint', classes?.prefix)}>{@render prefix()}</span
  		>{/if}
  	<input class={cn('flex-1 bg-transparent outline-none', classes?.input)} {...restProps} />
  	{#if suffix}<span class={cn('text-foreground-faint', classes?.suffix)}>{@render suffix()}</span
  		>{/if}
  </div>
  ```
- **Independently composable parts** (`Select.Trigger`, `Select.Content`, `Select.Item`, `Card.Header`, `Card.Body`) — where a consumer genuinely benefits from rearranging, omitting, or reusing the sub-part on its own — get the full **compound component** treatment: separate exported components composed by the consumer, each following this skill's rules independently.
- Default to the decorative-slot pattern unless there's a concrete reason a sub-part needs to stand alone. Don't reach for compound components just because a component has more than one visual section.

## How this fits with class overrides

`class` prop merging via `cn()` (see [component-variants](../component-variants/SKILL.md)) is the styling half of headlessness; this skill is the structure/behavior half. A fully semi-headless component in this library typically has: a `class` prop merged last-wins, `...restProps` forwarded, `data-*` state attributes, and — only where justified — a `child` snippet and/or bindable `ref`. Not every component needs every one of these; add what the component's real use cases call for.
