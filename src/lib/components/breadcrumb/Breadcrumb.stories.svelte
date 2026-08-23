<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Breadcrumb from './Breadcrumb.svelte';
	import BreadcrumbList from './BreadcrumbList.svelte';
	import BreadcrumbItem from './BreadcrumbItem.svelte';
	import BreadcrumbLink from './BreadcrumbLink.svelte';
	import BreadcrumbPage from './BreadcrumbPage.svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';
	import BreadcrumbEllipsis from './BreadcrumbEllipsis.svelte';

	const { Story } = defineMeta({
		title: 'Components/Breadcrumb',
		component: Breadcrumb,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Profile</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="Two levels" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Dashboard</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="Custom separator" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator>/</BreadcrumbSeparator>
			<BreadcrumbItem>
				<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator>/</BreadcrumbSeparator>
			<BreadcrumbItem>
				<BreadcrumbPage>Profile</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="Collapsed with ellipsis" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbEllipsis>
					<div class="flex flex-col">
						<BreadcrumbLink
							href="/docs"
							class="rounded-md px-compact py-2 hover:bg-surface-subtle"
						>
							Docs
						</BreadcrumbLink>
						<BreadcrumbLink
							href="/library"
							class="rounded-md px-compact py-2 hover:bg-surface-subtle"
						>
							Library
						</BreadcrumbLink>
						<BreadcrumbLink
							href="/data"
							class="rounded-md px-compact py-2 hover:bg-surface-subtle"
						>
							Data
						</BreadcrumbLink>
					</div>
				</BreadcrumbEllipsis>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/data/settings">Settings</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Profile</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>
