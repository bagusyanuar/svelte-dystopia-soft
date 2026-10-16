<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Checkbox from './Checkbox.svelte';
	import Label from '../label/Label.svelte';
	import type { CheckboxProps } from './Checkbox.types.js';

	type CheckboxStoryArgs = Pick<
		CheckboxProps,
		'size' | 'checked' | 'indeterminate' | 'disabled' | 'invalid'
	>;

	const componentDescription = [
		'Komponen input checkbox interaktif dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas form WAI-ARIA, feedback visual state (checked, unchecked, indeterminate), serta arsitektur semi-headless yang fleksibel.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Tiga State Visual**: Mendukung status `checked`, `unchecked`, serta `indeterminate` (mixed state, cocok untuk parent checkbox hierarkis).',
		'- **State via Data Attributes**: Mengekspos `data-state="checked|unchecked|indeterminate"`, `data-slot="checkbox"`, `data-checked`, `data-indeterminate`, `data-disabled`, `data-invalid`, dan `data-size` langsung pada wrapper root `<span>`. Ini memungkinkan styling berbasis CSS selector (`[data-state="checked"]`) tanpa coupling ke class internal.',
		'- **Akses DOM Ref Ganda (`ref` & `rootRef`)**: Mendukung binding `ref = $bindable(null)` ke elemen native `<input>` untuk manipulasi form, serta `rootRef = $bindable(null)` ke node pembungkus `<span>` untuk layout / positioning.',
		'- **Snippet Kustom `indicator`**: Menyediakan snippet opsional `indicator({ checked, indeterminate })` sehingga konsumen bebas mengganti ikon checkmark dan minus bawaan dengan icon kustom (seperti Lucide icon, dot status, dsb.).',
		'- **Label & Deskripsi Terintegrasi**: Mendukung prop `label` dan `description` (string atau snippet). Menghubungkan `<input>` dan `<Label>` secara otomatis via ID stabil (`$props.id()`), dengan kebebasan penuh kustomisasi styling via `classes.label` dan `classes.description`.',
		'- **Styling Sub-bagian (`classes`)**: Mendukung kustomisasi class terstruktur via `classes.input`, `classes.indicator`, `classes.icon`, `classes.label`, `classes.description`, dan `classes.field`.',
		'- **3 Pilihan Ukuran Kepadatan (`size`)**: `sm` (size-4), `md` (size-5, default), dan `lg` (size-6).'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Checkbox',
		component: Checkbox,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		args: { 'aria-label': 'Accept terms' },
		argTypes: {
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Ukuran kontrol checkbox.'
			},
			checked: {
				control: 'boolean',
				description: 'Status centang checkbox (bindable).'
			},
			indeterminate: {
				control: 'boolean',
				description: 'Status parsial/mixed state checkbox (bindable).'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan interaksi pada checkbox.'
			},
			invalid: {
				control: 'boolean',
				description: 'Menandai status validasi form error pada input.'
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Checked" args={{ checked: true }}>
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Indeterminate" args={{ indeterminate: true }}>
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-3">
		<Checkbox size="sm" checked aria-label="Small" />
		<Checkbox size="md" checked aria-label="Medium" />
		<Checkbox size="lg" checked aria-label="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true }}>
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Disabled" asChild>
	<div class="flex items-center gap-3">
		<Checkbox disabled aria-label="Disabled" />
		<Checkbox disabled checked aria-label="Disabled and checked" />
		<Checkbox disabled indeterminate aria-label="Disabled and indeterminate" />
	</div>
</Story>

<Story name="With a label" asChild>
	<div class="flex items-center gap-2">
		<Checkbox id="checkbox-terms" />
		<Label for="checkbox-terms">Accept terms and conditions</Label>
	</div>
</Story>

<Story name="Integrated Label" asChild>
	<div class="flex flex-col gap-4">
		<Checkbox label="Ingat saya di perangkat ini" />
		<Checkbox
			label="Dapatkan notifikasi pembaruan produk"
			description="Kami hanya akan mengirimkan email ringkasan maksimal 1 kali seminggu."
			checked
		/>
	</div>
</Story>

<Story name="Custom Label Styling" asChild>
	<div class="flex flex-col gap-3">
		<Checkbox
			label="Opsi prioritas dengan label custom (tebal & warna)"
			classes={{
				label: 'text-xs font-semibold uppercase tracking-wider text-primary cursor-pointer'
			}}
			checked
		/>
		<Checkbox
			label="Label dengan font muted dan italic"
			description="Penjelasan tambahan dengan styling custom"
			classes={{
				label: 'text-sm italic text-foreground-soft font-normal',
				description: 'text-xs text-primary/70'
			}}
		/>
	</div>
</Story>

<Story name="Custom Indicator" asChild>
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2">
			<Checkbox id="custom-check" checked>
				{#snippet indicator({ checked: c, indeterminate: ind })}
					<span class="text-xs font-bold leading-none select-none">
						{ind ? '—' : c ? '✓' : ''}
					</span>
				{/snippet}
			</Checkbox>
			<Label for="custom-check">Text glyph indicator</Label>
		</div>
		<div class="flex items-center gap-2">
			<Checkbox id="custom-dot" checked classes={{ indicator: 'text-white' }}>
				{#snippet indicator({ checked: c, indeterminate: ind })}
					{#if ind}
						<span class="size-1.5 rounded-xs bg-current"></span>
					{:else if c}
						<span class="size-2 rounded-full bg-current"></span>
					{/if}
				{/snippet}
			</Checkbox>
			<Label for="custom-dot">Dot status indicator</Label>
		</div>
	</div>
</Story>

<Story name="Vertical Group" asChild>
	<fieldset class="flex flex-col gap-3">
		<legend class="text-sm font-medium text-foreground">Keahlian & Minat</legend>
		<p class="-mt-1.5 text-xs text-foreground-muted">Pilih bidang keahlian yang sesuai dengan peran Anda.</p>
		<div class="flex flex-col gap-2.5 pt-1">
			<div class="flex items-center gap-2">
				<Checkbox id="skill-design" checked />
				<Label for="skill-design">Product Design & UI/UX</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="skill-frontend" checked />
				<Label for="skill-frontend">Frontend Engineering (Svelte / Tailwind)</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="skill-backend" />
				<Label for="skill-backend">Backend Systems & API</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="skill-devops" />
				<Label for="skill-devops">Cloud Infrastructure & DevOps</Label>
			</div>
		</div>
	</fieldset>
</Story>

<Story name="Horizontal Group" asChild>
	<fieldset class="flex flex-col gap-3">
		<legend class="text-sm font-medium text-foreground">Hari Kerja Tersedia</legend>
		<p class="-mt-1.5 text-xs text-foreground-muted">Pilih hari kerja aktif untuk jadwal mingguan.</p>
		<div class="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
			<div class="flex items-center gap-2">
				<Checkbox id="day-senin" checked />
				<Label for="day-senin">Senin</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="day-selasa" checked />
				<Label for="day-selasa">Selasa</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="day-rabu" checked />
				<Label for="day-rabu">Rabu</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="day-kamis" checked />
				<Label for="day-kamis">Kamis</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="day-jumat" checked />
				<Label for="day-jumat">Jumat</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="day-sabtu" />
				<Label for="day-sabtu">Sabtu</Label>
			</div>
		</div>
	</fieldset>
</Story>

<Story name="Nested Group" asChild>
	<fieldset class="flex flex-col gap-3">
		<legend class="mb-2 text-sm font-medium text-foreground-soft">Notifications</legend>
		<div class="flex items-center gap-2">
			<Checkbox id="notify-all" indeterminate />
			<Label for="notify-all">Everything</Label>
		</div>
		<div class="ml-6 flex items-center gap-2">
			<Checkbox id="notify-mentions" checked />
			<Label for="notify-mentions">Mentions</Label>
		</div>
		<div class="ml-6 flex items-center gap-2">
			<Checkbox id="notify-replies" />
			<Label for="notify-replies">Replies</Label>
		</div>
	</fieldset>
</Story>
