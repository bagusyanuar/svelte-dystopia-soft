<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Toaster from './Toaster.svelte';
	import { toast } from './toast-store.svelte.js';

	const { Story } = defineMeta({
		title: 'Components/Toast',
		component: Toaster,
		tags: ['autodocs']
	});

	const triggerClass =
		'inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-border bg-surface px-3 text-xs font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
</script>

{#snippet customStarIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class="size-4 text-primary"
	>
		<polygon
			points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
		/>
	</svg>
{/snippet}

<Story name="Default" asChild>
	<div class="flex h-64 w-96 items-center justify-center">
		<button
			type="button"
			class={triggerClass}
			onclick={() => toast.message('Event has been created')}
		>
			Show toast
		</button>
		<Toaster />
	</div>
</Story>

<Story name="Variants" asChild>
	<div class="flex h-64 w-full flex-wrap items-center justify-center gap-2">
		<button type="button" class={triggerClass} onclick={() => toast.message('Neutral update')}>
			Default
		</button>
		<button
			type="button"
			class={triggerClass}
			onclick={() => toast.info('New version 2.0 is available')}
		>
			Info
		</button>
		<button
			type="button"
			class={triggerClass}
			onclick={() => toast.success('Changes saved successfully')}
		>
			Success
		</button>
		<button
			type="button"
			class={triggerClass}
			onclick={() => toast.warning('Storage reaching capacity (85%)')}
		>
			Warning
		</button>
		<button
			type="button"
			class={triggerClass}
			onclick={() => toast.danger('Could not connect to server')}
		>
			Danger
		</button>
		<Toaster />
	</div>
</Story>

<Story name="With a description" asChild>
	<div class="flex h-64 w-96 items-center justify-center">
		<button
			type="button"
			class={triggerClass}
			onclick={() =>
				toast.success('Deployment completed', {
					description: 'Production is now serving the latest release.'
				})}
		>
			Show toast with description
		</button>
		<Toaster />
	</div>
</Story>

<Story name="Custom icon" asChild>
	<div class="flex h-64 w-96 items-center justify-center">
		<button
			type="button"
			class={triggerClass}
			onclick={() =>
				toast.message('Added to favorites', {
					icon: customStarIcon,
					description: 'Saved to your personal workspace.'
				})}
		>
			Toast with custom icon
		</button>
		<Toaster />
	</div>
</Story>

<Story name="Without icon" asChild>
	<div class="flex h-64 w-96 items-center justify-center">
		<button
			type="button"
			class={triggerClass}
			onclick={() =>
				toast.success('Changes applied', {
					icon: false
				})}
		>
			Success without icon
		</button>
		<Toaster />
	</div>
</Story>

<Story name="Stacking (max 3 visible)" asChild>
	<div class="flex h-64 w-96 flex-col items-center justify-center gap-2">
		<button
			type="button"
			class={triggerClass}
			onclick={() => toast.message(`Notification ${Math.floor(Math.random() * 100)}`)}
		>
			Show toast (click a few times)
		</button>
		<p class="max-w-64 text-center text-xs text-foreground-subtle">
			Only the newest 3 render at once; the rest wait until one clears.
		</p>
		<Toaster max={3} />
	</div>
</Story>

<Story name="Top-left position" asChild>
	<div class="flex h-64 w-96 items-center justify-center">
		<button type="button" class={triggerClass} onclick={() => toast.message('Top left toast')}>
			Show toast
		</button>
		<Toaster position="top-left" />
	</div>
</Story>

<Story name="With Action" asChild>
	<div class="flex h-64 w-96 items-center justify-center">
		<button
			type="button"
			class={triggerClass}
			onclick={() =>
				toast.success('Conversation archived', {
					description: 'Moved to archived conversations list.',
					action: {
						label: 'Undo',
						onClick: () => toast.info('Archiving undone')
					}
				})}
		>
			Toast with action
		</button>
		<Toaster />
	</div>
</Story>

<Story name="Custom Item Snippet" asChild>
	<div class="flex h-64 w-96 items-center justify-center">
		<button
			type="button"
			class={triggerClass}
			onclick={() =>
				toast.message('Build succeeded', {
					description: 'Artifact deployed to production.'
				})}
		>
			Custom styled toast
		</button>
		<Toaster>
			{#snippet item({ toast: t, dismiss })}
				<div class="flex items-center justify-between gap-3 rounded-full border border-primary/20 bg-surface px-4 py-2 shadow-lg backdrop-blur-md">
					<div class="flex items-center gap-2">
						<span class="size-2 rounded-full bg-success"></span>
						<span class="text-xs font-semibold text-foreground">{t.title}</span>
					</div>
					<button
						type="button"
						class="text-xs text-foreground-faint hover:text-foreground cursor-pointer"
						onclick={() => dismiss(t.id)}
					>
						✕
					</button>
				</div>
			{/snippet}
		</Toaster>
	</div>
</Story>

