<script lang="ts">
	import MaskedField from './MaskedField.svelte';
	import type { MaskedFieldClasses } from './MaskedField.types.js';

	interface Props {
		pattern?: string;
		value?: string;
		classes?: MaskedFieldClasses;
		onValueChange?: (value: string, unmaskedValue: string) => void;
	}

	let { pattern = '(##)-###-###', value = $bindable(''), classes, onValueChange }: Props = $props();

	let unmaskedValue = $state<string | undefined>('');
	let rootRef = $state<HTMLInputElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef !== null}
	data-has-input={inputRef !== null}
	data-unmasked={unmaskedValue}
	data-masked={value}
>
	<MaskedField
		bind:ref={rootRef}
		bind:inputRef
		bind:value
		bind:unmaskedValue
		{pattern}
		{classes}
		{onValueChange}
		placeholder="(08)-123-456"
	>
		{#snippet prefix({ unmaskedValue })}
			<span data-testid="test-prefix" data-len={unmaskedValue?.length ?? 0}>ID</span>
		{/snippet}
		{#snippet suffix({ value, unmaskedValue })}
			<span data-testid="test-suffix" data-val={value}>
				{unmaskedValue?.length === 8 ? 'LENGKAP' : 'BELUM'}
			</span>
		{/snippet}
	</MaskedField>
</div>
