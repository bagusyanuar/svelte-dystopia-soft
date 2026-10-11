import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Card from './Card.svelte';
import CardHeader from './CardHeader.svelte';
import CardTitle from './CardTitle.svelte';
import CardDescription from './CardDescription.svelte';
import CardContent from './CardContent.svelte';
import CardFooter from './CardFooter.svelte';
import CardHarness from './CardHarness.spec.svelte';
import CardRefHarness from './CardRefHarness.spec.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>Content</span>`
}));

describe('Card family', () => {
	it('composes a full card with header, content, and footer', async () => {
		render(CardHarness);

		await expect.element(page.getByText('Team plan')).toBeInTheDocument();
		await expect
			.element(page.getByText('Everything your team needs to ship faster.'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Unlimited projects and priority support.'))
			.toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
	});

	it('nests header, content, and footer inside the card root', async () => {
		render(CardHarness);

		const root = page.getByTestId('card-root').element();

		expect(root.contains(page.getByText('Team plan').element())).toBe(true);
		expect(root.contains(page.getByRole('button', { name: 'Upgrade' }).element())).toBe(true);
	});

	it.each([
		['Card', () => render(Card, { children: text, class: 'my-custom-class' })],
		['CardHeader', () => render(CardHeader, { children: text, class: 'my-custom-class' })],
		['CardTitle', () => render(CardTitle, { children: text, class: 'my-custom-class' })],
		[
			'CardDescription',
			() => render(CardDescription, { children: text, class: 'my-custom-class' })
		],
		['CardContent', () => render(CardContent, { children: text, class: 'my-custom-class' })],
		['CardFooter', () => render(CardFooter, { children: text, class: 'my-custom-class' })]
	])('%s renders its children and forwards a class override', async (_name, renderComponent) => {
		renderComponent();

		await expect.element(page.getByText('Content')).toBeInTheDocument();

		const el = page.getByText('Content').element().closest('div');
		expect(el?.className).toContain('my-custom-class');
	});

	it.each([
		['Card', () => render(Card, { children: text, id: 'probe-id' })],
		['CardHeader', () => render(CardHeader, { children: text, id: 'probe-id' })],
		['CardTitle', () => render(CardTitle, { children: text, id: 'probe-id' })],
		['CardDescription', () => render(CardDescription, { children: text, id: 'probe-id' })],
		['CardContent', () => render(CardContent, { children: text, id: 'probe-id' })],
		['CardFooter', () => render(CardFooter, { children: text, id: 'probe-id' })]
	])('%s forwards unrecognized attributes', async (_name, renderComponent) => {
		renderComponent();

		const el = page.getByText('Content').element().closest('div');
		expect(el?.id).toBe('probe-id');
	});

	// --- Semi-headless capability tests ---

	it('binds DOM element ref across all 6 subcomponents', async () => {
		render(CardRefHarness);

		await expect.element(page.getByTestId('refs-bound')).toHaveTextContent('all-bound');
	});

	it('exposes data-slot attributes on all 6 subcomponents', async () => {
		render(CardRefHarness);

		await expect.element(page.getByTestId('ref-card')).toHaveAttribute('data-slot', 'card');
		await expect
			.element(page.getByTestId('ref-header'))
			.toHaveAttribute('data-slot', 'card-header');
		await expect.element(page.getByTestId('ref-title')).toHaveAttribute('data-slot', 'card-title');
		await expect
			.element(page.getByTestId('ref-desc'))
			.toHaveAttribute('data-slot', 'card-description');
		await expect
			.element(page.getByTestId('ref-content'))
			.toHaveAttribute('data-slot', 'card-content');
		await expect
			.element(page.getByTestId('ref-footer'))
			.toHaveAttribute('data-slot', 'card-footer');
	});

	it('swaps underlying HTML element when as prop is supplied', async () => {
		render(CardRefHarness);

		const cardEl = page.getByTestId('ref-card').element();
		const titleEl = page.getByTestId('ref-title').element();
		const descEl = page.getByTestId('ref-desc').element();

		expect(cardEl.tagName.toLowerCase()).toBe('article');
		expect(titleEl.tagName.toLowerCase()).toBe('h3');
		expect(descEl.tagName.toLowerCase()).toBe('p');
	});

	it('renders without children without throwing an error', async () => {
		render(Card, { 'data-testid': 'empty-card' });
		render(CardHeader, { 'data-testid': 'empty-header' });
		render(CardTitle, { 'data-testid': 'empty-title' });
		render(CardDescription, { 'data-testid': 'empty-desc' });
		render(CardContent, { 'data-testid': 'empty-content' });
		render(CardFooter, { 'data-testid': 'empty-footer' });

		await expect.element(page.getByTestId('empty-card')).toBeInTheDocument();
		await expect.element(page.getByTestId('empty-header')).toBeInTheDocument();
		await expect.element(page.getByTestId('empty-title')).toBeInTheDocument();
		await expect.element(page.getByTestId('empty-desc')).toBeInTheDocument();
		await expect.element(page.getByTestId('empty-content')).toBeInTheDocument();
		await expect.element(page.getByTestId('empty-footer')).toBeInTheDocument();
	});
});
