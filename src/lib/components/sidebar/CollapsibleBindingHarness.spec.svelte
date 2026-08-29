<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import SidebarContent from './SidebarContent.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import SidebarCollapsibleItem from './SidebarCollapsibleItem.svelte';

	let open = $state(false);
</script>

<Sidebar>
	<SidebarContent>
		<SidebarCollapsibleItem bind:open>
			{#snippet trigger()}Team{/snippet}
			<SidebarItem>Active members</SidebarItem>
		</SidebarCollapsibleItem>
	</SidebarContent>
</Sidebar>
<output data-testid="outer-open">{open}</output>
