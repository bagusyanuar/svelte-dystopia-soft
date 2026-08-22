<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Card from './Card.svelte';
	import CardHeader from './CardHeader.svelte';
	import CardTitle from './CardTitle.svelte';
	import CardDescription from './CardDescription.svelte';
	import CardContent from './CardContent.svelte';
	import CardFooter from './CardFooter.svelte';
	import Button from '../button/Button.svelte';
	import Badge from '../badge/Badge.svelte';

	const { Story } = defineMeta({
		title: 'Components/Card',
		component: Card,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="w-80">
		<Card>
			<CardHeader>
				<CardTitle>Team plan</CardTitle>
				<CardDescription>Everything your team needs to ship faster.</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-foreground-muted">
					Unlimited projects, priority support, and access to every component in the library.
				</p>
			</CardContent>
			<CardFooter>
				<Button class="w-full">Upgrade</Button>
			</CardFooter>
		</Card>
	</div>
</Story>

<Story name="Header and content only" asChild>
	<div class="w-80">
		<Card>
			<CardHeader>
				<CardTitle>No footer</CardTitle>
				<CardDescription>Not every card needs an action row.</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-foreground-muted">
					Compose only the parts you actually need — every section is optional.
				</p>
			</CardContent>
		</Card>
	</div>
</Story>

<Story name="With a footer of multiple actions" asChild>
	<div class="w-80">
		<Card>
			<CardHeader>
				<CardTitle>Delete project</CardTitle>
				<CardDescription>This action cannot be undone.</CardDescription>
			</CardHeader>
			<CardFooter class="justify-end">
				<Button variant="outline">Cancel</Button>
				<Button>Delete</Button>
			</CardFooter>
		</Card>
	</div>
</Story>

<Story name="With a header badge" asChild>
	<div class="w-80">
		<Card>
			<CardHeader class="flex-row items-center justify-between">
				<CardTitle>Storage</CardTitle>
				<Badge variant="secondary">80% used</Badge>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-foreground-muted">12.4 GB of 15 GB used.</p>
			</CardContent>
		</Card>
	</div>
</Story>
