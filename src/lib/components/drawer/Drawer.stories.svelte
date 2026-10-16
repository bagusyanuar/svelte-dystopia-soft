<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Drawer from './Drawer.svelte';

	const componentDescription = [
		'Komponen panel slide-out (Drawer / Sheet) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Mendukung 4 posisi tepi layar (`right`, `left`, `bottom`, `top`), integrasi ARIA lengkap (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`), focus trap otomatis, scroll lock dengan kompensasi scrollbar, serta dismissable layer (Esc & outside click).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **4 Posisi Sisi Layar (`side`)**: Mendukung slide-in dari `right` (default), `left` (navigasi sidebar), `bottom` (mobile action sheet), dan `top` (banner/notifikasi).',
		'- **Focus Trap & Scroll Lock**: Mengunci fokus keyboard di dalam panel saat terbuka dan mengembalikan fokus ke trigger saat ditutup, serta mengunci scroll body tanpa layout shift.',
		'- **State via Data Attributes**: Mengekspos `data-state="open|closed"`, `data-side`, `data-disabled`, dan `data-slot` (`drawer-trigger`, `drawer-overlay`, `drawer-content`, `drawer-title`, `drawer-description`, `drawer-body`, `drawer-close`) untuk styling berbasis state dan animasi CSS kustom.',
		'- **Akses DOM Ref Ganda**: Mendukung binding `ref = $bindable(null)` / `triggerRef = $bindable(null)` ke tombol trigger serta `contentRef = $bindable(null)` ke elemen panel drawer.',
		'- **Snippet State & Action Payload**: Snippet `trigger` menerima `{ open }`, dan snippet `children` menerima `{ open, close }` sehingga tombol internal drawer (seperti Batal atau Simpan) dapat menutup panel langsung tanpa perlu `bind:open`.',
		'- **Kustomisasi Tombol Close**: Menyediakan snippet opsional `close({ close })` untuk mengganti tombol close sudut kanan atas.',
		'- **Class Override & Sub-parts**: Mendukung root `class` override serta sub-bagian via `classes.trigger`, `classes.overlay`, `classes.content`, `classes.title`, `classes.description`, `classes.body`, `classes.close`, dan `classes.closeIcon`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Drawer',
		component: Drawer,
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
				description: 'Status buka/tutup drawer panel (bindable).'
			},
			side: {
				control: 'select',
				options: ['right', 'left', 'bottom', 'top'],
				description: 'Posisi tepi layar tempat drawer muncul.'
			},
			class: {
				control: 'text',
				description: 'Class override untuk tombol trigger utama.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan tombol trigger drawer.'
			}
		}
	});
</script>

