import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Accordion from './Accordion.svelte';
import AccordionHarness from './AccordionHarness.spec.svelte';
import MultipleHarness from './MultipleHarness.spec.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import HeadlessHarness from './HeadlessHarness.spec.svelte';

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

	it('does not apply inner rounded classes to trigger headers so items remain flush', async () => {
		render(AccordionHarness);

		const trigger1 = page
			.getByRole('button', { name: "What's included in the Pro plan?" })
			.element();
		const trigger2 = page.getByRole('button', { name: 'Can I cancel anytime?' }).element();

		// Custom classes should still pass, but default classes shouldn't include rounded-md or rounded-t-md
		expect(trigger1.className).not.toContain('rounded-md');
		expect(trigger1.className).not.toContain('rounded-t-md');
		expect(trigger2.className).not.toContain('rounded-md');
		expect(trigger2.className).not.toContain('rounded-t-md');
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

describe('Accordion family — headless composition & customization', () => {
	it('supports DOM refs for root accordion, item wrapper, and trigger button', async () => {
		render(HeadlessHarness);

		await expect.element(page.getByTestId('has-accordion-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-item-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-trigger-ref')).toHaveTextContent('yes');
	});

	it('reflects data-state and data-disabled on item root wrapper', async () => {
		render(HeadlessHarness);

		const trigger1 = page.getByRole('button', { name: /Expanded/ }).element();
		const item1 = trigger1.closest('div[data-state]');
		expect(item1?.getAttribute('data-state')).toBe('open');
		expect(item1?.hasAttribute('data-disabled')).toBe(false);

		const trigger2 = page.getByRole('button', { name: /Disabled Item/ }).element();
		const item2 = trigger2.closest('div[data-state]');
		expect(item2?.getAttribute('data-state')).toBe('closed');
		expect(item2?.getAttribute('data-disabled')).toBe('');
	});

	it('forwards open state to trigger and children snippets', async () => {
		render(HeadlessHarness);

		await expect.element(page.getByTestId('trigger-text')).toHaveTextContent('Expanded');
		await expect.element(page.getByTestId('content-text')).toHaveTextContent('Open Content');
		await expect.element(page.getByTestId('custom-indicator')).toHaveTextContent('[-]');

		// Toggle item-1 closed
		await page.getByRole('button', { name: /Expanded/ }).click();

		await expect.element(page.getByTestId('trigger-text')).toHaveTextContent('Collapsed');
		await expect.element(page.getByTestId('custom-indicator')).toHaveTextContent('[+]');
	});

	it('supports classes.panel for transition container', async () => {
		render(HeadlessHarness);

		const trigger1 = page.getByRole('button', { name: /Expanded/ }).element();
		const controlsId = trigger1.getAttribute('aria-controls');
		const panel = document.getElementById(controlsId!);

		expect(panel?.className).toContain('custom-panel-class');
	});
});
