<script lang="ts">
	import Textarea from './Textarea.svelte';

	let value = $state('');
</script>

<Textarea placeholder="Bio" bind:value maxlength={10} />
<output data-testid="outer-value">{value}</output>
