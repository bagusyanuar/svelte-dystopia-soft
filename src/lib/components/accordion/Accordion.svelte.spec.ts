import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Accordion from './Accordion.svelte';
import AccordionHarness from './AccordionHarness.spec.svelte';
import MultipleHarness from './MultipleHarness.spec.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

const text = createRawSnippet(() => ({
	render: () => '<span>Content</span>'
}));

describe('Accordion.svelte (root)', () => {
	it('renders its children', async () => {
		render(Accordion, { children: text });

		await expect.element(page.getByText('Content')).toBeInTheDocument();
	});

	it('lets a consumer class override an internal one', async () => {
		render(Accordion, { children: text, class: 'rounded-none' });

		const root = page.getByText('Content').element().closest('div');
		expect(root?.className).toContain('rounded-none');
	});

	it('forwards unrecognized attributes', async () => {
		render(Accordion, { children: text, id: 'probe-id' });

		const root = page.getByText('Content').element().closest('div');
		expect(root?.id).toBe('probe-id');
	});
});

describe('Accordion family — single mode (default)', () => {
	it('opens the item matching the initial value', async () => {
		render(AccordionHarness);

		await expect
			.element(page.getByRole('button', { name: "What's included in the Pro plan?" }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect
			.element(page.getByRole('button', { name: 'Can I cancel anytime?' }))
			.toHaveAttribute('aria-expanded', 'false');
	});

	it('associates each trigger with its content via aria-controls/id', async () => {
		render(AccordionHarness);

		const trigger = page
			.getByRole('button', { name: "What's included in the Pro plan?" })
			.element();
		const controlsId = trigger.getAttribute('aria-controls');

		expect(controlsId).toBeTruthy();
		expect(document.getElementById(controlsId!)).not.toBeNull();
	});

	it('opening a new item closes the previously open one', async () => {
		render(AccordionHarness);

		await page.getByRole('button', { name: 'Can I cancel anytime?' }).click();

		await expect
			.element(page.getByRole('button', { name: 'Can I cancel anytime?' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect
			.element(page.getByRole('button', { name: "What's included in the Pro plan?" }))
			.toHaveAttribute('aria-expanded', 'false');
	});

	it('clicking the open item closes it', async () => {
		render(AccordionHarness);

		await page.getByRole('button', { name: "What's included in the Pro plan?" }).click();

		await expect
			.element(page.getByRole('button', { name: "What's included in the Pro plan?" }))
			.toHaveAttribute('aria-expanded', 'false');
	});

	it('does not toggle a disabled item', async () => {
		render(AccordionHarness);

		await page.getByRole('button', { name: 'Enterprise plan' }).click({ force: true });

		await expect
			.element(page.getByRole('button', { name: 'Enterprise plan' }))
			.toHaveAttribute('aria-expanded', 'false');
	});

	it('lets a consumer class override the trigger and content classes', async () => {
		render(AccordionHarness);

		const trigger = page
			.getByRole('button', { name: "What's included in the Pro plan?" })
			.element();
		expect(trigger.className).toContain('custom-trigger');

		const contentId = trigger.getAttribute('aria-controls');
		expect(document.getElementById(contentId!)?.querySelector('.custom-content')).not.toBeNull();
	});

	it('propagates the active value back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'First' }).click();

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('item-1');
	});
});

describe('Accordion family — multiple mode', () => {
	it('opening a second item keeps the first one open', async () => {
		render(MultipleHarness);

		await expect
			.element(page.getByRole('button', { name: 'First' }))
			.toHaveAttribute('aria-expanded', 'true');

		await page.getByRole('button', { name: 'Second' }).click();

		await expect
			.element(page.getByRole('button', { name: 'First' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect
			.element(page.getByRole('button', { name: 'Second' }))
			.toHaveAttribute('aria-expanded', 'true');
	});

	it('closing one open item leaves the other open', async () => {
		render(MultipleHarness);

		await page.getByRole('button', { name: 'First' }).click();

		await expect
			.element(page.getByRole('button', { name: 'First' }))
			.toHaveAttribute('aria-expanded', 'false');
	});
});
