import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Badge from './Badge.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>New</span>`
}));

describe('Badge.svelte', () => {
	it('renders its children', async () => {
		render(Badge, { children: text });

		await expect.element(page.getByText('New')).toBeInTheDocument();
	});

	it('lets a consumer class override an internal one', async () => {
		render(Badge, { children: text, class: 'rounded-md' });

		const el = page.getByText('New').element().parentElement;

		expect(el?.className).toContain('rounded-md');
		expect(el?.className).not.toContain('rounded-full');
	});

	it('forwards unrecognized attributes', async () => {
		render(Badge, { children: text, id: 'status-badge' });

		const el = page.getByText('New').element().parentElement;

		expect(el?.id).toBe('status-badge');
	});
});
