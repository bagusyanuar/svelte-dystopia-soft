<script lang="ts">
	import PasswordField from './PasswordField.svelte';
	import type { PasswordFieldClasses } from './PasswordField.types.js';

	interface Props {
		value?: string;
		visible?: boolean;
		classes?: PasswordFieldClasses;
		onVisibleChange?: (visible: boolean) => void;
	}

	let {
		value = $bindable(''),
		visible = $bindable(false),
		classes,
		onVisibleChange
	}: Props = $props();

	let rootRef = $state<HTMLInputElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);
	let toggleRef = $state<HTMLButtonElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef !== null}
	data-has-input={inputRef !== null}
	data-has-container={containerRef !== null}
	data-has-toggle={toggleRef !== null}
	data-visible={visible}
>
	<PasswordField
		bind:ref={rootRef}
		bind:inputRef
		bind:containerRef
		bind:toggleRef
		bind:value
		bind:visible
		{classes}
		{onVisibleChange}
		placeholder="Enter secret"
	>
		{#snippet prefix({ visible })}
			<span data-testid="test-prefix">
				{visible ? 'UNLOCKED' : 'LOCKED'}
			</span>
		{/snippet}
		{#snippet icon({ visible })}
			<span data-testid="custom-icon">{visible ? 'EYE-OPEN' : 'EYE-CLOSED'}</span>
		{/snippet}
	</PasswordField>
</div>
