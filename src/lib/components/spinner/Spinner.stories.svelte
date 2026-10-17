<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Spinner from './Spinner.svelte';
	import type { SpinnerProps } from './Spinner.types.js';

	type SpinnerStoryArgs = Pick<SpinnerProps, 'size' | 'label'>;

	const componentDescription = [
		'Komponen indikator pemuatan (Spinner) inline berbasis SVG dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Aksesibilitas Cerdas**: Mengumumkan `role="status"` dengan default `aria-label="Loading"`. Jika diberikan `label=""` (misal saat berada di dalam tombol dengan `aria-busy="true"`), otomatis mengabaikan role status dan menyembunyikan diri (`aria-hidden="true"`).',
		'- **Sub-parts Styling (`classes`)**: Mendukung kustomisasi terstruktur untuk `classes.root` (`<span>`) dan `classes.icon` (`<svg>`).',
		'- **Snippet Escape Hatch**: Mendukung snippet `icon` atau `children` dengan payload `{ size }` untuk menggantikan SVG circular spinner dengan animasi kustom (misal dots/bars).',
		'- **DOM Element Reference**: Mendukung `bind:ref` ke elemen root `<span>`.',
		'- **State Hooks via Data-Attributes**: Mengekspos hook `data-slot="spinner"`, `data-slot="spinner-icon"`, dan `data-size`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Spinner',
		component: Spinner,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Ukuran dimensi spinner (sm = 12px, md = 16px, lg = 24px).'
			},
			label: {
				control: 'text',
				description:
					'Label aksesibel yang dibacakan oleh assistive tech. Berikan string kosong "" untuk menyembunyikan jika parent sudah mengumumkan status loading.'
			}
		}
	});
</script>

<Story name="Default" args={{}}>
	{#snippet template(args: SpinnerStoryArgs)}
		<Spinner {...args} class="text-foreground-subtle" />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-cozy text-foreground-subtle">
		<Spinner size="sm" />
		<Spinner size="md" />
		<Spinner size="lg" />
	</div>
</Story>

<Story name="Custom label" args={{ label: 'Saving changes' }}>
	{#snippet template(args: SpinnerStoryArgs)}
		<Spinner {...args} class="text-foreground-subtle" />
	{/snippet}
</Story>

<Story name="Custom icon snippet" asChild>
	<div class="flex items-center gap-cozy text-primary">
		<Spinner size="md">
			{#snippet icon()}
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-5 animate-spin text-primary"
					aria-hidden="true"
				>
					<path
						d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
					/>
				</svg>
			{/snippet}
		</Spinner>
		<span class="text-xs font-medium text-foreground-soft">Custom radial ray icon</span>
	</div>
</Story>

<Story name="Custom sub-parts styling" asChild>
	<div class="flex items-center gap-2">
		<Spinner
			size="md"
			classes={{
				root: 'rounded-full bg-primary/10 p-1',
				icon: 'text-primary'
			}}
		/>
		<span class="text-xs text-foreground-soft">Padded background badge</span>
	</div>
</Story>

<Story name="Inside a button (aria-busy already announces it)" asChild>
	<button
		type="button"
		disabled
		aria-busy="true"
		class="inline-flex h-10 cursor-not-allowed items-center gap-tight rounded-md bg-primary px-control-x text-sm font-medium text-primary-foreground opacity-50"
	>
		<Spinner label="" size="sm" />
		Saving…
	</button>
</Story>
