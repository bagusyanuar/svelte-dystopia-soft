import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Table from './Table.svelte';
import TableHeader from './TableHeader.svelte';
import TableBody from './TableBody.svelte';
import TableFooter from './TableFooter.svelte';
import TableRow from './TableRow.svelte';
import TableHead from './TableHead.svelte';
import TableCell from './TableCell.svelte';
import TableCaption from './TableCaption.svelte';
import TableHarness from './TableHarness.spec.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>Content</span>`
}));

describe('Table', () => {
	it('renders a table element wrapped in a scrollable container', async () => {
		render(Table, { children: text });

		const table = page.getByRole('table').element();
		expect(table.tagName).toBe('TABLE');
		expect(table.parentElement?.className).toContain('overflow-x-auto');
	});

	it('applies `class` to the scroll wrapper, not the table element', async () => {
		render(Table, { children: text, class: 'my-custom-class' });

		const table = page.getByRole('table').element();
		expect(table.className).not.toContain('my-custom-class');
		expect(table.parentElement?.className).toContain('my-custom-class');
	});

	it('applies `classes.table` to the table element', async () => {
		render(Table, { children: text, classes: { table: 'table-fixed' } });

		expect(page.getByRole('table').element().className).toContain('table-fixed');
	});

	it('forwards unrecognized attributes to the table element', async () => {
		render(Table, { children: text, id: 'probe-id' });

		expect(page.getByRole('table').element().id).toBe('probe-id');
	});
});

// Not run via `it.each` with a shared component array: unlike `Card`'s parts
// (all plain `<div>`s, so structurally interchangeable props), these each
// extend a different native element's attribute type (`HTMLTableRowElement`,
// `HTMLTableCellElement`, ...), which TypeScript correctly refuses to unify
// into one array's element type.
describe('Table row/cell/section parts', () => {
	it('TableHeader renders as a thead and forwards a class override and attributes', async () => {
		render(TableHeader, { children: text, class: 'my-custom-class', id: 'probe-id' });

		const el = page.getByText('Content').element();
		expect(el.tagName).toBe('THEAD');
		expect(el.className).toContain('my-custom-class');
		expect(el.id).toBe('probe-id');
	});

	it('TableBody renders as a tbody and forwards a class override and attributes', async () => {
		render(TableBody, { children: text, class: 'my-custom-class', id: 'probe-id' });

		const el = page.getByText('Content').element();
		expect(el.tagName).toBe('TBODY');
		expect(el.className).toContain('my-custom-class');
		expect(el.id).toBe('probe-id');
	});

	it('TableFooter renders as a tfoot and forwards a class override and attributes', async () => {
		render(TableFooter, { children: text, class: 'my-custom-class', id: 'probe-id' });

		const el = page.getByText('Content').element();
		expect(el.tagName).toBe('TFOOT');
		expect(el.className).toContain('my-custom-class');
		expect(el.id).toBe('probe-id');
	});

	it('TableRow renders as a tr and forwards a class override and attributes', async () => {
		render(TableRow, { children: text, class: 'my-custom-class', id: 'probe-id' });

		const el = page.getByText('Content').element();
		expect(el.tagName).toBe('TR');
		expect(el.className).toContain('my-custom-class');
		expect(el.id).toBe('probe-id');
	});

	it('TableHead renders as a th and forwards a class override and attributes', async () => {
		render(TableHead, { children: text, class: 'my-custom-class', id: 'probe-id' });

		const el = page.getByText('Content').element();
		expect(el.tagName).toBe('TH');
		expect(el.className).toContain('my-custom-class');
		expect(el.id).toBe('probe-id');
	});

	it('TableCell renders as a td and forwards a class override and attributes', async () => {
		render(TableCell, { children: text, class: 'my-custom-class', id: 'probe-id' });

		const el = page.getByText('Content').element();
		expect(el.tagName).toBe('TD');
		expect(el.className).toContain('my-custom-class');
		expect(el.id).toBe('probe-id');
	});

	it('TableCaption renders as a caption and forwards a class override and attributes', async () => {
		render(TableCaption, { children: text, class: 'my-custom-class', id: 'probe-id' });

		const el = page.getByText('Content').element();
		expect(el.tagName).toBe('CAPTION');
		expect(el.className).toContain('my-custom-class');
		expect(el.id).toBe('probe-id');
	});

	it('TableHead defaults to scope="col"', async () => {
		render(TableHead, { children: text });
		expect(page.getByText('Content').element().getAttribute('scope')).toBe('col');
	});

	it('TableHead lets a consumer override scope', async () => {
		render(TableHead, { children: text, scope: 'row' });
		expect(page.getByText('Content').element().getAttribute('scope')).toBe('row');
	});

	it('TableRow has no data-selected by default', async () => {
		render(TableRow, { children: text });
		expect(page.getByText('Content').element().hasAttribute('data-selected')).toBe(false);
	});

	it('TableRow marks itself selected via data-selected when the selected prop is set', async () => {
		render(TableRow, { children: text, selected: true });
		expect(page.getByText('Content').element().hasAttribute('data-selected')).toBe(true);
	});
});

describe('Table composition', () => {
	it('assembles into a semantically valid table with the expected roles', async () => {
		render(TableHarness);

		await expect.element(page.getByRole('table')).toBeInTheDocument();
		expect(page.getByRole('columnheader', { name: 'Invoice' }).element()).toBeTruthy();
		expect(page.getByRole('row').all().length).toBe(4); // 1 header + 2 body + 1 footer
		expect(page.getByRole('cell', { name: 'INV001' }).element()).toBeTruthy();
	});

	it('renders the caption text', async () => {
		render(TableHarness);

		await expect.element(page.getByText('A list of recent invoices.')).toBeInTheDocument();
	});

	it('marks the selected row via data-selected', async () => {
		render(TableHarness);

		const pendingCell = page.getByRole('cell', { name: 'Pending' }).element();
		const row = pendingCell.closest('tr');
		expect(row?.hasAttribute('data-selected')).toBe(true);
	});
});
