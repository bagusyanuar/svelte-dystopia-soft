import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HoverCard from './HoverCard.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

const content = createRawSnippet(() => ({
	render: () => `<div data-testid="hovercard-content"><a href="/profile">View profile</a></div>`
}));
const triggerChildren = createRawSnippet(() => ({
	render: () => `<a href="/user">@ada</a>`
}));

function trigger() {
	return page.getByRole('link', { name: '@ada' });
}

function cardContent() {
	return page.getByTestId('hovercard-content');
}

describe('HoverCard.svelte', () => {
	it('renders the trigger', async () => {
		render(HoverCard, { content, children: triggerChildren });

		await expect.element(trigger()).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(HoverCard, { content, children: triggerChildren });

		await expect.element(cardContent()).not.toBeInTheDocument();
	});

	it('shows on hover once the open delay elapses', async () => {
		render(HoverCard, { content, children: triggerChildren, openDelay: 30 });

		await trigger().hover();

		await expect.element(cardContent()).toBeInTheDocument();
	});

	it('does not show before the open delay elapses', async () => {
		render(HoverCard, { content, children: triggerChildren, openDelay: 10_000 });

		await trigger().hover();

		await expect.element(cardContent()).not.toBeInTheDocument();
	});

	it('shows immediately on focus, without waiting for the open delay', async () => {
		render(HoverCard, { content, children: triggerChildren, openDelay: 10_000 });

		await trigger().element().focus();

		await expect.element(cardContent()).toBeInTheDocument();
	});

	it('stays open when the pointer travels from the trigger into the card within the close delay', async () => {
		render(HoverCard, {
			content,
			children: triggerChildren,
			openDelay: 0,
			// unhover() and hover() are two separate real pointer actions, each a
			// round trip through the automation driver — under load (e.g. the
			// full suite running many files in parallel) that transit can take
			// longer than a short delay leaves room for, closing the card before
			// the second hover ever lands and making this test flaky. A generous
			// delay keeps the assertion meaningful without racing test infra
			// overhead.
			closeDelay: 1000
		});

		await trigger().hover();
		await expect.element(cardContent()).toBeInTheDocument();

		await trigger().unhover();
		await cardContent().hover();

		// Well past the original close-delay window — still open because
		// hovering the card cancelled the pending close.
		await new Promise((resolve) => setTimeout(resolve, 1500));
		await expect.element(cardContent()).toBeInTheDocument();
	});

	it('closes after the close delay when the pointer leaves the trigger without entering the card', async () => {
		render(HoverCard, {
			content,
			children: triggerChildren,
			openDelay: 0,
			closeDelay: 30
		});

		await trigger().hover();
		await expect.element(cardContent()).toBeInTheDocument();

		await trigger().unhover();

		await expect.element(cardContent()).not.toBeInTheDocument();
	});

	it('closes after the close delay when the pointer leaves the card', async () => {
		render(HoverCard, {
			content,
			children: triggerChildren,
			openDelay: 0,
			closeDelay: 30
		});

		await trigger().hover();
		await cardContent().hover();
		await expect.element(cardContent()).toBeInTheDocument();

		await cardContent().unhover();

		await expect.element(cardContent()).not.toBeInTheDocument();
	});

	it('stays open when focus moves from the trigger into a link inside the card', async () => {
		render(HoverCard, { content, children: triggerChildren, openDelay: 0, closeDelay: 30 });

		await trigger().element().focus();
		await expect.element(cardContent()).toBeInTheDocument();

		await userEvent.keyboard('{Tab}');

		await expect.element(page.getByRole('link', { name: 'View profile' })).toHaveFocus();
		await expect.element(cardContent()).toBeInTheDocument();
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		render(HoverCard, { content, children: triggerChildren, openDelay: 0 });

		await trigger().element().focus();
		await expect.element(cardContent()).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await expect.element(cardContent()).not.toBeInTheDocument();
		await expect.element(trigger()).toHaveFocus();
	});

	it('closes when clicking outside the trigger and card', async () => {
		const { container } = render(HoverCard, { content, children: triggerChildren, openDelay: 0 });
		const outside = document.createElement('button');
		outside.textContent = 'Outside';
		container.append(outside);

		await trigger().hover();
		await expect.element(cardContent()).toBeInTheDocument();

		await page.getByRole('button', { name: 'Outside' }).click();

		await expect.element(cardContent()).not.toBeInTheDocument();

		outside.remove();
	});

	it('propagates the open state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('link', { name: '@ada' }).hover();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override the internal content class', async () => {
		render(HoverCard, {
			content,
			children: triggerChildren,
			openDelay: 0,
			classes: { content: 'rounded-md' }
		});

		await trigger().hover();

		const el = cardContent().element().parentElement!;
		expect(el.className).toContain('rounded-md');
		expect(el.className).not.toContain('rounded-lg');
	});

	it('portals the card out of the component container', async () => {
		const { container } = render(HoverCard, { content, children: triggerChildren, openDelay: 0 });

		await trigger().hover();
		await expect.element(cardContent()).toBeInTheDocument();

		const cardEl = cardContent().element().parentElement!;
		expect(cardEl.parentElement).toBe(document.body);
		expect(container.contains(cardEl)).toBe(false);
	});
});
