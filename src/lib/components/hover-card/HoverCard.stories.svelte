<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HoverCard from './HoverCard.svelte';
	import Button from '../button/Button.svelte';

	const componentDescription = [
		'Komponen pratinjau konten mengambang (Hover Card) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memungkinkan pengguna melihat ringkasan profil, detail isu, atau kartu informasi tanpa meninggalkan konteks halaman.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Interaktivitas & Aksesibilitas Keyboard**: Berbeda dari Tooltip, konten di dalam Hover Card sepenuhnya interaktif (dapat memuat tautan dan tombol). Pengguna dapat berpindah fokus dengan tombol Tab tanpa pencurian fokus saat hover, serta menutup kartu secara instan dengan tombol `Escape`.',
		'- **Hover Grace Period (`closeDelay`)**: Memberikan toleransi waktu saat kursor berpindah dari trigger melintasi jarak kosong menuju kartu mengambang tanpa menutup kartu secara mendadak.',
		'- **State via Data-Attributes**: Mengekspos atribut `data-slot="hover-card-trigger"`, `data-slot="hover-card-content"`, serta `data-state="open | closed"`.',
		'- **Dual DOM Element Refs**: Menyediakan prop bindable `ref` / `triggerRef` ke elemen trigger `<span>`, serta `contentRef` ke kontainer kartu `<div>`.',
		'- **Snippet State Payload**: Meneruskan `{ open, close }` ke snippet `children` dan `content` sehingga konsumen dapat membaca status kartu atau menutupnya secara imperatif.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/HoverCard',
		component: HoverCard,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			open: {
				control: 'boolean',
				description: 'Status buka/tutup kartu. Mendukung two-way binding bind:open.'
			},
			openDelay: {
				control: 'number',
				description: 'Delay dalam milidetik sebelum kartu muncul saat kursor diarahkan.'
			},
			closeDelay: {
				control: 'number',
				description: 'Waktu toleransi dalam milidetik sebelum kartu tertutup saat kursor keluar.'
			},
			placement: {
				control: 'select',
				options: [
					'top',
					'top-start',
					'top-end',
					'bottom',
					'bottom-start',
					'bottom-end',
					'left',
					'right'
				],
				description: 'Posisi penempatan kartu floating relatif terhadap trigger.'
			},
			offset: {
				control: 'number',
				description: 'Jarak antara trigger dan kontainer kartu dalam pixel.'
			},
			class: {
				control: 'text',
				description: 'Class override untuk elemen wrapper trigger.'
			}
		}
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<HoverCard openDelay={0}>
			{#snippet content()}
				<div class="flex w-64 flex-col gap-2">
					<p class="font-medium text-foreground">Ada Lovelace</p>
					<p class="text-foreground-muted">
						Mathematician and writer, known for her work on Charles Babbage's Analytical Engine.
					</p>
					<a href="#profile" class="text-primary hover:underline">View full profile</a>
				</div>
			{/snippet}
			<a href="#user" class="font-medium text-primary hover:underline">@ada</a>
		</HoverCard>
	</div>
</Story>

<Story name="With actions in card" asChild>
	<div class="flex w-96 justify-center p-16">
		<HoverCard openDelay={0}>
			{#snippet content({ close })}
				<div class="flex w-72 flex-col gap-3">
					<div class="flex items-center gap-3">
						<div
							class="flex size-10 items-center justify-center rounded-full bg-surface-subtle font-semibold text-foreground"
						>
							AL
						</div>
						<div class="flex flex-col">
							<span class="font-medium text-foreground">Ada Lovelace</span>
							<span class="text-xs text-foreground-subtle">@ada · Pengembang Inti</span>
						</div>
					</div>
					<p class="text-xs text-foreground-muted">
						Fokus pada arsitektur sistem dan fondasi pustaka komponen.
					</p>
					<div class="mt-1 flex items-center justify-end gap-2 border-t border-border pt-2">
						<Button variant="ghost" size="sm" onclick={close}>Tutup</Button>
						<Button size="sm" onclick={close}>Ikuti</Button>
					</div>
				</div>
			{/snippet}
			<span
				class="cursor-pointer font-medium text-foreground underline decoration-dotted hover:text-primary"
			>
				Arahkan ke profil Ada
			</span>
		</HoverCard>
	</div>
</Story>

<Story name="Trigger state indicator" asChild>
	<div class="flex w-80 justify-center p-16">
		<HoverCard openDelay={0}>
			{#snippet children({ open })}
				<button
					type="button"
					class="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors"
					class:bg-surface-subtle={open}
					class:border-primary={open}
				>
					<span>Status Kartu:</span>
					<span class="font-bold" class:text-primary={open}>
						{open ? 'Terbuka' : 'Tertutup'}
					</span>
				</button>
			{/snippet}
			{#snippet content()}
				<div class="w-56 text-xs text-foreground-muted">
					Konten hover card sedang aktif dan statusnya tercermin pada tombol pemicu.
				</div>
			{/snippet}
		</HoverCard>
	</div>
</Story>

<Story name="Placements" asChild>
	<div class="flex w-full flex-wrap justify-center gap-16 p-24">
		<HoverCard placement="top" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Top placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Top</span>
		</HoverCard>
		<HoverCard placement="right" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Right placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Right</span>
		</HoverCard>
		<HoverCard placement="bottom" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Bottom placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Bottom</span>
		</HoverCard>
		<HoverCard placement="left" openDelay={0}>
			{#snippet content()}
				<p class="w-40">Left placement.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Left</span>
		</HoverCard>
	</div>
</Story>

<Story name="Custom content styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<HoverCard openDelay={0} classes={{ content: 'border-danger/30 bg-surface' }}>
			{#snippet content()}
				<p class="w-48 text-danger">Kartu dengan style kustom via prop classes.content.</p>
			{/snippet}
			<span class="cursor-default underline decoration-dotted">Custom border</span>
		</HoverCard>
	</div>
</Story>
