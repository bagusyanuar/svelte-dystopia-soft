<script lang="ts">
	import {
		Sidebar,
		SidebarHeader,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupLabel,
		SidebarItem,
		SidebarCollapsibleItem
	} from '$lib/components/sidebar/index.js';
	import { Popover } from '$lib/components/popover/index.js';

	let collapsed = $state(false);
	let active = $state('dashboard');
	let theme = $state<'light' | 'dark'>('light');

	$effect(() => {
		document.documentElement.dataset.theme = theme;
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
	}

	const sectionMeta: Record<string, { group: string; label: string }> = {
		dashboard: { group: 'Workspace', label: 'Dashboard' },
		projects: { group: 'Workspace', label: 'Projects' },
		reports: { group: 'Workspace', label: 'Reports' },
		members: { group: 'Team', label: 'Members' },
		invites: { group: 'Team', label: 'Invites' },
		settings: { group: 'Admin', label: 'Settings' }
	};
	const current = $derived(sectionMeta[active]);
</script>

<div class="flex h-screen bg-surface-subtle">
	<Sidebar bind:collapsed class="border-r-0 bg-transparent pt-compact">
		<SidebarHeader class={collapsed ? 'h-14 justify-center border-b-0' : 'h-14 border-b-0'}>
			<div
				class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
			>
				A
			</div>
			<div class="flex min-w-0 flex-col leading-tight" class:hidden={collapsed}>
				<span class="truncate text-sm font-semibold text-foreground">Acme Inc</span>
				<span class="truncate text-xs text-foreground-subtle">Project management</span>
			</div>
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Workspace</SidebarGroupLabel>
				<SidebarItem active={active === 'dashboard'} onclick={() => (active = 'dashboard')}>
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
				<SidebarItem active={active === 'projects'} onclick={() => (active = 'projects')}>
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
				<SidebarItem active={active === 'reports'} onclick={() => (active = 'reports')}>
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
							<path d="M3 3v18h18" />
							<path d="M18 17V9" />
							<path d="M13 17V5" />
							<path d="M8 17v-3" />
						</svg>
					{/snippet}
					Reports
				</SidebarItem>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarGroupLabel>Admin</SidebarGroupLabel>
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
					<SidebarItem size="sm" active={active === 'members'} onclick={() => (active = 'members')}>
						Members
					</SidebarItem>
					<SidebarItem size="sm" active={active === 'invites'} onclick={() => (active = 'invites')}>
						Invites
					</SidebarItem>
				</SidebarCollapsibleItem>
				<SidebarItem active={active === 'settings'} onclick={() => (active = 'settings')}>
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
		<SidebarFooter class="border-t-0">
			<Popover
				placement="right-end"
				offset={8}
				classes={{
					trigger: collapsed
						? 'flex h-auto w-full items-center justify-center rounded-md border-0 p-tight'
						: 'flex h-auto w-full items-center justify-start gap-tight rounded-md border border-border px-compact py-control-y',
					content: 'w-56 p-0'
				}}
			>
				{#snippet trigger()}
					<span class="relative shrink-0">
						<span
							class="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground"
						>
							JD
						</span>
						<span
							aria-hidden="true"
							class="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-surface bg-success"
						></span>
					</span>
					<span
						class="flex min-w-0 flex-1 flex-col text-left leading-tight"
						class:hidden={collapsed}
					>
						<span class="truncate text-sm font-medium text-foreground">Jane Doe</span>
						<span class="truncate text-xs text-foreground-subtle">jane@acme.dev</span>
					</span>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="size-4 shrink-0 text-foreground-faint"
						class:hidden={collapsed}
					>
						<path d="m7 15 5 5 5-5" />
						<path d="m7 9 5-5 5 5" />
					</svg>
				{/snippet}

				<div class="flex flex-col gap-0.5 p-compact">
					<span class="text-sm font-medium text-foreground">Jane Doe</span>
					<span class="text-xs text-foreground-subtle">jane@acme.dev</span>
				</div>
				<div class="border-t border-border p-tight">
					<button
						type="button"
						class="flex w-full cursor-pointer items-center gap-tight rounded-md px-compact py-control-y text-sm font-medium text-danger transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
							class="size-4"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<path d="M16 17l5-5-5-5" />
							<path d="M21 12H9" />
						</svg>
						Log out
					</button>
				</div>
			</Popover>
			<p class="text-center text-xs text-foreground-subtle" class:hidden={collapsed}>
				App Version v1.0.0
			</p>
		</SidebarFooter>
	</Sidebar>

	<div class="min-w-0 flex-1 py-compact pr-compact">
		<div class="flex h-full flex-col rounded-xl border border-border bg-surface">
			<header class="flex h-14 shrink-0 items-center gap-cozy border-b border-border px-compact">
				<button
					type="button"
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					aria-expanded={!collapsed}
					onclick={() => (collapsed = !collapsed)}
					class="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-subtle transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="size-4"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" />
						<path d="M9 3v18" />
					</svg>
				</button>

				<nav aria-label="Breadcrumb" class="flex min-w-0 items-center gap-tight text-sm">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="size-4 shrink-0 text-foreground-faint"
					>
						<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					</svg>
					<span class="text-foreground-subtle">{current.group}</span>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="size-3.5 shrink-0 text-foreground-faint"
					>
						<path d="m9 18 6-6-6-6" />
					</svg>
					<span class="truncate font-medium text-foreground">{current.label}</span>
				</nav>

				<div class="ml-auto flex shrink-0 items-center gap-cozy">
					<button
						type="button"
						aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
						onclick={toggleTheme}
						class="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground-subtle transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						{#if theme === 'light'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								class="size-4"
							>
								<circle cx="12" cy="12" r="4" />
								<path
									d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
								/>
							</svg>
						{:else}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								class="size-4"
							>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
							</svg>
						{/if}
					</button>
				</div>
			</header>

			<div class="flex flex-1 flex-col gap-cozy overflow-y-auto p-surface">
				<h1 class="text-lg font-semibold text-foreground">Sidebar playground</h1>

				<p class="text-sm text-foreground-subtle">
					Active section: <span class="font-medium text-foreground">{active}</span>. Collapsed:
					<span class="font-medium text-foreground">{collapsed}</span>.
				</p>
				<p class="text-sm text-foreground-subtle">
					The collapse toggle now lives in the header, not inside the sidebar itself — it's just a
					plain button bound to the same <code>collapsed</code> state, since
					<code>Sidebar</code> exposes it as a bindable prop regardless of where the trigger sits.
				</p>
				<p class="text-sm text-foreground-subtle">
					Resize the window narrow to see the current gap: the rail has no mobile drawer yet, that's
					next to brainstorm.
				</p>
			</div>
		</div>
	</div>
</div>
