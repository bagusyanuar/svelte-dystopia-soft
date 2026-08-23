import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Pagination from './Pagination.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('Pagination', () => {
	it('renders a nav landmark labelled "pagination"', async () => {
		render(Pagination, { totalPages: 5, currentPage: 1 });

		await expect.element(page.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
	});

	it('collapses a long page range with ellipsis around the current page', async () => {
		const { container } = render(Pagination, { totalPages: 25, currentPage: 7 });

		await expect.element(page.getByRole('button', { name: '1', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: '6', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: '7', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: '8', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: '25', exact: true })).toBeInTheDocument();
		expect(page.getByRole('button', { name: '2', exact: true }).query()).toBeNull();
		expect(container.textContent).toContain('…');
	});

	it('marks the current page with aria-current="page"', async () => {
		render(Pagination, { totalPages: 10, currentPage: 3 });

		await expect
			.element(page.getByRole('button', { name: '3', exact: true }))
			.toHaveAttribute('aria-current', 'page');
		await expect
			.element(page.getByRole('button', { name: '4', exact: true }))
			.not.toHaveAttribute('aria-current');
	});

	it('calls onPageChange when a page number is clicked', async () => {
		const onPageChange = vi.fn();
		render(Pagination, { totalPages: 10, currentPage: 3, onPageChange });

		await page.getByRole('button', { name: '4', exact: true }).click();

		expect(onPageChange).toHaveBeenCalledWith(4);
	});

	it('disables Previous on the first page and Next on the last page', async () => {
		render(Pagination, { totalPages: 5, currentPage: 1 });

		await expect.element(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
		await expect.element(page.getByRole('button', { name: 'Next' })).not.toBeDisabled();
	});

	it('disables Next on the last page', async () => {
		render(Pagination, { totalPages: 5, currentPage: 5 });

		await expect.element(page.getByRole('button', { name: 'Next' })).toBeDisabled();
		await expect.element(page.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
	});

	it('Next/Previous step by one page', async () => {
		const onPageChange = vi.fn();
		render(Pagination, { totalPages: 10, currentPage: 3, onPageChange });

		await page.getByRole('button', { name: 'Next' }).click();

		expect(onPageChange).toHaveBeenCalledWith(4);
	});

	it('disables every control when the disabled prop is set', async () => {
		render(Pagination, { totalPages: 10, currentPage: 3, disabled: true });

		await expect.element(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
		await expect.element(page.getByRole('button', { name: 'Next' })).toBeDisabled();
		await expect.element(page.getByRole('button', { name: '4', exact: true })).toBeDisabled();
	});

	it('lets a consumer localize the Previous/Next labels', async () => {
		render(Pagination, {
			totalPages: 5,
			currentPage: 2,
			labels: { previous: 'Sebelumnya', next: 'Berikutnya' }
		});

		await expect.element(page.getByRole('button', { name: 'Sebelumnya' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Berikutnya' })).toBeInTheDocument();
	});

	it('lets a consumer enrich a page button beyond its visible number', async () => {
		// currentPage 3 of 5, default sibling/boundary counts, renders every page (1-5)
		// with no ellipsis, so page 3 is guaranteed to be on screen.
		render(Pagination, {
			totalPages: 5,
			currentPage: 3,
			labels: { page: (p) => `Go to page ${p}` }
		});

		await expect.element(page.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
	});

	it('renders a custom item via the item snippet instead of the default link', async () => {
		const item = createRawSnippet<[{ page: number; active: boolean }]>((getProps) => ({
			render: () => `<span data-testid="custom-item">P${getProps().page}</span>`
		}));
		render(Pagination, { totalPages: 5, currentPage: 3, item });

		await expect.element(page.getByText('P3')).toBeInTheDocument();
		expect(page.getByRole('button', { name: '3', exact: true }).query()).toBeNull();
	});

	it('lets a consumer override internal classes', async () => {
		render(Pagination, {
			totalPages: 5,
			currentPage: 1,
			classes: { list: 'list-test', link: 'link-test' }
		});

		expect(document.querySelector('ul')?.className).toContain('list-test');
		const link = page.getByRole('button', { name: '1', exact: true }).element();
		expect(link.className).toContain('link-test');
	});

	it('propagates currentPage back to the consumer via bind', async () => {
		render(BindingHarness);

		// BindingHarness starts at page 1 of 10 — with default sibling/boundary
		// counts that renders `1 2 … 10`, so 2 is the nearest page actually on screen.
		await page.getByRole('button', { name: '2', exact: true }).click();

		await expect.element(page.getByTestId('outer-current-page')).toHaveTextContent('2');
	});
});
