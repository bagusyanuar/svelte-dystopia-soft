<script lang="ts">
	import Select from './Select.svelte';

	let value = $state('apple');
</script>

<Select aria-label="Fruit" bind:value>
	<option value="apple">Apple</option>
	<option value="banana">Banana</option>
	<option value="cherry">Cherry</option>
</Select>
<output data-testid="outer-value">{value}</output>
