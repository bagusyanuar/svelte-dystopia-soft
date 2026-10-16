<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TextField from './TextField.svelte';
	import Label from '../label/Label.svelte';
	import type { TextFieldProps } from './TextField.types.js';

	type TextFieldStoryArgs = Pick<
		TextFieldProps,
		'variant' | 'size' | 'placeholder' | 'disabled' | 'invalid'
	>;

	const componentDescription = [
		'Komponen input teks tunggal (Text Field) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Merupakan pondasi bagi varian input khusus seperti `PasswordField`, `NumberField`, dan `MaskedField`.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Dual DOM Refs**: Mendukung `bind:ref` / `bind:inputRef` (ke elemen native `<input>`) dan `bind:containerRef` (ke elemen pembungkus terluar `<div>`).',
		'- **Granular Styling (`classes`)**: Mendukung sub-part class overrides terstruktur untuk `container`, `input`, `prefix`, dan `suffix`.',
		'- **Snippet State Payload**: Meneruskan `{ value }` secara reaktif ke snippet `prefix` dan `suffix` untuk komponen interaktif dinamis seperti tombol clear atau penghitung karakter.',
		'- **State via Data-Attributes**: Mengekspos hook `data-slot="text-field"`, `data-slot="text-field-input"`, `data-disabled`, `data-invalid`, dan `data-has-value`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/TextField',
		component: TextField,
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
				description: 'Menonaktifkan interaksi pada input.'
			},
			invalid: {
				control: 'boolean',
				description: 'Menandai status validasi error dengan border warna bahaya.'
			}
		}
	});
</script>

{#snippet searchIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet mailIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="m3 7 9 6 9-6" stroke-linecap="round" />
	</svg>
{/snippet}

<Story name="Default" args={{ placeholder: 'Type something…', 'aria-label': 'Default text field' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args} />
	{/snippet}
</Story>

<Story name="Prefix icon" args={{ placeholder: 'Search…', 'aria-label': 'Search with prefix' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet prefix()}{@render searchIcon()}{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story
	name="Suffix icon"
	args={{ placeholder: 'you@company.com', 'aria-label': 'Email with suffix' }}
>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet suffix()}{@render mailIcon()}{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story
	name="Prefix and suffix"
	args={{ placeholder: 'Search…', 'aria-label': 'Search with shortcut' }}
>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet prefix()}{@render searchIcon()}{/snippet}
			{#snippet suffix()}<kbd class="text-xs text-foreground-muted">⌘K</kbd>{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story
	name="Ghost"
	args={{ variant: 'ghost', placeholder: 'Search…', 'aria-label': 'Ghost search' }}
>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet prefix()}{@render searchIcon()}{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story name="Snippet payload (counter & clear)" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Label for="interactive-field" class="text-xs font-medium text-foreground-muted">
			Interactive Suffix (Character Counter & Clear)
		</Label>
		<TextField
			id="interactive-field"
			placeholder="Ketik teks..."
			aria-label="Interactive field"
			value="Contoh teks"
		>
			{#snippet suffix({ value })}
				<div class="flex items-center gap-1.5">
					<span class="text-xs text-foreground-muted tabular-nums">
						{value.length}/50
					</span>
					{#if value.length > 0}
						<button
							type="button"
							class="cursor-pointer text-xs font-semibold text-foreground-muted hover:text-foreground"
							onclick={() => {
								// Akses reset
								const input = document.getElementById('interactive-field') as HTMLInputElement;
								if (input) {
									input.value = '';
									input.dispatchEvent(new Event('input', { bubbles: true }));
								}
							}}
						>
							✕
						</button>
					{/if}
				</div>
			{/snippet}
		</TextField>
	</div>
</Story>

<Story name="Custom sub-parts styling" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Label for="custom-styled" class="text-xs font-medium text-foreground-muted">
			Custom Sub-parts (`classes.container` & `classes.input`)
		</Label>
		<TextField
			id="custom-styled"
			placeholder="domain-name"
			aria-label="Custom styled domain field"
			classes={{
				container:
					'bg-surface-subtle/50 border-primary/40 focus-within:ring-2 focus-within:ring-primary/30',
				input: 'font-mono text-primary font-medium tracking-wide',
				suffix: 'font-mono text-xs text-foreground-muted'
			}}
		>
			{#snippet suffix()}.company.internal{/snippet}
		</TextField>
	</div>
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<TextField size="sm" placeholder="Small" aria-label="Small field" />
		<TextField size="md" placeholder="Medium" aria-label="Medium field" />
		<TextField size="lg" placeholder="Large" aria-label="Large field" />
	</div>
</Story>

<Story
	name="Invalid"
	args={{ invalid: true, placeholder: 'you@company.com', 'aria-label': 'Invalid email' }}
>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args} />
	{/snippet}
</Story>

<Story
	name="Disabled"
	args={{ disabled: true, placeholder: 'Disabled', 'aria-label': 'Disabled field' }}
>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args} />
	{/snippet}
</Story>
