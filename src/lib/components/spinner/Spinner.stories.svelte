<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Spinner from './Spinner.svelte';
	import type { SpinnerProps } from './Spinner.types.js';

	type SpinnerStoryArgs = Pick<SpinnerProps, 'size' | 'label'>;

	const { Story } = defineMeta({
		title: 'Components/Spinner',
		component: Spinner,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'select', options: ['sm', 'md', 'lg'] }
		}
	});
</script>

<Story name="Default" args={{}}>
	{#snippet template(args: SpinnerStoryArgs)}
		<Spinner {...args} class="text-foreground-subtle" />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-cozy text-foreground-subtle">
		<Spinner size="sm" />
		<Spinner size="md" />
		<Spinner size="lg" />
	</div>
</Story>

<Story name="Custom label" args={{ label: 'Saving changes' }}>
	{#snippet template(args: SpinnerStoryArgs)}
		<Spinner {...args} class="text-foreground-subtle" />
	{/snippet}
</Story>

<Story name="Inside a button (aria-busy already announces it)" asChild>
	<button
		type="button"
		disabled
		aria-busy="true"
		class="inline-flex h-10 cursor-not-allowed items-center gap-tight rounded-md bg-primary px-control-x text-sm font-medium text-primary-foreground opacity-50"
	>
		<Spinner label="" size="sm" />
		Saving…
	</button>
</Story>
