<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import SidebarHeader from './SidebarHeader.svelte';
	import SidebarContent from './SidebarContent.svelte';
	import SidebarFooter from './SidebarFooter.svelte';
	import SidebarGroup from './SidebarGroup.svelte';
	import SidebarGroupLabel from './SidebarGroupLabel.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import SidebarCollapsibleItem from './SidebarCollapsibleItem.svelte';
	import SidebarTrigger from './SidebarTrigger.svelte';
</script>

<Sidebar data-testid="sidebar-root" class="custom-sidebar">
	<SidebarHeader>
		<span>Acme</span>
		<SidebarTrigger class="custom-trigger" />
	</SidebarHeader>
	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupLabel>Workspace</SidebarGroupLabel>
			<SidebarItem active class="custom-item">Dashboard</SidebarItem>
			<SidebarItem>Projects</SidebarItem>
			<SidebarCollapsibleItem class="custom-collapsible">
				{#snippet trigger()}Team{/snippet}
				<SidebarItem>Active members</SidebarItem>
				<SidebarItem>Archived</SidebarItem>
			</SidebarCollapsibleItem>
		</SidebarGroup>
	</SidebarContent>
	<SidebarFooter>
		<SidebarItem>Settings</SidebarItem>
	</SidebarFooter>
</Sidebar>
