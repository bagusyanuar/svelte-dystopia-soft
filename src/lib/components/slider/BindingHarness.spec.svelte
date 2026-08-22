<script lang="ts">
	import Slider from './Slider.svelte';

	let value = $state(20);
</script>

<Slider bind:value aria-label="Volume" min={0} max={100} />
<output data-testid="outer-value">{value}</output>
