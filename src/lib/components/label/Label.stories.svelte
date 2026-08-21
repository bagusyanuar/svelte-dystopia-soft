<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Label from './Label.svelte';
	import TextField from '../text-field/TextField.svelte';
	import PasswordField from '../password-field/PasswordField.svelte';
	import type { LabelProps } from './Label.types.js';

	type LabelStoryArgs = Pick<LabelProps, 'required' | 'disabled'>;

	const { Story } = defineMeta({
		title: 'Components/Label',
		component: Label,
		tags: ['autodocs'],
		argTypes: {
			required: { control: 'boolean' },
			disabled: { control: 'boolean' }
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
