<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Separator from './Separator.svelte';

	const componentDescription = [
		'Komponen garis pemisah visual maupun semantik (Separator) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **WAI-ARIA Compliant**: Mendukung mode visual murni (`decorative={true}`, default) tanpa role eksplisit, dan mode semantik (`decorative={false}`) dengan `role="separator"` dan `aria-orientation`.',
		'- **Orientasi Fleksibel**: Tersedia dalam orientasi `horizontal` (lebar penuh, tinggi 1px) dan `vertical` (tinggi penuh, lebar 1px).',
		'- **DOM Element Reference**: Mendukung `bind:ref` ke elemen root `<div>`.',
		'- **State Hooks via Data-Attributes**: Mengekspos `data-slot="separator"`, `data-orientation="horizontal" | "vertical"`, dan `data-decorative` untuk penataan CSS berbasis selektor.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Separator',
		component: Separator,
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
				control: 'select',
				options: ['horizontal', 'vertical'],
				description: 'Orientasi garis pemisah.'
			},
			decorative: {
				control: 'boolean',
				description:
					'Jika true (default), diperlakukan sebagai elemen dekoratif murni tanpa role pemisah semantik.'
			}
		}
	});
</script>

<Story name="Horizontal" asChild>
	<div class="w-72">
		<div class="text-sm text-foreground-soft">Account</div>
		<div class="my-cozy">
			<Separator />
		</div>
		<div class="text-sm text-foreground-subtle">Manage your account settings.</div>
	</div>
</Story>

<Story name="Vertical" asChild>
	<div class="flex h-6 items-center gap-cozy text-sm text-foreground-soft">
		<span>Blog</span>
		<Separator orientation="vertical" />
		<span>Docs</span>
		<Separator orientation="vertical" />
		<span>Source</span>
	</div>
</Story>

<Story name="Custom styling" asChild>
	<div class="w-72">
		<div class="text-sm text-foreground-soft">Primary colored separator</div>
		<div class="my-cozy">
			<Separator class="bg-primary/50" />
		</div>
	</div>
</Story>

<Story name="Meaningful (not decorative)" asChild>
	<div class="w-72">
		<p class="text-sm text-foreground-subtle">
			Separator with <code>decorative={false}</code> — announced to assistive tech as a section boundary.
		</p>
		<div class="my-cozy">
			<Separator decorative={false} />
		</div>
	</div>
</Story>
