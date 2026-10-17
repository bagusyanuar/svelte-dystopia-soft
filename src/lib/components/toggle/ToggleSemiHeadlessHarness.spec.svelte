<script lang="ts">
	import Toggle from './Toggle.svelte';

	let {
		bindRef = false,
		testChild = false,
		testSnippetPayload = false,
		testPreventDefault = false,
		defaultPressed = false,
		onPressedChange
	}: {
		bindRef?: boolean;
		testChild?: boolean;
		testSnippetPayload?: boolean;
		testPreventDefault?: boolean;
		defaultPressed?: boolean;
		onPressedChange?: (pressed: boolean) => void;
	} = $props();

	let toggleRef = $state<HTMLButtonElement | null>(null);
	let pressed = $state(false);

	function handlePreventClick(event: MouseEvent) {
		event.preventDefault();
	}
</script>

{#if bindRef}
	<Toggle bind:ref={toggleRef} aria-label="Ref Test">Ref Toggle</Toggle>
	<output data-testid="ref-status">{toggleRef ? 'bound' : 'null'}</output>
{:else if testChild}
	<Toggle {defaultPressed} {onPressedChange}>
		{#snippet child({ props, pressed: childPressed, disabled: childDisabled })}
			<div
				{...props}
				role="button"
				tabindex="0"
				data-testid="custom-toggle"
				data-custom-pressed={childPressed}
				data-custom-disabled={childDisabled}
			>
				Custom {childPressed ? 'Active' : 'Inactive'}
			</div>
		{/snippet}
	</Toggle>
{:else if testSnippetPayload}
	<Toggle {defaultPressed}>
		{#snippet children({ pressed: isPressed, disabled: isDisabled })}
			<span data-testid="payload-pressed">{isPressed ? 'Pressed' : 'Unpressed'}</span>
			<span data-testid="payload-disabled">{isDisabled ? 'Disabled' : 'Enabled'}</span>
		{/snippet}
	</Toggle>
{:else if testPreventDefault}
	<Toggle onclick={handlePreventClick}>
		Prevent Default
	</Toggle>
{:else}
	<Toggle bind:pressed {defaultPressed} {onPressedChange}>
		Toggle Standard
	</Toggle>
	<output data-testid="state-output">{pressed ? 'true' : 'false'}</output>
{/if}
