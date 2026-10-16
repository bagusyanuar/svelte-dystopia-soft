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
	import { Avatar } from '../avatar/index.js';
	import { Badge } from '../badge/index.js';
	import { cn } from '../../utils/cn.js';

	const allFruits: ComboboxOption[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'apricot', label: 'Apricot' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'clementine', label: 'Clementine' }
	];

	interface MemberOption extends ComboboxOption<string> {
		email: string;
		role: 'Owner' | 'Admin' | 'Member' | 'Guest';
		roleVariant: 'default' | 'secondary' | 'outline' | 'info';
		status: 'active' | 'busy' | 'away';
		statusColor: string;
		avatarText: string;
	}

	const teamMembers: MemberOption[] = [
		{
			value: 'bagus',
			label: 'Bagus Yanuar',
			email: 'bagus@dystopia.dev',
			role: 'Owner',
			roleVariant: 'default',
			status: 'active',
			statusColor: 'bg-success',
			avatarText: 'BY',
			group: 'Core Engineering',
			keywords: ['bagus', 'dystopia', 'owner', 'lead']
		},
		{
			value: 'alexa',
			label: 'Alexa Vance',
			email: 'alexa.vance@blackmesa.org',
			role: 'Admin',
			roleVariant: 'info',
			status: 'busy',
			statusColor: 'bg-warning',
			avatarText: 'AV',
			group: 'Core Engineering',
			keywords: ['alexa', 'vance', 'admin']
		},
		{
			value: 'gordon',
			label: 'Gordon Freeman',
			email: 'gordon.f@blackmesa.org',
			role: 'Member',
			roleVariant: 'secondary',
			status: 'active',
			statusColor: 'bg-success',
			avatarText: 'GF',
			group: 'Research & Design',
			keywords: ['gordon', 'freeman', 'research']
		},
		{
			value: 'elena',
			label: 'Elena Rostova',
			email: 'elena@novaprospekt.ru',
			role: 'Member',
			roleVariant: 'secondary',
			status: 'away',
			statusColor: 'bg-foreground-faint',
			avatarText: 'ER',
			group: 'Research & Design',
			keywords: ['elena', 'rostova', 'design']
		},
		{
			value: 'marcus',
			label: 'Marcus Holloway',
			email: 'marcus@dedsec.io',
			role: 'Guest',
			roleVariant: 'outline',
			status: 'active',
			statusColor: 'bg-success',
			avatarText: 'MH',
			group: 'External Contractors',
			keywords: ['marcus', 'guest', 'contractor']
		}
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

	let creatableTags = $state<ComboboxOption[]>([
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'tailwind', label: 'Tailwind' },
		{ value: 'typescript', label: 'TypeScript' }
	]);
	let selectedTags = $state<string[]>(['svelte']);

	function handleCreateTag(newLabel: string) {
		const newTag: ComboboxOption = {
			value: newLabel.toLowerCase().replace(/\s+/g, '-'),
			label: newLabel
		};
		creatableTags = [...creatableTags, newTag];
		selectedTags = [...selectedTags, String(newTag.value)];
	}

	let remoteTagsPool: ComboboxOption[] = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'tailwind', label: 'Tailwind' },
		{ value: 'typescript', label: 'TypeScript' },
		{ value: 'vitest', label: 'Vitest' },
		{ value: 'vite', label: 'Vite' }
	];

	let asyncCreatableOptions = $state<ComboboxOption[]>([...remoteTagsPool]);
	let selectedAsyncTags = $state<string[]>(['svelte']);
	let asyncCreatableLoading = $state(false);
	let asyncCreatableTimer: ReturnType<typeof setTimeout>;

	function fakeAsyncTagSearch(query: string) {
		clearTimeout(asyncCreatableTimer);
		asyncCreatableLoading = true;
		asyncCreatableTimer = setTimeout(() => {
			const needle = query.trim().toLowerCase();
			if (!needle) {
				asyncCreatableOptions = [...remoteTagsPool];
			} else {
				asyncCreatableOptions = remoteTagsPool.filter((tag) =>
					tag.label.toLowerCase().includes(needle)
				);
			}
			asyncCreatableLoading = false;
		}, 400);
	}

	async function handleAsyncCreateTag(newLabel: string) {
		// Simulates network POST request to /api/tags (750ms)
		await new Promise((resolve) => setTimeout(resolve, 750));
		const newTag: ComboboxOption = {
			value: newLabel.toLowerCase().replace(/\s+/g, '-'),
			label: newLabel
		};
		remoteTagsPool = [...remoteTagsPool, newTag];
		asyncCreatableOptions = [...remoteTagsPool];
		selectedAsyncTags = [...selectedAsyncTags, String(newTag.value)];
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

<Story name="Custom indicator & styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<Combobox
			options={groupedOptions}
			labels={{ placeholder: 'Pilih buah…' }}
			classes={{
				trigger: 'border-primary/40 hover:border-primary',
				indicator: 'text-primary'
			}}
		>
			{#snippet indicator({ open })}
				<span class="text-xs font-bold text-primary transition-transform duration-200 {open ? 'rotate-180' : ''}">
					▼
				</span>
			{/snippet}
		</Combobox>
	</div>
</Story>

<Story name="Complex custom item" asChild>
	<div class="flex w-105 max-w-full justify-center p-16">
		<Combobox
			options={teamMembers}
			labels={{
				placeholder: 'Pilih anggota tim…',
				searchPlaceholder: 'Cari nama, email, atau role…'
			}}
		>
			{#snippet item({ option, selected })}
				{@const member = option as unknown as MemberOption}
				<div class="flex w-full items-center justify-between gap-tight py-1">
					<div class="flex items-center gap-tight min-w-0">
						<div class="relative shrink-0">
							<Avatar alt={member.label} class="size-8 text-xs font-semibold">
								{member.avatarText}
							</Avatar>
							<span
								class={cn(
									'absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface',
									member.statusColor
								)}
								title={`Status: ${member.status}`}
							></span>
						</div>

						<div class="flex flex-col min-w-0 text-left">
							<span class="truncate font-medium {selected ? 'text-primary' : 'text-foreground'}">
								{member.label}
							</span>
							<span class="truncate text-[11px] text-foreground-faint">
								{member.email}
							</span>
						</div>
					</div>

					<div class="flex items-center gap-2 shrink-0">
						<Badge size="sm" variant={member.roleVariant}>
							{member.role}
						</Badge>
						{#if selected}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								class="size-4 shrink-0 text-primary"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						{/if}
					</div>
				</div>
			{/snippet}
		</Combobox>
	</div>
</Story>

<Story name="Custom chips styling" asChild>
	<div class="flex w-96 justify-center p-16">
		<Combobox
			options={fruitOptions}
			multiple
			value={['apple', 'banana', 'cherry', 'elderberry']}
			maxChips={2}
			labels={{ placeholder: 'Pilih buah…' }}
			classes={{
				chip: 'rounded-full border-primary/30 bg-primary/10 font-medium text-primary',
				chipRemove: 'text-primary hover:bg-primary/20',
				chipCounter: 'rounded-full bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary'
			}}
		/>
	</div>
</Story>

<Story name="Creatable tags (multiple)" asChild>
	<div class="flex w-96 flex-col gap-cozy p-16">
		<Combobox
			options={creatableTags}
			multiple
			creatable
			bind:value={selectedTags}
			onCreate={handleCreateTag}
			labels={{
				placeholder: 'Pilih atau ketik tag baru…',
				searchPlaceholder: 'Cari atau buat tag…',
				create: (q) => `Buat tag baru "${q}"`
			}}
		/>
		<p class="text-xs text-foreground-faint">
			Ketik nama tag baru (misal: "React" atau "Vite") lalu tekan <kbd class="rounded border border-border-subtle bg-surface-subtle px-1 py-0.5 text-[10px] font-medium text-foreground">Enter</kbd> untuk menambahkan tag baru secara dinamis.
		</p>
	</div>
</Story>

<Story name="Async creatable tags" asChild>
	<div class="flex w-96 flex-col gap-cozy p-16">
		<Combobox
			options={asyncCreatableOptions}
			multiple
			creatable
			loading={asyncCreatableLoading}
			manualFilter
			bind:value={selectedAsyncTags}
			onCreate={handleAsyncCreateTag}
			onSearchChange={fakeAsyncTagSearch}
			labels={{
				placeholder: 'Search or create tags (async)…',
				searchPlaceholder: 'Search or type new tag…',
				create: (q) => `Create "${q}" on server`,
				creating: (q) => `Creating "${q}" on server…`,
				empty: 'No tags found.'
			}}
		/>
		<p class="text-xs text-foreground-faint">
			Demonstrates remote search (400ms debounce) with asynchronous server creation (750ms latency). The item row shows an active spinner while the API call is in progress.
		</p>
	</div>
</Story>



