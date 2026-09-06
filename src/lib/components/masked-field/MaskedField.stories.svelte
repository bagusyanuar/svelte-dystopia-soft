<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MaskedField from './MaskedField.svelte';
	import type { MaskedFieldProps } from './MaskedField.types.js';

	type MaskedFieldStoryArgs = Pick<
		MaskedFieldProps,
		'pattern' | 'variant' | 'size' | 'placeholder' | 'disabled' | 'invalid'
	>;

	const { Story } = defineMeta({
		title: 'Components/MaskedField',
		component: MaskedField,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' }
		}
	});
</script>

{#snippet phoneIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path
			d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2Z"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<Story name="Phone number" args={{ pattern: '(##)-###-###', placeholder: '(08)-123-456' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<MaskedField {...args}>
			{#snippet prefix()}{@render phoneIcon()}{/snippet}
		</MaskedField>
	{/snippet}
</Story>

<Story name="Postal code" args={{ pattern: '#####', placeholder: '40123' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<MaskedField {...args} />
	{/snippet}
</Story>

<Story
	name="KTP / ID number"
	args={{ pattern: '################', placeholder: '3201234567890001' }}
>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<MaskedField {...args} />
	{/snippet}
</Story>

<Story name="With initial value" args={{ pattern: '(##)-###-###' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<MaskedField {...args} value="0211234567" />
	{/snippet}
</Story>

<Story name="Invalid" args={{ pattern: '#####', invalid: true, placeholder: '40123' }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<MaskedField {...args} value="123" />
	{/snippet}
</Story>

<Story name="Disabled" args={{ pattern: '(##)-###-###', disabled: true }}>
	{#snippet template(args: MaskedFieldStoryArgs)}
		<MaskedField {...args} value="0211234567" />
	{/snippet}
</Story>
