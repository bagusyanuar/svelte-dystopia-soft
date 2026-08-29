<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Combobox from './Combobox.svelte';
	import type { ComboboxOption, ComboboxProps } from './Combobox.types.js';

	type ComboboxStoryArgs = Pick<ComboboxProps, 'size' | 'disabled' | 'invalid' | 'clearable'>;

	const { Story } = defineMeta({
		title: 'Components/Combobox',
		component: Combobox,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' },
			clearable: { control: 'boolean' }
		}
	});

	const fruitOptions: ComboboxOption[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'durian', label: 'Durian', disabled: true },
		{ value: 'elderberry', label: 'Elderberry' }
	];

	const groupedOptions: ComboboxOption[] = [
		{ value: 'apple', label: 'Apple', group: 'Pome' },
		{ value: 'pear', label: 'Pear', group: 'Pome' },
		{ value: 'lemon', label: 'Lemon', group: 'Citrus' },
		{ value: 'lime', label: 'Lime', group: 'Citrus' },
		{ value: 'strawberry', label: 'Strawberry', group: 'Berry' },
		{ value: 'blueberry', label: 'Blueberry', group: 'Berry' }
	];

	// Rendered into the Storybook docs page via `parameters.docs.description.story`
	// on the "Async search" story below — a plain source comment wouldn't show up
	// there. Built as joined lines (rather than one template literal) so none of
	// the embedded code needs its backticks escaped.
	const asyncPatternDocs = [
		"Combobox never touches a Promise itself — `search` is just the debounced query key and `onEndReached` is a scroll-threshold signal. Fetching, caching, racing, and pagination are entirely the consumer's job. The `fakeFetch` used below stands in for a real data layer so this demo carries no extra dependency — here is the same pattern with [@tanstack/svelte-query](https://tanstack.com/query/latest/docs/framework/svelte/overview).",
		'',
		'**Single query**',
		'',
		'```svelte',
		'// instance script',
		"import { createQuery } from '@tanstack/svelte-query';",
		"import { Combobox } from 'dystopia-linear-lib/components/combobox';",
		'',
		"let search = $state('');",
		'',
		'const fruitsQuery = createQuery(() => ({',
		"\tqueryKey: ['fruits', search],",
		'\tqueryFn: () => fetchFruits(search),',
		'\tenabled: search.length > 0',
		'}));',
		'',
		'// markup',
		'<Combobox',
		'\toptions={fruitsQuery.data ?? []}',
		'\tbind:search',
		'\tmanualFilter',
		'\tloading={fruitsQuery.isFetching}',
		"\terror={fruitsQuery.isError ? 'Failed to load fruits.' : undefined}",
		'\tonRetry={() => fruitsQuery.refetch()}',
		'/>',
		'```',
		'',
		'**Paginated — search combined with infinite scroll via `onEndReached`**',
		'',
		'```svelte',
		'// instance script',
		"import { createInfiniteQuery } from '@tanstack/svelte-query';",
		"import { Combobox } from 'dystopia-linear-lib/components/combobox';",
		'',
		"let search = $state('');",
		'',
		'const fruitsQuery = createInfiniteQuery(() => ({',
		"\tqueryKey: ['fruits', search],",
		'\tqueryFn: ({ pageParam }) => fetchFruits(search, pageParam),',
		'\tinitialPageParam: 0,',
		'\tgetNextPageParam: (lastPage) => lastPage.nextCursor',
		'}));',
		'',
		'const options = $derived(fruitsQuery.data?.pages.flatMap((page) => page.items) ?? []);',
		'',
		'// markup',
		'<Combobox',
		'\t{options}',
		'\tbind:search',
		'\tmanualFilter',
		'\tloading={fruitsQuery.isFetching}',
		"\terror={fruitsQuery.isError ? 'Failed to load fruits.' : undefined}",
		'\tonRetry={() => fruitsQuery.refetch()}',
		'\tonEndReached={() => {',
		'\t\tif (fruitsQuery.hasNextPage && !fruitsQuery.isFetchingNextPage) {',
		'\t\t\tfruitsQuery.fetchNextPage();',
		'\t\t}',
		'\t}}',
		'/>',
		'```'
	].join('\n');
