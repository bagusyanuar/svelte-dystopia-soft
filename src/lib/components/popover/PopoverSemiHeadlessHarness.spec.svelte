<script lang="ts">
	import Popover from './Popover.svelte';
	import type { PopoverClasses } from './Popover.types.js';

	interface Props {
		open?: boolean;
		class?: string;
		classes?: PopoverClasses;
		onOpenChange?: (open: boolean) => void;
	}

	let { open = $bindable(false), class: className, classes, onOpenChange }: Props = $props();

	let rootRef = $state<HTMLButtonElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef !== null}
	data-has-trigger={triggerRef !== null}
	data-has-content={contentRef !== null}
	data-open={open}
>
	<Popover
		bind:ref={rootRef}
		bind:triggerRef
		bind:contentRef
		bind:open
		class={className}
		{classes}
		{onOpenChange}
	>
		{#snippet trigger({ open })}
			<span data-testid="trigger-text">{open ? 'IS_OPEN' : 'IS_CLOSED'}</span>
		{/snippet}
		{#snippet children({ close })}
			<p>Content panel</p>
			<button data-testid="internal-close-btn" type="button" onclick={close}> Close Me </button>
		{/snippet}
	</Popover>
</div>
