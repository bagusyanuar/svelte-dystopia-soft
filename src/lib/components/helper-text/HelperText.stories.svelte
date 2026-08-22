<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HelperText from './HelperText.svelte';
	import Label from '../label/Label.svelte';
	import TextField from '../text-field/TextField.svelte';
	import type { HelperTextProps } from './HelperText.types.js';

	type HelperTextStoryArgs = Pick<HelperTextProps, 'invalid'>;

	const { Story } = defineMeta({
		title: 'Components/HelperText',
		component: HelperText,
		tags: ['autodocs'],
		argTypes: {
			invalid: { control: 'boolean' }
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: HelperTextStoryArgs)}
		<HelperText {...args}>We'll never share your email.</HelperText>
	{/snippet}
</Story>

<Story name="Error" args={{ invalid: true }}>
	{#snippet template(args: HelperTextStoryArgs)}
		<HelperText {...args}>Enter a valid email address.</HelperText>
	{/snippet}
</Story>

<Story name="With a field" asChild>
	<div class="flex w-72 flex-col gap-1.5">
		<Label for="helper-email">Email</Label>
		<TextField id="helper-email" type="email" placeholder="you@company.com" />
		<HelperText id="helper-email-hint">We'll never share your email.</HelperText>
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
			placeholder="you@company.com"
			value="not-an-email"
		/>
		<HelperText id="helper-email-invalid-error" invalid>Enter a valid email address.</HelperText>
	</div>
</Story>