</script>

<script lang="ts">
	const allFruits: ComboboxOption[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'apricot', label: 'Apricot' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'clementine', label: 'Clementine' }
	];

	let asyncOptions = $state<ComboboxOption[]>([]);
	let asyncLoading = $state(false);
	let asyncSearch = $state('');
	let asyncTimer: ReturnType<typeof setTimeout>;

	// Stands in for a real network call: debounced `onSearchChange` already
	// arrives settled, this just adds an artificial round-trip delay so the
	// loading state is visible in the story.
	function fakeFetch(query: string) {
		clearTimeout(asyncTimer);
		if (!query) {
			asyncOptions = [];
			asyncLoading = false;
			return;
		}
		asyncLoading = true;
		asyncTimer = setTimeout(() => {
			const needle = query.toLowerCase();
			asyncOptions = allFruits.filter((option) => option.label.toLowerCase().includes(needle));
			asyncLoading = false;
		}, 600);
	}
</script>

<Story name="Default" args={{ clearable: false }}>
	{#snippet template(args: ComboboxStoryArgs)}
		<div class="flex w-80 justify-center p-16">
			<Combobox options={fruitOptions} {...args} labels={{ placeholder: 'Select a fruit…' }} />
		</div>
	{/snippet}
</Story>

<Story name="Multiple" asChild>
	<div class="flex w-80 justify-center p-16">
		<Combobox
			options={fruitOptions}
			multiple
			value={['apple', 'banana']}
			labels={{ placeholder: 'Select fruits…' }}
		/>
	</div>
</Story>

<Story name="Groups" asChild>
	<div class="flex w-80 justify-center p-16">
		<Combobox options={groupedOptions} labels={{ placeholder: 'Select a fruit…' }} />
	</div>
</Story>

<Story
	name="Async search"
	asChild
	parameters={{ docs: { description: { story: asyncPatternDocs } } }}
>
	<div class="flex w-80 justify-center p-16">
		<Combobox
			options={asyncOptions}
			bind:search={asyncSearch}
			manualFilter
			loading={asyncLoading}
			labels={{
				placeholder: 'Search fruits…',
				searchPlaceholder: 'Type to search…',
				typeToSearch: 'Start typing to search fruits…',
				empty: 'No fruits matched your search.'
			}}
			onSearchChange={fakeFetch}
		/>
	</div>
</Story>

<Story name="Clearable with a value" asChild>
	<div class="flex w-80 justify-center p-16">
		<Combobox
			options={fruitOptions}
			value="banana"
			clearable
			labels={{ placeholder: 'Select a fruit…' }}
		/>
	</div>
</Story>

<Story name="Empty" asChild>
	<div class="flex w-80 justify-center p-16">
		<Combobox
			options={[]}
			labels={{ placeholder: 'Select a fruit…', empty: 'No fruits available.' }}
		/>
	</div>
</Story>

<Story name="Error with retry" asChild>
	<div class="flex w-80 justify-center p-16">
		<Combobox
			options={[]}
			error="Failed to load fruits."
			onRetry={() => alert('Retrying…')}
			labels={{ placeholder: 'Select a fruit…' }}
		/>
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true }}>
	{#snippet template(args: ComboboxStoryArgs)}
		<div class="flex w-80 justify-center p-16">
			<Combobox options={fruitOptions} {...args} labels={{ placeholder: 'Select a fruit…' }} />
		</div>
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true }}>
	{#snippet template(args: ComboboxStoryArgs)}
		<div class="flex w-80 justify-center p-16">
			<Combobox
				options={fruitOptions}
				{...args}
				value="apple"
				labels={{ placeholder: 'Select a fruit…' }}
			/>
		</div>
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-80 flex-col gap-3 p-16">
		<Combobox options={fruitOptions} size="sm" labels={{ placeholder: 'Small' }} />
		<Combobox options={fruitOptions} size="md" labels={{ placeholder: 'Medium' }} />
		<Combobox options={fruitOptions} size="lg" labels={{ placeholder: 'Large' }} />
	</div>
</Story>
