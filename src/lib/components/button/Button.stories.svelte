<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
	import type { ButtonProps } from './Button.types.js';

	type ButtonStoryArgs = Pick<ButtonProps, 'variant' | 'size' | 'disabled' | 'isLoading'>;

	const componentDescription = [
		'Komponen tombol interaktif dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas, visual state feedback, serta arsitektur semi-headless yang fleksibel.',
		'',
		'### Fitur Utama',
		'- **3 Varian Visual**: `default` (latar solid primary teal dengan ambient glow saat dark hover), `outline` (border halus netral), dan `ghost` (transparan bersih untuk secondary actions & toolbars).',
		'- **4 Ukuran Density**: Dari `xs` (24px, ringkas untuk cell tabel / compact row), `sm` (32px), `md` (40px standar), hingga `lg` (48px).',
		'- **Loading State Terintegrasi**: Spinner SVG beranimasi otomatis aktif dengan `aria-busy="true"` dan click prevention. Mendukung indikator loading kustom melalui snippet prop `loading`.',
		'- **Semi-Headless Composition (`child` snippet)**: Pola `asChild` idiomatik Svelte 5 via snippet `child({ props })` untuk me-render link (`<a>`), router links, atau elemen custom tanpa nested wrapper DOM.',
		'- **State via Data Attributes**: Mengekspos `data-loading` dan `data-disabled` langsung di DOM node untuk mempermudah custom selector Tailwind (`data-[loading]`, `data-[disabled]`).',
		'- **Keamanan Form & Aksesibilitas**: Default `type="button"` mencegah form submission yang tidak disengaja, exposure DOM ref via `$bindable(ref)`, serta memenuhi standar kontras warna WCAG dan audit axe-core.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
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
				options: ['default', 'outline', 'ghost'],
				description: 'Varian gaya visual tombol.'
			},
			size: {
				control: 'select',
				options: ['xs', 'sm', 'md', 'lg'],
				description: 'Tingkat kepadatan (density) ukuran tombol.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan interaksi klik dan meredupkan tampilan (opacity 50%).'
			},
			isLoading: {
				control: 'boolean',
				description: 'Menampilkan spinner loading, menandai `aria-busy="true"`, dan menonaktifkan klik.'
			}
		}
	});
</script>

{#snippet plusIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M12 5v14M5 12h14" />
	</svg>
{/snippet}

{#snippet dotsLoading()}
	<span class="flex items-center gap-1" aria-hidden="true">
		<span class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></span>
		<span class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></span>
		<span class="size-1.5 animate-bounce rounded-full bg-current"></span>
	</span>
{/snippet}

<Story
	name="Default"
	args={{ variant: 'default', size: 'md' }}
	parameters={{
		docs: {
			description: {
				story:
					'Varian tombol utama (default) dengan warna solid primary. Saat dark mode, dilengkapi efek ambient glow halus saat kursor diarahkan ke tombol.'
			}
		}
	}}
>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story
	name="Outline"
	args={{ variant: 'outline' }}
	parameters={{
		docs: {
			description: {
				story:
					'Varian border halus netral untuk aksi sekunder atau pelengkap tombol utama.'
			}
		}
	}}
>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story
	name="Ghost"
	args={{ variant: 'ghost' }}
	parameters={{
		docs: {
			description: {
				story:
					'Varian transparan minimalis tanpa border, ideal untuk toolbar aksi atau antarmuka yang bersih.'
			}
		}
	}}
>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story
	name="Sizes"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					'Tersedia dalam 4 ukuran: `xs` (24px, sangat cocok di row tabel), `sm` (32px), `md` (40px standar), dan `lg` (48px).'
			}
		}
	}}
>
	<div class="flex items-center gap-3">
		<Button size="xs">Extra small</Button>
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
	</div>
</Story>

<Story
	name="Disabled"
	args={{ disabled: true }}
	parameters={{
		docs: {
			description: {
				story:
					'State tombol dinonaktifkan dengan cursor not-allowed dan opasitas 50%, mencegah interaksi klik.'
			}
		}
	}}
>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story
	name="Loading"
	args={{ isLoading: true }}
	parameters={{
		docs: {
			description: {
				story:
					'State loading menampilkan spinner SVG bawaan, menandai `aria-busy="true"`, dan otomatis memblokir event klik.'
			}
		}
	}}
>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Save changes</Button>
	{/snippet}
</Story>

<Story
	name="Custom loading indicator"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					'Kustomisasi indikator loading dengan snippet sendiri melalui prop `loading`.'
			}
		}
	}}
>
	<Button isLoading loading={dotsLoading}>Saving</Button>
</Story>

<Story
	name="Icon only"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					'Tombol ikon proporsional (ukuran kotak) dengan padding 0. Wajib menyertakan `aria-label` untuk aksesibilitas.'
			}
		}
	}}
>
	<div class="flex items-center gap-3">
		<Button size="xs" class="size-6 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button size="sm" class="size-8 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button size="md" class="size-10 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button size="lg" class="size-12 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button variant="outline" size="md" class="size-10 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button variant="ghost" size="md" class="size-10 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
	</div>
</Story>

<Story
	name="As link (child snippet)"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					'Komposisi semi-headless menggunakan snippet `child({ props })` (pola `asChild` Svelte 5) untuk me-render tag link `<a>` atau SvelteKit router link dengan styling Button.'
			}
		}
	}}
>
	<div class="flex items-center gap-3">
		<Button variant="default">
			{#snippet child({ props })}
				<a href="#dashboard" {...props}>Dashboard link</a>
			{/snippet}
		</Button>
		<Button variant="outline">
			{#snippet child({ props })}
				<a href="#settings" {...props}>Settings link</a>
			{/snippet}
		</Button>
	</div>
</Story>
