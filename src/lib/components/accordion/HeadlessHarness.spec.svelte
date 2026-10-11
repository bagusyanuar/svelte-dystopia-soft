<script lang="ts">
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';

	let accordionRef = $state<HTMLDivElement | null>(null);
	let itemRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);
</script>

<Accordion bind:ref={accordionRef} value="item-1">
	<AccordionItem
		bind:ref={itemRef}
		bind:triggerRef
		value="item-1"
		classes={{
			indicator: 'custom-indicator-class',
			panel: 'custom-panel-class'
		}}
	>
		{#snippet trigger({ open })}
			<span data-testid="trigger-text">{open ? 'Expanded' : 'Collapsed'}</span>
		{/snippet}
		{#snippet indicator({ open })}
			<span data-testid="custom-indicator">{open ? '[-]' : '[+]'}</span>
		{/snippet}
		{#snippet children({ open })}
			<span data-testid="content-text">{open ? 'Open Content' : 'Closed Content'}</span>
		{/snippet}
	</AccordionItem>
	<AccordionItem value="item-2" disabled>
		{#snippet trigger()}Disabled Item{/snippet}
		Disabled Content
	</AccordionItem>
</Accordion>

<span data-testid="has-accordion-ref">{accordionRef ? 'yes' : 'no'}</span>
<span data-testid="has-item-ref">{itemRef ? 'yes' : 'no'}</span>
<span data-testid="has-trigger-ref">{triggerRef ? 'yes' : 'no'}</span>
