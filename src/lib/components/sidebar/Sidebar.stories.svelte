<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Sidebar from './Sidebar.svelte';
	import SidebarHeader from './SidebarHeader.svelte';
	import SidebarContent from './SidebarContent.svelte';
	import SidebarFooter from './SidebarFooter.svelte';
	import SidebarGroup from './SidebarGroup.svelte';
	import SidebarGroupLabel from './SidebarGroupLabel.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import SidebarCollapsibleItem from './SidebarCollapsibleItem.svelte';
	import SidebarTrigger from './SidebarTrigger.svelte';

	const { Story } = defineMeta({
		title: 'Components/Sidebar',
		component: Sidebar,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="flex h-120 border border-border">
		<Sidebar>
			<SidebarHeader>
				<span class="text-sm font-semibold text-foreground">Acme Inc</span>
				<SidebarTrigger class="ml-auto" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
					<SidebarItem active>
						{#snippet icon()}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
								<path d="M9 22V12h6v10" />
							</svg>
						{/snippet}
						Dashboard
					</SidebarItem>
					<SidebarItem>
						{#snippet icon()}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<path
									d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
								/>
							</svg>
						{/snippet}
						Projects
					</SidebarItem>
					<SidebarCollapsibleItem>
						{#snippet icon()}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						{/snippet}
						{#snippet trigger()}Team{/snippet}
						<SidebarItem size="sm">Active members</SidebarItem>
						<SidebarItem size="sm">Archived</SidebarItem>
					</SidebarCollapsibleItem>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Admin</SidebarGroupLabel>
					<SidebarItem>
						{#snippet icon()}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<circle cx="12" cy="12" r="3" />
								<path
									d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
								/>
							</svg>
						{/snippet}
						Settings
					</SidebarItem>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarItem>
					{#snippet icon()}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-4"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<path d="M16 17l5-5-5-5" />
							<path d="M21 12H9" />
						</svg>
					{/snippet}
					Log out
				</SidebarItem>
			</SidebarFooter>
		</Sidebar>
		<div class="flex flex-1 items-center justify-center text-sm text-foreground-subtle">
			Page content
		</div>
	</div>
</Story>

<Story name="Collapsed" asChild>
	<div class="flex h-120 border border-border">
		<Sidebar collapsed>
			<SidebarHeader>
				<span class="text-sm font-semibold text-foreground">A</span>
				<SidebarTrigger class="ml-auto" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
					<SidebarItem active>
						{#snippet icon()}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
								<path d="M9 22V12h6v10" />
							</svg>
						{/snippet}
						Dashboard
					</SidebarItem>
					<SidebarItem>
						{#snippet icon()}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<path
									d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
								/>
							</svg>
						{/snippet}
						Projects
					</SidebarItem>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
		<div class="flex flex-1 items-center justify-center text-sm text-foreground-subtle">
			Page content
		</div>
	</div>
</Story>
