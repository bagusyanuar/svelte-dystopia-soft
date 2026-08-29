<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import SidebarHeader from './SidebarHeader.svelte';
	import SidebarTrigger from './SidebarTrigger.svelte';

	let collapsed = $state(false);
</script>

<Sidebar bind:collapsed>
	<SidebarHeader>
		<SidebarTrigger />
	</SidebarHeader>
</Sidebar>
<output data-testid="outer-collapsed">{collapsed}</output>
