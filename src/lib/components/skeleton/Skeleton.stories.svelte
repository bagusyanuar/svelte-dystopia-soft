<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Skeleton from './Skeleton.svelte';
	import Card from '../card/Card.svelte';
	import CardHeader from '../card/CardHeader.svelte';
	import CardContent from '../card/CardContent.svelte';

	const componentDescription = [
		'Komponen penampung loading placeholder (Skeleton) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Aksesibilitas Bawaan**: Otomatis menyertakan `aria-hidden="true"` agar pembaca layar tidak mengumumkan konten palsu/kosong selama pemuatan.',
		'- **Animasi & Bentuk Fleksibel**: Membawa animasi `animate-pulse` dan radius default yang dapat dioverride sepenuhnya menggunakan utilitas Tailwind (`rounded-full`, warna background kustom, dsb.).',
		'- **DOM Element Reference**: Mendukung `bind:ref` ke elemen root `<div>`.',
		'- **State Hooks via Data-Attributes**: Mengekspos hook `data-slot="skeleton"`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Skeleton',
		component: Skeleton,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		}
	});
</script>

<Story name="Default" asChild>
	<Skeleton class="h-4 w-48" />
</Story>

<Story name="Text lines" asChild>
	<div class="flex w-64 flex-col gap-2">
		<Skeleton class="h-4 w-full" />
		<Skeleton class="h-4 w-full" />
		<Skeleton class="h-4 w-3/4" />
	</div>
</Story>

<Story name="Avatar" asChild>
	<Skeleton class="size-12 rounded-full" />
</Story>

<Story name="Card" asChild>
	<div class="w-80">
		<Card>
			<CardHeader class="flex-row items-center gap-3">
				<Skeleton class="size-10 shrink-0 rounded-full" />
				<div class="flex flex-1 flex-col gap-2">
					<Skeleton class="h-4 w-2/3" />
					<Skeleton class="h-3 w-1/3" />
				</div>
			</CardHeader>
			<CardContent class="flex flex-col gap-2">
				<Skeleton class="h-3 w-full" />
				<Skeleton class="h-3 w-full" />
				<Skeleton class="h-3 w-5/6" />
			</CardContent>
		</Card>
	</div>
</Story>
