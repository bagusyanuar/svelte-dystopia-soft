<script lang="ts">
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';
</script>

<Accordion type="multiple" value={['item-1']}>
	<AccordionItem value="item-1">
		{#snippet trigger()}First{/snippet}
		First content.
	</AccordionItem>
	<AccordionItem value="item-2">
		{#snippet trigger()}Second{/snippet}
		Second content.
	</AccordionItem>
</Accordion>
