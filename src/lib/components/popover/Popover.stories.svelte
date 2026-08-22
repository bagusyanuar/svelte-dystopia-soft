<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Popover from './Popover.svelte';

	const { Story } = defineMeta({
		title: 'Components/Popover',
		component: Popover,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<Popover>
			{#snippet trigger()}
				Open popover
			{/snippet}
			<p class="w-56">
				Popovers position themselves against the trigger and stay clear of clipping ancestors.
			</p>
		</Popover>
	</div>
</Story>

<Story name="Placements" asChild>
	<div class="flex w-full flex-wrap justify-center gap-16 p-24">
		<Popover placement="top">
			{#snippet trigger()}
				Top
			{/snippet}
			<p class="w-48">Top placement.</p>
		</Popover>
		<Popover placement="right">
			{#snippet trigger()}
				Right
			{/snippet}
			<p class="w-48">Right placement.</p>
		</Popover>
		<Popover placement="bottom">
			{#snippet trigger()}
				Bottom
			{/snippet}
			<p class="w-48">Bottom placement.</p>
		</Popover>
		<Popover placement="left">
			{#snippet trigger()}
				Left
			{/snippet}
			<p class="w-48">Left placement.</p>
		</Popover>
	</div>
</Story>

<Story name="Inside a scroll container (table)" asChild>
	<!--
	  A row of freeform details, not a list of actions — for an actions menu
	  with arrow-key navigation and a `menu` role, use Dropdown instead.
	-->
	<div class="w-96 overflow-x-auto rounded-lg border border-border">
		<table class="w-160 text-sm">
			<thead>
				<tr class="border-b border-border text-left text-foreground-soft">
					<th class="p-3">Name</th>
					<th class="p-3">Email</th>
					<th class="p-3">Role</th>
					<th class="p-3">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-border">
					<td class="p-3">Ada Lovelace</td>
					<td class="p-3">ada@example.com</td>
					<td class="p-3">Admin</td>
					<td class="p-3">
						<Popover placement="bottom-end">
							{#snippet trigger()}
								View
							{/snippet}
							<div class="w-48 space-y-1">
								<p class="font-medium text-foreground">Ada Lovelace</p>
								<p class="text-foreground-muted">Admin since Jan 2024. Last active 2 hours ago.</p>
							</div>
						</Popover>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</Story>

<Story name="Custom enter and exit animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Popover classes={{ content: 'popover-animated' }}>
			{#snippet trigger()}
				Animated
			{/snippet}
			<p class="w-52">
				The panel stays mounted until the <code>data-state="closed"</code> animation finishes.
			</p>
		</Popover>
	</div>
</Story>

<Story name="Custom content styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<Popover classes={{ content: 'bg-primary text-primary-foreground border-transparent' }}>
			{#snippet trigger()}
				Open
			{/snippet}
			<p class="w-48">Accent-styled panel via the classes prop.</p>
		</Popover>
	</div>
</Story>

<style>
	/*
	  The panel is portalled to <body>, so it never carries this component's
	  scope class — the selectors have to be global. Positioning is driven by
	  `left`/`top`, which leaves `transform` free for the consumer.

	  `-global-` belongs on the @keyframes declaration only: Svelte strips it
	  from the emitted name but does NOT rewrite references inside :global(),
	  so spelling it here too would point at a `-global-popover-in` that no
	  longer exists, and the animation would silently never run.
	*/
	:global(.popover-animated[data-state='open']) {
		animation: popover-in 150ms ease-out;
	}

	:global(.popover-animated[data-state='closed']) {
		animation: popover-out 150ms ease-in;
	}

	@keyframes -global-popover-in {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(-4px);
		}
	}

	@keyframes -global-popover-out {
		to {
			opacity: 0;
			transform: scale(0.96) translateY(-4px);
		}
	}
</style>
