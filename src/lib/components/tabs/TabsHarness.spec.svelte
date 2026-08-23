<script lang="ts">
	import Tabs from './Tabs.svelte';
	import TabsList from './TabsList.svelte';
	import TabsTrigger from './TabsTrigger.svelte';
	import TabsContent from './TabsContent.svelte';
</script>

<Tabs value="profile" data-testid="tabs-root">
	<TabsList class="custom-list">
		<TabsTrigger value="profile">Profile</TabsTrigger>
		<TabsTrigger value="billing" class="custom-trigger">Billing</TabsTrigger>
		<TabsTrigger value="settings" disabled>Settings</TabsTrigger>
	</TabsList>
	<TabsContent value="profile" class="custom-content">Profile content</TabsContent>
	<TabsContent value="billing">Billing content</TabsContent>
	<TabsContent value="settings">Settings content</TabsContent>
</Tabs>
