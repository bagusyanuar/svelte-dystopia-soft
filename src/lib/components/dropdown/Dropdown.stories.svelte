<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dropdown from './Dropdown.svelte';
	import DropdownItem from './DropdownItem.svelte';

	const componentDescription = [
		'Komponen menu aksi mengambang (Dropdown Menu) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas ARIA menu penuh (`role="menu"`, `role="menuitem"`, `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`), navigasi keyboard roving focus otomatis (panah atas/bawah, Home, End, typeahead huruf), positioning cerdas via `@floating-ui/dom`, serta dismissable layer (Esc & outside click).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Roving Focus & Keyboard Navigation**: Fokus berpindah secara mulus menggunakan tombol panah atas/bawah, melompat ke item pertama/terakhir dengan `Home`/`End`, dan pencarian cepat menggunakan huruf awal (typeahead).',
		'- **State via Data Attributes**: Mengekspos `data-state="open|closed"`, `data-disabled`, dan `data-slot` (`dropdown-trigger`, `dropdown-content`, `dropdown-item`) untuk styling berbasis state dan animasi CSS kustom.',
		'- **Akses DOM Ref Ganda**: Mendukung binding `ref = $bindable(null)` / `triggerRef = $bindable(null)` ke tombol trigger, `contentRef = $bindable(null)` ke panel menu floating, serta `ref` pada tiap `DropdownItem`.',
		'- **Snippet State Payload**: Snippet `trigger` menerima `{ open }` untuk memudahkan animasi dinamis (seperti rotasi panah chevron saat terbuka). Snippet `children` menerima `{ open, close }` untuk aksi kustom.',
		'- **Polimorfisme Item (Button & Link)**: `DropdownItem` mendukung prop `href` untuk merender tag `<a>` semantik untuk navigasi URL, serta snippet `child` untuk integrasi router eksternal (asChild pattern).'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Dropdown',
		component: Dropdown,
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
				description: 'Status buka/tutup menu dropdown (bindable).'
			},
			placement: {
				control: 'select',
				options: [
					'bottom-start',
					'bottom',
					'bottom-end',
					'top-start',
					'top',
					'top-end',
					'right-start',
					'left-start'
				],
				description: 'Posisi panel floating relatif terhadap trigger.'
			},
			offset: {
				control: 'number',
				description: 'Jarak pixel antara trigger dan panel menu floating.'
			},
			class: {
				control: 'text',
				description: 'Class override untuk tombol trigger utama.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan tombol trigger dropdown.'
			}
		}
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dropdown>
			{#snippet trigger()}
				Options
			{/snippet}
			<DropdownItem onSelect={() => alert('Duplicate')}>Duplicate</DropdownItem>
			<DropdownItem onSelect={() => alert('Rename')}>Rename</DropdownItem>
			<DropdownItem disabled onSelect={() => alert('Archive')}>Archive</DropdownItem>
			<DropdownItem onSelect={() => alert('Delete')}>Delete</DropdownItem>
		</Dropdown>
	</div>
</Story>

<Story name="With state payload and chevron" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dropdown>
			{#snippet trigger({ open })}
				<span class="inline-flex items-center gap-1.5">
					Aksi Proyek
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class={`size-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
						aria-hidden="true"
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</span>
			{/snippet}
			<DropdownItem onSelect={() => alert('Duplikat')}>
				<span class="flex w-full items-center justify-between">
					<span>Duplikat</span>
					<span class="text-[11px] text-foreground-faint">⌘D</span>
				</span>
			</DropdownItem>
			<DropdownItem onSelect={() => alert('Ubah nama')}>
				<span class="flex w-full items-center justify-between">
					<span>Ganti Nama</span>
					<span class="text-[11px] text-foreground-faint">F2</span>
				</span>
			</DropdownItem>
			<DropdownItem disabled onSelect={() => alert('Arsipkan')}>
				<span class="flex w-full items-center justify-between">
					<span>Arsipkan (Disabled)</span>
					<span class="text-[11px] text-foreground-faint">⌘E</span>
				</span>
			</DropdownItem>
			<DropdownItem class="text-danger hover:bg-danger/10" onSelect={() => alert('Hapus')}>
				<span class="flex w-full items-center justify-between">
					<span>Hapus Permanen</span>
					<span class="text-[11px] text-danger/80">⌫</span>
				</span>
			</DropdownItem>
		</Dropdown>
	</div>
</Story>

<Story name="Navigation with links" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dropdown placement="bottom-start">
			{#snippet trigger()}
				Akun Saya
			{/snippet}
			<DropdownItem href="#profile">
				Profil Pengguna
			</DropdownItem>
			<DropdownItem href="#settings">
				Pengaturan Akun
			</DropdownItem>
			<DropdownItem href="#billing">
				Tagihan & Langganan
			</DropdownItem>
			<DropdownItem href="#docs" target="_blank" rel="noopener noreferrer">
				Dokumentasi API ↗
			</DropdownItem>
		</Dropdown>
	</div>
</Story>

<Story name="Inside a scroll container (table)" asChild>
	<div class="w-96 overflow-x-auto rounded-lg border border-border">
		<table class="w-160 text-sm">
			<thead>
				<tr class="border-b border-border text-left text-foreground-soft">
					<th class="p-3">Name</th>
					<th class="p-3">Email</th>
					<th class="p-3">Role</th>
					<th class="p-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-border">
					<td class="p-3">Ada Lovelace</td>
					<td class="p-3">ada@example.com</td>
					<td class="p-3">Admin</td>
					<td class="p-3">
						<Dropdown placement="bottom-end">
							{#snippet trigger()}
								Actions
							{/snippet}
							<DropdownItem>Edit</DropdownItem>
							<DropdownItem>Remove</DropdownItem>
						</Dropdown>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</Story>

<Story name="Custom enter and exit animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dropdown classes={{ content: 'dropdown-animated' }}>
			{#snippet trigger()}
				Options
			{/snippet}
			<DropdownItem>Duplicate</DropdownItem>
			<DropdownItem>Rename</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</Dropdown>
	</div>
</Story>

<style>
	/*
	  The menu is portalled to <body>, so it never carries this component's
	  scope class — the selectors have to be global. `-global-` belongs on the
	  @keyframes declaration only: Svelte strips it from the emitted name but
	  does NOT rewrite references inside :global(), so spelling it in both
	  places would point at a name that no longer exists and the animation
	  would silently never run.
	*/
	:global(.dropdown-animated[data-state='open']) {
		animation: dropdown-in 150ms ease-out;
	}

	:global(.dropdown-animated[data-state='closed']) {
		animation: dropdown-out 150ms ease-in;
	}

	@keyframes -global-dropdown-in {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(-4px);
		}
	}

	@keyframes -global-dropdown-out {
		to {
			opacity: 0;
			transform: scale(0.96) translateY(-4px);
		}
	}
</style>
