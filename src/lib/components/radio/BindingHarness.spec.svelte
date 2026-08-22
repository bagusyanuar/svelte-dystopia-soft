<script lang="ts">
	import Radio from './Radio.svelte';
	import Label from '../label/Label.svelte';

	let selected = $state<string | undefined>(undefined);
</script>

<div>
	<Radio id="plan-free" name="plan" value="free" bind:group={selected} />
	<Label for="plan-free">Free</Label>
</div>
<div>
	<Radio id="plan-pro" name="plan" value="pro" bind:group={selected} />
	<Label for="plan-pro">Pro</Label>
</div>
<output data-testid="outer-selected">{selected}</output>
