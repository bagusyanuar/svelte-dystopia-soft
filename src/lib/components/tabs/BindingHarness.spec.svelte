<script lang="ts">
	import Tabs from './Tabs.svelte';
	import TabsList from './TabsList.svelte';
	import TabsTrigger from './TabsTrigger.svelte';
	import TabsContent from './TabsContent.svelte';

	let value = $state('profile');
</script>

<Tabs bind:value>
	<TabsList>
		<TabsTrigger value="profile">Profile</TabsTrigger>
		<TabsTrigger value="billing">Billing</TabsTrigger>
	</TabsList>
	<TabsContent value="profile">Profile content</TabsContent>
	<TabsContent value="billing">Billing content</TabsContent>
</Tabs>
<output data-testid="outer-value">{value}</output>
