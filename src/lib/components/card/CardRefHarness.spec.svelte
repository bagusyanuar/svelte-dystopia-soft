<script lang="ts">
	import Card from './Card.svelte';
	import CardHeader from './CardHeader.svelte';
	import CardTitle from './CardTitle.svelte';
	import CardDescription from './CardDescription.svelte';
	import CardContent from './CardContent.svelte';
	import CardFooter from './CardFooter.svelte';

	let cardRef = $state<HTMLElement | null>(null);
	let headerRef = $state<HTMLDivElement | null>(null);
	let titleRef = $state<HTMLElement | null>(null);
	let descRef = $state<HTMLElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);
	let footerRef = $state<HTMLDivElement | null>(null);
</script>

<Card bind:ref={cardRef} as="article" data-testid="ref-card">
	<CardHeader bind:ref={headerRef} data-testid="ref-header">
		<CardTitle bind:ref={titleRef} as="h3" data-testid="ref-title">Title</CardTitle>
		<CardDescription bind:ref={descRef} as="p" data-testid="ref-desc">Desc</CardDescription>
	</CardHeader>
	<CardContent bind:ref={contentRef} data-testid="ref-content">Content</CardContent>
	<CardFooter bind:ref={footerRef} data-testid="ref-footer">Footer</CardFooter>
</Card>

<div data-testid="refs-bound">
	{cardRef && headerRef && titleRef && descRef && contentRef && footerRef ? 'all-bound' : 'missing'}
</div>
