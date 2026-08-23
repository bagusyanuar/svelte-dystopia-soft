<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Drawer from './Drawer.svelte';

	const { Story } = defineMeta({
		title: 'Components/Drawer',
		component: Drawer,
		tags: ['autodocs']
	});
</script>

<Story name="Right (default)" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer>
			{#snippet trigger()}
				Open notifications
			{/snippet}
			{#snippet title()}
				Notifications
			{/snippet}
			{#snippet description()}
				Recent activity on your account.
			{/snippet}
			<p class="text-foreground-muted">You're all caught up.</p>
		</Drawer>
	</div>
</Story>

<Story name="Left" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer side="left">
			{#snippet trigger()}
				Open menu
			{/snippet}
			{#snippet title()}
				Navigation
			{/snippet}
			<p class="text-foreground-muted">Links and shortcuts go here.</p>
		</Drawer>
	</div>
</Story>

<Story name="Bottom (mobile sheet)" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer side="bottom">
			{#snippet trigger()}
				Open sheet
			{/snippet}
			{#snippet title()}
				Share
			{/snippet}
			<p class="text-foreground-muted">Pick where to share this.</p>
		</Drawer>
	</div>
</Story>

<Story name="Top" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer side="top">
			{#snippet trigger()}
				Open banner
			{/snippet}
			{#snippet title()}
				System status
			{/snippet}
			<p class="text-foreground-muted">All systems operational.</p>
		</Drawer>
	</div>
</Story>

<Story name="With a footer" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer>
			{#snippet trigger()}
				Edit item
			{/snippet}
			{#snippet title()}
				Edit item
			{/snippet}
			<div class="flex h-full flex-col justify-between">
				<p class="text-foreground-muted">Form fields would go here.</p>
				<div class="flex justify-end gap-2 pt-4">
					<button
						type="button"
						class="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle"
					>
						Cancel
					</button>
					<button
						type="button"
						class="inline-flex h-9 cursor-pointer items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
					>
						Save
					</button>
				</div>
			</div>
		</Drawer>
	</div>
</Story>
