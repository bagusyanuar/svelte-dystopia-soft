<script lang="ts">
	import Label from './Label.svelte';
	import type { LabelClasses } from './Label.types.js';

	interface Props {
		required?: boolean;
		disabled?: boolean;
		classes?: LabelClasses;
		useCustomIndicator?: boolean;
	}

	let { required = false, disabled = false, classes, useCustomIndicator = false }: Props = $props();

	let rootRef = $state<HTMLLabelElement | null>(null);
</script>

<div data-testid="ref-status" data-has-root={rootRef !== null}>
	<Label bind:ref={rootRef} {required} {disabled} {classes}>
		{#snippet children({ required, disabled })}
			<span data-testid="label-text" data-required={required} data-disabled={disabled}>
				Label Akun
			</span>
		{/snippet}
		{#snippet requiredIndicator({ required })}
			{#if useCustomIndicator}
				<span data-testid="custom-marker">(wajib-{required})</span>
			{/if}
		{/snippet}
	</Label>
</div>
