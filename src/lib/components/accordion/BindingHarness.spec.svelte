<script lang="ts">
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';

	let value = $state('');
</script>

<Accordion bind:value>
	<AccordionItem value="item-1">
		{#snippet trigger()}First{/snippet}
		First content.
	</AccordionItem>
	<AccordionItem value="item-2">
		{#snippet trigger()}Second{/snippet}
		Second content.
	</AccordionItem>
</Accordion>
<output data-testid="outer-value">{value}</output>
