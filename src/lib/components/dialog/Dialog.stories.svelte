<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dialog from './Dialog.svelte';

	const componentDescription = [
		'Komponen modal dialog dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas ARIA penuh (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`), focus trap otomatis, scroll lock dengan kompensasi scrollbar, serta dismissable layer (Esc & outside click).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Focus Trap & Scroll Lock**: Mengunci fokus keyboard di dalam dialog saat terbuka dan mengembalikan fokus ke trigger saat tertutup, serta mengunci scroll body tanpa layout shift.',
		'- **State via Data Attributes**: Mengekspos `data-state="open|closed"`, `data-disabled`, dan `data-slot` (`dialog-trigger`, `dialog-overlay`, `dialog-content`, `dialog-title`, `dialog-description`, `dialog-body`, `dialog-close`) untuk styling berbasis state dan animasi CSS.',
		'- **Akses DOM Ref Ganda**: Mendukung binding `ref = $bindable(null)` / `triggerRef = $bindable(null)` ke tombol trigger serta `contentRef = $bindable(null)` ke modal dialog content.',
		'- **Snippet State & Action Payload**: Snippet `trigger` menerima `{ open }`, dan snippet `children` menerima `{ open, close }` sehingga aksi tombol dalam modal (seperti Batal atau Simpan) dapat menutup dialog tanpa perlu `bind:open`.',
		'- **Kustomisasi Tombol Close**: Menyediakan snippet opsional `close({ close })` untuk mengganti tombol close pojok kanan atas dengan elemen/desain kustom.',
		'- **Class Override & Sub-parts**: Mendukung root `class` override serta sub-bagian via `classes.trigger`, `classes.overlay`, `classes.content`, `classes.title`, `classes.description`, `classes.body`, `classes.close`, dan `classes.closeIcon`.',
		'- **Konten Scrollable**: Fleksibel untuk konten panjang — baik melalui container scroll internal (misal: Syarat & Ketentuan) maupun overflow langsung pada body modal via sub-part `classes.body` dan `classes.content`.'
	].join('\n');

	const auditEvents = [
		{ id: '1', date: '13 Okt 2026, 20:15', event: 'API Key production dibuat oleh admin', user: 'bagus@dystopia.dev' },
		{ id: '2', date: '13 Okt 2026, 18:42', event: 'Perubahan webhook endpoint ke https://api.client.id/events', user: 'system' },
		{ id: '3', date: '12 Okt 2026, 14:10', event: 'Role diperbarui: developer -> maintainer', user: 'alex@dystopia.dev' },
		{ id: '4', date: '11 Okt 2026, 09:22', event: 'Integrasi GitHub repository dystopia-soft-lib ditambahkan', user: 'bagus@dystopia.dev' },
		{ id: '5', date: '10 Okt 2026, 23:55', event: 'Otentikasi 2FA diaktifkan untuk akun organisasi', user: 'security@dystopia.dev' },
		{ id: '6', date: '09 Okt 2026, 11:30', event: 'Backup database mingguan selesai (size: 4.2GB)', user: 'cron-daemon' },
		{ id: '7', date: '08 Okt 2026, 16:45', event: 'Pengaturan IP Whitelist diperbarui untuk CIDR 192.168.1.0/24', user: 'net-admin' },
		{ id: '8', date: '07 Okt 2026, 08:00', event: 'Sertifikat SSL domain diperbarui otomatis oleh Lets Encrypt', user: 'system' }
	];

	const { Story } = defineMeta({
		title: 'Components/Dialog',
		component: Dialog,
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
				description: 'Status buka/tutup modal dialog (bindable).'
			},
			class: {
				control: 'text',
				description: 'Class override untuk tombol trigger utama.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan tombol trigger dialog.'
			}
		}
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog>
			{#snippet trigger()}
				Edit profile
			{/snippet}
			{#snippet title()}
				Edit profile
			{/snippet}
			<p class="w-64 text-foreground-muted">Update your name and photo. Changes save instantly.</p>
		</Dialog>
	</div>
</Story>

<Story name="With a description" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog>
			{#snippet trigger()}
				Delete project
			{/snippet}
			{#snippet title()}
				Delete project
			{/snippet}
			{#snippet description()}
				This will permanently delete the project and all of its data. This action cannot be undone.
			{/snippet}
			<div class="mt-2 flex justify-end gap-2">
				<button
					type="button"
					class="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle"
				>
					Cancel
				</button>
				<button
					type="button"
					class="inline-flex h-9 cursor-pointer items-center rounded-lg bg-danger px-3 text-sm font-medium text-danger-foreground transition-colors duration-150 hover:opacity-90"
				>
					Delete
				</button>
			</div>
		</Dialog>
	</div>
</Story>

<Story name="Inside a scroll container (table)" asChild>
	<div class="w-96 overflow-x-auto rounded-lg border border-border">
		<table class="w-160 text-sm">
			<thead>
				<tr class="border-b border-border text-left text-foreground-soft">
					<th class="p-3">Name</th>
					<th class="p-3">Role</th>
					<th class="p-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-border">
					<td class="p-3">Ada Lovelace</td>
					<td class="p-3">Admin</td>
					<td class="p-3">
						<Dialog>
							{#snippet trigger()}
								Remove
							{/snippet}
							{#snippet title()}
								Remove Ada Lovelace?
							{/snippet}
							<p class="w-56 text-foreground-muted">
								They will lose access to this workspace immediately.
							</p>
						</Dialog>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</Story>

<Story name="Semi-headless payload action" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog class="border-primary/50 text-primary hover:bg-primary/10">
			{#snippet trigger({ open })}
				{open ? 'Modal terbuka...' : 'Kelola Akun'}
			{/snippet}
			{#snippet title()}
				Konfirmasi Perubahan
			{/snippet}
			{#snippet description()}
				Snippet children menerima fungsi `close` langsung tanpa perlu `bind:open`.
			{/snippet}
			{#snippet children({ close })}
				<div class="space-y-4">
					<p class="text-sm text-foreground-muted">
						Apakah kamu yakin ingin menyimpan perubahan pada profil ini?
					</p>
					<div class="flex justify-end gap-2">
						<button
							type="button"
							onclick={close}
							class="inline-flex h-9 cursor-pointer items-center rounded-md border border-border px-3 text-sm font-medium text-foreground-soft hover:bg-surface-subtle"
						>
							Batal (via payload close)
						</button>
						<button
							type="button"
							onclick={close}
							class="inline-flex h-9 cursor-pointer items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
						>
							Simpan & Tutup
						</button>
					</div>
				</div>
			{/snippet}
		</Dialog>
	</div>
</Story>

<Story name="Semi-headless custom close button" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog>
			{#snippet trigger()}
				Buka dengan Custom Close
			{/snippet}
			{#snippet title()}
				Custom Close Button
			{/snippet}
			{#snippet close({ close })}
				<button
					type="button"
					onclick={close}
					class="absolute top-4 right-4 rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-foreground-soft transition-colors hover:bg-surface-subtle"
				>
					Tutup ✕
				</button>
			{/snippet}
			<p class="w-64 text-foreground-muted">
				Tombol close di sudut kanan atas telah diganti sepenuhnya menggunakan snippet `close`.
			</p>
		</Dialog>
	</div>
</Story>

<Story name="Scrollable content" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog classes={{ content: 'max-w-lg' }}>
			{#snippet trigger()}
				Syarat & Ketentuan
			{/snippet}
			{#snippet title()}
				Syarat & Ketentuan Layanan
			{/snippet}
			{#snippet description()}
				Harap baca seluruh syarat dan ketentuan di bawah ini sebelum melanjutkan.
			{/snippet}
			{#snippet children({ close })}
				<div class="space-y-4">
					<!--
						WCAG 2.1.1 requires a scrollable region to be keyboard-operable; `tabindex="0"` is
						axe's remediation for `scrollable-region-focusable`.
					-->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<div
						tabindex="0"
						role="region"
						aria-label="Dokumen Syarat dan Ketentuan"
						class="max-h-64 space-y-3 overflow-y-auto rounded-md border border-border bg-surface-subtle p-3.5 text-xs leading-relaxed text-foreground-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						<div>
							<h4 class="font-medium text-foreground">1. Penerimaan Ketentuan</h4>
							<p class="mt-1">
								Dengan mendaftar, mengakses, atau menggunakan layanan kami, Anda menyetujui
								seluruh syarat dan ketentuan yang tercantum dalam dokumen ini. Jika Anda tidak
								menyetujui salah satu ketentuan, Anda tidak diperkenankan menggunakan sistem.
							</p>
						</div>

						<div>
							<h4 class="font-medium text-foreground">2. Keamanan Akun & Kredensial</h4>
							<p class="mt-1">
								Anda bertanggung jawab penuh untuk menjaga kerahasiaan kredensial akun Anda,
								termasuk kata sandi dan token akses API. Setiap aktivitas yang terjadi di bawah akun
								Anda dianggap sebagai otorisasi resmi dari pihak Anda.
							</p>
						</div>

						<div>
							<h4 class="font-medium text-foreground">3. Perlindungan & Privasi Data</h4>
							<p class="mt-1">
								Data Anda diproses sesuai dengan standar kepatuhan privasi global. Kami menerapkan
								enkripsi end-to-end saat transit dan at-rest untuk semua aset data sensitif. Kami
								tidak pernah menjual data pengguna kepada pihak ketiga.
							</p>
						</div>

						<div>
							<h4 class="font-medium text-foreground">4. Batasan Penggunaan</h4>
							<p class="mt-1">
								Pengguna dilarang melakukan aktivitas scraping tanpa izin, rekayasa balik (reverse
								engineering), atau memanfaatkan sistem untuk aktivitas yang melanggar hukum serta
								kebijakan keamanan siber yang berlaku.
							</p>
						</div>

						<div>
							<h4 class="font-medium text-foreground">5. Pembaruan dan Penghentian Layanan</h4>
							<p class="mt-1">
								Kami dapat memperbarui syarat dan ketentuan ini secara berkala. Pemberitahuan akan
								diberikan melalui email atau dashboard aplikasi minimal 14 hari sebelum perubahan
								efektif berlaku.
							</p>
						</div>
					</div>

					<div class="flex items-center justify-end gap-2 pt-1">
						<button
							type="button"
							onclick={close}
							class="inline-flex h-8 cursor-pointer items-center rounded-md border border-border px-3 text-xs font-medium text-foreground-soft transition-colors hover:bg-surface-subtle"
						>
							Tolak & Batal
						</button>
						<button
							type="button"
							onclick={close}
							class="inline-flex h-8 cursor-pointer items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
						>
							Saya Menyetujui
						</button>
					</div>
				</div>
			{/snippet}
		</Dialog>
	</div>
</Story>

<Story name="Scrollable modal body" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog
			classes={{
				content: 'max-h-[80vh] flex flex-col max-w-lg',
				body: 'min-h-0 flex-1 overflow-y-auto pr-1'
			}}
		>
			{#snippet trigger()}
				Log Aktivitas
			{/snippet}
			{#snippet title()}
				Riwayat Audit & Aktivitas
			{/snippet}
			{#snippet description()}
				Menampilkan seluruh riwayat event sistem dalam 30 hari terakhir.
			{/snippet}
			{#snippet children({ close })}
				<div class="space-y-2.5 text-xs">
					{#each auditEvents as item (item.id)}
						<div
							class="flex flex-col gap-0.5 rounded-md border border-border bg-surface-subtle p-2.5"
						>
							<div class="flex items-center justify-between font-medium text-foreground">
								<span>{item.event}</span>
							</div>
							<div class="flex items-center justify-between text-[11px] text-foreground-subtle">
								<span>{item.user}</span>
								<span>{item.date}</span>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-4 flex justify-end">
					<button
						type="button"
						onclick={close}
						class="inline-flex h-8 cursor-pointer items-center rounded-md border border-border px-3 text-xs font-medium text-foreground-soft transition-colors hover:bg-surface-subtle"
					>
						Tutup
					</button>
				</div>
			{/snippet}
		</Dialog>
	</div>
</Story>

<Story name="Custom content styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog classes={{ content: 'bg-primary text-primary-foreground border-transparent' }}>
			{#snippet trigger()}
				Open
			{/snippet}
			{#snippet title()}
				Accent-styled dialog
			{/snippet}
			<p class="w-56">Styled entirely via the classes prop.</p>
		</Dialog>
	</div>
</Story>

<Story name="Overriding the default animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog classes={{ content: 'dialog-slide' }}>
			{#snippet trigger()}
				Slide in
			{/snippet}
			{#snippet title()}
				Custom animation
			{/snippet}
			<p class="w-56">
				The built-in scale animation is a plain <code>data-[state=*]:animate-*</code> utility, so
				passing your own through <code>classes</code> replaces it instead of stacking.
			</p>
		</Dialog>
	</div>
</Story>

<Story name="No animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dialog classes={{ overlay: 'animate-none', content: 'animate-none' }}>
			{#snippet trigger()}
				Instant
			{/snippet}
			{#snippet title()}
				No animation
			{/snippet}
			<p class="w-56">
				<code>animate-none</code> opts out entirely; the dialog unmounts immediately on close.
			</p>
		</Dialog>
	</div>
</Story>

<style>
	/*
	  The content is portalled to <body>, so it never carries this component's
	  scope class — the selectors have to be global. See Popover.stories.svelte
	  for the same reasoning.

	  `-global-` belongs on the @keyframes declaration only: Svelte strips it
	  from the emitted name but does NOT rewrite references inside :global(),
	  so spelling it here too would point at names that no longer exist and the
	  animations would silently never run.

	  Only `transform` is touched — Dialog centres its content with a flex
	  wrapper, so a consumer animation never has to restate a centring offset.
	*/
	:global(.dialog-slide[data-state='open']) {
		animation: dialog-slide-in 200ms ease-out;
	}

	:global(.dialog-slide[data-state='closed']) {
		animation: dialog-slide-out 200ms ease-in;
	}

	@keyframes -global-dialog-slide-in {
		from {
			opacity: 0;
			transform: translateY(-16px);
		}
	}

	@keyframes -global-dialog-slide-out {
		to {
			opacity: 0;
			transform: translateY(-16px);
		}
	}
</style>
