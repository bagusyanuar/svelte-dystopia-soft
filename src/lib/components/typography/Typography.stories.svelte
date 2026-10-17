<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Typography from './Typography.svelte';
	import type { TypographyProps } from './Typography.types.js';

	type TypographyStoryArgs = Pick<TypographyProps, 'variant' | 'as'>;

	const { Story } = defineMeta({
		title: 'Components/Typography',
		component: Typography,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: ['h1', 'h2', 'h3', 'h4', 'lead', 'body', 'small', 'muted', 'code', 'blockquote']
			},
			as: {
				control: 'select',
				options: [
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'p',
					'span',
					'div',
					'label',
					'strong',
					'small',
					'code',
					'blockquote'
				]
			}
		}
	});
</script>

<Story name="Default" args={{ variant: 'body' }}>
	{#snippet template(args: TypographyStoryArgs)}
		<Typography {...args}>The quick brown fox jumps over the lazy dog.</Typography>
	{/snippet}
</Story>

<Story name="Scale" asChild>
	<div class="flex max-w-lg flex-col gap-4">
		<Typography variant="h1">Heading one</Typography>
		<Typography variant="h2">Heading two</Typography>
		<Typography variant="h3">Heading three</Typography>
		<Typography variant="h4">Heading four</Typography>
		<Typography variant="lead">
			Lead paragraph for introducing article sections or important summaries.
		</Typography>
		<Typography variant="body">
			Body copy sits at text-sm in foreground-muted — the default for anything that isn't a heading.
		</Typography>
		<Typography variant="small">Small text for dense UI labels.</Typography>
		<Typography variant="muted">Muted text for secondary or supporting copy.</Typography>
		<div>
			<Typography variant="code">npm install @dystopia/soft-lib</Typography>
		</div>
		<Typography variant="blockquote">
			"Good design is as little design as possible." — Dieter Rams
		</Typography>
	</div>
</Story>

<Story name="Semantic override" asChild>
	<div class="flex max-w-lg flex-col gap-2">
		<Typography variant="h2" as="span">Looks like h2, renders a span</Typography>
		<Typography variant="muted">
			Use <code>as</code> when a card title needs heading styling without claiming a level in the document
			outline.
		</Typography>
	</div>
</Story>

<Story name="In context" asChild>
	<div class="flex max-w-sm flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-xs">
		<Typography variant="h3">Monthly usage</Typography>
		<Typography variant="body">You've used 8,420 of 10,000 credits this billing period.</Typography>
		<Typography variant="muted">Resets on 1 September.</Typography>
	</div>
</Story>

<Story name="Text Prop" asChild>
	<div class="flex max-w-lg flex-col gap-2">
		<Typography variant="h4" text="Direct String Prop Heading" />
		<Typography variant="body" text="This text is passed directly via the text prop without children snippet." />
	</div>
</Story>

<Story name="Child Snippet Pattern" asChild>
	<div class="flex max-w-lg flex-col gap-2">
		<Typography variant="lead">
			{#snippet child({ props })}
				<a {...props} href="#typography-demo" class="text-primary hover:underline">
					Custom Anchor Element with Lead Typography Styles
				</a>
			{/snippet}
		</Typography>
	</div>
</Story>

