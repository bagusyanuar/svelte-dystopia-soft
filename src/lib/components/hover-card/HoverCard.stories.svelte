<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HoverCard from './HoverCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/HoverCard',
		component: HoverCard,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<HoverCard openDelay={0}>
			{#snippet content()}
				<div class="flex w-64 flex-col gap-2">
					<p class="font-medium text-foreground">Ada Lovelace</p>
					<p class="text-foreground-muted">
						Mathematician and writer, known for her work on Charles Babbage's Analytical Engine.
					</p>
					<a href="#profile" class="text-primary hover:underline">View full profile</a>
				</div>
			{/snippet}
			<a href="#user" class="font-medium text-primary hover:underline">@ada</a>
		</HoverCard>
	</div>
</Story>

<Story name="Placements" asChild>
	<div class="flex w-full flex-wrap justify-center gap-16 p-24">
		<HoverCard placement="top" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Top placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Top</span>
		</HoverCard>
		<HoverCard placement="right" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Right placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Right</span>
		</HoverCard>
		<HoverCard placement="bottom" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Bottom placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Bottom</span>
		</HoverCard>
		<HoverCard placement="left" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Left placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Left</span>
		</HoverCard>
	</div>
</Story>

<Story name="Custom content styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<HoverCard openDelay={0} classes={{ content: 'bg-danger text-danger-foreground' }}>
			{#snippet content()}
				<p class="w-48">Card styled with the classes prop, same as Popover and Dropdown.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Danger styled</span>
		</HoverCard>
	</div>
</Story>
