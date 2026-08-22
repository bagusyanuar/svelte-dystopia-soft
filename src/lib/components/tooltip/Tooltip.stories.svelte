<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tooltip from './Tooltip.svelte';

	const { Story } = defineMeta({
		title: 'Components/Tooltip',
		component: Tooltip,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<Tooltip>
			{#snippet content()}
				Saves your changes
			{/snippet}
			<button
				type="button"
				class="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground-soft hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				Save
			</button>
		</Tooltip>
	</div>
</Story>

<Story name="Placements" asChild>
	<div class="flex w-full flex-wrap justify-center gap-16 p-24">
		<Tooltip placement="top">
			{#snippet content()}
				Top
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Top</span>
		</Tooltip>
		<Tooltip placement="right">
			{#snippet content()}
				Right
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Right</span>
		</Tooltip>
		<Tooltip placement="bottom">
			{#snippet content()}
				Bottom
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Bottom</span>
		</Tooltip>
		<Tooltip placement="left">
			{#snippet content()}
				Left
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Left</span>
		</Tooltip>
	</div>
</Story>

<Story name="With arrow" asChild>
	<div class="flex w-full flex-wrap justify-center gap-16 p-24">
		<Tooltip placement="top" showArrow>
			{#snippet content()}
				Top
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Top</span>
		</Tooltip>
		<Tooltip placement="bottom" showArrow>
			{#snippet content()}
				Bottom
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Bottom</span>
		</Tooltip>
		<Tooltip placement="left" showArrow>
			{#snippet content()}
				Left
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Left</span>
		</Tooltip>
		<Tooltip placement="right" showArrow>
			{#snippet content()}
				Right
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Right</span>
		</Tooltip>
	</div>
</Story>

<Story name="On an icon-only button" asChild>
	<!--
	  The trigger here is a real <button>, and aria-describedby lands on that
	  button (not the wrapping span) so a screen reader announces the
	  description when it receives focus — the exact case the disabled-vs-
	  wrapper distinction below exists for.
	-->
	<div class="flex w-80 justify-center p-16">
		<Tooltip placement="top">
			{#snippet content()}
				Delete item
			{/snippet}
			<button
				type="button"
				aria-label="Delete"
				class="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground-soft hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="size-4"
				>
					<path d="M3 6h18" />
					<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
					<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
				</svg>
			</button>
		</Tooltip>
	</div>
</Story>

<Story name="Custom delay" asChild>
	<div class="flex w-80 justify-center p-16">
		<Tooltip delayDuration={0}>
			{#snippet content()}
				Shows instantly
			{/snippet}
			<span class="cursor-help underline decoration-dotted">No delay</span>
		</Tooltip>
	</div>
</Story>

<Story name="Custom content styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<Tooltip
			showArrow
			classes={{ content: 'bg-danger text-danger-foreground', arrow: 'bg-danger' }}
		>
			{#snippet content()}
				Destructive action
			{/snippet}
			<span class="cursor-help underline decoration-dotted">Danger styled</span>
		</Tooltip>
	</div>
</Story>
