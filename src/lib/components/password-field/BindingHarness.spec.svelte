<script lang="ts">
	import PasswordField from './PasswordField.svelte';

	let value = $state('');
	let visible = $state(false);
</script>

<PasswordField placeholder="Password" bind:value bind:visible />

<output data-testid="outer-value">{value}</output>
<output data-testid="outer-visible">{String(visible)}</output>
