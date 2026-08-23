import {
	createTable,
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

const emptySnippet = createRawSnippet(() => ({ render: () => `<p>Nothing here</p>` }));

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
});
