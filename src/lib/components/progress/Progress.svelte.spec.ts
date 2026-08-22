import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Progress from './Progress.svelte';

describe('Progress.svelte', () => {
	it('exposes value via the progressbar role and ARIA attributes', async () => {
		render(Progress, { value: 40, 'aria-label': 'Upload progress' });

		const el = page.getByRole('progressbar').element();

		expect(el.getAttribute('aria-valuenow')).toBe('40');
		expect(el.getAttribute('aria-valuemin')).toBe('0');
		expect(el.getAttribute('aria-valuemax')).toBe('100');
	});

	it('defaults to a value of 0', async () => {
		render(Progress, { 'aria-label': 'Upload progress' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
	});

	it('scales aria-valuemax to a custom max', async () => {
		render(Progress, { value: 3, max: 5, 'aria-label': 'Steps' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
	});

	it('sets the fill width proportional to value/max', async () => {
		render(Progress, { value: 3, max: 5, 'aria-label': 'Steps' });

		const fill = page.getByRole('progressbar').element().firstElementChild as HTMLElement;

		expect(fill.style.width).toBe('60%');
	});

	it('clamps the fill width to 100% when value exceeds max', async () => {
		render(Progress, { value: 150, 'aria-label': 'Upload progress' });

		const fill = page.getByRole('progressbar').element().firstElementChild as HTMLElement;

		expect(fill.style.width).toBe('100%');
	});

	it('omits aria-valuenow and sets a sweeping fill when indeterminate', async () => {
		render(Progress, { indeterminate: true, 'aria-label': 'Loading' });

		const el = page.getByRole('progressbar').element();
		expect(el.hasAttribute('aria-valuenow')).toBe(false);

		const fill = el.firstElementChild as HTMLElement;
		expect(fill.className).toContain('animate-progress-indeterminate');
		expect(fill.style.width).toBe('');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Progress, { 'aria-label': 'Upload progress', class: 'h-4' });

		const el = page.getByRole('progressbar').element();

		expect(el.className).toContain('h-4');
		expect(el.className).not.toContain('h-2');
	});

	it('forwards unrecognized attributes', async () => {
		render(Progress, { 'aria-label': 'Upload progress', id: 'upload-progress' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('id', 'upload-progress');
	});
});
