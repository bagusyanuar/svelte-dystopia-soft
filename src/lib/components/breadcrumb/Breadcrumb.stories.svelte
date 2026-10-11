<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Breadcrumb from './Breadcrumb.svelte';
	import BreadcrumbList from './BreadcrumbList.svelte';
	import BreadcrumbItem from './BreadcrumbItem.svelte';
	import BreadcrumbLink from './BreadcrumbLink.svelte';
	import BreadcrumbPage from './BreadcrumbPage.svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';
	import BreadcrumbEllipsis from './BreadcrumbEllipsis.svelte';

	const componentDescription = [
		'Sistem komponen navigasi hierarki rekam jejak (*breadcrumb*) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Membantu pengguna memahami posisi hierarki lokasi saat ini di dalam aplikasi dengan semantik WAI-ARIA lengkap.',
		'',
		'### Fitur Utama',
		'- **Arsitektur Compound Semantik**: Terdiri dari `Breadcrumb` (`<nav aria-label="breadcrumb">`), `BreadcrumbList` (`<ol>`), `BreadcrumbItem` (`<li>`), `BreadcrumbLink` (`<a>`), `BreadcrumbPage` (`<span aria-current="page">`), `BreadcrumbSeparator`, dan `BreadcrumbEllipsis`.',
		'- **Pola `child` Snippet pada Link**: `BreadcrumbLink` mengimplementasikan pola `child` idiomatik Svelte 5 untuk integrasi mulus dengan router framework (seperti SvelteKit router links) tanpa menghasilkan wrapper DOM berlebih.',
		'- **Separator Fleksibel**: Menggunakan chevron default yang tersembunyi dari assistive tech (`aria-hidden="true"`), dengan dukungan snippet kustom untuk karakter slash (`/`) atau ikon lain.',
		'- **Collapsed Ellipsis Popover**: `BreadcrumbEllipsis` menyembunyikan level rekam jejak yang panjang ke dalam popover ringkas dengan dukungan kustomisasi trigger snippet.',
		'- **State via Data Attributes**: Mengekspos atribut `data-current` pada `BreadcrumbPage` untuk mempermudah targeting selector CSS.',
		'- **Akses DOM Ref Penuh**: Seluruh subkomponen mengekspos prop `ref = $bindable(null)` untuk kalkulasi layout, roving focus, atau animasi.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Breadcrumb',
		component: Breadcrumb,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			class: {
				control: 'text',
				description: 'Class override atau tambahan pada elemen nav container terluar.'
			}
		}
	});
</script>

<Story name="Default" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Profile</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="Two levels" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Dashboard</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="Custom separator" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator>/</BreadcrumbSeparator>
			<BreadcrumbItem>
				<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator>/</BreadcrumbSeparator>
			<BreadcrumbItem>
				<BreadcrumbPage>Profile</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="Collapsed with ellipsis" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbEllipsis>
					<div class="flex flex-col">
						<BreadcrumbLink href="/docs" class="rounded-md px-compact py-2 hover:bg-surface-subtle">
							Docs
						</BreadcrumbLink>
						<BreadcrumbLink
							href="/library"
							class="rounded-md px-compact py-2 hover:bg-surface-subtle"
						>
							Library
						</BreadcrumbLink>
						<BreadcrumbLink href="/data" class="rounded-md px-compact py-2 hover:bg-surface-subtle">
							Data
						</BreadcrumbLink>
					</div>
				</BreadcrumbEllipsis>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/data/settings">Settings</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Profile</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="With icons" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/" class="flex items-center gap-1.5">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-3.5"
						aria-hidden="true"
					>
						<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
						<polyline points="9 22 9 12 15 12 15 22" />
					</svg>
					Home
				</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/projects" class="flex items-center gap-1.5">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-3.5"
						aria-hidden="true"
					>
						<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
					</svg>
					Projects
				</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage class="flex items-center gap-1.5">Design System</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>

<Story name="Router link child snippet" asChild>
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/app">
					{#snippet child({ props })}
						<!-- Example of forwarding props to a custom link or router button -->
						<a {...props} data-client-route="true">Workspace</a>
					{/snippet}
					Workspace
				</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Analytics</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</Story>
