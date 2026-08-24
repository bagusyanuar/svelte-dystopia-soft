<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Pagination from './Pagination.svelte';
	import type { PaginationProps } from './Pagination.types.js';

	type PaginationStoryArgs = Pick<
		PaginationProps,
		'totalPages' | 'siblingCount' | 'boundaryCount' | 'showPreviousNext' | 'disabled' | 'size'
	>;

	const { Story } = defineMeta({
		title: 'Components/Pagination',
		component: Pagination,
		tags: ['autodocs'],
		argTypes: {
			totalPages: { control: { type: 'number', min: 1 } },
			siblingCount: { control: { type: 'number', min: 0 } },
			boundaryCount: { control: { type: 'number', min: 0 } },
			showPreviousNext: { control: 'boolean' },
			disabled: { control: 'boolean' },
			size: { control: 'select', options: ['sm', 'md', 'lg'] }
		}
	});
</script>

<Story name="Playground" args={{ totalPages: 20, siblingCount: 1, boundaryCount: 1 }}>
	{#snippet template(args: PaginationStoryArgs)}
		<Pagination {...args} currentPage={8} />
	{/snippet}
</Story>

<Story
	name="Sizes"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					"Density variant, applied to every auto-rendered part (link, previous, next, ellipsis). Default `'md'` — unchanged from before this prop existed. `'sm'` is the dense option for Linear-style layouts (this is also `DataTablePagination`'s default, since it pairs with `DataTable`'s compact rows)."
			}
		}
	}}
>
	<div class="flex flex-col items-start gap-cozy">
		<Pagination size="sm" totalPages={10} currentPage={3} labels={{ nav: 'pagination (sm)' }} />
		<Pagination size="md" totalPages={10} currentPage={3} labels={{ nav: 'pagination (md)' }} />
		<Pagination size="lg" totalPages={10} currentPage={3} labels={{ nav: 'pagination (lg)' }} />
	</div>
</Story>

<Story name="Ellipsis on one side" asChild>
	<Pagination totalPages={10} currentPage={2} />
</Story>

<Story name="Ellipsis on both sides" asChild>
	<Pagination totalPages={25} currentPage={13} />
</Story>

<Story name="Few pages (no ellipsis needed)" asChild>
	<Pagination totalPages={4} currentPage={2} />
</Story>

<Story name="Last page" asChild>
	<Pagination totalPages={25} currentPage={25} />
</Story>

<Story name="Disabled" asChild>
	<Pagination totalPages={10} currentPage={3} disabled />
</Story>

<Story name="Localized labels" asChild>
	<Pagination
		totalPages={10}
		currentPage={3}
		labels={{ nav: 'navigasi halaman', previous: 'Sebelumnya', next: 'Berikutnya' }}
	/>
</Story>
