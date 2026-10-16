<script lang="ts">
	import HoverCard from './HoverCard.svelte';
	import type { HoverCardClasses } from './HoverCard.types.js';

	interface Props {
		open?: boolean;
		classes?: HoverCardClasses;
	}

	let { open = $bindable(false), classes }: Props = $props();

	let rootRef = $state<HTMLSpanElement | null>(null);
	let triggerRef = $state<HTMLSpanElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef !== null}
	data-has-trigger={triggerRef !== null}
	data-has-content={contentRef !== null}
>
	<HoverCard
		bind:ref={rootRef}
		bind:triggerRef
		bind:contentRef
		bind:open
		openDelay={0}
		closeDelay={30}
		{classes}
	>
		{#snippet children({ open })}
			<a href="#test-user" data-testid="test-trigger" data-trigger-open={open}> @tester </a>
		{/snippet}
		{#snippet content({ open, close })}
			<div data-testid="harness-content" data-content-open={open}>
				<p>Kartu pratinjau profil tester.</p>
				<button type="button" data-testid="card-close-btn" onclick={close}> Tutup Kartu </button>
			</div>
		{/snippet}
	</HoverCard>
</div>
