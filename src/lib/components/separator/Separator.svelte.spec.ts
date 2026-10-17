import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Separator from './Separator.svelte';
import SeparatorHarness from './SeparatorHarness.spec.svelte';

describe('Separator.svelte', () => {
	it('has no separator role by default (decorative)', async () => {
		render(Separator, { 'data-testid': 'sep' });

		await expect.element(page.getByRole('separator')).not.toBeInTheDocument();
	});

	it('exposes a separator role with the orientation when not decorative', async () => {
		render(Separator, { decorative: false, orientation: 'vertical' });

		await expect
			.element(page.getByRole('separator'))
			.toHaveAttribute('aria-orientation', 'vertical');
	});

	it('renders as a thin horizontal line by default', async () => {
		render(Separator, { 'data-testid': 'sep' });

		const el = page.getByTestId('sep').element();
		expect(el.className).toContain('h-px');
		expect(el.className).toContain('w-full');
	});

	it('renders as a thin vertical line when orientation is vertical', async () => {
		render(Separator, { 'data-testid': 'sep', orientation: 'vertical' });

		const el = page.getByTestId('sep').element();
		expect(el.className).toContain('w-px');
		expect(el.className).toContain('h-full');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Separator, { 'data-testid': 'sep', class: 'bg-primary' });

		const el = page.getByTestId('sep').element();
		expect(el.className).toContain('bg-primary');
	});

	it('forwards unrecognized attributes', async () => {
		render(Separator, { 'data-testid': 'sep', id: 'probe-id' });

		await expect.element(page.getByTestId('sep')).toHaveAttribute('id', 'probe-id');
	});

	// --- Semi-headless capability tests ---

	it('exposes data-slot and default data-orientation attributes', async () => {
		render(Separator, { 'data-testid': 'sep' });

		const el = page.getByTestId('sep').element();
		expect(el.getAttribute('data-slot')).toBe('separator');
		expect(el.getAttribute('data-orientation')).toBe('horizontal');
		expect(el.hasAttribute('data-decorative')).toBe(true);
	});

	it('exposes vertical data-orientation and removes data-decorative when decorative is false', async () => {
		render(Separator, { 'data-testid': 'sep', orientation: 'vertical', decorative: false });

		const el = page.getByTestId('sep').element();
		expect(el.getAttribute('data-slot')).toBe('separator');
		expect(el.getAttribute('data-orientation')).toBe('vertical');
		expect(el.hasAttribute('data-decorative')).toBe(false);
	});

	it('binds ref to the root element via harness', async () => {
		render(SeparatorHarness);

		await expect.element(page.getByTestId('has-ref')).toHaveTextContent('yes');
	});
});
