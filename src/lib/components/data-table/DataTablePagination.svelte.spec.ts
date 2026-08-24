import {
	createPaginatedRowModel,
	createTable,
	rowPaginationFeature,
	tableFeatures
} from '@tanstack/svelte-table';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DataTablePaginationFixture from './DataTablePaginationFixture.spec.svelte';

type Row = { name: string };

const rows: Row[] = Array.from({ length: 12 }, (_, i) => ({ name: `Row ${i + 1}` }));
const columns = [{ accessorKey: 'name', header: 'Name' }];
const features = tableFeatures({
	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel()
});

function instance() {
	return () =>
		createTable({
			features,
			columns,
			get data() {
				return rows;
			},
			initialState: { pagination: { pageIndex: 0, pageSize: 5 } }
		});
}

describe('DataTablePagination', () => {
	it('associates the rows-per-page label with the select via for/id', async () => {
		render(DataTablePaginationFixture, {
			createInstance: instance(),
			pageSizeOptions: [5, 10, 20]
		});

		const select = page.getByLabelText('Rows per page').element();
		expect(select.tagName).toBe('SELECT');
	});

	it('shows a page-number button for each page at the initial page size', async () => {
		render(DataTablePaginationFixture, {
			createInstance: instance(),
			pageSizeOptions: [5, 10, 20]
		});

		await expect.element(page.getByRole('button', { name: '1', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: '2', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: '3', exact: true })).toBeInTheDocument();
	});

	it('collapses to one page once the rows-per-page select covers every row', async () => {
		render(DataTablePaginationFixture, {
			createInstance: instance(),
			pageSizeOptions: [5, 10, 20]
		});

		await userEvent.selectOptions(page.getByLabelText('Rows per page').element(), '20');

		expect(page.getByRole('button', { name: '2', exact: true }).query()).toBeNull();
		await expect.element(page.getByRole('button', { name: 'Next' })).toBeDisabled();
	});

	it('marks the clicked page as current, driven by the same table instance', async () => {
		render(DataTablePaginationFixture, {
			createInstance: instance(),
			pageSizeOptions: [5, 10, 20]
		});

		await page.getByRole('button', { name: '2', exact: true }).click();

		await expect
			.element(page.getByRole('button', { name: '2', exact: true }))
			.toHaveAttribute('aria-current', 'page');
	});
});
