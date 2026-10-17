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
	<div class="w-full max-w-md rounded-lg border border-border bg-surface p-4 shadow-xs">
		<Tabs value="account">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
				<TabsTrigger value="team">Team</TabsTrigger>
			</TabsList>
			<TabsContent value="account" class="pt-2">
				<p>Update your personal name, email address, and avatar image.</p>
			</TabsContent>
			<TabsContent value="password" class="pt-2">
				<p>Change your password and configure multi-factor authentication.</p>
			</TabsContent>
			<TabsContent value="team" class="pt-2">
				<p>Invite teammates and manage organization permission roles.</p>
			</TabsContent>
		</Tabs>
	</div>
</Story>

<Story name="Underline" asChild>
	<div class="w-full max-w-md rounded-lg border border-border bg-surface p-4 shadow-xs">
		<Tabs value="overview" variant="underline">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
				<TabsTrigger value="audit" disabled>Audit Log</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" class="pt-3">
				<p>General overview metrics, performance KPIs, and server health status.</p>
			</TabsContent>
			<TabsContent value="activity" class="pt-3">
				<p>Recent team commits, pull requests, and automated deployment logs.</p>
			</TabsContent>
			<TabsContent value="settings" class="pt-3">
				<p>Configure repo webhooks, branch protection policies, and access tokens.</p>
			</TabsContent>
			<TabsContent value="audit" class="pt-3">
				<p>Audit logs are available on Enterprise plans.</p>
			</TabsContent>
		</Tabs>
	</div>
</Story>


<Story name="Vertical Orientation" asChild>
	<div class="w-full max-w-lg rounded-lg border border-border bg-surface p-4 shadow-xs">
		<Tabs value="general" orientation="vertical">
			<TabsList class="w-36">
				<TabsTrigger value="general">General</TabsTrigger>
				<TabsTrigger value="integrations">Integrations</TabsTrigger>
				<TabsTrigger value="api">API Keys</TabsTrigger>
				<TabsTrigger value="danger" class="text-danger data-[state=active]:text-danger">Danger Zone</TabsTrigger>
			</TabsList>
			<div class="flex-1 rounded-md border border-border-subtle bg-surface-subtle p-3">
				<TabsContent value="general">
					<h4 class="font-medium text-foreground">General Preferences</h4>
					<p class="mt-1 text-xs text-foreground-muted">Manage your workspace name and default project settings.</p>
				</TabsContent>
				<TabsContent value="integrations">
					<h4 class="font-medium text-foreground">Connected Services</h4>
					<p class="mt-1 text-xs text-foreground-muted">GitHub, Slack, and Google Cloud service connections.</p>
				</TabsContent>
				<TabsContent value="api">
					<h4 class="font-medium text-foreground">Secret API Keys</h4>
					<p class="mt-1 text-xs text-foreground-muted">Rotate and generate programmatic Bearer access tokens.</p>
				</TabsContent>
				<TabsContent value="danger">
					<h4 class="font-medium text-danger">Delete Workspace</h4>
					<p class="mt-1 text-xs text-foreground-muted">Irreversibly delete this workspace and all associated resources.</p>
				</TabsContent>
			</div>
		</Tabs>
	</div>
</Story>

<Story name="With Icons & Badges" asChild>
	<div class="w-full max-w-md rounded-lg border border-border bg-surface p-4 shadow-xs">
		<Tabs value="inbox">
			<TabsList class="w-full justify-start">
				<TabsTrigger value="inbox">
					{#snippet children({ active })}
						<div class="flex items-center gap-1.5">
							<svg class="size-3.5 {active ? 'text-primary' : 'text-foreground-faint'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect width="20" height="16" x="2" y="4" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
							<span>Inbox</span>
							<span class="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">3</span>
						</div>
					{/snippet}
				</TabsTrigger>

				<TabsTrigger value="archived">
					{#snippet children({ active })}
						<div class="flex items-center gap-1.5">
							<svg class="size-3.5 {active ? 'text-primary' : 'text-foreground-faint'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect width="20" height="5" x="2" y="3" rx="1" />
								<path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
								<path d="M10 12h4" />
							</svg>
							<span>Archived</span>
						</div>
					{/snippet}
				</TabsTrigger>

				<TabsTrigger value="trash">
					{#snippet children({ active })}
						<div class="flex items-center gap-1.5">
							<svg class="size-3.5 {active ? 'text-primary' : 'text-foreground-faint'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
							</svg>
							<span>Trash</span>
						</div>
					{/snippet}
				</TabsTrigger>
			</TabsList>

			<TabsContent value="inbox" class="pt-3">
				<p class="text-xs text-foreground-soft">You have 3 unread messages in your priority inbox.</p>
			</TabsContent>
			<TabsContent value="archived" class="pt-3">
				<p class="text-xs text-foreground-soft">Search through historical conversations and projects.</p>
			</TabsContent>
			<TabsContent value="trash" class="pt-3">
				<p class="text-xs text-foreground-soft">Items in trash will be permanently purged after 30 days.</p>
			</TabsContent>
		</Tabs>
	</div>
</Story>

<Story name="State Preservation (forceMount)" asChild>
	<div class="w-full max-w-md rounded-lg border border-border bg-surface p-4 shadow-xs">
		<Tabs value="form1">
			<TabsList>
				<TabsTrigger value="form1">Step 1: Contact</TabsTrigger>
				<TabsTrigger value="form2">Step 2: Notes</TabsTrigger>
			</TabsList>

			<TabsContent value="form1" forceMount class="pt-3 flex flex-col gap-2">
				<label for="demo-email" class="text-xs font-medium text-foreground-soft">Email address (kept in DOM):</label>
				<input id="demo-email" class="rounded border border-border bg-surface px-2 py-1 text-xs text-foreground focus:outline-primary" placeholder="user@example.com" />
			</TabsContent>

			<TabsContent value="form2" forceMount class="pt-3 flex flex-col gap-2">
				<label for="demo-notes" class="text-xs font-medium text-foreground-soft">Additional notes (kept in DOM):</label>
				<textarea id="demo-notes" class="rounded border border-border bg-surface px-2 py-1 text-xs text-foreground focus:outline-primary" rows="2" placeholder="Write notes here..."></textarea>
			</TabsContent>
		</Tabs>
	</div>
</Story>

<Story name="With a disabled tab" asChild>
	<div class="w-full max-w-md rounded-lg border border-border bg-surface p-4 shadow-xs">
		<Tabs value="account">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="billing" disabled>Billing</TabsTrigger>
				<TabsTrigger value="team">Team</TabsTrigger>
			</TabsList>
			<TabsContent value="account" class="pt-2">Update your name, email, and avatar.</TabsContent>
			<TabsContent value="billing" class="pt-2">Billing is only available on paid plans.</TabsContent>
			<TabsContent value="team" class="pt-2">Invite teammates and manage their roles.</TabsContent>
		</Tabs>
	</div>
</Story>

