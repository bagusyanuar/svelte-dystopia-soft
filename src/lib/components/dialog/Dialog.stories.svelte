<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dialog from './Dialog.svelte';

	const { Story } = defineMeta({
		title: 'Components/Dialog',
		component: Dialog,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog>
			{#snippet trigger()}
				Edit profile
			{/snippet}
			{#snippet title()}
				Edit profile
			{/snippet}
			<p class="w-64 text-foreground-muted">Update your name and photo. Changes save instantly.</p>
		</Dialog>
	</div>
</Story>

<Story name="With a description" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog>
			{#snippet trigger()}
				Delete project
			{/snippet}
			{#snippet title()}
				Delete project
			{/snippet}
			{#snippet description()}
				This will permanently delete the project and all of its data. This action cannot be undone.
			{/snippet}
			<div class="mt-2 flex justify-end gap-2">
				<button
					type="button"
					class="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle"
				>
					Cancel
				</button>
				<button
					type="button"
					class="inline-flex h-9 cursor-pointer items-center rounded-lg bg-danger px-3 text-sm font-medium text-danger-foreground transition-colors duration-150 hover:opacity-90"
				>
					Delete
				</button>
			</div>
		</Dialog>
	</div>
</Story>

<Story name="Inside a scroll container (table)" asChild>
	<div class="w-96 overflow-x-auto rounded-lg border border-border">
		<table class="w-160 text-sm">
			<thead>
				<tr class="border-b border-border text-left text-foreground-soft">
					<th class="p-3">Name</th>
					<th class="p-3">Role</th>
					<th class="p-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-border">
					<td class="p-3">Ada Lovelace</td>
					<td class="p-3">Admin</td>
					<td class="p-3">
						<Dialog>
							{#snippet trigger()}
								Remove
							{/snippet}
							{#snippet title()}
								Remove Ada Lovelace?
							{/snippet}
							<p class="w-56 text-foreground-muted">
								They will lose access to this workspace immediately.
							</p>
						</Dialog>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</Story>

<Story name="Custom content styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog classes={{ content: 'bg-primary text-primary-foreground border-transparent' }}>
			{#snippet trigger()}
				Open
			{/snippet}
			{#snippet title()}
				Accent-styled dialog
			{/snippet}
			<p class="w-56">Styled entirely via the classes prop.</p>
		</Dialog>
	</div>
</Story>

<Story name="Overriding the default animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog classes={{ content: 'dialog-slide' }}>
			{#snippet trigger()}
				Slide in
			{/snippet}
			{#snippet title()}
				Custom animation
			{/snippet}
			<p class="w-56">
				The built-in scale animation is a plain <code>data-[state=*]:animate-*</code> utility, so
				passing your own through <code>classes</code> replaces it instead of stacking.
			</p>
		</Dialog>
	</div>
</Story>

<Story name="No animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog classes={{ overlay: 'animate-none', content: 'animate-none' }}>
			{#snippet trigger()}
				Instant
			{/snippet}
			{#snippet title()}
				No animation
			{/snippet}
			<p class="w-56">
				<code>animate-none</code> opts out entirely; the dialog unmounts immediately on close.
			</p>
		</Dialog>
	</div>
</Story>

<style>
	/*
	  The content is portalled to <body>, so it never carries this component's
	  scope class — the selectors have to be global. See Popover.stories.svelte
	  for the same reasoning.

	  `-global-` belongs on the @keyframes declaration only: Svelte strips it
	  from the emitted name but does NOT rewrite references inside :global(),
	  so spelling it here too would point at names that no longer exist and the
	  animations would silently never run.

	  Only `transform` is touched — Dialog centres its content with a flex
	  wrapper, so a consumer animation never has to restate a centring offset.
	*/
	:global(.dialog-slide[data-state='open']) {
		animation: dialog-slide-in 200ms ease-out;
	}

	:global(.dialog-slide[data-state='closed']) {
		animation: dialog-slide-out 200ms ease-in;
	}

	@keyframes -global-dialog-slide-in {
		from {
			opacity: 0;
			transform: translateY(-16px);
		}
	}

	@keyframes -global-dialog-slide-out {
		to {
			opacity: 0;
			transform: translateY(-16px);
		}
	}
</style>
