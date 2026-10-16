<script lang="ts">
	import NumberField from './NumberField.svelte';
	import type { NumberFieldClasses } from './NumberField.types.js';

	interface Props {
		value?: number;
		thousandSeparator?: boolean;
		hideSpinner?: boolean;
		classes?: NumberFieldClasses;
		onValueChange?: (value: number | undefined) => void;
	}

	let {
		value = $bindable(),
		thousandSeparator = false,
		hideSpinner = true,
		classes,
		onValueChange
	}: Props = $props();

	let rootRef = $state<HTMLInputElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef !== null}
	data-has-input={inputRef !== null}
	data-value={value}
>
	<NumberField
		bind:ref={rootRef}
		bind:inputRef
		bind:value
		{thousandSeparator}
		{hideSpinner}
		{classes}
		{onValueChange}
		placeholder="Enter number"
	>
		{#snippet prefix({ value, displayValue })}
			<span data-testid="test-prefix" data-display={displayValue}>
				{value !== undefined && value < 0 ? 'NEG' : 'POS'}
			</span>
		{/snippet}
		{#snippet suffix({ value })}
			<span data-testid="test-suffix">
				{value !== undefined ? `VAL:${value}` : 'EMPTY'}
			</span>
		{/snippet}
	</NumberField>
</div>
