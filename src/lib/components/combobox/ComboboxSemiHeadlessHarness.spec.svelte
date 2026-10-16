<!-- ComboboxSemiHeadlessHarness.spec.svelte -->
<script lang="ts">
	import Combobox from './Combobox.svelte';
	import type { ComboboxOption } from './Combobox.types.js';

	let rootRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLDivElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);

	const options: ComboboxOption[] = [
		{ value: 'apple', label: 'Apple', group: 'Fruits' },
		{ value: 'banana', label: 'Banana', group: 'Fruits' }
	];
</script>

<Combobox
	{options}
	bind:ref={rootRef}
	bind:triggerRef
	bind:inputRef
	bind:contentRef
	data-testid="combobox-root"
	class="custom-root-class"
	classes={{
		trigger: 'custom-trigger-class',
		content: 'custom-content-class',
		listbox: 'custom-listbox-class',
		indicator: 'custom-indicator-class',
		groupHeader: 'custom-group-header'
	}}
>
	{#snippet indicator({ open })}
		<span data-testid="custom-indicator" data-open={open ? 'true' : 'false'}>ICON</span>
	{/snippet}
	{#snippet empty({ query })}
		<span data-testid="custom-empty">Kosong: {query}</span>
	{/snippet}
</Combobox>

<output data-testid="has-root-ref">{rootRef ? 'yes' : 'no'}</output>
<output data-testid="has-trigger-ref">{triggerRef ? 'yes' : 'no'}</output>
<output data-testid="has-input-ref">{inputRef ? 'yes' : 'no'}</output>
<output data-testid="has-content-ref">{contentRef ? 'yes' : 'no'}</output>
