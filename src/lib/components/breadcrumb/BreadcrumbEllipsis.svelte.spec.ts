import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import BreadcrumbEllipsis from './BreadcrumbEllipsis.svelte';
import EllipsisBindingHarness from './EllipsisBindingHarness.spec.svelte';

const content = createRawSnippet(() => ({
	render: () => `<div><a href="/library">Library</a><a href="/data">Data</a></div>`
}));

describe('BreadcrumbEllipsis.svelte', () => {
	it('renders a trigger button named "More" by default', async () => {
		render(BreadcrumbEllipsis, { children: content });

		await expect.element(page.getByRole('button', { name: 'More' })).toBeInTheDocument();
	});

	it('lets a consumer override the accessible label', async () => {
		render(BreadcrumbEllipsis, { children: content, labels: { more: 'Show hidden crumbs' } });

		await expect
			.element(page.getByRole('button', { name: 'Show hidden crumbs' }))
			.toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(BreadcrumbEllipsis, { children: content });

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens the popover with the collapsed items when clicked', async () => {
		render(BreadcrumbEllipsis, { children: content });

		await page.getByRole('button', { name: 'More' }).click();

		await expect.element(page.getByRole('dialog')).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Library' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Data' })).toBeInTheDocument();
	});

	it('propagates the open state back to the consumer', async () => {
		render(EllipsisBindingHarness);

		await page.getByRole('button', { name: 'More' }).click();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override the internal trigger and content classes', async () => {
		render(BreadcrumbEllipsis, {
			children: content,
			classes: { trigger: 'rounded-full', content: 'rounded-none' }
		});

		const button = page.getByRole('button', { name: 'More' }).element();
		expect(button.className).toContain('rounded-full');

		await page.getByRole('button', { name: 'More' }).click();

		const panel = page.getByRole('dialog').element();
		expect(panel.className).toContain('rounded-none');
	});

	it('allows replacing the trigger icon via trigger snippet', async () => {
		const customTrigger = createRawSnippet<[{ open: boolean }]>((getArgs) => ({
			render: () => {
				const { open } = getArgs();
				return `<span data-testid="custom-trigger">${open ? 'Hide' : 'Expand'}</span>`;
			}
		}));

		render(BreadcrumbEllipsis, { children: content, trigger: customTrigger });

		await expect.element(page.getByTestId('custom-trigger')).toHaveTextContent('Expand');
	});
});
