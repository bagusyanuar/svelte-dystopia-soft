import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Dialog from './Dialog.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import DialogSemiHeadlessHarness from './DialogSemiHeadlessHarness.spec.svelte';

const trigger = createRawSnippet(() => ({
	render: () => `<span>Open</span>`
}));
const title = createRawSnippet(() => ({
	render: () => `<span>Delete project</span>`
}));
const description = createRawSnippet(() => ({
	render: () => `<span>This cannot be undone.</span>`
}));
const content = createRawSnippet(() => ({
	render: () => `<p>Are you sure?</p>`
}));
const contentWithButton = createRawSnippet(() => ({
	render: () => `<div><p>Are you sure?</p><button>Confirm</button></div>`
}));

afterEach(() => {
	document.body.style.overflow = '';
	document.body.style.paddingRight = '';
});

describe('Dialog.svelte', () => {
	it('renders the trigger', async () => {
		render(Dialog, { trigger, title, children: content });

		await expect.element(page.getByRole('button', { name: 'Open' })).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(Dialog, { trigger, title, children: content });

		await expect
			.element(page.getByRole('button', { name: 'Open' }))
			.toHaveAttribute('aria-expanded', 'false');
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens when the trigger is clicked', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		await expect
			.element(page.getByRole('button', { name: 'Open' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();
	});

	it('associates the dialog with its title via aria-labelledby', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		const labelledBy = dialog.getAttribute('aria-labelledby');

		expect(labelledBy).toBeTruthy();
		expect(document.getElementById(labelledBy!)?.textContent).toContain('Delete project');
	});

	it('associates the dialog with its description via aria-describedby when given', async () => {
		render(Dialog, { trigger, title, description, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		const describedBy = dialog.getAttribute('aria-describedby');

		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)?.textContent).toContain('cannot be undone');
	});

	it('omits aria-describedby when no description is given', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		expect(page.getByRole('dialog').element().hasAttribute('aria-describedby')).toBe(false);
	});

	it('moves focus into the dialog when it opens', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByRole('button', { name: 'Close' })).toHaveFocus();
	});

	it('traps Tab focus within the dialog', async () => {
		render(Dialog, { trigger, title, children: contentWithButton });

		await page.getByRole('button', { name: 'Open' }).click();
		// Content renders before the built-in close button, so the "Confirm"
		// button is the dialog's first focusable element and gets initial focus.
		await expect.element(page.getByRole('button', { name: 'Confirm' })).toHaveFocus();

		await userEvent.tab();
		await expect.element(page.getByRole('button', { name: 'Close' })).toHaveFocus();

		// Wraps from the last focusable element back to the first.
		await userEvent.tab();
		await expect.element(page.getByRole('button', { name: 'Confirm' })).toHaveFocus();
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		render(Dialog, { trigger, title, children: content });

		const openButton = page.getByRole('button', { name: 'Open' });
		await openButton.click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		await expect.element(openButton).toHaveFocus();
	});

	it('closes when the close button is clicked', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();
		await page.getByRole('button', { name: 'Close' }).click();

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes when clicking the overlay', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		// The overlay is an empty full-viewport box with no intrinsic content —
		// its hit area comes entirely from Tailwind's `fixed inset-0`, which this
		// browser test project doesn't load a stylesheet for. A real coordinate
		// click would land on a collapsed 0x0 box, so dispatch the pointerdown
		// directly to exercise the dismissable-layer wiring instead of layout.
		const overlay = document.querySelector('[data-state="open"][aria-hidden="true"]')!;
		overlay.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('does not close when clicking inside the dialog content', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();
		await page.getByText('Are you sure?').click();

		await expect.element(page.getByRole('dialog')).toBeInTheDocument();
	});

	it('locks body scroll while open and restores it on close', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();
		expect(document.body.style.overflow).toBe('hidden');

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		expect(document.body.style.overflow).toBe('');
	});

	it('portals the overlay and content out of the component container', async () => {
		const { container } = render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		// The content sits inside its centring wrapper, which is itself portalled
		// to <body> — so assert it escaped the component container rather than
		// pinning the exact depth.
		const dialog = page.getByRole('dialog').element();
		expect(container.contains(dialog)).toBe(false);
		expect(dialog.closest('body')).toBe(document.body);
		expect(dialog.parentElement?.parentElement).toBe(document.body);
	});

	it('propagates the open state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override the internal content class', async () => {
		render(Dialog, {
			trigger,
			title,
			children: content,
			classes: { content: 'rounded-md' }
		});

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		expect(dialog.className).toContain('rounded-md');
		expect(dialog.className).not.toContain('rounded-lg');
	});

	it('lets a consumer override the close button label', async () => {
		render(Dialog, {
			trigger,
			title,
			children: content,
			labels: { close: 'Dismiss' }
		});

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
	});

	it('keeps the content mounted until a consumer exit animation finishes', async () => {
		const style = document.createElement('style');
		style.textContent = `
			@keyframes dialog-exit-test { to { opacity: 0; } }
			.exit-test[data-state='closed'] { animation: dialog-exit-test 300ms linear; }
		`;
		document.head.append(style);

		render(Dialog, { trigger, title, children: content, classes: { content: 'exit-test' } });

		await page.getByRole('button', { name: 'Open' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		// Mid-animation: closed, but deliberately still in the DOM.
		const midFlight = document.querySelector('[role="dialog"]');
		expect(midFlight?.getAttribute('data-state')).toBe('closed');

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();

		style.remove();
	});

	it('hides the exiting content from assistive tech while it animates out', async () => {
		const style = document.createElement('style');
		style.textContent = `
			@keyframes dialog-exit-test-2 { to { opacity: 0; } }
			.exit-test-2[data-state='closed'] { animation: dialog-exit-test-2 300ms linear; }
		`;
		document.head.append(style);

		render(Dialog, { trigger, title, children: content, classes: { content: 'exit-test-2' } });

		await page.getByRole('button', { name: 'Open' }).click();
		await userEvent.keyboard('{Escape}');

		expect((document.querySelector('[role="dialog"]') as HTMLElement | null)?.inert).toBe(true);

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();

		style.remove();
	});

	it('centres the content without spending its transform, so a consumer animation composes cleanly', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		// Tailwind v4 compiles `-translate-x-1/2` to the standalone `translate`
		// property, which stacks on top of any `transform` a consumer animates
		// with — centring the content that way doubles the offset and makes an
		// enter animation fly in from off-centre. Centring belongs on the
		// wrapper instead.
		const dialog = page.getByRole('dialog').element();
		expect(dialog.className).not.toContain('translate');

		const wrapper = dialog.parentElement!;
		expect(wrapper.className).toContain('flex');
		expect(wrapper.className).toContain('items-center');
		expect(wrapper.className).toContain('justify-center');
	});

	it('lets a consumer animate the overlay independently via classes.overlay', async () => {
		render(Dialog, { trigger, title, children: content, classes: { overlay: 'overlay-test' } });

		await page.getByRole('button', { name: 'Open' }).click();

		const overlay = document.querySelector('[aria-hidden="true"].overlay-test');
		expect(overlay).toBeTruthy();
		expect(overlay?.getAttribute('data-state')).toBe('open');
	});

	it('exposes the data-slot hooks the default animation is keyed on', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		// index.css hangs the built-in enter/exit animation on these, so losing
		// one silently drops the default animation with nothing else failing.
		const overlay = document.querySelector('[data-slot="dialog-overlay"]');
		const dialog = page.getByRole('dialog').element();

		expect(overlay?.getAttribute('data-state')).toBe('open');
		expect(dialog.getAttribute('data-slot')).toBe('dialog-content');
	});

	it('keeps the default animation out of the class attribute so a consumer utility can win', async () => {
		render(Dialog, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		// The default lives in the `components` layer, which every utility
		// outranks. Emitting it as a utility class here instead would put it in
		// the same layer as the consumer's and leave the winner to source order —
		// tailwind-merge can't arbitrate it, as it only knows Tailwind's built-in
		// `animate-*` values and treats custom ones as unrelated classes.
		const overlay = document.querySelector('[data-slot="dialog-overlay"]')!;
		const dialog = page.getByRole('dialog').element();

		expect(overlay.className).not.toContain('animate-');
		expect(dialog.className).not.toContain('animate-');
	});

	it('binds root ref, triggerRef, and contentRef correctly', async () => {
		render(DialogSemiHeadlessHarness);

		const statusEl = page.getByTestId('ref-status').element();
		expect(statusEl.getAttribute('data-has-root')).toBe('true');
		expect(statusEl.getAttribute('data-has-trigger')).toBe('true');
		expect(statusEl.getAttribute('data-has-content')).toBe('false');

		await page.getByRole('button', { name: 'Open Modal' }).click();

		expect(statusEl.getAttribute('data-has-content')).toBe('true');
	});

	it('supports root class prop merging with default classes', async () => {
		render(DialogSemiHeadlessHarness, { class: 'custom-root-btn' });

		const triggerBtn = page.getByRole('button', { name: 'Open Modal' }).element();
		expect(triggerBtn.className).toContain('custom-root-btn');
		expect(triggerBtn.className).toContain('inline-flex');
	});

	it('supports sub-parts styling via classes.body and classes.closeIcon', async () => {
		render(DialogSemiHeadlessHarness, {
			classes: { body: 'custom-body-slot', closeIcon: 'custom-icon-slot' }
		});

		await page.getByRole('button', { name: 'Open Modal' }).click();

		const bodyEl = document.querySelector('[data-slot="dialog-body"]')!;
		expect(bodyEl.className).toContain('custom-body-slot');

		const closeIcon = document.querySelector('[data-slot="dialog-close"] svg')!;
		expect(closeIcon.getAttribute('class')).toContain('custom-icon-slot');
	});

	it('exposes data-slot annotations across all sub-parts', async () => {
		render(DialogSemiHeadlessHarness);

		const triggerBtn = page.getByRole('button', { name: 'Open Modal' }).element();
		expect(triggerBtn.getAttribute('data-slot')).toBe('dialog-trigger');

		await page.getByRole('button', { name: 'Open Modal' }).click();

		expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeTruthy();
		expect(document.querySelector('[data-slot="dialog-content"]')).toBeTruthy();
		expect(document.querySelector('[data-slot="dialog-title"]')).toBeTruthy();
		expect(document.querySelector('[data-slot="dialog-description"]')).toBeTruthy();
		expect(document.querySelector('[data-slot="dialog-body"]')).toBeTruthy();
		expect(document.querySelector('[data-slot="dialog-close"]')).toBeTruthy();
	});

	it('sets data-disabled attribute on trigger when disabled', async () => {
		render(DialogSemiHeadlessHarness, { disabled: true });

		const triggerBtn = page.getByRole('button', { name: 'Open Modal' }).element();
		expect(triggerBtn.hasAttribute('disabled')).toBe(true);
		expect(triggerBtn.getAttribute('data-disabled')).toBe('');
	});

	it('passes open and close state payload to snippets', async () => {
		render(DialogSemiHeadlessHarness);

		const triggerSpan = page.getByTestId('trigger-span').element();
		expect(triggerSpan.getAttribute('data-is-open')).toBe('false');

		await page.getByRole('button', { name: 'Open Modal' }).click();

		expect(triggerSpan.getAttribute('data-is-open')).toBe('true');
		expect(page.getByTestId('title-span').element().getAttribute('data-is-open')).toBe('true');
		expect(page.getByTestId('desc-span').element().getAttribute('data-is-open')).toBe('true');
		expect(page.getByTestId('body-content').element().getAttribute('data-is-open')).toBe('true');

		// Close via inner close button provided in children snippet payload
		await page.getByTestId('inner-close-btn').click();

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		expect(triggerSpan.getAttribute('data-is-open')).toBe('false');
	});

	it('renders custom close snippet and closes on interaction', async () => {
		render(DialogSemiHeadlessHarness, { useCustomClose: true });

		await page.getByRole('button', { name: 'Open Modal' }).click();

		await expect.element(page.getByTestId('custom-close-btn')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="dialog-close"]')).toBeNull();

		await page.getByTestId('custom-close-btn').click();

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});
});
