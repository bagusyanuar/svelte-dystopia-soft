<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MaskedField from './MaskedField.svelte';
	import Label from '../label/Label.svelte';
	import { cn } from '../../utils/cn.js';
	import type { MaskedFieldProps } from './MaskedField.types.js';

	type MaskedFieldStoryArgs = Pick<
		MaskedFieldProps,
		'pattern' | 'variant' | 'size' | 'placeholder' | 'disabled' | 'invalid'
	>;

	const componentDescription = [
		'Komponen input teks bermasker (Masked Field) berbasis `imask` dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memformat digit secara otomatis sesuai pola (nomor telepon, kode pos, nomor KTP/ID, tanggal) tanpa merusak posisi kursor saat mengetik atau menghapus.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Masking Presisi Tinggi**: Menggunakan placeholder `#` untuk digit angka dan menyisipkan karakter pemisah otomatis (kurung, strip, spasi).',
		'- **Two-Way Binding Dual-Value**: Menyediakan `bind:value` untuk teks berformat (cth: `"(021)-123-456"`) dan `bind:unmaskedValue` untuk digit mentah (cth: `"021123456"`).',
		'- **State via Data-Attributes**: Mengekspos hook `data-slot="masked-field"` dan `data-masked=""` pada elemen input.',
		'- **Akses DOM Ref**: Mendukung `bind:ref` dan `bind:inputRef` langsung ke elemen native `<input>`.',
		'- **Snippet State Payload**: Meneruskan `{ value, unmaskedValue }` ke snippet `prefix` dan `suffix` untuk menampilkan status kelengkapan digit atau tombol validasi secara reaktif.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/MaskedField',
		component: MaskedField,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			pattern: {
				control: 'text',
				description: 'Pola format masker dengan simbol # sebagai digit angka.'
			},
			variant: {
				control: 'select',
				options: ['default', 'ghost'],
				description: 'Varian visual container input.'
			},
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Ukuran dimensi input.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan input.'
			},
			invalid: {
				control: 'boolean',
				description: 'Menandai status validasi error dengan border bahaya.'
			}
		}
	});
</script>

{#snippet phoneIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
		class="size-4"
	>
		<path
			d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2Z"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<Story name="Phone number" args={{ pattern: '(##)-###-###', placeholder: '(08)-123-456' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<div class="flex w-72 flex-col gap-1.5">
			<Label for="phone-input">Nomor Telepon</Label>
			<MaskedField {...args} id="phone-input">
				{#snippet prefix()}{@render phoneIcon()}{/snippet}
			</MaskedField>
		</div>
	{/snippet}
</Story>

<Story name="Postal code" args={{ pattern: '#####', placeholder: '40123' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<div class="flex w-72 flex-col gap-1.5">
			<Label for="postal-input">Kode Pos</Label>
			<MaskedField {...args} id="postal-input" />
		</div>
	{/snippet}
</Story>

<Story
	name="KTP / ID number"
	args={{ pattern: '################', placeholder: '3201234567890001' }}
>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<div class="flex w-72 flex-col gap-1.5">
			<Label for="ktp-input">Nomor Induk Kependudukan (NIK)</Label>
			<MaskedField {...args} id="ktp-input" />
		</div>
	{/snippet}
</Story>

<Story name="With initial value" args={{ pattern: '(##)-###-###', placeholder: '(08)-123-456' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<div class="flex w-72 flex-col gap-1.5">
			<Label for="initial-val-input">Nomor Telepon Kantor</Label>
			<MaskedField {...args} id="initial-val-input" value="0211234567" />
		</div>
	{/snippet}
</Story>

<Story name="With reactive status indicator" asChild>
	<div class="flex w-80 flex-col gap-1.5">
		<Label for="reactive-ktp">Nomor KTP (16 Digit)</Label>
		<MaskedField pattern="################" placeholder="3201234567890001" id="reactive-ktp">
			{#snippet suffix({ unmaskedValue })}
				<span
					class={cn(
						'rounded px-1.5 py-0.5 text-[10px] font-semibold',
						unmaskedValue?.length === 16 ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'
					)}
				>
					{unmaskedValue?.length === 16 ? 'Valid 16 digit' : `${unmaskedValue?.length ?? 0}/16`}
				</span>
			{/snippet}
		</MaskedField>
	</div>
</Story>

<Story name="Bounded trailing digits" asChild>
	<div class="flex w-80 flex-col gap-1.5">
		<Label for="bounded-tail">Format 12 Digit + Maks 3 Digit Ekor</Label>
		<MaskedField id="bounded-tail" pattern="####-####-####[###]" placeholder="1234-5678-9012345" />
	</div>
</Story>

<Story name="Dynamic trailing digits" asChild>
	<div class="flex w-80 flex-col gap-1.5">
		<Label for="dynamic-tail">Format 12 Digit + Ekor Dinamis</Label>
		<MaskedField
			id="dynamic-tail"
			pattern="####-####-####[tail]"
			blocks={{ tail: { mask: /^\d*$/ } }}
			placeholder="1234-5678-9012..."
		/>
	</div>
</Story>

<Story name="Repeating chunk every N digits" asChild>
	<div class="flex w-80 flex-col gap-1.5">
		<Label for="repeating-chunk">Kelipatan 4 Digit Dinamis (####-####-...)</Label>
		<MaskedField
			id="repeating-chunk"
			pattern="first[rest]"
			blocks={{
				first: {
					mask: '####',
					definitions: { '#': /\d/ }
				},
				rest: {
					mask: '-####',
					definitions: { '#': /\d/ },
					repeat: Infinity
				}
			}}
			placeholder="1234-5678-9012-3456..."
		/>
	</div>
</Story>

<Story name="Invalid" args={{ pattern: '#####', invalid: true, placeholder: '40123' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<div class="flex w-72 flex-col gap-1.5">
			<Label for="invalid-input">Kode Pos (Salah)</Label>
			<MaskedField {...args} id="invalid-input" value="123" />
		</div>
	{/snippet}
</Story>

<Story
	name="Disabled"
	args={{ pattern: '(##)-###-###', disabled: true, placeholder: '(08)-123-456' }}
>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<div class="flex w-72 flex-col gap-1.5">
			<Label for="disabled-input" disabled>Nomor Telepon Tidak Aktif</Label>
			<MaskedField {...args} id="disabled-input" value="0211234567" />
		</div>
	{/snippet}
</Story>
