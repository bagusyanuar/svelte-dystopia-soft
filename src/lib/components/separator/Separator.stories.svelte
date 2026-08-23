<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Separator from './Separator.svelte';
	import type { SeparatorProps } from './Separator.types.js';

	type SeparatorStoryArgs = Pick<SeparatorProps, 'orientation' | 'decorative'>;

	const { Story } = defineMeta({
		title: 'Components/Separator',
		component: Separator,
		tags: ['autodocs'],
		argTypes: {
			orientation: { control: 'select', options: ['horizontal', 'vertical'] },
			decorative: { control: 'boolean' }
		}
	});
</script>

<Story name="Horizontal" asChild>
	<div class="w-72">
		<div class="text-sm text-foreground-soft">Account</div>
		<div class="my-cozy">
			<Separator />
		</div>
		<div class="text-sm text-foreground-subtle">Manage your account settings.</div>
	</div>
</Story>

<Story name="Vertical" asChild>
	<div class="flex h-6 items-center gap-cozy text-sm text-foreground-soft">
		<span>Blog</span>
		<Separator orientation="vertical" />
		<span>Docs</span>
		<Separator orientation="vertical" />
		<span>Source</span>
	</div>
</Story>

<Story name="Meaningful (not decorative)" asChild>
	<div class="w-72">
		<p class="text-sm text-foreground-subtle">
			Separator with <code>decorative={false}</code> — announced to assistive tech as a section boundary.
		</p>
		<div class="my-cozy">
			<Separator decorative={false} />
		</div>
	</div>
</Story>
