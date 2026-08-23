<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tabs from './Tabs.svelte';
	import TabsList from './TabsList.svelte';
	import TabsTrigger from './TabsTrigger.svelte';
	import TabsContent from './TabsContent.svelte';

	const { Story } = defineMeta({
		title: 'Components/Tabs',
		component: Tabs,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="w-96">
		<Tabs value="account">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
				<TabsTrigger value="team">Team</TabsTrigger>
			</TabsList>
			<TabsContent value="account">Update your name, email, and avatar.</TabsContent>
			<TabsContent value="password">Change your password and enable two-factor auth.</TabsContent>
			<TabsContent value="team">Invite teammates and manage their roles.</TabsContent>
		</Tabs>
	</div>
</Story>

<Story name="With a disabled tab" asChild>
	<div class="w-96">
		<Tabs value="account">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="billing" disabled>Billing</TabsTrigger>
				<TabsTrigger value="team">Team</TabsTrigger>
			</TabsList>
			<TabsContent value="account">Update your name, email, and avatar.</TabsContent>
			<TabsContent value="billing">Billing is only available on paid plans.</TabsContent>
			<TabsContent value="team">Invite teammates and manage their roles.</TabsContent>
		</Tabs>
	</div>
</Story>
