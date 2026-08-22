<script lang="ts">
	import Card from './Card.svelte';
	import CardHeader from './CardHeader.svelte';
	import CardTitle from './CardTitle.svelte';
	import CardDescription from './CardDescription.svelte';
	import CardContent from './CardContent.svelte';
	import CardFooter from './CardFooter.svelte';
</script>

<Card data-testid="card-root">
	<CardHeader>
		<CardTitle>Team plan</CardTitle>
		<CardDescription>Everything your team needs to ship faster.</CardDescription>
	</CardHeader>
	<CardContent>
		<p>Unlimited projects and priority support.</p>
	</CardContent>
	<CardFooter>
		<button type="button">Upgrade</button>
	</CardFooter>
</Card>
