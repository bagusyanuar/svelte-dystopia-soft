<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Avatar from './Avatar.svelte';
	import type { AvatarProps } from './Avatar.types.js';

	type AvatarStoryArgs = Pick<AvatarProps, 'src' | 'alt'>;

	const componentDescription = [
		'Komponen avatar profil visual dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Mendukung auto fallback bertingkat saat gambar sedang dimuat atau gagal dimuat (*error handling*), siklus re-arm otomatis saat `src` berubah, dan arsitektur semi-headless yang fleksibel.',
		'',
		'### Fitur Utama',
		'- **Otomatisasi Status Visual**: Mengelola status internal secara reaktif (`loading` -> `loaded` atau `error`). Saat `src` berubah, status otomatis di-*re-arm* kembali ke siklus baru tanpa mewarisi status gambar sebelumnya.',
		'- **State via Data Attributes**: Mengekspos atribut `data-status="loading | loaded | error"` langsung pada elemen root `<span>`, memudahkan penulisan CSS selector kustom (seperti `[data-status="loading"]` untuk skeleton pulse atau `[data-status="error"]` untuk border warning).',
		'- **Fallback Bertingkat & Dynamic Snippet**: Menampilkan snippet `children` saat gambar belum selesai dimuat atau gagal diakses. Snippet `children` menerima payload `{ status }` sehingga konsumen dapat me-render icon indikator, spinner, atau inisial secara dinamis.',
		'- **Sub-part Classes Granular**: Mendukung prop terstruktur `classes.image` dan `classes.fallback` untuk kustomisasi style gambar dan fallback secara terpisah tanpa merusak kontur container.',
		'- **Komposisi Stack / Group Bertumpuk**: Mudah disusun saling bertumpuk (*stacked avatars*) dengan utility flex `-space-x-2.5` dan `ring-2 ring-surface` untuk menampilkan teman, kontributor, atau assignees proyek beserta badge jumlah sisa (+N).',
		'- **Integrasi Status Kehadiran (Online / Presence Indicator)**: Fleksibel dikombinasikan dengan badge status kehadiran di sudut avatar (seperti dot hijau dengan animasi ping/pulse untuk menandai user sedang online).',
		'- **Forwarding Atribut Gambar (`imageProps`)**: Meneruskan atribut native gambar seperti `loading="lazy"`, `decoding="async"`, `crossorigin`, atau `referrerpolicy` ke elemen `<img>` internal.',
		'- **Akses DOM Ref Ganda**: Menyediakan `$bindable(ref)` untuk elemen root `<span>` dan `$bindable(imageRef)` untuk elemen `<img>` internal.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Avatar',
		component: Avatar,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			src: {
				control: 'text',
				description:
					'URL gambar avatar. Jika tidak ada atau gagal dimuat, komponen menampilkan fallback.'
			},
			alt: {
				control: 'text',
				description: 'Teks alternatif (alt) gambar untuk aksesibilitas screen reader.'
			},
			class: {
				control: 'text',
				description:
					'Class override atau tambahan pada elemen container root <span> (misal custom size atau border).'
			}
		}
	});
</script>

<Story name="Image" args={{ src: 'https://i.pravatar.cc/80?img=12', alt: 'Jane Doe' }}>
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar {...args}>JD</Avatar>
	{/snippet}
</Story>

<Story name="Fallback (no image)" args={{ alt: 'Jane Doe' }}>
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar {...args}>JD</Avatar>
	{/snippet}
</Story>

<Story name="Broken image falls back" args={{ src: '/does-not-exist.png', alt: 'Jane Doe' }}>
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar {...args}>JD</Avatar>
	{/snippet}
</Story>

<Story name="Custom size" asChild>
	<div class="flex items-center gap-cozy">
		<Avatar alt="Jane Doe" class="size-6 text-xs">JD</Avatar>
		<Avatar alt="Jane Doe" class="size-10">JD</Avatar>
		<Avatar alt="Jane Doe" class="size-16 text-lg">JD</Avatar>
	</div>
</Story>

<Story name="Avatar stack (group)" asChild>
	<div class="flex flex-col gap-6">
		<!-- Standard stack with remaining counter & status label -->
		<div class="flex items-center">
			<div class="flex -space-x-2.5 overflow-hidden p-0.5">
				<Avatar
					src="https://i.pravatar.cc/80?img=11"
					alt="Sarah Connor"
					class="ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					SC
				</Avatar>
				<Avatar
					src="https://i.pravatar.cc/80?img=12"
					alt="John Doe"
					class="ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					JD
				</Avatar>
				<Avatar
					src="https://i.pravatar.cc/80?img=33"
					alt="Alex Smith"
					class="ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					AS
				</Avatar>
				<Avatar
					src="https://i.pravatar.cc/80?img=60"
					alt="Elena Rostova"
					class="ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					ER
				</Avatar>
				<Avatar
					alt="+12 other collaborators"
					class="bg-surface-subtle text-xs font-semibold text-foreground-soft ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					+12
				</Avatar>
			</div>
			<span class="ml-3 text-xs text-foreground-subtle"> Active in this workspace </span>
		</div>

		<!-- Compact stack (Linear-style table/card assignees) -->
		<div class="flex items-center">
			<div class="flex -space-x-1.5 overflow-hidden p-0.5">
				<Avatar
					src="https://i.pravatar.cc/80?img=47"
					alt="Dev 1"
					class="size-7 text-xs ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					D1
				</Avatar>
				<Avatar
					src="https://i.pravatar.cc/80?img=59"
					alt="Dev 2"
					class="size-7 text-xs ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					D2
				</Avatar>
				<Avatar
					alt="Dev 3"
					class="size-7 text-xs ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					MK
				</Avatar>
				<Avatar
					alt="+3 more"
					class="size-7 bg-surface-subtle text-[10px] font-semibold text-foreground-subtle ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
				>
					+3
				</Avatar>
			</div>
			<span class="ml-2.5 text-xs text-foreground-subtle"> 3 assignees </span>
		</div>
	</div>
