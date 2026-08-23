<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import BreadcrumbList from './BreadcrumbList.svelte';
	import BreadcrumbItem from './BreadcrumbItem.svelte';
	import BreadcrumbLink from './BreadcrumbLink.svelte';
	import BreadcrumbPage from './BreadcrumbPage.svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';
</script>

<Breadcrumb data-testid="breadcrumb-root">
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
