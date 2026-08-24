<script lang="ts">
	import { untrack } from 'svelte';
	import DataTablePagination from './DataTablePagination.svelte';
	import type { DataTablePaginationProps } from './DataTablePagination.types.js';

	let {
		createInstance,
		...rest
	}: {
		/** Called once during this fixture's own init, so `createTable`'s internal
		 * `$effect` runs inside a valid component context — it can't be called
		 * from a plain `.spec.ts` test module. */
		createInstance: () => unknown;
	} & Omit<DataTablePaginationProps<never, never>, 'table'> = $props();

	// Same reasoning as `DataTableFixture.spec.svelte` — `Table<TFeatures, TData>`
	// resists instantiation with `any`/`never` for a single concrete instance.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const table = untrack(() => createInstance()) as any;
</script>

<DataTablePagination {table} {...rest} />