</Story>

<Story name="Online & presence indicator" asChild>
	<div class="flex flex-col gap-6">
		<!-- Multiple presence statuses with pulse animation on online -->
		<div class="flex items-center gap-6">
			<!-- Online with pulse/ping animation -->
			<div class="flex items-center gap-2.5">
				<div class="relative inline-flex">
					<Avatar src="https://i.pravatar.cc/80?img=11" alt="Sarah Connor">SC</Avatar>
					<span class="absolute right-0 bottom-0 flex size-3 items-center justify-center">
						<span class="sr-only">Online</span>
						<span
							aria-hidden="true"
							class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"
						></span>
						<span
							aria-hidden="true"
							class="relative inline-flex size-2.5 rounded-full bg-success ring-2 ring-surface"
						></span>
					</span>
				</div>
				<div class="flex flex-col">
					<span class="text-xs font-medium text-foreground">Sarah Connor</span>
					<span class="text-[11px] text-foreground-subtle">Online</span>
				</div>
			</div>

			<!-- Busy / In a meeting -->
			<div class="flex items-center gap-2.5">
				<div class="relative inline-flex">
					<Avatar src="https://i.pravatar.cc/80?img=33" alt="Alex Smith">AS</Avatar>
					<span
						class="absolute right-0 bottom-0 flex size-2.5 rounded-full bg-danger ring-2 ring-surface"
					>
						<span class="sr-only">Busy</span>
					</span>
				</div>
				<div class="flex flex-col">
					<span class="text-xs font-medium text-foreground">Alex Smith</span>
					<span class="text-[11px] text-foreground-subtle">In a meeting</span>
				</div>
			</div>

			<!-- Away -->
			<div class="flex items-center gap-2.5">
				<div class="relative inline-flex">
					<Avatar src="https://i.pravatar.cc/80?img=60" alt="Elena Rostova">ER</Avatar>
					<span
						class="absolute right-0 bottom-0 flex size-2.5 rounded-full bg-warning ring-2 ring-surface"
					>
						<span class="sr-only">Away</span>
					</span>
				</div>
				<div class="flex flex-col">
					<span class="text-xs font-medium text-foreground">Elena Rostova</span>
					<span class="text-[11px] text-foreground-subtle">Away</span>
				</div>
			</div>
		</div>

		<!-- Compact presence in a user profile card -->
		<div
			class="flex max-w-sm items-center justify-between rounded-lg border border-border bg-surface p-3"
		>
			<div class="flex items-center gap-3">
				<div class="relative inline-flex">
					<Avatar src="https://i.pravatar.cc/80?img=12" alt="John Doe" class="size-9">JD</Avatar>
					<span class="absolute right-0 bottom-0 flex size-2.5 items-center justify-center">
						<span class="sr-only">Active now</span>
						<span
							aria-hidden="true"
							class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"
						></span>
						<span
							aria-hidden="true"
							class="relative inline-flex size-2 rounded-full bg-success ring-2 ring-surface"
						></span>
					</span>
				</div>
				<div class="flex flex-col">
					<span class="text-sm font-medium text-foreground">John Doe</span>
					<span class="text-xs text-foreground-subtle">Product Designer</span>
				</div>
			</div>
			<span
				class="rounded-full bg-surface-subtle px-2 py-0.5 text-xs font-medium text-foreground-subtle"
			>
				Available
			</span>
		</div>
	</div>
</Story>

<Story name="Dynamic status fallback" asChild>
	<div class="flex items-center gap-cozy">
		<!-- Error fallback displaying status-aware indicator -->
		<Avatar src="/broken-link.png" alt="Jane Doe" class="border border-border">
			{#snippet children({ status })}
				{#if status === 'error'}
					<span class="text-xs font-semibold text-danger" title="Load failed">!</span>
				{:else}
					<span>JD</span>
				{/if}
			{/snippet}
		</Avatar>

		<!-- Normal fallback -->
		<Avatar alt="Alex Smith" class="border border-border">
			{#snippet children({ status })}
				<span class="text-xs uppercase">{status === 'loaded' ? '' : 'AS'}</span>
			{/snippet}
		</Avatar>
	</div>
</Story>

<Story name="Sub-part styling (classes)" asChild>
	<div class="flex items-center gap-cozy">
		<!-- Custom image grayscale filter via classes.image -->
		<Avatar
			src="https://i.pravatar.cc/80?img=33"
			alt="Alex Smith"
			classes={{ image: 'grayscale contrast-125' }}
		>
			AS
		</Avatar>

		<!-- Custom fallback badge styling via classes.fallback -->
		<Avatar
			alt="Support Bot"
			class="bg-primary/10 ring-1 ring-primary/20"
			classes={{ fallback: 'text-primary font-semibold text-xs' }}
		>
			BOT
		</Avatar>
	</div>
</Story>
