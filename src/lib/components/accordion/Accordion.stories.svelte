<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';

	const { Story } = defineMeta({
		title: 'Components/Accordion',
		component: Accordion,
		tags: ['autodocs']
	});
</script>

<Story name="Single (default)" asChild>
	<div class="w-96">
		<Accordion value="item-1">
			<AccordionItem value="item-1">
				{#snippet trigger()}What's included in the Pro plan?{/snippet}
				Unlimited projects, priority support, and access to every component in the library.
			</AccordionItem>
			<AccordionItem value="item-2">
				{#snippet trigger()}Can I cancel anytime?{/snippet}
				Yes — cancel from your billing settings, no questions asked.
			</AccordionItem>
			<AccordionItem value="item-3" disabled>
				{#snippet trigger()}Enterprise plan{/snippet}
				Contact sales for custom pricing.
			</AccordionItem>
		</Accordion>
	</div>
</Story>

<Story name="Multiple" asChild>
	<div class="w-96">
		<Accordion type="multiple" value={['item-1']}>
			<AccordionItem value="item-1">
				{#snippet trigger()}What's included in the Pro plan?{/snippet}
				Unlimited projects, priority support, and access to every component in the library.
			</AccordionItem>
			<AccordionItem value="item-2">
				{#snippet trigger()}Can I cancel anytime?{/snippet}
				Yes — cancel from your billing settings, no questions asked.
			</AccordionItem>
			<AccordionItem value="item-3">
				{#snippet trigger()}Does it support dark mode?{/snippet}
				Yes — set <code>data-theme="dark"</code> on any ancestor element.
			</AccordionItem>
		</Accordion>
	</div>
</Story>
