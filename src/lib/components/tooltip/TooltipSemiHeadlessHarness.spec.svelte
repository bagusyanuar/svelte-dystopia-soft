<script lang="ts">
	import Tooltip from './Tooltip.svelte';

	let {
		testRefs = false,
		testAsDiv = false,
		testDisabled = false,
		testDefaultOpen = false,
		testStringContent = false,
		testSnippetPayload = false,
		testContentProps = false,
		onOpenChange
	}: {
		testRefs?: boolean;
		testAsDiv?: boolean;
		testDisabled?: boolean;
		testDefaultOpen?: boolean;
		testStringContent?: boolean;
		testSnippetPayload?: boolean;
		testContentProps?: boolean;
		onOpenChange?: (open: boolean) => void;
	} = $props();

	let triggerRef = $state<HTMLElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);
	let arrowRef = $state<HTMLDivElement | null>(null);
	let open = $state(false);
</script>

{#if testRefs}
	<Tooltip
		bind:triggerRef
		bind:contentRef
		bind:arrowRef
		bind:open
		delayDuration={0}
		showArrow={true}
		content="Ref Test Content"
	>
		<button type="button">Trigger Ref Button</button>
	</Tooltip>
	<output data-testid="trigger-ref-status">{triggerRef ? 'bound' : 'null'}</output>
	<output data-testid="content-ref-status">{contentRef ? 'bound' : 'null'}</output>
	<output data-testid="arrow-ref-status">{arrowRef ? 'bound' : 'null'}</output>
{:else if testAsDiv}
	<Tooltip as="div" delayDuration={0} content="Div Trigger Content">
		<button type="button">Div Trigger</button>
	</Tooltip>
{:else if testDisabled}
	<Tooltip disabled delayDuration={0} content="Disabled Tooltip" {onOpenChange}>
		<button type="button">Disabled Trigger</button>
	</Tooltip>
{:else if testDefaultOpen}
	<Tooltip defaultOpen delayDuration={0} content="Default Open Content" {onOpenChange}>
		<button type="button">Default Open</button>
	</Tooltip>
{:else if testStringContent}
	<Tooltip delayDuration={0} content="Plain string content">
		<button type="button">String Trigger</button>
	</Tooltip>
{:else if testSnippetPayload}
	<Tooltip delayDuration={0}>
		{#snippet children({ open: isOpen, close })}
			<button type="button" onclick={close}>
				Trigger State: {isOpen ? 'Open' : 'Closed'}
			</button>
		{/snippet}
		{#snippet content({ open: isContentOpen })}
			<div data-testid="content-payload">
				<span>Payload Open: {isContentOpen ? 'true' : 'false'}</span>
			</div>
		{/snippet}
	</Tooltip>
{:else if testContentProps}
	<Tooltip
		delayDuration={0}
		content="Props test"
		contentProps={{ 'data-testid': 'custom-tooltip-content', 'aria-label': 'Custom Floating' }}
	>
		<button type="button">Content Props Trigger</button>
	</Tooltip>
{/if}
