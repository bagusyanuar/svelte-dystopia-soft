<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Toggle from './Toggle.svelte';
	import ToggleInteractiveDemo from './ToggleInteractiveDemo.svelte';
	import type { ToggleProps } from './Toggle.types.js';

	type ToggleStoryArgs = Pick<ToggleProps, 'variant' | 'size' | 'pressed' | 'disabled'>;

	const { Story } = defineMeta({
		title: 'Components/Toggle',
		component: Toggle,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'outline'] },
			size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
			pressed: { control: 'boolean' },
			disabled: { control: 'boolean' }
		}
	});
</script>

{#snippet boldIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />
	</svg>
{/snippet}

<Story name="Default" args={{ variant: 'default' }}>
	{#snippet template(args: ToggleStoryArgs)}
		<Toggle {...args}>Bold</Toggle>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet template(args: ToggleStoryArgs)}
		<Toggle {...args}>Bold</Toggle>
	{/snippet}
</Story>

<Story name="Pressed" args={{ pressed: true }}>
	{#snippet template(args: ToggleStoryArgs)}
		<Toggle {...args}>Bold</Toggle>
	{/snippet}
</Story>

<Story name="Interactive Demo" asChild>
	<ToggleInteractiveDemo />
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-3">
		<Toggle size="xs" pressed>Extra Small</Toggle>
		<Toggle size="sm" pressed>Small</Toggle>
		<Toggle size="md" pressed>Medium</Toggle>
		<Toggle size="lg" pressed>Large</Toggle>
	</div>
</Story>

<Story name="Disabled" asChild>
	<div class="flex items-center gap-3">
		<Toggle disabled>Bold</Toggle>
		<Toggle disabled pressed>Bold</Toggle>
	</div>
</Story>

<Story name="Icon only" asChild>
	<div class="flex items-center gap-3">
		<Toggle size="md" class="w-10 px-0" aria-label="Bold">
			{@render boldIcon()}
		</Toggle>
		<Toggle size="md" class="w-10 px-0" pressed aria-label="Bold">
			{@render boldIcon()}
		</Toggle>
	</div>
</Story>

<Story name="Toolbar" asChild>
	<div class="flex items-center gap-1">
		<Toggle variant="outline" pressed>Bold</Toggle>
		<Toggle variant="outline">Italic</Toggle>
		<Toggle variant="outline">Underline</Toggle>
	</div>
</Story>

<Story name="Child Snippet Pattern" asChild>
	<div class="flex items-center gap-3">
		<Toggle defaultPressed>
			{#snippet child({ props, pressed })}
				<button
					{...props}
					class="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-surface-subtle data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
				>
					<span class="size-1.5 rounded-full {pressed ? 'bg-primary' : 'bg-foreground-faint'}"></span>
					<span>Custom Filter Pill ({pressed ? 'Active' : 'Inactive'})</span>
				</button>
			{/snippet}
		</Toggle>
	</div>
</Story>

