import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Spinner from './Spinner.svelte';
import SpinnerHarness from './SpinnerHarness.spec.svelte';

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

	// --- Semi-headless capability tests ---

	it('exposes data-slot="spinner", data-slot="spinner-icon", and data-size', async () => {
		render(Spinner, { 'data-testid': 'spinner', size: 'sm' });

		const root = page.getByTestId('spinner').element();
		const svg = root.querySelector('svg');

		expect(root.getAttribute('data-slot')).toBe('spinner');
		expect(root.getAttribute('data-size')).toBe('sm');
		expect(svg?.getAttribute('data-slot')).toBe('spinner-icon');
	});

	it('suppresses role="status" and sets aria-hidden="true" when label is empty string', async () => {
		render(Spinner, { 'data-testid': 'spinner', label: '' });

		const root = page.getByTestId('spinner').element();

		expect(root.getAttribute('role')).toBeNull();
		expect(root.getAttribute('aria-hidden')).toBe('true');
		expect(root.hasAttribute('aria-label')).toBe(false);
	});

	it('supports granular classes.root and classes.icon', async () => {
		render(Spinner, {
			'data-testid': 'spinner',
			classes: { root: 'custom-root-cls', icon: 'custom-icon-cls' }
		});

		const root = page.getByTestId('spinner').element();
		const svg = root.querySelector('svg');

		expect(root.className).toContain('custom-root-cls');
		expect(svg?.getAttribute('class')).toContain('custom-icon-cls');
	});

	it('binds ref to the root element via harness', async () => {
		render(SpinnerHarness);

		await expect.element(page.getByTestId('has-ref')).toHaveTextContent('yes');
	});

	it('renders a custom icon snippet with size payload', async () => {
		render(SpinnerHarness, { customIcon: true, size: 'lg' });

		const customIcon = page.getByTestId('custom-spinner-icon');
		await expect.element(customIcon).toBeInTheDocument();
		await expect.element(customIcon).toHaveTextContent('CUSTOM_SPINNER_lg');
	});
});
