<script lang="ts">
	import TextField from './TextField.svelte';
	import type { TextFieldClasses } from './TextField.types.js';

	interface Props {
		value?: string;
		classes?: TextFieldClasses;
		invalid?: boolean;
		disabled?: boolean;
		onValueChange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		classes,
		invalid = false,
		disabled = false,
		onValueChange
	}: Props = $props();

	let rootRef = $state<HTMLInputElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef !== null}
	data-has-input={inputRef !== null}
	data-has-container={containerRef !== null}
	data-value={value}
>
	<TextField
		bind:ref={rootRef}
		bind:inputRef
		bind:containerRef
		bind:value
		{classes}
		{invalid}
		{disabled}
		{onValueChange}
		placeholder="Type here..."
	>
		{#snippet prefix({ value })}
			<span data-testid="test-prefix" data-len={value.length}>PREFIX</span>
		{/snippet}
		{#snippet suffix({ value })}
			<span data-testid="test-suffix">
				{value.length > 0 ? `LEN:${value.length}` : 'EMPTY'}
			</span>
		{/snippet}
	</TextField>
</div>
