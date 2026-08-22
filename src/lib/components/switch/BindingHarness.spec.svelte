<script lang="ts">
	import Switch from './Switch.svelte';
	import Label from '../label/Label.svelte';

	let checked = $state(false);
</script>

<Switch id="notifications" bind:checked />
<Label for="notifications">Notifications</Label>
<output data-testid="outer-checked">{checked}</output>
