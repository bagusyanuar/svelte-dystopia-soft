<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import BreadcrumbList from './BreadcrumbList.svelte';
	import BreadcrumbItem from './BreadcrumbItem.svelte';
	import BreadcrumbLink from './BreadcrumbLink.svelte';
	import BreadcrumbPage from './BreadcrumbPage.svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';

	let navRef = $state<HTMLElement | null>(null);
	let listRef = $state<HTMLOListElement | null>(null);
	let itemRef = $state<HTMLLIElement | null>(null);
	let linkRef = $state<HTMLAnchorElement | null>(null);
	let pageRef = $state<HTMLSpanElement | null>(null);
	let sepRef = $state<HTMLLIElement | null>(null);
</script>

<Breadcrumb bind:ref={navRef} data-testid="breadcrumb-root">
	<BreadcrumbList bind:ref={listRef}>
		<BreadcrumbItem bind:ref={itemRef}>
			<BreadcrumbLink bind:ref={linkRef} href="/">Home</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator bind:ref={sepRef} />
		<BreadcrumbItem>
			<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbPage bind:ref={pageRef}>Profile</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>

<span data-testid="has-nav-ref">{navRef ? 'yes' : 'no'}</span>
<span data-testid="has-list-ref">{listRef ? 'yes' : 'no'}</span>
<span data-testid="has-item-ref">{itemRef ? 'yes' : 'no'}</span>
<span data-testid="has-link-ref">{linkRef ? 'yes' : 'no'}</span>
<span data-testid="has-page-ref">{pageRef ? 'yes' : 'no'}</span>
<span data-testid="has-sep-ref">{sepRef ? 'yes' : 'no'}</span>
