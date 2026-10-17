<script lang="ts">
	import Select from './Select.svelte';
	import type { SelectClasses } from './Select.types.js';

	let {
		value = $bindable('apple'),
		disabled = false,
		invalid = false,
		customIcon = false,
		classes = undefined,
		onValueChange = undefined
	}: {
		value?: string;
		disabled?: boolean;
		invalid?: boolean;
		customIcon?: boolean;
		classes?: SelectClasses;
		onValueChange?: (val: string) => void;
	} = $props();

	let ref = $state<HTMLSelectElement | null>(null);
	let selectRef = $state<HTMLSelectElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);
</script>

<Select
	aria-label="Fruit"
	bind:value
	bind:ref
	bind:selectRef
	bind:containerRef
	{disabled}
	{invalid}
	{classes}
	{onValueChange}
>
	{#snippet icon({ disabled: isDis, invalid: isInv, value: currentVal })}
		{#if customIcon}
			<span data-testid="custom-icon">
				{isDis ? 'DIS' : isInv ? 'ERR' : 'ICON'}:{currentVal}
			</span>
		{/if}
	{/snippet}

	{#snippet children({ value: currentVal })}
		<option value="apple">Apple ({currentVal})</option>
		<option value="banana">Banana</option>
		<option value="cherry">Cherry</option>
	{/snippet}
</Select>

<span data-testid="has-ref">{ref ? 'yes' : 'no'}</span>
<span data-testid="has-select-ref">{selectRef ? 'yes' : 'no'}</span>
<span data-testid="has-container-ref">{containerRef ? 'yes' : 'no'}</span>
<output data-testid="outer-value">{value}</output>
