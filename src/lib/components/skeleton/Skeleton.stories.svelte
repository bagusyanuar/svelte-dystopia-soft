<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Skeleton from './Skeleton.svelte';
	import Card from '../card/Card.svelte';
	import CardHeader from '../card/CardHeader.svelte';
	import CardContent from '../card/CardContent.svelte';

	const { Story } = defineMeta({
		title: 'Components/Skeleton',
		component: Skeleton,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<Skeleton class="h-4 w-48" />
</Story>

<Story name="Text lines" asChild>
	<div class="flex w-64 flex-col gap-2">
		<Skeleton class="h-4 w-full" />
		<Skeleton class="h-4 w-full" />
		<Skeleton class="h-4 w-3/4" />
	</div>
</Story>

<Story name="Avatar" asChild>
	<Skeleton class="size-12 rounded-full" />
</Story>

<Story name="Card" asChild>
	<div class="w-80">
		<Card>
			<CardHeader class="flex-row items-center gap-3">
				<Skeleton class="size-10 shrink-0 rounded-full" />
				<div class="flex flex-1 flex-col gap-2">
					<Skeleton class="h-4 w-2/3" />
					<Skeleton class="h-3 w-1/3" />
				</div>
			</CardHeader>
			<CardContent class="flex flex-col gap-2">
				<Skeleton class="h-3 w-full" />
				<Skeleton class="h-3 w-full" />
				<Skeleton class="h-3 w-5/6" />
			</CardContent>
		</Card>
	</div>
</Story>
