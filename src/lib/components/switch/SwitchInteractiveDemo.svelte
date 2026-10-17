<script lang="ts">
	import Switch from './Switch.svelte';
	import type { SwitchProps } from './Switch.types.js';

	let {
		label = 'Airplane Mode',
		description = 'Disable all cellular, Wi-Fi, and Bluetooth radios.',
		checked = $bindable(false),
		size = 'md',
		disabled = false,
		withIcon = false
	}: {
		label?: string;
		description?: string;
		checked?: boolean;
		size?: SwitchProps['size'];
		disabled?: boolean;
		withIcon?: boolean;
	} = $props();

	let lastToggled = $state<boolean | null>(null);
</script>

<div class="flex max-w-sm flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs">
	<div class="flex items-center justify-between">
		<span class="text-xs font-semibold tracking-wider uppercase text-foreground-faint">Network Control</span>
		{#if lastToggled !== null}
			<span class="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
				onCheckedChange: {String(lastToggled)}
			</span>
		{/if}
	</div>

	<Switch
		bind:checked
		{size}
		{disabled}
		{label}
		{description}
		onCheckedChange={(val) => {
			lastToggled = val;
		}}
	>
		{#snippet thumb({ checked: isChecked })}
			{#if withIcon}
				{#if isChecked}
					<svg class="size-2.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6 9 17l-5-5"/>
					</svg>
				{:else}
					<svg class="size-2.5 text-foreground-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6 6 18M6 6l12 12"/>
					</svg>
				{/if}
			{/if}
		{/snippet}
	</Switch>

	<div class="mt-1 flex items-center justify-between border-t border-border pt-2 text-xs">
		<span class="text-foreground-muted">Current status:</span>
		<span class="font-medium {checked ? 'text-primary' : 'text-foreground-faint'}">
			{checked ? 'Radio Transmitters OFF' : 'Radio Transmitters ACTIVE'}
		</span>
	</div>
</div>
