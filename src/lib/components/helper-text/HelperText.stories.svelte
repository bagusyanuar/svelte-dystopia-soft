<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HelperText from './HelperText.svelte';
	import Label from '../label/Label.svelte';
	import TextField from '../text-field/TextField.svelte';
	import type { HelperTextProps } from './HelperText.types.js';

	type HelperTextStoryArgs = Pick<HelperTextProps, 'invalid'>;

	const componentDescription = [
		'Komponen teks bantuan dan pesan kesalahan form (Helper Text) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Aksesibilitas ARIA Bawaan**: Secara otomatis menetapkan `role="alert"` ketika `invalid: true` agar pesan kesalahan segera diumumkan oleh screen reader.',
		'- **Integrasi Form (`aria-describedby`)**: Berfungsi sebagai target deskripsi field input form ketika dihubungkan melalui `id`.',
		'- **Hook Data-Slot & Data-Attributes**: Mengekspos hook `data-slot="helper-text"`, `data-slot="helper-text-icon"`, serta `data-invalid` untuk kemudahan styling CSS berbasis state.',
		'- **Akses DOM Ref**: Mendukung binding `ref = $bindable(null)` ke elemen root `<p>`.',
		'- **Snippet Modular & State Payload**: Mendukung snippet opsional `icon` dan `children` yang menerima payload `{ invalid }` untuk rendering dinamis.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/HelperText',
		component: HelperText,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			invalid: {
				control: 'boolean',
				description: 'Mengubah status visual ke mode bahaya/error dan mengaktifkan role="alert".'
			},
			class: {
				control: 'text',
				description: 'Class override untuk elemen root <p>.'
			}
		}
	});
</script>

{#snippet infoIcon()}
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
		<path
			fill-rule="evenodd"
			d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.25 7a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0V7Z"
			clip-rule="evenodd"
		/>
	</svg>
{/snippet}

{#snippet alertIcon()}
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
		<path
			fill-rule="evenodd"
			d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 6.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
			clip-rule="evenodd"
		/>
	</svg>
{/snippet}

<Story name="Default">
	{#snippet template(args: HelperTextStoryArgs)}
		<HelperText {...args}
			>Kami tidak akan pernah membagikan email Anda kepada pihak lain.</HelperText
		>
	{/snippet}
</Story>

<Story name="Error" args={{ invalid: true }}>
	{#snippet template(args: HelperTextStoryArgs)}
		<HelperText {...args}>Format alamat email tidak valid.</HelperText>
	{/snippet}
</Story>

<Story name="With icon">
	<div class="flex flex-col gap-3">
		<HelperText>
			{#snippet icon()}
				{@render infoIcon()}
			{/snippet}
			Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
		</HelperText>

		<HelperText invalid>
			{#snippet icon()}
				{@render alertIcon()}
			{/snippet}
			Kata sandi harus menyertakan setidaknya satu karakter khusus.
		</HelperText>
	</div>
</Story>

<Story name="With state payload" args={{ invalid: false }}>
	{#snippet template(args: HelperTextStoryArgs)}
		<HelperText {...args}>
			{#snippet icon({ invalid })}
				{#if invalid}
					{@render alertIcon()}
				{:else}
					{@render infoIcon()}
				{/if}
			{/snippet}
			{#snippet children({ invalid })}
				<span>
					{invalid
						? 'Terjadi kesalahan pada input data Anda.'
						: 'Data ini bersifat opsional dan dapat diubah nanti.'}
				</span>
			{/snippet}
		</HelperText>
	{/snippet}
</Story>

<Story name="With a field" asChild>
	<div class="flex w-72 flex-col gap-1.5">
		<Label for="helper-email">Email</Label>
		<TextField id="helper-email" type="email" placeholder="nama@perusahaan.com" />
		<HelperText id="helper-email-hint">
			{#snippet icon()}
				{@render infoIcon()}
			{/snippet}
			Kami tidak akan pernah membagikan email Anda.
		</HelperText>
	</div>
</Story>

<Story name="With a field error" asChild>
	<div class="flex w-72 flex-col gap-1.5">
		<Label for="helper-email-invalid">Email</Label>
		<TextField
			id="helper-email-invalid"
			type="email"
			invalid
			aria-describedby="helper-email-invalid-error"
			placeholder="nama@perusahaan.com"
			value="bukan-email-valid"
		/>
		<HelperText id="helper-email-invalid-error" invalid>
			{#snippet icon()}
				{@render alertIcon()}
			{/snippet}
			Masukkan alamat email yang valid.
		</HelperText>
	</div>
</Story>
