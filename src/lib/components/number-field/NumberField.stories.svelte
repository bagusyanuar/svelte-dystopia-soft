<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NumberField from './NumberField.svelte';
	import Label from '../label/Label.svelte';
	import type { NumberFieldProps } from './NumberField.types.js';

	type NumberFieldStoryArgs = Pick<
		NumberFieldProps,
		| 'variant'
		| 'size'
		| 'placeholder'
		| 'disabled'
		| 'invalid'
		| 'hideSpinner'
		| 'thousandSeparator'
		| 'min'
		| 'max'
		| 'step'
	>;

	const componentDescription = [
		'Komponen input angka (Number Field) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Mendukung mode input angka native (`type="number"`) maupun mode pemformatan ribuan dan desimal gaya Indonesia (`thousandSeparator: true` -> `.` untuk ribuan dan `,` untuk pecahan).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Dual-Mode Number Input**: Mode native number dengan opsi menyembunyikan spinner tombol panah (`hideSpinner`), serta mode formatted input (`thousandSeparator`) dengan `inputmode="decimal"`.',
		'- **Two-Way Binding**: Menyediakan `bind:value` yang menyimpan nilai numerik murni (`number | undefined`).',
		'- **Akses DOM Ref**: Mendukung `bind:ref` dan alias `bind:inputRef` langsung ke elemen `<input>`.',
		'- **Snippet State Payload**: Meneruskan `{ value, displayValue }` ke snippet `prefix` dan `suffix` untuk membuat indikator dinamis atau badge status.',
		'- **State via Data-Attributes**: Mengekspos hook `data-slot="number-field"`, `data-thousand-separator`, dan `data-has-value` pada elemen input.',
		'- **Granular Styling**: Sub-bagian dapat dikustomisasi via prop `classes: { input?: string; prefix?: string; suffix?: string }`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/NumberField',
		component: NumberField,
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
				options: ['default', 'ghost'],
				description: 'Varian visual container input.'
			},
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Ukuran dimensi kontrol input.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan interaksi pada input.'
			},
			invalid: {
				control: 'boolean',
				description: 'Menandai status validasi error dengan border warna bahaya.'
			},
			hideSpinner: {
				control: 'boolean',
				description: 'Menyembunyikan tombol spinner panah naik/turun bawaan browser.'
			},
			thousandSeparator: {
				control: 'boolean',
				description:
					'Mengaktifkan pemformatan ribuan dan desimal gaya Indonesia (cth: 1.234.567,89) secara interaktif saat mengetik.'
			},
			min: {
				control: 'number',
				description: 'Nilai minimum (berlaku pada mode native number).'
			},
			max: {
				control: 'number',
				description: 'Nilai maksimum (berlaku pada mode native number).'
			},
			step: {
				control: 'number',
				description: 'Kelipatan penambahan/pengurangan nilai.'
			}
		}
	});
</script>

<Story name="Default" args={{ placeholder: 'Quantity', 'aria-label': 'Quantity' }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} />
	{/snippet}
</Story>

<Story
	name="With initial value"
	args={{ placeholder: 'Quantity', 'aria-label': 'Initial quantity' }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={42} />
	{/snippet}
</Story>

<Story
	name="Min, max and step"
	args={{ placeholder: '0-100', 'aria-label': 'Percentage', min: 0, max: 100, step: 5 }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={10} />
	{/snippet}
</Story>

<Story
	name="Spinner visible"
	args={{ placeholder: 'Quantity', 'aria-label': 'Item quantity', hideSpinner: false }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1} />
	{/snippet}
</Story>

<Story
	name="Thousand separator"
	args={{ placeholder: 'Amount', 'aria-label': 'Formatted amount', thousandSeparator: true }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1234567.89} />
	{/snippet}
</Story>

<Story
	name="Currency (IDR)"
	args={{ placeholder: '0', 'aria-label': 'Rupiah amount', thousandSeparator: true }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1500000}>
			{#snippet prefix()}<span class="text-sm font-medium text-foreground-subtle">Rp</span
				>{/snippet}
		</NumberField>
	{/snippet}
</Story>

<Story
	name="Currency (USD)"
	args={{ placeholder: '0.00', 'aria-label': 'USD amount', thousandSeparator: true }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1999.99}>
			{#snippet prefix()}<span class="text-sm font-medium text-foreground-subtle">$</span>{/snippet}
		</NumberField>
	{/snippet}
</Story>

<Story name="Snippet payload (dynamic status)" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Label for="balance-field" class="text-xs font-medium text-foreground-muted">
			Saldo Rekening (dinamis positif / negatif)
		</Label>
		<NumberField
			id="balance-field"
			thousandSeparator={true}
			value={-250000}
			placeholder="0"
			aria-label="Saldo rekening"
		>
			{#snippet prefix({ value })}
				<span
					class="rounded px-1.5 py-0.5 text-xs font-semibold {value !== undefined && value < 0
						? 'bg-danger/10 text-danger'
						: 'bg-success/10 text-success'}"
				>
					{value !== undefined && value < 0 ? 'DEFISIT' : 'SURPLUS'}
				</span>
			{/snippet}
			{#snippet suffix({ value })}
				<span class="text-xs font-medium text-foreground-muted">
					{value !== undefined ? 'IDR' : ''}
				</span>
			{/snippet}
		</NumberField>
	</div>
</Story>

<Story name="Custom sub-part classes" asChild>
	<div class="flex w-72 flex-col gap-2">
		<Label for="custom-styled" class="text-xs font-medium text-foreground-muted">
			Custom Sub-part Styling
		</Label>
		<NumberField
			id="custom-styled"
			value={75}
			thousandSeparator={true}
			placeholder="0"
			aria-label="Custom styled number"
			classes={{
				input: 'font-mono text-primary font-semibold tracking-wider',
				prefix: 'text-foreground-muted font-mono text-sm'
			}}
		>
			{#snippet prefix()}#IDX:{/snippet}
		</NumberField>
	</div>
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<NumberField size="sm" placeholder="Small" aria-label="Small size" />
		<NumberField size="md" placeholder="Medium" aria-label="Medium size" />
		<NumberField size="lg" placeholder="Large" aria-label="Large size" />
	</div>
</Story>

<Story
	name="Invalid"
	args={{ invalid: true, placeholder: 'Quantity', 'aria-label': 'Invalid quantity' }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={-5} />
	{/snippet}
</Story>

<Story
	name="Disabled"
	args={{ disabled: true, placeholder: 'Quantity', 'aria-label': 'Disabled quantity' }}
>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={10} />
	{/snippet}
</Story>
