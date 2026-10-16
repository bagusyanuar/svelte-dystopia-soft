<script lang="ts">
	import Checkbox from './Checkbox.svelte';

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		customIndicator = false
	}: {
		checked?: boolean;
		indeterminate?: boolean;
		customIndicator?: boolean;
	} = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let rootRef = $state<HTMLSpanElement | null>(null);
</script>

{#if customIndicator}
	<Checkbox
		bind:ref={inputRef}
		bind:rootRef
		bind:checked
		bind:indeterminate
		data-testid="harness-checkbox"
	>
		{#snippet indicator({ checked: c, indeterminate: ind })}
			<span data-testid="custom-indicator">{ind ? 'dash' : c ? 'check' : 'none'}</span>
		{/snippet}
	</Checkbox>
{:else}
	<Checkbox
		bind:ref={inputRef}
		bind:rootRef
		bind:checked
		bind:indeterminate
		data-testid="harness-checkbox"
	/>
{/if}

<span data-testid="has-input-ref">{inputRef ? 'yes' : 'no'}</span>
<span data-testid="has-root-ref">{rootRef ? 'yes' : 'no'}</span>
