import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Drawer from './Drawer.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import DrawerSemiHeadlessHarness from './DrawerSemiHeadlessHarness.spec.svelte';

const trigger = createRawSnippet(() => ({
	render: () => `<span>Open</span>`
}));
const title = createRawSnippet(() => ({
	render: () => `<span>Notifications</span>`
}));
const description = createRawSnippet(() => ({
	render: () => `<span>Recent activity on your account.</span>`
}));
const content = createRawSnippet(() => ({
	render: () => `<p>Nothing new.</p>`
}));

afterEach(() => {
	document.body.style.overflow = '';
	document.body.style.paddingRight = '';
});

describe('Drawer.svelte', () => {
	it('renders the trigger', async () => {
		render(Drawer, { trigger, title, children: content });

		await expect.element(page.getByRole('button', { name: 'Open' })).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(Drawer, { trigger, title, children: content });

		await expect
			.element(page.getByRole('button', { name: 'Open' }))
			.toHaveAttribute('aria-expanded', 'false');
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens when the trigger is clicked', async () => {
		render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		await expect
			.element(page.getByRole('button', { name: 'Open' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();
	});

	it('defaults to sliding in from the right', async () => {
		render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByRole('dialog')).toHaveAttribute('data-side', 'right');
	});

	it('renders on the requested side', async () => {
		render(Drawer, { trigger, title, children: content, side: 'left' });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		expect(dialog.getAttribute('data-side')).toBe('left');
		expect(dialog.className).toContain('left-0');
	});

	it('associates the drawer with its title via aria-labelledby', async () => {
		render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		const labelledBy = dialog.getAttribute('aria-labelledby');

		expect(labelledBy).toBeTruthy();
		expect(document.getElementById(labelledBy!)?.textContent).toContain('Notifications');
	});

	it('associates the drawer with its description via aria-describedby when given', async () => {
		render(Drawer, { trigger, title, description, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		const describedBy = dialog.getAttribute('aria-describedby');

		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)?.textContent).toContain('Recent activity');
	});

	it('moves focus into the drawer when it opens', async () => {
		render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByRole('button', { name: 'Close' })).toHaveFocus();
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		render(Drawer, { trigger, title, children: content });

		const openButton = page.getByRole('button', { name: 'Open' });
		await openButton.click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		await expect.element(openButton).toHaveFocus();
	});

	it('closes when the close button is clicked', async () => {
		render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();
		await page.getByRole('button', { name: 'Close' }).click();

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes when clicking the overlay', async () => {
		render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		// Same reasoning as Dialog's equivalent test: this browser test project
		// loads no stylesheet, so the overlay's hit area (from `fixed inset-0`)
		// collapses to 0x0 for a real coordinate click. Dispatch directly instead.
		const overlay = document.querySelector('[data-slot="drawer-overlay"]')!;
		overlay.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('locks body scroll while open and restores it on close', async () => {
		render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();
		expect(document.body.style.overflow).toBe('hidden');

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		expect(document.body.style.overflow).toBe('');
	});

	it('portals the content out of the component container', async () => {
		const { container } = render(Drawer, { trigger, title, children: content });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		expect(container.contains(dialog)).toBe(false);
		expect(dialog.parentElement).toBe(document.body);
	});

	it('propagates the open state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override the internal content class', async () => {
		render(Drawer, {
			trigger,
			title,
			children: content,
			classes: { content: 'rounded-md' }
		});

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		expect(dialog.className).toContain('rounded-md');
		expect(dialog.className).not.toContain('rounded-l-lg');
	});

	it('lets a consumer override the close button label', async () => {
		render(Drawer, {
			trigger,
			title,
			children: content,
			labels: { close: 'Dismiss' }
		});

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(page.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
	});

	it('exposes the data-slot/data-side hooks the default animation is keyed on', async () => {
		render(Drawer, { trigger, title, children: content, side: 'bottom' });

		await page.getByRole('button', { name: 'Open' }).click();

		const dialog = page.getByRole('dialog').element();
		expect(dialog.getAttribute('data-slot')).toBe('drawer-content');
		expect(dialog.getAttribute('data-side')).toBe('bottom');
	});

	it('exposes ref and triggerRef bound to the trigger button', async () => {
		render(DrawerSemiHeadlessHarness);

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
		await expect.element(status).toHaveAttribute('data-has-trigger', 'true');
		await expect.element(status).toHaveAttribute('data-has-content', 'false');
	});

	it('exposes contentRef bound to the drawer panel when open', async () => {
		render(DrawerSemiHeadlessHarness);

		await page.getByRole('button', { name: 'Open Drawer' }).click();

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-content', 'true');
	});

	it('supports root class merging alongside classes.trigger on trigger button', async () => {
		render(DrawerSemiHeadlessHarness, {
			class: 'my-custom-trigger',
			classes: { trigger: 'subpart-trigger-class' }
		});

		const triggerBtn = page.getByRole('button', { name: 'Open Drawer' }).element();
		expect(triggerBtn.className).toContain('my-custom-trigger');
		expect(triggerBtn.className).toContain('subpart-trigger-class');
	});

	it('exposes data-slot hooks across all internal parts and data-disabled', async () => {
		render(DrawerSemiHeadlessHarness, { disabled: true });

		const triggerBtn = page.getByRole('button', { name: 'Open Drawer' }).element();
		expect(triggerBtn.getAttribute('data-slot')).toBe('drawer-trigger');
		expect(triggerBtn.getAttribute('data-disabled')).toBe('');

		render(DrawerSemiHeadlessHarness, { open: true });

		const overlay = document.querySelector('[data-slot="drawer-overlay"]');
		expect(overlay).toBeInTheDocument();

		const titleEl = document.querySelector('[data-slot="drawer-title"]');
		expect(titleEl).toBeInTheDocument();

		const descEl = document.querySelector('[data-slot="drawer-description"]');
		expect(descEl).toBeInTheDocument();

		const bodyEl = document.querySelector('[data-slot="drawer-body"]');
		expect(bodyEl).toBeInTheDocument();

		const closeEl = document.querySelector('[data-slot="drawer-close"]');
		expect(closeEl).toBeInTheDocument();
	});

	it('forwards open state payload to trigger and children snippets', async () => {
		render(DrawerSemiHeadlessHarness);

		const triggerSpan = page.getByTestId('trigger-span');
		await expect.element(triggerSpan).toHaveAttribute('data-is-open', 'false');

		await page.getByRole('button', { name: 'Open Drawer' }).click();

		await expect.element(triggerSpan).toHaveAttribute('data-is-open', 'true');
		const bodyContent = page.getByTestId('body-content');
		await expect.element(bodyContent).toHaveAttribute('data-is-open', 'true');
	});

	it('allows closing the drawer from inside children snippet using close payload', async () => {
		render(DrawerSemiHeadlessHarness);

		await page.getByRole('button', { name: 'Open Drawer' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await page.getByTestId('inner-close-btn').click();
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders custom close snippet and closes using close payload', async () => {
		render(DrawerSemiHeadlessHarness, { useCustomClose: true });

		await page.getByRole('button', { name: 'Open Drawer' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await page.getByTestId('custom-close-btn').click();
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('supports classes.body and classes.closeIcon sub-parts', async () => {
		render(Drawer, {
			trigger,
			title,
			children: content,
			open: true,
			classes: {
				body: 'custom-body-class',
				closeIcon: 'custom-icon-class'
			}
		});

		const bodyEl = document.querySelector('[data-slot="drawer-body"]');
		expect(bodyEl?.className).toContain('custom-body-class');

		const closeIcon = document.querySelector('[data-slot="drawer-close"] svg');
		expect(closeIcon?.getAttribute('class')).toContain('custom-icon-class');
	});
});
