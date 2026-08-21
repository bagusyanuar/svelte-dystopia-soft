---
name: storybook-stories
description: How to write .stories.svelte files with @storybook/addon-svelte-csf v5 in this library — the template vs. children vs. asChild rules, args typing, and the wrapper trap that silently renders an extra copy of the component. Load before creating or editing any *.stories.svelte file.
---

# Writing stories (addon-svelte-csf v5)

Stories are colocated with their component as `ComponentName.stories.svelte` (see [naming-convention](../naming-convention/SKILL.md)). This library uses `@storybook/addon-svelte-csf` v5 with `defineMeta`.

## The three content forms — pick the right one

`<Story>` accepts content in three mutually exclusive ways, and picking the wrong one silently changes what renders. From the addon's `Story.svelte` source:

```svelte
{#if isSnippet(template)}
	{@render template(args, storyContext)}
{:else if isSnippet(children)}
	{#if asChild || isLegacyStory}
		{@render children()}
	{:else if storyContext.component}
		<storyContext.component {...args} {children} />
	{:else}
		{@render children()}
	{/if}
{:else if metaRenderSnippet}...
```

1. **`template` snippet** — for a story that renders the component driven by `args` (controls work):

   ```svelte
   <Story name="Outline" args={{ variant: 'outline' }}>
   	{#snippet template(args: ButtonStoryArgs)}
   		<Button {...args}>Button</Button>
   	{/snippet}
   </Story>
   ```

2. **`asChild` + static markup** — for a story showing **several instances** or arbitrary layout, where `args` are irrelevant:

   ```svelte
   <Story name="Sizes" asChild>
   	<div class="flex items-center gap-3">
   		<Button size="sm">Small</Button>
   		<Button size="md">Medium</Button>
   		<Button size="lg">Large</Button>
   	</div>
   </Story>
   ```

3. **Bare `children` without `asChild`** — content becomes the _children of the meta `component`_, i.e. the addon renders `<Component {...args}>{children}</Component>`. Only correct when you genuinely want the meta component wrapping your content (e.g. passing custom label markup to a single `Button`).

## The wrapper trap (read this before writing a multi-instance story)

Because form 3 wraps content in the meta `component`, a story like this:

```svelte
<!-- WRONG: renders an extra outer <Button> around the whole row -->
<Story name="Sizes">
	<div class="flex gap-3">
		<Button size="sm">Small</Button>
		...
	</div>
</Story>
```

renders **an extra `Button` wrapping the whole row** — visible as a stray filled/rounded background behind the group that reacts to hover. It is not a CSS bug, a Tailwind bug, or a Storybook toolbar overlay. Any story that shows more than one instance of the component, or any non-component layout, **must** use `asChild` (form 2) or `template` (form 1).

## Args typing

Type the `template` snippet arg with a narrowed `Pick<>` of the component's props, not the full `Props` interface — spreading a `Props` type that includes a required `children` onto an element that already has content produces `'children' is specified more than once`:

```ts
type ButtonStoryArgs = Pick<ButtonProps, 'variant' | 'size' | 'disabled'>;
```

## Lint note

`svelte/no-useless-children-snippet` flags `{#snippet children()}...{/snippet}` wrappers. The fix is to move to `asChild` with plain markup — **not** to simply drop the snippet wrapper, which leaves you in form 3 and re-introduces the wrapper trap above.
