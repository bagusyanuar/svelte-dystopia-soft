import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Skeleton from './Skeleton.svelte';

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
});
