import {
	columnPinningFeature,
	columnSizingFeature,
	createExpandedRowModel,
	createTable,
	rowExpandingFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures
} from '@tanstack/svelte-table';
import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DataTableFixture from './DataTableFixture.spec.svelte';

type Person = { firstName: string; age: number };

const people: Person[] = [
	{ firstName: 'Ada', age: 36 },
	{ firstName: 'Grace', age: 41 }
];

const columns = [
	{ accessorKey: 'firstName', header: 'First name' },
	{ accessorKey: 'age', header: 'Age' }
];

const coreFeatures = tableFeatures({});
const sortableFeatures = tableFeatures({ rowSortingFeature });
const selectableFeatures = tableFeatures({ rowSelectionFeature });
const expandableFeatures = tableFeatures({
	rowExpandingFeature,
	expandedRowModel: createExpandedRowModel()
});
const pinnableFeatures = tableFeatures({ columnPinningFeature, columnSizingFeature });

function coreInstance(data: Person[] = people) {
	return () =>
		createTable({
			features: coreFeatures,
			columns,
			get data() {
				return data;
			}
		});
}

function sortableInstance() {
	return () =>
		createTable({
			features: sortableFeatures,
			columns,
			get data() {
				return people;
			}
		});
}

function selectableInstance() {
	return () =>
		createTable({
			features: selectableFeatures,
			columns,
			get data() {
				return people;
			}
		});
}

function expandableInstance() {
	return () =>
		createTable({
			features: expandableFeatures,
			columns,
			getRowCanExpand: () => true,
			get data() {
				return people;
			}
		});
}

function pinnableInstance() {
	return () =>
		createTable({
			features: pinnableFeatures,
			columns,
			get data() {
				return people;
			}
		});
}

const emptySnippet = createRawSnippet(() => ({ render: () => `<p>Nothing here</p>` }));
const expandedRowSnippet = createRawSnippet(() => ({ render: () => `<p>Row details</p>` }));

