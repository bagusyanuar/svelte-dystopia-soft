<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './Badge.svelte';
	import type { BadgeProps } from './Badge.types.js';

	type BadgeStoryArgs = Pick<BadgeProps, 'variant' | 'size'>;

	const componentDescription = [
		'Komponen badge visual ringkas (*compact tag / label*) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Digunakan untuk menampilkan status entitas, kategori, tag, hitungan, atau metadata singkat.',
		'',
		'### Fitur Utama',
		'- **7 Varian Semantik**: `default` (brand accent solid teal), `secondary` (netral subtle border-driven), `outline` (transparan bersih), serta ragam status alert lengkap `success` (hijau), `warning` (amber), `info` (biru), dan `danger` (merah).',
		'- **3 Pilihan Ukuran Kepadatan (`size`)**: `sm` (compact 11px untuk cell tabel/kanban), `md` (standar 12px), dan `lg` (14px).',
		'- **State via Data Attributes**: Mengekspos `data-variant` dan `data-size` langsung pada elemen root `<span>`, mempermudah styling berbasis CSS selector (`[data-variant="danger"]`).',
		'- **Akses DOM Ref**: Mendukung `ref = $bindable(null)` untuk eksposisi node `<span>` bawaan.',
		'- **Snippet State Payload**: Meneruskan `{ variant }` ke snippet `children`, memungkinkan ikon atau dot indikator di dalam badge beradaptasi otomatis dengan varian warna yang dipilih.',
		'- **Kompatibilitas Bentuk & Sub-elemen**: Mudah dipadukan dengan status dot bulat (`size-1.5 rounded-full`) atau diubah menjadi pill lonjong via class override `rounded-full`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Badge',
		component: Badge,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'secondary', 'outline', 'success', 'warning', 'info', 'danger'],
				description: 'Varian gaya visual dan warna semantik badge.'
			},
			size: {
				control: 'inline-radio',
				options: ['sm', 'md', 'lg'],
				description: 'Tingkat kepadatan (density) ukuran badge.'
			},
			class: {
				control: 'text',
				description: 'Class override atau tambahan pada elemen badge.'
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: BadgeStoryArgs)}
		<Badge {...args}>Badge</Badge>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>
	{#snippet template(args: BadgeStoryArgs)}
		<Badge {...args}>Secondary</Badge>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet template(args: BadgeStoryArgs)}
		<Badge {...args}>Outline</Badge>
	{/snippet}
</Story>

<Story name="Semantic status variants" asChild>
	<div class="flex flex-wrap items-center gap-2">
		<Badge variant="default">Default</Badge>
		<Badge variant="secondary">Draft</Badge>
		<Badge variant="info">In Review</Badge>
		<Badge variant="warning">Pending</Badge>
		<Badge variant="success">Active</Badge>
		<Badge variant="danger">Failed</Badge>
		<Badge variant="outline">Archived</Badge>
	</div>
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-3">
		<Badge size="sm">Small (11px)</Badge>
		<Badge size="md">Medium (12px)</Badge>
		<Badge size="lg">Large (14px)</Badge>
	</div>
</Story>

<Story name="Pill & status dot" asChild>
	<div class="flex items-center gap-2.5">
		<Badge variant="secondary" class="rounded-full">
			<span class="size-1.5 rounded-full bg-success" aria-hidden="true"></span>
			Online
		</Badge>
		<Badge variant="secondary" class="rounded-full">
			<span class="size-1.5 rounded-full bg-warning" aria-hidden="true"></span>
			Away
		</Badge>
		<Badge variant="secondary" class="rounded-full">
			<span class="size-1.5 rounded-full bg-danger" aria-hidden="true"></span>
			Offline
		</Badge>
	</div>
</Story>

<Story name="Dynamic snippet payload" asChild>
	<div class="flex items-center gap-2">
		<Badge variant="success">
			{#snippet children({ variant })}
				<span class="flex items-center gap-1">
					<span class="text-[10px]" aria-hidden="true">✓</span>
					Status: {variant}
				</span>
			{/snippet}
		</Badge>

		<Badge variant="danger">
			{#snippet children({ variant })}
				<span class="flex items-center gap-1">
					<span class="text-[10px]" aria-hidden="true">✕</span>
					Status: {variant}
				</span>
			{/snippet}
		</Badge>
	</div>
</Story>
