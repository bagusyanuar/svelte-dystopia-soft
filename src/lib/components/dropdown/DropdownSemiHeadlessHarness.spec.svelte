<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import DropdownItem from './DropdownItem.svelte';
	import type { DropdownClasses } from './Dropdown.types.js';

	let {
		open = $bindable(false),
		class: className,
		classes,
		disabled = false,
		itemDisabled = false,
		renderLink = false,
		renderChild = false
	}: {
		open?: boolean;
		class?: string;
		classes?: DropdownClasses;
		disabled?: boolean;
		itemDisabled?: boolean;
		renderLink?: boolean;
		renderChild?: boolean;
	} = $props();

	let rootRef = $state<HTMLButtonElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);
	let itemRef = $state<HTMLElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef ? 'true' : 'false'}
	data-has-trigger={triggerRef ? 'true' : 'false'}
	data-has-content={contentRef ? 'true' : 'false'}
	data-has-item={itemRef ? 'true' : 'false'}
></div>

<Dropdown
	bind:ref={rootRef}
	bind:triggerRef
	bind:contentRef
	bind:open
	class={className}
	{classes}
	{disabled}
>
	{#snippet trigger({ open: isOpen })}
		<span data-testid="trigger-span" data-is-open={isOpen ? 'true' : 'false'}>
			{isOpen ? 'Close Menu' : 'Open Menu'}
		</span>
	{/snippet}
	{#snippet children({ open: isOpen, close })}
		<div data-testid="menu-wrapper" data-is-open={isOpen ? 'true' : 'false'}>
			{#if renderChild}
				<DropdownItem>
					{#snippet child({ props })}
						<span data-testid="custom-child-item" {...props}>Custom Child Span</span>
					{/snippet}
				</DropdownItem>
			{:else if renderLink}
				<DropdownItem bind:ref={itemRef} href="/profile" disabled={itemDisabled}>
					Profile Link
				</DropdownItem>
			{:else}
				<DropdownItem bind:ref={itemRef} disabled={itemDisabled}>
					Standard Item
				</DropdownItem>
			{/if}
			<button type="button" data-testid="inner-close-btn" onclick={close}>
				Close via payload
			</button>
		</div>
	{/snippet}
</Dropdown>
