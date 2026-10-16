<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Collapsible from './Collapsible.svelte';

	const componentDescription = [
		'Komponen kontainer collapsible/ekspansi dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas ARIA penuh (`aria-expanded`, `aria-controls`, `inert`), transisi CSS grid yang halus, serta arsitektur semi-headless yang fleksibel.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Transisi CSS Grid Mulus**: Animasi buka-tutup menggunakan `grid-template-rows` dari `0fr` ke `1fr` sehingga ketinggian konten tidak perlu di-hardcode.',
		'- **Perbaikan Hover Header**: Elemen trigger bebas dari sudut rounded bawah saat panel terbuka, ter-clip sempurna oleh `overflow-hidden` pada container root.',
		'- **State via Data Attributes**: Mengekspos `data-state="open|closed"`, `data-disabled`, dan `data-slot="collapsible"` langsung pada wrapper terluar `<div>` untuk mempermudah penataan berbasis CSS selector (`[data-state="open"]`).',
		'- **Akses DOM Ref Ganda**: Mendukung binding `ref = $bindable(null)` ke container root `<div>` dan `triggerRef = $bindable(null)` ke tombol `<button>`.',
		'- **Snippet State Payload**: Meneruskan `{ open }` ke snippet `trigger`, `children`, dan `indicator`.',
		'- **Custom Indicator Snippet**: Konsumen dapat mengganti ikon chevron default dengan snippet kustom `indicator({ open })`.',
		'- **Sub-part Classes**: Mendukung penataan granular via `classes.trigger`, `classes.content`, `classes.indicator`, dan `classes.panel`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Collapsible',
		component: Collapsible,
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
				description: 'Status buka/tutup panel collapsible (bindable).'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan interaksi klik pada trigger.'
			}
		}
	});
</script>

<Story name="Default" asChild>
	<div class="w-80">
		<Collapsible>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Open by default" asChild>
	<div class="w-80">
		<Collapsible open>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Disabled" asChild>
	<div class="w-80">
		<Collapsible disabled>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Custom trigger background" asChild>
	<div class="w-80">
		<Collapsible open classes={{ trigger: 'bg-primary/10 text-primary hover:bg-primary/15' }}>
			{#snippet trigger()}
				What's included in the Pro plan?
			{/snippet}
			Unlimited projects, priority support, and access to every component in the library.
		</Collapsible>
	</div>
</Story>

<Story name="Custom Indicator" asChild>
	<div class="w-80">
		<Collapsible>
			{#snippet trigger({ open })}
				<span class="font-medium">{open ? 'Hide details' : 'Show details'}</span>
			{/snippet}
			{#snippet indicator({ open })}
				<span class="text-xs font-mono font-bold text-primary select-none">
					{open ? '[-]' : '[+]'}
				</span>
			{/snippet}
			This collapsible uses a custom plus/minus text indicator instead of the default chevron icon.
		</Collapsible>
	</div>
</Story>

<Story name="State-Driven Styling" asChild>
	<div class="w-80">
		<Collapsible class="transition-colors data-[state=open]:border-primary data-[state=open]:shadow-sm">
			{#snippet trigger({ open })}
				<span class="font-medium {open ? 'text-primary' : 'text-foreground-soft'}">
					Highlight active container
				</span>
			{/snippet}
			Kontainer ini memanfaatkan <code>data-state="open"</code> pada root untuk mengubah warna border menjadi warna primary saat terbuka.
		</Collapsible>
	</div>
</Story>

<Story name="Stacked (FAQ list)" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Collapsible>
			{#snippet trigger()}
				How do I install the library?
			{/snippet}
			Run <code>npm install dystopia-linear-lib</code> and import components from their subpath.
		</Collapsible>
		<Collapsible>
			{#snippet trigger()}
				Does it support dark mode?
			{/snippet}
			Yes — set <code>data-theme="dark"</code> on any ancestor element.
		</Collapsible>
		<Collapsible>
			{#snippet trigger()}
				Can I customize the styling?
			{/snippet}
			Every component accepts a <code>class</code> prop merged over the internal styles.
		</Collapsible>
	</div>
</Story>
