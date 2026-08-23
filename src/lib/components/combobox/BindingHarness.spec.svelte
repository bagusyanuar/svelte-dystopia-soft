<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import Combobox from './Combobox.svelte';
	import type { ComboboxOption } from './Combobox.types.js';

	let value = $state<string | undefined>();
	let search = $state('');

	const options: ComboboxOption[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' }
	];
</script>

<Combobox {options} bind:value bind:search />
<output data-testid="outer-value">{value}</output>
<output data-testid="outer-search">{search}</output>
