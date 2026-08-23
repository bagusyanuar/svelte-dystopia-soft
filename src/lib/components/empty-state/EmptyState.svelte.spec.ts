import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import EmptyState from './EmptyState.svelte';

const title = createRawSnippet(() => ({
	render: () => `<span>No results found</span>`
}));
const description = createRawSnippet(() => ({
	render: () => `<span>Try adjusting your filters or search terms.</span>`
}));
const icon = createRawSnippet(() => ({
	render: () => `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>`
}));

describe('EmptyState.svelte', () => {
	it('renders with the status role, so a dynamic empty result gets announced politely', async () => {
		render(EmptyState, { title, description });

		await expect.element(page.getByRole('status')).toBeInTheDocument();
	});

	it('renders the title and description', async () => {
		render(EmptyState, { title, description });

		await expect.element(page.getByText('No results found')).toBeInTheDocument();
		await expect
			.element(page.getByText('Try adjusting your filters', { exact: false }))
			.toBeInTheDocument();
	});

	it('renders nothing for a part that is omitted', async () => {
		const { container } = render(EmptyState, { title });

		expect(container.querySelectorAll('p').length).toBe(1);
	});

	it('renders custom content via the default children snippet', async () => {
		const children = createRawSnippet(() => ({
			render: () => `<button>Create item</button>`
		}));

		render(EmptyState, { title, children });

		await expect.element(page.getByRole('button', { name: 'Create item' })).toBeInTheDocument();
	});

	it('hides the icon from assistive tech', async () => {
		const { container } = render(EmptyState, { title, icon });

		const iconWrapper = container.querySelector('svg')?.parentElement;
		expect(iconWrapper?.getAttribute('aria-hidden')).toBe('true');
	});

	it('lets a consumer class override the internal class', async () => {
		render(EmptyState, { title, class: 'my-custom-class' });

		const root = page.getByRole('status').element();
		expect(root.className).toContain('my-custom-class');
	});

	it('lets a consumer style the title, description, and icon via classes', async () => {
		render(EmptyState, {
			title,
			description,
			icon,
			classes: { title: 'title-test', description: 'desc-test', icon: 'icon-test' }
		});

		const root = page.getByRole('status').element();
		expect(root.querySelector('p.title-test')).toBeTruthy();
		expect(root.querySelector('p.desc-test')).toBeTruthy();
		expect(root.querySelector('span.icon-test')).toBeTruthy();
	});

	it('forwards unrecognized attributes to the root element', async () => {
		render(EmptyState, { title, 'data-testid': 'search-empty-state' });

		await expect.element(page.getByTestId('search-empty-state')).toBeInTheDocument();
	});
});
