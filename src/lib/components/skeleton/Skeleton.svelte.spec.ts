import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Skeleton from './Skeleton.svelte';
import SkeletonHarness from './SkeletonHarness.spec.svelte';

describe('Skeleton.svelte', () => {
	it('is hidden from assistive tech since it carries no content', async () => {
		render(Skeleton, { 'data-testid': 'skeleton' });

		expect(page.getByTestId('skeleton').element().getAttribute('aria-hidden')).toBe('true');
	});

	it('lets a consumer size and shape it via class', async () => {
		render(Skeleton, { 'data-testid': 'skeleton', class: 'h-4 w-32 rounded-full' });

		const el = page.getByTestId('skeleton').element();

		expect(el.className).toContain('h-4');
		expect(el.className).toContain('w-32');
		expect(el.className).toContain('rounded-full');
		expect(el.className).not.toContain('rounded-md');
	});

	it('forwards unrecognized attributes', async () => {
		render(Skeleton, { 'data-testid': 'skeleton', id: 'avatar-skeleton' });

		expect(page.getByTestId('skeleton').element().id).toBe('avatar-skeleton');
	});

	// --- Semi-headless capability tests ---

	it('exposes data-slot="skeleton" on the root element', async () => {
		render(Skeleton, { 'data-testid': 'skeleton' });

		const el = page.getByTestId('skeleton').element();
		expect(el.getAttribute('data-slot')).toBe('skeleton');
	});

	it('binds ref to the root element via harness', async () => {
		render(SkeletonHarness);

		await expect.element(page.getByTestId('has-ref')).toHaveTextContent('yes');
	});
});