describe('DataTable', () => {
	it('renders header cells and body rows from the table instance', async () => {
		render(DataTableFixture, { createInstance: coreInstance() });

		expect(page.getByRole('columnheader', { name: 'First name' }).element()).toBeTruthy();
		expect(page.getByRole('columnheader', { name: 'Age' }).element()).toBeTruthy();
		expect(page.getByRole('cell', { name: 'Ada' }).element()).toBeTruthy();
		expect(page.getByRole('cell', { name: 'Grace' }).element()).toBeTruthy();
	});

	it('shows the default empty state when there are no rows', async () => {
		render(DataTableFixture, { createInstance: coreInstance([]) });

		await expect.element(page.getByText('No data')).toBeInTheDocument();
	});

	it('uses the `labels.empty` override for the default empty state', async () => {
		render(DataTableFixture, { createInstance: coreInstance([]), labels: { empty: 'No results' } });

		await expect.element(page.getByText('No results')).toBeInTheDocument();
	});

	it('renders a custom `empty` snippet instead of the default EmptyState', async () => {
		render(DataTableFixture, { createInstance: coreInstance([]), empty: emptySnippet });

		await expect.element(page.getByText('Nothing here')).toBeInTheDocument();
		expect(page.getByText('No data').elements().length).toBe(0);
	});

	it("sets aria-sort on a sortable header, reflecting the table's sort state", async () => {
		render(DataTableFixture, { createInstance: sortableInstance() });

		const header = page.getByRole('columnheader', { name: 'Age' }).element();
		expect(header.getAttribute('aria-sort')).toBe('none');

		await userEvent.click(page.getByTestId('sort-age').element());
		expect(header.getAttribute('aria-sort')).toBe('ascending');
	});

	it('does not set aria-sort when the table has no sorting feature', async () => {
		render(DataTableFixture, { createInstance: coreInstance() });

		const header = page.getByRole('columnheader', { name: 'Age' }).element();
		expect(header.hasAttribute('aria-sort')).toBe(false);
	});

	it('reflects row selection via data-selected on the row', async () => {
		render(DataTableFixture, { createInstance: selectableInstance() });

		const cell = page.getByRole('cell', { name: 'Ada' }).element();
		const row = cell.closest('tr');
		expect(row?.hasAttribute('data-selected')).toBe(false);

		await userEvent.click(page.getByTestId('select-first').element());
		expect(row?.hasAttribute('data-selected')).toBe(true);
	});

	it('applies `classes.table` to the underlying table element', async () => {
		render(DataTableFixture, { createInstance: coreInstance(), classes: { table: 'table-fixed' } });

		expect(page.getByRole('table').element().className).toContain('table-fixed');
	});

	it('does not make a row focusable/clickable when the table has no row-expanding feature', async () => {
		render(DataTableFixture, { createInstance: coreInstance() });

		const row = page.getByRole('cell', { name: 'Ada' }).element().closest('tr');
		expect(row?.hasAttribute('tabindex')).toBe(false);
		expect(row?.hasAttribute('data-expanded')).toBe(false);
	});

	it('toggles data-expanded and reveals the `expandedRow` snippet on row click', async () => {
		render(DataTableFixture, {
			createInstance: expandableInstance(),
			expandedRow: expandedRowSnippet
		});

		const row = page.getByRole('cell', { name: 'Ada' }).element().closest('tr') as HTMLElement;
		expect(row.hasAttribute('data-expanded')).toBe(false);
		expect(page.getByText('Row details').elements().length).toBe(0);

		await userEvent.click(row);
		expect(row.hasAttribute('data-expanded')).toBe(true);
		await expect.element(page.getByText('Row details')).toBeInTheDocument();

		await userEvent.click(row);
		expect(row.hasAttribute('data-expanded')).toBe(false);
		expect(page.getByText('Row details').elements().length).toBe(0);
	});

	it('toggles expansion via keyboard (Enter) on a focused row', async () => {
		render(DataTableFixture, {
			createInstance: expandableInstance(),
			expandedRow: expandedRowSnippet
		});

		const row = page.getByRole('cell', { name: 'Ada' }).element().closest('tr') as HTMLElement;
		row.focus();
		await userEvent.keyboard('{Enter}');

		expect(row.hasAttribute('data-expanded')).toBe(true);
		await expect.element(page.getByText('Row details')).toBeInTheDocument();
	});

	it('does not stick a column when the table has no pinning feature', async () => {
		render(DataTableFixture, { createInstance: coreInstance() });

		const header = page.getByRole('columnheader', { name: 'First name' }).element();
		expect(header.className).not.toMatch(/\bsticky\b/);
	});

	it('sticks a pinned column and its cells to the pinned edge', async () => {
		render(DataTableFixture, { createInstance: pinnableInstance() });

		const header = page.getByRole('columnheader', { name: 'First name' }).element() as HTMLElement;
		const cell = page.getByRole('cell', { name: 'Ada' }).element() as HTMLElement;
		expect(header.className).not.toMatch(/\bsticky\b/);

		await userEvent.click(page.getByTestId('pin-first-name').element());

		expect(header.className).toMatch(/\bsticky\b/);
		expect(header.style.left).toBe('0px');
		expect(cell.className).toMatch(/\bsticky\b/);
		expect(cell.style.left).toBe('0px');
	});

	it('stacks the offset of a second column pinned to the same edge', async () => {
		render(DataTableFixture, { createInstance: pinnableInstance() });

		await userEvent.click(page.getByTestId('pin-first-name').element());
		await userEvent.click(page.getByTestId('pin-age').element());

		const firstNameHeader = page
			.getByRole('columnheader', { name: 'First name' })
			.element() as HTMLElement;
		const ageHeader = page.getByRole('columnheader', { name: 'Age' }).element() as HTMLElement;

		expect(firstNameHeader.style.left).toBe('0px');
		expect(parseInt(ageHeader.style.left)).toBeGreaterThan(0);
	});

	it('sticks the header row to the top when `stickyHeader` is set', async () => {
		render(DataTableFixture, { createInstance: coreInstance(), stickyHeader: true });

		const header = page.getByRole('columnheader', { name: 'Age' }).element();
		expect(header.className).toMatch(/\bsticky\b/);
		expect(header.className).toMatch(/\btop-0\b/);
	});

	it('does not stick the header row by default', async () => {
		render(DataTableFixture, { createInstance: coreInstance() });

		const header = page.getByRole('columnheader', { name: 'Age' }).element();
		expect(header.className).not.toMatch(/\bsticky\b/);
	});
});
