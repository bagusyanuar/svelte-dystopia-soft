<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import EmptyState from './EmptyState.svelte';
	import Button from '../button/Button.svelte';

	const componentDescription = [
		'Komponen status kosong (Empty State) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas ARIA bawaan (`role="status"`, ikon dekoratif dengan `aria-hidden="true"`), layout fleksibel yang dapat ditempatkan di halaman utama, card, maupun di dalam baris tabel data (`<tr><td colspan="...">`).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Aksesibilitas Politis (`role="status"`)**: Dinamis dan diumumkan secara sopan oleh screen reader ketika hasil filter atau pencarian menghasilkan data kosong.',
		'- **State via Data Attributes**: Mengekspos hook `data-slot` (`empty-state`, `empty-state-icon`, `empty-state-title`, `empty-state-description`, `empty-state-actions`) untuk styling berbasis selector CSS.',
		'- **Akses DOM Ref**: Mendukung binding `ref = $bindable(null)` ke elemen root container `<div>`.',
		'- **Class Override & Sub-parts**: Mendukung root `class` override serta sub-bagian via `classes.icon`, `classes.title`, `classes.description`, dan `classes.actions`.',
		'- **Snippet Modular**: Mendukung snippet `icon`, `title`, `description`, serta `children` untuk tombol call-to-action (CTA).'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/EmptyState',
		component: EmptyState,
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
				description: 'Class override untuk root container element.'
			}
		}
	});
</script>

{#snippet inboxIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M22 12h-6l-2 3h-4l-2-3H2" />
		<path
			d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"
		/>
	</svg>
{/snippet}

{#snippet searchIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
{/snippet}

<Story name="Default" asChild>
	<div class="w-96 rounded-lg border border-border">
		<EmptyState>
			{#snippet icon()}
				{@render inboxIcon()}
			{/snippet}
			{#snippet title()}
				No items yet
			{/snippet}
			{#snippet description()}
				Items you create will show up here.
			{/snippet}
		</EmptyState>
	</div>
</Story>

<Story name="No search results" asChild>
	<div class="w-96 rounded-lg border border-border">
		<EmptyState>
			{#snippet icon()}
				{@render searchIcon()}
			{/snippet}
			{#snippet title()}
				No results found
			{/snippet}
			{#snippet description()}
				Try adjusting your filters or search terms.
			{/snippet}
		</EmptyState>
	</div>
</Story>

<Story name="With an action" asChild>
	<div class="w-96 rounded-lg border border-border">
		<EmptyState>
			{#snippet icon()}
				{@render inboxIcon()}
			{/snippet}
			{#snippet title()}
				No items yet
			{/snippet}
			{#snippet description()}
				Get started by creating your first item.
			{/snippet}
			<Button size="sm">Create item</Button>
		</EmptyState>
	</div>
</Story>

<Story name="With multiple actions" asChild>
	<div class="w-96 rounded-lg border border-border">
		<EmptyState>
			{#snippet icon()}
				{@render inboxIcon()}
			{/snippet}
			{#snippet title()}
				Belum ada data proyek
			{/snippet}
			{#snippet description()}
				Mulai dengan membuat proyek baru dari template atau impor data yang sudah ada.
			{/snippet}
			<Button variant="outline" size="sm">Impor Data</Button>
			<Button size="sm">Buat Proyek Baru</Button>
		</EmptyState>
	</div>
</Story>

<Story name="Title only" asChild>
	<div class="w-96 rounded-lg border border-border">
		<EmptyState>
			{#snippet title()}
				Nothing here yet
			{/snippet}
		</EmptyState>
	</div>
</Story>

<Story name="Inside a table" asChild>
	<div class="w-160 overflow-hidden rounded-lg border border-border">
		<table class="w-full text-sm">
			<thead class="border-b border-border">
				<tr>
					<th class="px-compact py-2 text-left font-medium text-foreground-soft">Invoice</th>
					<th class="px-compact py-2 text-left font-medium text-foreground-soft">Status</th>
					<th class="px-compact py-2 text-left font-medium text-foreground-soft">Amount</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td colspan={3}>
						<EmptyState>
							{#snippet icon()}
								{@render inboxIcon()}
							{/snippet}
							{#snippet title()}
								No invoices yet
							{/snippet}
							{#snippet description()}
								Invoices will appear here once you create one.
							{/snippet}
						</EmptyState>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</Story>
