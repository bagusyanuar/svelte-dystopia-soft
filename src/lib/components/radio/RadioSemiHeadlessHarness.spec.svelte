<script lang="ts">
	import Radio from './Radio.svelte';

	let {
		value = 'plan-pro',
		group = $bindable(undefined),
		checked,
		disabled = false,
		invalid = false,
		customIndicator = false,
		hasLabel = false,
		hasDescription = false,
		useSnippets = false
	}: {
		value?: string;
		group?: string;
		checked?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		customIndicator?: boolean;
		hasLabel?: boolean;
		hasDescription?: boolean;
		useSnippets?: boolean;
	} = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let rootRef = $state<HTMLSpanElement | null>(null);
	let fieldRef = $state<HTMLDivElement | null>(null);
</script>

{#if customIndicator}
	<Radio
		bind:ref={inputRef}
		bind:rootRef
		bind:fieldRef
		bind:group
		{value}
		{checked}
		{disabled}
		{invalid}
		aria-label="Custom Radio"
		data-testid="harness-radio"
	>
		{#snippet indicator({ checked: isChecked })}
			<span data-testid="custom-indicator">{isChecked ? 'ACTIVE_DOT' : 'INACTIVE'}</span>
		{/snippet}
	</Radio>
{:else if useSnippets}
	<Radio
		bind:ref={inputRef}
		bind:rootRef
		bind:fieldRef
		bind:group
		{value}
		{checked}
		{disabled}
		{invalid}
		data-testid="harness-radio"
	>
		{#snippet label({ checked: isChecked })}
			<span data-testid="snippet-label">{isChecked ? 'Pro (Selected)' : 'Pro (Unselected)'}</span>
		{/snippet}
		{#snippet description({ checked: isChecked })}
			<span data-testid="snippet-desc"
				>{isChecked ? 'Selected plan active' : 'Click to select plan'}</span
			>
		{/snippet}
	</Radio>
{:else}
	<Radio
		bind:ref={inputRef}
		bind:rootRef
		bind:fieldRef
		bind:group
		{value}
		{checked}
		{disabled}
		{invalid}
		label={hasLabel ? 'Pro Plan' : undefined}
		description={hasDescription ? 'Best for growing teams' : undefined}
		aria-label={hasLabel ? undefined : 'Pro Plan'}
		data-testid="harness-radio"
	/>
{/if}

<span data-testid="has-input-ref">{inputRef ? 'yes' : 'no'}</span>
<span data-testid="has-root-ref">{rootRef ? 'yes' : 'no'}</span>
<span data-testid="has-field-ref">{fieldRef ? 'yes' : 'no'}</span>
<output data-testid="harness-group">{group}</output>
