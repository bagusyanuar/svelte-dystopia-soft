<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';

	const componentDescription = [
		'Komponen accordion collapsible hierarkis dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas keyboard dan screen reader WAI-ARIA, transisi ekspansi CSS grid yang halus, serta hierarki props semi-headless yang fleksibel.',
		'',
		'### Fitur Utama',
		'- **2 Mode Pemilihan (`type`)**: `single` (default, satu item terbuka dalam satu waktu dan menutup kembali saat diklik) serta `multiple` (banyak item dapat terbuka bersamaan secara independen).',
		'- **Type-Discriminated Bindable Value**: Prop `value` bindable (`$bindable()`) dengan validasi tipe otomatis (string untuk single, string[] untuk multiple).',
		'- **Desain Hover Flush & Sudut Rapi**: Baris header item mengisi area secara rata (*flush*) tanpa celah lengkungan internal, dengan sudut terluar dipotong rapi mengikuti kontur container `rounded-lg` via `overflow-hidden`.',
		'- **Animasi Ekspansi Halus**: Menggunakan teknik modern CSS `grid-template-rows: 0fr -> 1fr` dengan transisi mulus tanpa perhitungan tinggi JavaScript yang berat.',
		'- **Komposisi Semi-Headless Penuh**: Mendukung sub-part class granular (`classes.trigger`, `classes.content`, `classes.indicator`, `classes.panel`), custom `indicator` snippet (pengganti ikon chevron bawaan), serta penerusan state `{ open }` ke snippet `trigger`, `children`, dan `indicator`.',
		'- **State via Data Attributes**: Mengekspos atribut `data-state="open | closed"` dan `data-disabled` pada wrapper baris terluar serta tombol trigger untuk mempermudah targeting selector CSS kustom (`[data-state="open"]`).',
		'- **Aksesibilitas & DOM Ref**: Asosiasi otomatis `aria-expanded` dan `aria-controls` melalui ID deterministik, penonaktifan interaksi item tertutup dengan atribut `inert`, serta eksposisi DOM ref (`ref` pada Accordion, serta `ref` dan `triggerRef` pada AccordionItem).'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Accordion',
		component: Accordion,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			type: {
				control: 'inline-radio',
				options: ['single', 'multiple'],
				description:
					'Mode pemilihan item accordion: single (hanya 1 item aktif) atau multiple (bisa banyak).'
			},
			value: {
				control: 'text',
				description: 'Nilai item yang aktif (string untuk single, string[] untuk multiple).'
			},
			class: {
				control: 'text',
				description: 'Class override atau tambahan pada container luar accordion.'
			}
		}
	});
</script>

<Story name="Single (default)" asChild>
	<div class="w-96">
		<Accordion value="item-1">
			<AccordionItem value="item-1">
				{#snippet trigger()}What's included in the Pro plan?{/snippet}
				Unlimited projects, priority support, and access to every component in the library.
			</AccordionItem>
			<AccordionItem value="item-2">
				{#snippet trigger()}Can I cancel anytime?{/snippet}
				Yes — cancel from your billing settings, no questions asked.
			</AccordionItem>
			<AccordionItem value="item-3" disabled>
				{#snippet trigger()}Enterprise plan{/snippet}
				Contact sales for custom pricing.
			</AccordionItem>
		</Accordion>
	</div>
</Story>

<Story name="Multiple" asChild>
	<div class="w-96">
		<Accordion type="multiple" value={['item-1']}>
			<AccordionItem value="item-1">
				{#snippet trigger()}What's included in the Pro plan?{/snippet}
				Unlimited projects, priority support, and access to every component in the library.
			</AccordionItem>
			<AccordionItem value="item-2">
				{#snippet trigger()}Can I cancel anytime?{/snippet}
				Yes — cancel from your billing settings, no questions asked.
			</AccordionItem>
			<AccordionItem value="item-3">
				{#snippet trigger()}Does it support dark mode?{/snippet}
				Yes — set <code>data-theme="dark"</code> on any ancestor element.
			</AccordionItem>
		</Accordion>
	</div>
</Story>

<Story name="Custom indicator & styling" asChild>
	<div class="w-96">
		<Accordion value="item-1">
			<AccordionItem value="item-1">
				{#snippet trigger({ open })}
					<span class="flex items-center gap-2">
						<span class="font-medium text-foreground">Billing details</span>
						<span
							class="rounded-full bg-surface-subtle px-1.5 py-0.5 text-xs text-foreground-subtle"
						>
							{open ? 'Open' : 'Closed'}
						</span>
					</span>
				{/snippet}
				{#snippet indicator({ open })}
					<span
						class="text-xs font-semibold text-foreground-faint transition-transform duration-150 {open
							? 'text-foreground-soft'
							: ''}"
					>
						{open ? 'Hide' : 'Show'}
					</span>
				{/snippet}
				Manage your payment methods, invoice history, and tax identifiers here.
			</AccordionItem>
			<AccordionItem value="item-2">
				{#snippet trigger()}Security & 2FA{/snippet}
				{#snippet indicator({ open })}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="size-4 text-foreground-faint transition-transform duration-150 {open
							? 'rotate-45 text-foreground'
							: ''}"
					>
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
				{/snippet}
				Two-factor authentication adds an extra layer of protection to your account.
			</AccordionItem>
		</Accordion>
	</div>
</Story>
