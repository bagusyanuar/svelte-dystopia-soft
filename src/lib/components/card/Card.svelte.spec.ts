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
		['Card', Card],
		['CardHeader', CardHeader],
		['CardTitle', CardTitle],
		['CardDescription', CardDescription],
		['CardContent', CardContent],
		['CardFooter', CardFooter]
	])('%s renders its children and forwards a class override', async (_name, Component) => {
		render(Component, { children: text, class: 'my-custom-class' });

		await expect.element(page.getByText('Content')).toBeInTheDocument();

		const el = page.getByText('Content').element().closest('div');
		expect(el?.className).toContain('my-custom-class');
	});

	it.each([
		['Card', Card],
		['CardHeader', CardHeader],
		['CardTitle', CardTitle],
		['CardDescription', CardDescription],
		['CardContent', CardContent],
		['CardFooter', CardFooter]
	])('%s forwards unrecognized attributes', async (_name, Component) => {
		render(Component, { children: text, id: 'probe-id' });

		const el = page.getByText('Content').element().closest('div');
		expect(el?.id).toBe('probe-id');
	});
});
