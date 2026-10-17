<script lang="ts">
	import Switch from './Switch.svelte';
	import type { SwitchClasses } from './Switch.types.js';
	import type { Snippet } from 'svelte';

	let {
		checked = $bindable(false),
		disabled = false,
		invalid = false,
		size = 'md',
		classes = undefined,
		label = undefined,
		description = undefined,
		customThumb = false,
		onCheckedChange = undefined
	}: {
		checked?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		size?: 'sm' | 'md' | 'lg';
		classes?: SwitchClasses;
		label?: string | Snippet<[{ checked: boolean }]>;
		description?: string | Snippet<[{ checked: boolean }]>;
		customThumb?: boolean;
		onCheckedChange?: (checked: boolean) => void;
	} = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let rootRef = $state<HTMLSpanElement | null>(null);
	let fieldRef = $state<HTMLDivElement | null>(null);
	let callbackCallCount = $state(0);
	let lastCallbackValue = $state<boolean | null>(null);

	function handleCheckedChange(val: boolean) {
		callbackCallCount += 1;
		lastCallbackValue = val;
		onCheckedChange?.(val);
	}
</script>

<Switch
	bind:ref={inputRef}
	bind:rootRef
	bind:fieldRef
	bind:checked
	{disabled}
	{invalid}
	{size}
	{classes}
	{label}
	{description}
	onCheckedChange={handleCheckedChange}
	aria-label={label ? undefined : 'Test Switch'}
>
	{#snippet thumb({ checked: thumbChecked, disabled: thumbDisabled })}
		{#if customThumb}
			<span data-testid="custom-thumb" data-thumb-checked={thumbChecked} data-thumb-disabled={thumbDisabled}>
				{thumbChecked ? 'ON' : 'OFF'}
			</span>
		{/if}
	{/snippet}
</Switch>

<div data-testid="harness-state">
	<span data-testid="has-input-ref">{Boolean(inputRef)}</span>
	<span data-testid="has-root-ref">{Boolean(rootRef)}</span>
	<span data-testid="has-field-ref">{Boolean(fieldRef)}</span>
	<span data-testid="callback-count">{callbackCallCount}</span>
	<span data-testid="callback-val">{String(lastCallbackValue)}</span>
	<span data-testid="bound-checked">{String(checked)}</span>
</div>
