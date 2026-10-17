import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Typography from './Typography.svelte';
import TypographySemiHeadlessHarness from './TypographySemiHeadlessHarness.spec.svelte';

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

	it('exposes data-slot and data-variant attributes', async () => {
		render(Typography, { variant: 'h4', children: text });

		const el = page.getByText('Hello').element().parentElement;
		expect(el?.getAttribute('data-slot')).toBe('typography');
		expect(el?.getAttribute('data-variant')).toBe('h4');
	});

	it('binds DOM element ref to the underlying element', async () => {
		render(TypographySemiHeadlessHarness, { testRef: true });

		await expect.element(page.getByTestId('ref-status')).toHaveTextContent('bound');
	});

	it('supports text prop directly without children snippet', async () => {
		render(TypographySemiHeadlessHarness, { testTextProp: true });

		const el = page.getByText('Direct String Content');
		await expect.element(el).toBeInTheDocument();
		expect(el.element().tagName).toBe('H3');
	});

	it('renders custom element via child snippet pattern forwarding props and variant', async () => {
		render(TypographySemiHeadlessHarness, { testChild: true });

		const childEl = page.getByTestId('custom-child');
		await expect.element(childEl).toBeInTheDocument();
		await expect.element(childEl).toHaveAttribute('data-slot', 'typography');
		await expect.element(childEl).toHaveAttribute('data-variant', 'lead');
		await expect.element(childEl).toHaveAttribute('data-variant-name', 'lead');
		expect(childEl.element().tagName).toBe('A');
	});

	it('renders code, blockquote, and lead variants with appropriate default tags', async () => {
		render(Typography, { variant: 'code', text: 'git status' });
		const codeEl = page.getByText('git status');
		await expect.element(codeEl).toBeInTheDocument();
		expect(codeEl.element().tagName).toBe('CODE');

		render(Typography, { variant: 'blockquote', text: 'A wise quote' });
		const quoteEl = page.getByText('A wise quote');
		await expect.element(quoteEl).toBeInTheDocument();
		expect(quoteEl.element().tagName).toBe('BLOCKQUOTE');

		render(Typography, { variant: 'lead', text: 'Important lead summary' });
		const leadEl = page.getByText('Important lead summary');
		await expect.element(leadEl).toBeInTheDocument();
		expect(leadEl.element().tagName).toBe('P');
	});
});
