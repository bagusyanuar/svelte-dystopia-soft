<script lang="ts">
	import { untrack } from 'svelte';
	import DataTable from './DataTable.svelte';
	import type { DataTableProps } from './DataTable.types.js';

	let {
		createInstance,
		...rest
	}: {
		/** Called once during this fixture's own init, so `createTable`'s internal
		 * `$effect` runs inside a valid component context — it can't be called
		 * from a plain `.spec.ts` test module. */
		createInstance: () => unknown;
	} & Omit<DataTableProps<never, never>, 'table'> = $props();

	// TanStack's `Table<TFeatures, TData>` is a conditional type keyed by the
	// feature map, not a plain generic — instantiating it with `any`/`never`
	// still forces structural matching against every possible feature, which a
	// single concrete instance (core-only, sortable, selectable, ...) can never
	// satisfy. Not worth fighting in a fixture that never leaves this test file.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const table = untrack(() => createInstance()) as any;

	function sortByAge() {
		table.setSorting?.([{ id: 'age', desc: false }]);
	}

	function selectFirstRow() {
		table.getRow('0').toggleSelected(true);
	}

	function pinColumn(id: string) {
		table.getColumn(id).pin('start');
	}
</script>

<button type="button" data-testid="sort-age" onclick={sortByAge}>Sort by age</button>
<button type="button" data-testid="select-first" onclick={selectFirstRow}>Select first row</button>
<button type="button" data-testid="pin-first-name" onclick={() => pinColumn('firstName')}>
	Pin first name
</button>
<button type="button" data-testid="pin-age" onclick={() => pinColumn('age')}>Pin age</button>
<DataTable {table} {...rest} />
