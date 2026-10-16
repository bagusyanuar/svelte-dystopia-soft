import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Popover from './Popover.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import PopoverSemiHeadlessHarness from './PopoverSemiHeadlessHarness.spec.svelte';

const trigger = createRawSnippet(() => ({
	render: () => `<span>Open</span>`
}));
const content = createRawSnippet(() => ({
	render: () => `<p>Panel content</p>`
}));

describe('Popover.svelte', () => {
	it('renders the trigger', async () => {
		render(Popover, { trigger, children: content });

		await expect.element(page.getByRole('button', { name: 'Open' })).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(Popover, { trigger, children: content });

		await expect
			.element(page.getByRole('button', { name: 'Open' }))
			.toHaveAttribute('aria-expanded', 'false');
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens the panel when the trigger is clicked', async () => {
		render(Popover, { trigger, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		await expect
			.element(page.getByRole('button', { name: 'Open' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();
	});

	it('associates the trigger with the panel it controls via aria-controls', async () => {
		render(Popover, { trigger, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const button = page.getByRole('button', { name: 'Open' }).element();
		const controlsId = button.getAttribute('aria-controls');

		expect(controlsId).toBeTruthy();
		expect(document.getElementById(controlsId!)?.textContent).toContain('Panel content');
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		render(Popover, { trigger, children: content });

		const button = page.getByRole('button', { name: 'Open' });
		await button.click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		await expect.element(button).toHaveFocus();
	});

	it('closes when clicking outside the trigger and panel', async () => {
		const { container } = render(Popover, { trigger, children: content });
		const outside = document.createElement('button');
		outside.textContent = 'Outside';
		container.append(outside);

		await page.getByRole('button', { name: 'Open' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await userEvent.click(outside);

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();

		outside.remove();
	});

	it('portals the panel out of the component container, so a clipping ancestor cannot scroll or hide it', async () => {
		const { container } = render(Popover, { trigger, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		expect(dialog.parentElement).toBe(document.body);
		expect(container.contains(dialog)).toBe(false);
	});

	it('takes the panel out of normal flow immediately, before async positioning resolves', async () => {
		render(Popover, { trigger, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		expect(getComputedStyle(dialog).position).toBe('fixed');
	});

	it('keeps the panel mounted until a consumer exit animation finishes', async () => {
		const style = document.createElement('style');
		style.textContent = `
			@keyframes popover-exit-test { to { opacity: 0; } }
			.exit-test[data-state='closed'] { animation: popover-exit-test 300ms linear; }
		`;
		document.head.append(style);

		render(Popover, { trigger, children: content, classes: { content: 'exit-test' } });

		await page.getByRole('button', { name: 'Open' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		const midFlight = document.querySelector('[role="dialog"]');
		expect(midFlight?.getAttribute('data-state')).toBe('closed');

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();

		style.remove();
	});

	it('hides the exiting panel from assistive tech while it animates out', async () => {
		const style = document.createElement('style');
		style.textContent = `
			@keyframes popover-exit-test-2 { to { opacity: 0; } }
			.exit-test-2[data-state='closed'] { animation: popover-exit-test-2 300ms linear; }
		`;
		document.head.append(style);

		render(Popover, { trigger, children: content, classes: { content: 'exit-test-2' } });

		await page.getByRole('button', { name: 'Open' }).click();
		await userEvent.keyboard('{Escape}');

		expect((document.querySelector('[role="dialog"]') as HTMLElement | null)?.inert).toBe(true);

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();

		style.remove();
	});

	it('propagates the open state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override the internal trigger class', async () => {
		render(Popover, {
			trigger,
			children: content,
			classes: { trigger: 'rounded-full' }
		});

		const button = page.getByRole('button', { name: 'Open' }).element();

		expect(button.className).toContain('rounded-full');
		expect(button.className).not.toContain('rounded-md');
	});

	it('exposes ref, triggerRef, and contentRef bound to respective elements', async () => {
		render(PopoverSemiHeadlessHarness);

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
		await expect.element(status).toHaveAttribute('data-has-trigger', 'true');

		// Open popover so content mounts
		await page.getByTestId('trigger-text').click();
		await expect.element(status).toHaveAttribute('data-has-content', 'true');
	});

	it('exposes data-slot and data-placement attributes on trigger and content', async () => {
		render(Popover, {
			trigger,
			children: content,
			placement: 'top-end'
		});

		const button = document.querySelector('[data-slot="popover-trigger"]');
		expect(button).toBeTruthy();

		await page.getByRole('button', { name: 'Open' }).click();

		const contentEl = document.querySelector('[data-slot="popover-content"]');
		expect(contentEl).toBeTruthy();
		expect(contentEl?.hasAttribute('data-placement')).toBe(true);
	});

	it('allows primary class to style trigger button alongside classes.trigger', async () => {
		render(Popover, {
			trigger,
			children: content,
			class: 'custom-primary-class',
			classes: { trigger: 'custom-part-class' }
		});

		const button = page.getByRole('button', { name: 'Open' }).element();
		expect(button.className).toContain('custom-primary-class');
		expect(button.className).toContain('custom-part-class');
	});

	it('provides open and close payload to trigger and children snippets, closing via internal button', async () => {
		render(PopoverSemiHeadlessHarness);

		const triggerText = page.getByTestId('trigger-text');
		await expect.element(triggerText).toHaveTextContent('IS_CLOSED');

		await triggerText.click();
		await expect.element(triggerText).toHaveTextContent('IS_OPEN');
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		// Click the internal close button rendered by children({ close })
		await page.getByTestId('internal-close-btn').click();

		await expect.element(triggerText).toHaveTextContent('IS_CLOSED');
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('calls onOpenChange callback when opening and closing', async () => {
		const onOpenChange = vi.fn();
		render(PopoverSemiHeadlessHarness, { onOpenChange });

		await page.getByTestId('trigger-text').click();
		expect(onOpenChange).toHaveBeenCalledWith(true);

		await page.getByTestId('internal-close-btn').click();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
