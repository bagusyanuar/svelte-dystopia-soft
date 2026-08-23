import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Popover from './Popover.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

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

		// Left in flow, the portalled panel lands at the end of <body> and a
		// focus() call scrolls the page away from the trigger before floating-ui
		// ever reports coordinates.
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

		// Mid-animation: closed, but deliberately still in the DOM.
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
});
