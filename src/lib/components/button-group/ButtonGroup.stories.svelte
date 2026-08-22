<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from '../button/Button.svelte';

	const { Story } = defineMeta({
		title: 'Components/ButtonGroup',
		component: ButtonGroup,
		tags: ['autodocs']
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

{#snippet italicIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M19 4h-9M14 20H5M15 4 9 20" />
	</svg>
{/snippet}

{#snippet underlineIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" />
	</svg>
{/snippet}

<Story name="Default" asChild>
	<ButtonGroup aria-label="Text alignment">
		<Button variant="outline">Left</Button>
		<Button variant="outline">Center</Button>
		<Button variant="outline">Right</Button>
	</ButtonGroup>
</Story>

<Story name="Default variant" asChild>
	<ButtonGroup aria-label="View">
		<Button>List</Button>
		<Button>Board</Button>
		<Button>Timeline</Button>
	</ButtonGroup>
</Story>

<Story name="Vertical" asChild>
	<ButtonGroup orientation="vertical" aria-label="Text alignment">
		<Button variant="outline">Left</Button>
		<Button variant="outline">Center</Button>
		<Button variant="outline">Right</Button>
	</ButtonGroup>
</Story>

<Story name="With a disabled button" asChild>
	<ButtonGroup aria-label="Pagination">
		<Button variant="outline" disabled>Previous</Button>
		<Button variant="outline">Next</Button>
	</ButtonGroup>
</Story>

<Story name="Icon buttons" asChild>
	<ButtonGroup aria-label="Text formatting">
		<Button variant="outline" size="sm" class="px-2.5" aria-label="Bold">
			{@render boldIcon()}
		</Button>
		<Button variant="outline" size="sm" class="px-2.5" aria-label="Italic">
			{@render italicIcon()}
		</Button>
		<Button variant="outline" size="sm" class="px-2.5" aria-label="Underline">
			{@render underlineIcon()}
		</Button>
	</ButtonGroup>
</Story>
