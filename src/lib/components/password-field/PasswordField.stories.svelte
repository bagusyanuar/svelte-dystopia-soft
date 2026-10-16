<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PasswordField from './PasswordField.svelte';
	import Label from '../label/Label.svelte';
	import type { PasswordFieldProps } from './PasswordField.types.js';

	type PasswordFieldStoryArgs = Pick<
		PasswordFieldProps,
		'variant' | 'size' | 'placeholder' | 'disabled' | 'invalid' | 'visible'
	>;

	const componentDescription = [
		'Komponen input kata sandi (Password Field) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Merupakan varian khusus di atas `TextField` dengan tombol toggle visibilitas terintegrasi yang aksesibel.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Multi DOM Refs**: Mendukung `bind:ref` / `bind:inputRef` (elemen input), `bind:containerRef` (wrapper luar), dan `bind:toggleRef` (tombol mata toggle).',
		'- **Customizable Toggle & Icon**: Tombol toggle dan SVG ikon bawaan dapat dikustomisasi class-nya via `classes.toggle` dan `classes.icon`, atau diganti total menggunakan snippet `icon?: Snippet<[{ visible: boolean }]>`.',
		'- **Snippet State Payload**: Snippet `prefix` menerima payload `{ visible, value }` untuk indikator visual status keamanan kata sandi.',
		'- **State via Data-Attributes**: Mengekspos hook `data-slot="password-field"`, `data-visible`, dan `data-state="visible" | "hidden"` pada tombol toggle.',
		'- **Aksesibilitas Teruji**: Tombol toggle mengelola `aria-label` yang berganti status ("Show password" / "Hide password") tanpa konflik `aria-pressed`, serta mendukung lokalisasi via prop `labels`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/PasswordField',
		component: PasswordField,
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
				description: 'Ukuran dimensi input.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan input dan tombol toggle.'
			},
			invalid: {
				control: 'boolean',
				description: 'Menandai status validasi error dengan border warna bahaya.'
			},
			visible: {
				control: 'boolean',
				description: 'Status visibilitas teks kata sandi (revealed vs hidden).'
			}
		}
	});
</script>

{#snippet lockIcon(visible: boolean)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
		class="transition-transform duration-150 {visible
			? 'scale-105 text-primary'
			: 'text-foreground-faint'}"
	>
		{#if visible}
			<rect x="4" y="10" width="16" height="10" rx="2" />
			<path d="M8 10V7a4 4 0 0 1 8 0v0" stroke-linecap="round" />
		{:else}
			<rect x="4" y="10" width="16" height="10" rx="2" />
			<path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
		{/if}
	</svg>
{/snippet}

<Story name="Default" args={{ placeholder: 'Password', 'aria-label': 'Password' }}>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} />
	{/snippet}
</Story>

<Story
	name="Revealed"
	args={{ placeholder: 'Password', visible: true, 'aria-label': 'Revealed password' }}
>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} value="hunter2" />
	{/snippet}
</Story>

<Story
	name="Dynamic prefix lock icon"
	args={{ placeholder: 'Password', 'aria-label': 'Password with dynamic prefix' }}
>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args}>
			{#snippet prefix({ visible })}{@render lockIcon(visible)}{/snippet}
		</PasswordField>
	{/snippet}
</Story>

<Story name="Custom toggle icon snippet" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Label for="custom-icon-field" class="text-xs font-medium text-foreground-muted">
			Custom Toggle Label Snippet (Teks "SHOW" / "HIDE")
		</Label>
		<PasswordField
			id="custom-icon-field"
			placeholder="Ketik password"
			aria-label="Password with text toggle"
			value="MySecret#2026"
		>
			{#snippet icon({ visible })}
				<span
					class="px-1 text-[10px] font-bold tracking-wider text-foreground-subtle hover:text-foreground"
				>
					{visible ? 'HIDE' : 'SHOW'}
				</span>
			{/snippet}
		</PasswordField>
	</div>
</Story>

<Story name="Custom sub-part classes" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Label for="custom-styled-pwd" class="text-xs font-medium text-foreground-muted">
			Custom Sub-part Styling (`classes.toggle` & `classes.input`)
		</Label>
		<PasswordField
			id="custom-styled-pwd"
			placeholder="Ketik password"
			aria-label="Custom styled password"
			value="P@ssw0rd123"
			classes={{
				container: 'bg-surface-subtle/40 border-primary/40',
				input: 'font-mono text-primary font-medium tracking-widest',
				toggle: 'hover:bg-primary/10 hover:text-primary rounded p-1 transition-colors'
			}}
		/>
	</div>
</Story>

<Story
	name="Invalid"
	args={{ placeholder: 'Password', invalid: true, 'aria-label': 'Invalid password' }}
>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} value="short" />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<PasswordField size="sm" placeholder="Small" aria-label="Small password" />
		<PasswordField size="md" placeholder="Medium" aria-label="Medium password" />
		<PasswordField size="lg" placeholder="Large" aria-label="Large password" />
	</div>
</Story>

<Story
	name="Disabled"
	args={{ placeholder: 'Password', disabled: true, 'aria-label': 'Disabled password' }}
>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} value="hunter2" />
	{/snippet}
</Story>
