<script lang="ts">
	import Checkbox from './Checkbox.svelte';
	import Label from '../label/Label.svelte';

	let checked = $state(false);
	let indeterminate = $state(true);
</script>

<Checkbox id="terms" bind:checked bind:indeterminate />
<Label for="terms">Accept terms</Label>
<output data-testid="outer-checked">{checked}</output>
<output data-testid="outer-indeterminate">{indeterminate}</output>
