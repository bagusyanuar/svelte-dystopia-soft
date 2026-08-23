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
		'inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
</script>

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
	<div class="flex h-64 w-96 items-center justify-center gap-2">
		<button type="button" class={triggerClass} onclick={() => toast.message('Neutral update')}>
			Default
		</button>
		<button type="button" class={triggerClass} onclick={() => toast.success('Changes saved')}>
			Success
		</button>
		<button type="button" class={triggerClass} onclick={() => toast.warning('Storage almost full')}>
			Warning
		</button>
		<button type="button" class={triggerClass} onclick={() => toast.danger('Payment failed')}>
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
			onclick={() => toast.success('Saved', { description: 'Your changes are live.' })}
		>
			Show toast
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
		<p class="max-w-64 text-center text-sm text-foreground-subtle">
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
