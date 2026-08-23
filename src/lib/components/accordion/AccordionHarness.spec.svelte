<script lang="ts">
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';
</script>

<Accordion value="item-1" data-testid="accordion-root">
	<AccordionItem value="item-1" classes={{ trigger: 'custom-trigger', content: 'custom-content' }}>
		{#snippet trigger()}What's included in the Pro plan?{/snippet}
		Unlimited projects, priority support, and access to every component.
	</AccordionItem>
	<AccordionItem value="item-2">
		{#snippet trigger()}Can I cancel anytime?{/snippet}
		Yes, cancel from your billing settings, no questions asked.
	</AccordionItem>
	<AccordionItem value="item-3" disabled>
		{#snippet trigger()}Enterprise plan{/snippet}
		Contact sales for pricing.
	</AccordionItem>
</Accordion>
