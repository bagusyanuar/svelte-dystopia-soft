import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Typography from './Typography.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>Hello</span>`
}));

describe('Typography.svelte', () => {
	it('renders the heading element implied by the variant', async () => {
		render(Typography, { variant: 'h2', children: text });

		await expect.element(page.getByRole('heading', { level: 2 })).toBeInTheDocument();
	});

	it('renders a paragraph by default', async () => {
		render(Typography, { children: text });

		expect(page.getByText('Hello').element().closest('p')).not.toBeNull();
	});

	it('keeps the variant styling when as overrides the element', async () => {
		render(Typography, { variant: 'h1', as: 'span', children: text });

		const el = page.getByText('Hello').element().parentElement;

		expect(el?.tagName).toBe('SPAN');
		expect(el?.className).toContain('text-2xl');
	});

	it('merges a consumer class over the variant class', async () => {
		render(Typography, { variant: 'h1', class: 'text-sm', children: text });

		const el = page.getByText('Hello').element().parentElement;

		expect(el?.className).toContain('text-sm');
		expect(el?.className).not.toContain('text-2xl');
	});

	it('forwards unrecognized attributes', async () => {
		render(Typography, { variant: 'h3', id: 'section-title', children: text });

		await expect
			.element(page.getByRole('heading', { level: 3 }))
			.toHaveAttribute('id', 'section-title');
	});
});