<Story name="Right (default)" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer>
			{#snippet trigger()}
				Open notifications
			{/snippet}
			{#snippet title()}
				Notifications
			{/snippet}
			{#snippet description()}
				Recent activity on your account.
			{/snippet}
			<p class="text-foreground-muted">You're all caught up.</p>
		</Drawer>
	</div>
</Story>

<Story name="Left" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer side="left">
			{#snippet trigger()}
				Open menu
			{/snippet}
			{#snippet title()}
				Navigation
			{/snippet}
			<p class="text-foreground-muted">Links and shortcuts go here.</p>
		</Drawer>
	</div>
</Story>

<Story name="Bottom (mobile sheet)" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer side="bottom">
			{#snippet trigger()}
				Open sheet
			{/snippet}
			{#snippet title()}
				Share
			{/snippet}
			<p class="text-foreground-muted">Pick where to share this.</p>
		</Drawer>
	</div>
</Story>

<Story name="Top" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer side="top">
			{#snippet trigger()}
				Open banner
			{/snippet}
			{#snippet title()}
				System status
			{/snippet}
			<p class="text-foreground-muted">All systems operational.</p>
		</Drawer>
	</div>
</Story>

<Story name="With a footer" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer>
			{#snippet trigger()}
				Edit item
			{/snippet}
			{#snippet title()}
				Edit item
			{/snippet}
			{#snippet children({ close })}
				<div class="flex h-full flex-col justify-between">
					<p class="text-foreground-muted">Form fields would go here.</p>
					<div class="flex justify-end gap-2 pt-4">
						<button
							type="button"
							onclick={close}
							class="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle"
						>
							Cancel
						</button>
						<button
							type="button"
							onclick={close}
							class="inline-flex h-9 cursor-pointer items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
						>
							Save
						</button>
					</div>
				</div>
			{/snippet}
		</Drawer>
	</div>
</Story>

<Story name="Semi-headless payload action" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer class="border-primary/50 text-primary hover:bg-primary/10">
			{#snippet trigger({ open })}
				{open ? 'Panel terbuka...' : 'Pengaturan Cepat'}
			{/snippet}
			{#snippet title()}
				Pengaturan Cepat
			{/snippet}
			{#snippet description()}
				Snippet children menerima fungsi `close` langsung tanpa `bind:open`.
			{/snippet}
			{#snippet children({ close })}
				<div class="flex h-full flex-col justify-between">
					<div class="space-y-3 text-sm text-foreground-muted">
						<p>Konfigurasikan preferensi workspace Anda di sini.</p>
						<div class="rounded-md border border-border bg-surface-subtle p-3 text-xs">
							Opsi otomatis disimpan saat dialog atau drawer ditutup.
						</div>
					</div>
					<div class="flex justify-end gap-2 pt-4">
						<button
							type="button"
							onclick={close}
							class="inline-flex h-9 cursor-pointer items-center rounded-md border border-border px-3 text-sm font-medium text-foreground-soft hover:bg-surface-subtle"
						>
							Batal (via close payload)
						</button>
						<button
							type="button"
							onclick={close}
							class="inline-flex h-9 cursor-pointer items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
						>
							Selesai
						</button>
					</div>
				</div>
			{/snippet}
		</Drawer>
	</div>
</Story>

<Story name="Semi-headless custom close button" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer>
			{#snippet trigger()}
				Drawer dengan Custom Close
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
			<p class="text-foreground-muted">
				Tombol close di sudut kanan atas telah diganti sepenuhnya menggunakan snippet `close`.
			</p>
		</Drawer>
	</div>
</Story>

<Story name="Scrollable drawer content" asChild>
	<div class="flex w-80 justify-center p-16">
		<Drawer classes={{ body: 'overflow-y-auto pr-1' }}>
			{#snippet trigger()}
				Daftar Notifikasi Panjang
			{/snippet}
			{#snippet title()}
				Notifikasi Masuk
			{/snippet}
			{#snippet description()}
				Menampilkan seluruh riwayat aktivitas terbaru Anda.
			{/snippet}
			{#snippet children({ close })}
				<div class="space-y-4">
					<div class="space-y-2.5">
						{#each [
							{ id: '1', title: 'Deploy Production Berhasil', desc: 'Versi v1.2.1 telah dirilis ke cluster prod.', time: '5m lalu' },
							{ id: '2', title: 'Pull Request Dimerge', desc: 'PR #42 feat: semi-headless drawer disetujui.', time: '20m lalu' },
							{ id: '3', title: 'Komentar Baru', desc: 'Bagus menandai Anda pada issue #18.', time: '1 jam lalu' },
							{ id: '4', title: 'Backup Otomatis Selesai', desc: 'Snapshot database postgres berhasil disimpan.', time: '3 jam lalu' },
							{ id: '5', title: 'API Key Kedaluwarsa', desc: 'Token dev-test-key akan hangus dalam 2 hari.', time: '6 jam lalu' },
							{ id: '6', title: 'Pembaruan Kebijakan Privasi', desc: 'Syarat & ketentuan sistem telah diperbarui.', time: '1 hari lalu' }
						] as notif (notif.id)}
							<div class="rounded-md border border-border bg-surface-subtle p-3 text-xs">
								<div class="flex items-center justify-between font-medium text-foreground">
									<span>{notif.title}</span>
									<span class="text-[11px] text-foreground-subtle font-normal">{notif.time}</span>
								</div>
								<p class="mt-1 text-foreground-muted">{notif.desc}</p>
							</div>
						{/each}
					</div>
					<div class="flex justify-end pt-2">
						<button
							type="button"
							onclick={close}
							class="inline-flex h-8 cursor-pointer items-center rounded-md border border-border px-3 text-xs font-medium text-foreground-soft transition-colors hover:bg-surface-subtle"
						>
							Tutup Semua
						</button>
					</div>
				</div>
			{/snippet}
		</Drawer>
	</div>
</Story>
