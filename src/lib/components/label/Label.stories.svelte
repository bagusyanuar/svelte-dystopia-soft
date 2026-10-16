<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Label from './Label.svelte';
	import TextField from '../text-field/TextField.svelte';
	import PasswordField from '../password-field/PasswordField.svelte';
	import type { LabelProps } from './Label.types.js';

	type LabelStoryArgs = Pick<LabelProps, 'required' | 'disabled'>;

	const componentDescription = [
		'Komponen label form (Label) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Aksesibilitas Form Bersih**: Terhubung langsung ke kontrol input melalui atribut `for`. Indikator bintang wajib disembunyikan dari pembaca layar (`aria-hidden="true"`) untuk menghindari pengumuman ganda (misal: "Email bintang wajib diisi").',
		'- **State via Data-Attributes**: Mengekspos hook `data-slot="label"`, `data-slot="label-required"`, `data-required`, dan `data-disabled` untuk penataan gaya berbasis status.',
		'- **Akses DOM Ref**: Mendukung binding `ref = $bindable(null)` ke elemen root `<label>`.',
		'- **Snippet Modular & State Payload**: Snippet `children` menerima payload `{ required, disabled }`, serta menyediakan snippet opsional `requiredIndicator` untuk mengganti tanda bintang default dengan teks atau badge kustom.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Label',
		component: Label,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			required: {
				control: 'boolean',
				description: 'Menandai field sebagai wajib dan menampilkan indikator required.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menerapkan gaya visual nonaktif dan pointer tidak aktif.'
			},
			class: {
				control: 'text',
				description: 'Class override untuk elemen root <label>.'
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: LabelStoryArgs)}
		<Label {...args}>Email</Label>
	{/snippet}
</Story>

<Story name="Required" args={{ required: true }}>
	{#snippet template(args: LabelStoryArgs)}
		<Label {...args}>Email</Label>
	{/snippet}
</Story>

<!--
  color-contrast is switched off for this story only. WCAG 1.4.3 exempts text
  that is part of an inactive control, which is exactly what `disabled` renders
  — but axe can't tell, because a <label> has no programmatic disabled state to
  read. Don't copy this exception onto a story that isn't a disabled state.
-->
<Story
	name="Disabled"
	args={{ disabled: true }}
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
	{#snippet template(args: LabelStoryArgs)}
		<Label {...args}>Email</Label>
	{/snippet}
</Story>

<Story name="With custom required indicator">
	<div class="flex w-72 flex-col gap-3">
		<Label for="custom-username" required>
			Nama Pengguna
			{#snippet requiredIndicator()}
				<span class="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
					Wajib
				</span>
			{/snippet}
		</Label>
		<TextField id="custom-username" placeholder="cth. pengguna_baru" />
	</div>
</Story>

<Story name="With state payload" args={{ required: true, disabled: false }}>
	{#snippet template(args: LabelStoryArgs)}
		<div class="flex w-72 flex-col gap-1.5">
			<Label {...args} for="payload-field">
				{#snippet children({ required, disabled })}
					<span>Kata Sandi Baru</span>
					<span class="text-xs text-foreground-subtle">
						{disabled ? '(Terkunci)' : required ? '(Diperlukan)' : '(Opsional)'}
					</span>
				{/snippet}
			</Label>
			<TextField
				id="payload-field"
				type="password"
				placeholder="••••••••"
				disabled={args.disabled}
			/>
		</div>
	{/snippet}
</Story>

<Story name="With a field" asChild>
	<div class="flex w-72 flex-col gap-1.5">
		<Label for="email-field" required>Email</Label>
		<TextField id="email-field" type="email" placeholder="you@company.com" required />
	</div>
</Story>

<Story name="Form" asChild>
	<div class="flex w-72 flex-col gap-4">
		<div class="flex flex-col gap-1.5">
			<Label for="form-email" required>Email</Label>
			<TextField id="form-email" type="email" placeholder="you@company.com" required />
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="form-password" required>Password</Label>
			<PasswordField id="form-password" placeholder="••••••••" required />
		</div>
	</div>
</Story>
