<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Radio from './Radio.svelte';
	import Label from '../label/Label.svelte';
	import type { RadioProps } from './Radio.types.js';

	type RadioStoryArgs = Pick<
		RadioProps,
		'value' | 'size' | 'disabled' | 'invalid' | 'group' | 'checked' | 'label' | 'description'
	>;

	const componentDescription = [
		'Komponen input radio interaktif dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas form WAI-ARIA, feedback visual state (checked, unchecked), serta arsitektur semi-headless yang fleksibel.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **State via Data Attributes**: Mengekspos `data-state="checked|unchecked"`, `data-slot="radio"`, `data-checked`, `data-disabled`, `data-invalid`, dan `data-size` langsung pada wrapper root `<span>`. Memungkinkan styling berbasis CSS selector (`[data-state="checked"]`) pada container/kartu tanpa coupling ke class internal.',
		'- **Akses DOM Ref Ganda (`ref`, `rootRef`, `fieldRef`)**: Mendukung binding `ref = $bindable(null)` ke native `<input>`, `rootRef = $bindable(null)` ke wrapper `<span>`, serta `fieldRef = $bindable(null)` ke field container `<div>`.',
		'- **Snippet Kustom `indicator`**: Menyediakan snippet opsional `indicator({ checked })` sehingga konsumen bebas mengganti dot bawaan dengan icon (seperti Lucide icon, dot custom, dsb.).',
		'- **Label & Deskripsi Terintegrasi**: Mendukung prop `label` dan `description` (string atau snippet). Menghubungkan `<input>` dan `<Label>` secara otomatis via ID stabil (`$props.id()`), dengan kebebasan kustomisasi styling via `classes.label` dan `classes.description`.',
		'- **Styling Sub-bagian (`classes`)**: Mendukung kustomisasi class terstruktur via `classes.input`, `classes.indicator`, `classes.dot`, `classes.field`, `classes.label`, `classes.labelWrapper`, dan `classes.description`.',
		'- **3 Pilihan Ukuran Kepadatan (`size`)**: `sm` (size-4), `md` (size-5, default), dan `lg` (size-6).'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Radio',
		component: Radio,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		args: { value: 'option', 'aria-label': 'Option' },
		argTypes: {
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Ukuran kontrol radio.'
			},
			value: {
				control: 'text',
				description: 'Nilai dari radio button ini.'
			},
			group: {
				control: 'text',
				description: 'Nilai terpilih dalam radio group (bindable).'
			},
			checked: {
				control: 'boolean',
				description: 'Status terpilih mandiri (jika tanpa group).'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan interaksi pada radio button.'
			},
			invalid: {
				control: 'boolean',
				description: 'Menandai status validasi form error pada input.'
			},
			label: {
				control: 'text',
				description: 'Label terintegrasi untuk radio.'
			},
			description: {
				control: 'text',
				description: 'Deskripsi tambahan di bawah label.'
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: RadioStoryArgs)}
		<Radio {...args} />
	{/snippet}
</Story>

<Story name="Checked" args={{ value: 'option', group: 'option' }}>
	{#snippet template(args: RadioStoryArgs)}
		<Radio {...args} />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-4">
		<Radio size="sm" value="sm" group="sm" aria-label="Small" />
		<Radio size="md" value="md" group="md" aria-label="Medium" />
		<Radio size="lg" value="lg" group="lg" aria-label="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true }}>
	{#snippet template(args: RadioStoryArgs)}
		<Radio {...args} />
	{/snippet}
</Story>

<Story name="Disabled" asChild>
	<div class="flex items-center gap-4">
		<Radio value="off" disabled aria-label="Disabled" />
		<Radio value="on" group="on" disabled aria-label="Disabled and checked" />
	</div>
</Story>

<Story name="With a label" asChild>
	<div class="flex items-center gap-2">
		<Radio id="radio-free" name="plan" value="free" />
		<Label for="radio-free">Free</Label>
	</div>
</Story>

<Story name="Integrated Label & Description" asChild>
	<div class="flex flex-col gap-4">
		<Radio
			name="tier"
			value="starter"
			group="starter"
			label="Starter Plan"
			description="Cocok untuk proyek perorangan dan eksperimen kecil."
		/>
		<Radio
			name="tier"
			value="pro"
			label="Pro Plan"
			description="Fitur kolaborasi tanpa batas dan analitik mendalam."
		/>
		<Radio
			name="tier"
			value="enterprise"
			label="Enterprise"
			description="Dukungan SLA 24/7 dan dedicated cloud server."
		/>
	</div>
</Story>

<Story name="Custom Label Styling" asChild>
	<div class="flex flex-col gap-3">
		<Radio
			name="priority"
			value="high"
			group="high"
			label="Prioritas Tinggi"
			classes={{
				label: 'text-xs font-semibold uppercase tracking-wider text-primary cursor-pointer'
			}}
		/>
		<Radio
			name="priority"
			value="normal"
			label="Prioritas Normal"
			description="Akan diproses sesuai antrean reguler"
			classes={{
				label: 'text-sm italic text-foreground-soft font-normal',
				description: 'text-xs text-foreground-muted'
			}}
		/>
	</div>
</Story>

<Story name="Custom Indicator" asChild>
	<div class="flex items-center gap-6">
		<Radio
			name="custom-dot"
			value="teal"
			group="teal"
			label="Teal indicator dot"
			classes={{ indicator: 'text-teal-500' }}
		>
			{#snippet indicator({ checked })}
				{#if checked}
					<span class="size-2 rounded-full bg-teal-500"></span>
				{/if}
			{/snippet}
		</Radio>
		<Radio
			name="custom-dot"
			value="square"
			group="square"
			label="Square inner dot"
			classes={{ indicator: 'text-primary' }}
		>
			{#snippet indicator({ checked })}
				{#if checked}
					<span class="size-2 rounded-xs bg-primary"></span>
				{/if}
			{/snippet}
		</Radio>
	</div>
</Story>

<Story name="Group" asChild>
	<fieldset class="flex flex-col gap-3">
		<legend class="text-sm font-medium text-foreground">Paket Langganan</legend>
		<p class="-mt-1.5 text-xs text-foreground-muted">
			Pilih paket yang paling sesuai dengan kebutuhan tim.
		</p>
		<div class="flex flex-col gap-2.5 pt-1">
			<Radio
				id="plan-free"
				name="plan"
				value="free"
				label="Free Plan"
				description="Akses fitur dasar selamanya tanpa kartu kredit."
			/>
			<Radio
				id="plan-pro"
				name="plan"
				value="pro"
				group="pro"
				label="Pro Plan ($19/bln)"
				description="Fitur lengkap untuk tim berkembang dan startup."
			/>
			<Radio
				id="plan-enterprise"
				name="plan"
				value="enterprise"
				label="Enterprise Plan"
				description="Keamanan kustom, audit log, dan dukungan prioritas."
			/>
		</div>
	</fieldset>
</Story>
