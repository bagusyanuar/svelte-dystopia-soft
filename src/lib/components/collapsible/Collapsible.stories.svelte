<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Collapsible from './Collapsible.svelte';

	const { Story } = defineMeta({
		title: 'Components/Collapsible',
		component: Collapsible,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="w-80">
		<Collapsible>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Open by default" asChild>
	<div class="w-80">
		<Collapsible open>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Disabled" asChild>
	<div class="w-80">
		<Collapsible disabled>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Custom trigger background" asChild>
	<div class="w-80">
		<Collapsible open classes={{ trigger: 'bg-primary/10 text-primary hover:bg-primary/15' }}>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Stacked (FAQ list)" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Collapsible>
			{#snippet trigger()}
				How do I install the library?
			{/snippet}
			Run <code>npm install @dystopia/soft-lib</code> and import components from their subpath.
		</Collapsible>
		<Collapsible>
			{#snippet trigger()}
				Does it support dark mode?
			{/snippet}
			Yes — set <code>data-theme="dark"</code> on any ancestor element.
		</Collapsible>
		<Collapsible>
			{#snippet trigger()}
				Can I customize the styling?
			{/snippet}
			Every component accepts a <code>class</code> prop merged over the internal styles.
		</Collapsible>
	</div>
</Story>
