import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Spinner from './Spinner.svelte';

describe('Spinner.svelte', () => {
	it('has a status role announcing "Loading" by default', async () => {
		render(Spinner);

		await expect.element(page.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
	});

	it('lets a consumer override the accessible label', async () => {
		render(Spinner, { label: 'Saving changes' });

		await expect.element(page.getByRole('status', { name: 'Saving changes' })).toBeInTheDocument();
	});

	it('hides the icon from assistive tech', async () => {
		render(Spinner, { 'data-testid': 'spinner' });

		const svg = page.getByTestId('spinner').element().querySelector('svg');
		expect(svg?.getAttribute('aria-hidden')).toBe('true');
	});

	it('renders the medium size by default', async () => {
		render(Spinner, { 'data-testid': 'spinner' });

		const svg = page.getByTestId('spinner').element().querySelector('svg');
		expect(svg?.getAttribute('class')).toContain('size-4');
	});

	it('renders a different size when requested', async () => {
		render(Spinner, { 'data-testid': 'spinner', size: 'lg' });

		const svg = page.getByTestId('spinner').element().querySelector('svg');
		expect(svg?.getAttribute('class')).toContain('size-6');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Spinner, { 'data-testid': 'spinner', class: 'block' });

		expect(page.getByTestId('spinner').element().className).toContain('block');
	});

	it('lets a consumer override the icon class via classes.icon', async () => {
		render(Spinner, { 'data-testid': 'spinner', classes: { icon: 'text-danger' } });

		const svg = page.getByTestId('spinner').element().querySelector('svg');
		expect(svg?.getAttribute('class')).toContain('text-danger');
	});
});
