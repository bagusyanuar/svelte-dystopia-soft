<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Progress from './Progress.svelte';
	import type { ProgressProps } from './Progress.types.js';

	type ProgressStoryArgs = Pick<ProgressProps, 'value' | 'max' | 'size' | 'indeterminate'>;

	const { Story } = defineMeta({
		title: 'Components/Progress',
		component: Progress,
		tags: ['autodocs'],
		args: { 'aria-label': 'Upload progress' },
		argTypes: {
			value: { control: { type: 'range', min: 0, max: 100 } },
			max: { control: 'number' },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			indeterminate: { control: 'boolean' }
		}
	});
</script>

<Story name="Default" args={{ value: 40 }}>
	{#snippet template(args: ProgressStoryArgs)}
		<div class="w-72">
			<Progress {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Complete" args={{ value: 100 }}>
	{#snippet template(args: ProgressStoryArgs)}
		<div class="w-72">
			<Progress {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Indeterminate" args={{ indeterminate: true }}>
	{#snippet template(args: ProgressStoryArgs)}
		<div class="w-72">
			<Progress {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-4">
		<Progress size="sm" value={40} aria-label="Small" />
		<Progress size="md" value={40} aria-label="Medium" />
		<Progress size="lg" value={40} aria-label="Large" />
	</div>
</Story>

<Story name="With a label" asChild>
	<div class="flex w-72 flex-col gap-1.5">
		<div class="flex items-center justify-between text-sm text-foreground-soft">
			<span>Uploading…</span>
			<span>66%</span>
		</div>
		<Progress value={66} aria-label="Upload progress" />
	</div>
</Story>
