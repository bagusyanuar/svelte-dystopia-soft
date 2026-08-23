import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Breadcrumb from './Breadcrumb.svelte';
import BreadcrumbList from './BreadcrumbList.svelte';
import BreadcrumbItem from './BreadcrumbItem.svelte';
import BreadcrumbLink from './BreadcrumbLink.svelte';
import BreadcrumbPage from './BreadcrumbPage.svelte';
import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';
import BreadcrumbHarness from './BreadcrumbHarness.spec.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>Content</span>`
}));

describe('Breadcrumb family', () => {
	it('renders a nav landmark labelled "breadcrumb"', async () => {
		render(BreadcrumbHarness);

		await expect.element(page.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
	});

	it('renders links for non-current items', async () => {
		render(BreadcrumbHarness);

		await expect.element(page.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
		await expect
			.element(page.getByRole('link', { name: 'Settings' }))
			.toHaveAttribute('href', '/settings');
	});

	it('marks the current page with aria-current instead of a link', async () => {
		render(BreadcrumbHarness);

		await expect.element(page.getByText('Profile')).toHaveAttribute('aria-current', 'page');
		await expect.element(page.getByRole('link', { name: 'Profile' })).not.toBeInTheDocument();
	});

	it('hides separators from assistive tech', async () => {
		render(BreadcrumbHarness);

		const root = page.getByTestId('breadcrumb-root').element();
		const separators = root.querySelectorAll('[role="presentation"]');

		expect(separators.length).toBe(2);
		for (const separator of separators) {
			expect(separator.getAttribute('aria-hidden')).toBe('true');
		}
	});

	it('lets a consumer override the default separator icon', async () => {
		render(BreadcrumbSeparator, { children: text });

		await expect.element(page.getByText('Content')).toBeInTheDocument();
	});

	it('nests items inside the list inside the nav', async () => {
		render(BreadcrumbHarness);

		const nav = page.getByTestId('breadcrumb-root').element();
		expect(nav.contains(page.getByRole('link', { name: 'Home' }).element())).toBe(true);
		expect(nav.querySelector('ol')?.contains(page.getByText('Profile').element())).toBe(true);
	});

	it('renders a consumer-supplied element via the child snippet instead of an anchor', async () => {
		const customLink = createRawSnippet<[{ props: Record<string, unknown> }]>((getArgs) => ({
			render: () => {
				const { props } = getArgs();
				return `<span data-testid="custom-link" class="${String(props.class ?? '')}">Custom</span>`;
			}
		}));

		render(BreadcrumbLink, { href: '/', child: customLink, children: text });

		await expect.element(page.getByTestId('custom-link')).toBeInTheDocument();
		await expect.element(page.getByRole('link')).not.toBeInTheDocument();

		const custom = page.getByTestId('custom-link').element();
		expect(custom.className).toContain('transition-colors');
	});

	it.each([
		['Breadcrumb', Breadcrumb],
		['BreadcrumbList', BreadcrumbList],
		['BreadcrumbItem', BreadcrumbItem],
		['BreadcrumbPage', BreadcrumbPage]
	])('%s renders its children and forwards a class override', async (_name, Component) => {
		render(Component, { children: text, class: 'my-custom-class' });

		await expect.element(page.getByText('Content')).toBeInTheDocument();
		expect(page.getByText('Content').element().parentElement?.className).toContain(
			'my-custom-class'
		);
	});

	it.each([
		['Breadcrumb', Breadcrumb],
		['BreadcrumbList', BreadcrumbList],
		['BreadcrumbItem', BreadcrumbItem],
		['BreadcrumbPage', BreadcrumbPage]
	])('%s forwards unrecognized attributes', async (_name, Component) => {
		render(Component, { children: text, id: 'probe-id' });

		expect(page.getByText('Content').element().parentElement?.id).toBe('probe-id');
	});

	it('BreadcrumbLink forwards a class override and unrecognized attributes', async () => {
		render(BreadcrumbLink, { href: '/', class: 'my-custom-class', id: 'probe-id', children: text });

		const link = page.getByRole('link').element();
		expect(link.className).toContain('my-custom-class');
		expect(link.id).toBe('probe-id');
	});
});
