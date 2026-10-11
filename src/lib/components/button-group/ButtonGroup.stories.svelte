<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from '../button/Button.svelte';

	const componentDescription = [
		'Komponen kontainer grup tombol interaktif dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Menggabungkan beberapa tombol menjadi satu kesatuan visual yang solid dengan penanganan border-collapse otomatis, perataan sudut internal (*corner flattening*), dan elevasi z-index saat hover atau focus.',
		'',
		'### Fitur Utama',
		'- **Border Collapsing & Corner Management**: Menggabungkan border berdekatan (`-ml-px` untuk horizontal, `-mt-px` untuk vertical) sehingga ketebalan border tetap 1px seragam, mempertahankan kelengkungan sudut terluar (`rounded-l-md` / `rounded-r-md`), dan meratakan sudut internal menjadi `rounded-none`.',
		'- **Elevasi Fokus & Hover Z-Index**: Elemen tombol yang sedang aktif, di-hover, atau difokuskan secara otomatis dinaikkan ke atas layer (`z-10`) agar garis border atau focus ring tidak terpotong oleh tombol tetangga.',
		'- **Dua Arah Orientasi (`orientation`)**: Mendukung tata letak `horizontal` (default baris) dan `vertical` (kolom bertumpuk) dengan penyesuaian sudut dinamis.',
		'- **State via Data Attributes**: Mengekspos atribut `data-orientation="horizontal | vertical"` langsung pada elemen `<div role="group">` untuk mempermudah targeting selector CSS.',
		'- **Akses DOM Ref**: Mendukung `ref = $bindable(null)` untuk manajemen fokus keyboard (seperti roving tabindex) atau pengukuran layout.',
		'- **Snippet State Payload**: Meneruskan `{ orientation }` ke snippet `children`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/ButtonGroup',
		component: ButtonGroup,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			orientation: {
				control: 'inline-radio',
				options: ['horizontal', 'vertical'],
				description: 'Arah susunan tombol di dalam grup: horizontal (baris) atau vertical (kolom).'
			},
			class: {
				control: 'text',
				description: 'Class override atau tambahan pada container grup tombol.'
			}
		}
	});
</script>

{#snippet boldIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />
	</svg>
{/snippet}

{#snippet italicIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M19 4h-9M14 20H5M15 4 9 20" />
	</svg>
{/snippet}

{#snippet underlineIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" />
	</svg>
{/snippet}

<Story name="Default" asChild>
	<ButtonGroup aria-label="Text alignment">
		<Button variant="outline">Left</Button>
		<Button variant="outline">Center</Button>
		<Button variant="outline">Right</Button>
	</ButtonGroup>
</Story>

<Story name="Default variant" asChild>
	<ButtonGroup aria-label="View">
		<Button>List</Button>
		<Button>Board</Button>
		<Button>Timeline</Button>
	</ButtonGroup>
</Story>

<Story name="Vertical" asChild>
	<ButtonGroup orientation="vertical" aria-label="Text alignment">
		<Button variant="outline">Left</Button>
		<Button variant="outline">Center</Button>
		<Button variant="outline">Right</Button>
	</ButtonGroup>
</Story>

<Story name="With a disabled button" asChild>
	<ButtonGroup aria-label="Pagination">
		<Button variant="outline" disabled>Previous</Button>
		<Button variant="outline">Next</Button>
	</ButtonGroup>
</Story>

<Story name="Icon buttons" asChild>
	<ButtonGroup aria-label="Text formatting">
		<Button variant="outline" size="sm" class="px-2.5" aria-label="Bold">
			{@render boldIcon()}
		</Button>
		<Button variant="outline" size="sm" class="px-2.5" aria-label="Italic">
			{@render italicIcon()}
		</Button>
		<Button variant="outline" size="sm" class="px-2.5" aria-label="Underline">
			{@render underlineIcon()}
		</Button>
	</ButtonGroup>
</Story>

<Story name="Split button" asChild>
	<ButtonGroup aria-label="Publish options">
		<Button>Publish post</Button>
		<Button class="px-2" aria-label="More publishing actions">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-4"
				aria-hidden="true"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</Button>
	</ButtonGroup>
</Story>

<Story name="Dynamic snippet payload" asChild>
	<ButtonGroup aria-label="Orientation payload demo">
		{#snippet children({ orientation })}
			<Button variant="outline">
				Orientation: {orientation}
			</Button>
			<Button variant="outline">Item 2</Button>
		{/snippet}
	</ButtonGroup>
</Story>
