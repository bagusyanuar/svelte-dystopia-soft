<script lang="ts">
	import Toggle from './Toggle.svelte';

	let pressed = $state(false);
</script>

<Toggle bind:pressed aria-label="Bold">B</Toggle>
<output data-testid="outer-pressed">{pressed}</output>
