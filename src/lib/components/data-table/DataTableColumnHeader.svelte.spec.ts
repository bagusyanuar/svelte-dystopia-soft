import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DataTableColumnHeader from './DataTableColumnHeader.svelte';
import type { SortableColumn } from './DataTableColumnHeader.types.js';

const label = createRawSnippet(() => ({ render: () => `<span>Age</span>` }));

function makeColumn(overrides: Partial<SortableColumn> = {}): SortableColumn {
	return {
		getCanSort: () => true,
		getIsSorted: () => false,
		getToggleSortingHandler: () => vi.fn(),
		...overrides
	};
}

describe('DataTableColumnHeader', () => {
	it('renders plain children with no button when the column is not sortable', async () => {
		render(DataTableColumnHeader, {
			column: makeColumn({ getCanSort: () => false }),
			children: label
		});

		await expect.element(page.getByText('Age')).toBeInTheDocument();
		expect(page.getByRole('button').elements().length).toBe(0);
	});

	it('renders a button and invokes the toggle handler on click when sortable', async () => {
		const handler = vi.fn();
		render(DataTableColumnHeader, {
			column: makeColumn({ getToggleSortingHandler: () => handler }),
			children: label
		});

		await userEvent.click(page.getByRole('button', { name: 'Age' }).element());
		expect(handler).toHaveBeenCalledOnce();
	});
});
