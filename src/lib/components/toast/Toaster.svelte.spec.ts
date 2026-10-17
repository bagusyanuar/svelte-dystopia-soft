import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Toaster from './Toaster.svelte';
import ToasterHarness from './ToasterHarness.spec.svelte';
import { toast, toastStore } from './toast-store.svelte.js';


afterEach(() => {
	toastStore.dismissAll();
});

describe('Toaster.svelte', () => {
	it('renders nothing when there are no toasts', async () => {
		render(Toaster);

		expect(document.querySelectorAll('[data-slot="toast"]').length).toBe(0);
	});

	it('renders a toast queued via toast.message with role status', async () => {
		render(Toaster);
		toast.message('Saved');

		await expect.element(page.getByRole('status')).toHaveTextContent('Saved');
	});

	it('renders a danger toast with role alert for assertive announcement', async () => {
		render(Toaster);
		toast.danger('Something broke');

		await expect.element(page.getByRole('alert')).toHaveTextContent('Something broke');
	});

	it('renders the description when given', async () => {
		render(Toaster);
		toast.success('Saved', { description: 'Changes are live.' });

		await expect.element(page.getByText('Changes are live.')).toBeInTheDocument();
	});

	it('dismisses when the close button is clicked', async () => {
		render(Toaster);
		toast.message('Dismiss me', { duration: 0 });

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		await page.getByRole('button', { name: 'Close' }).click();

		await expect.element(page.getByRole('status')).not.toBeInTheDocument();
	});

	it('auto-dismisses after its duration elapses', async () => {
		// Fake timers avoid racing wall-clock delays against real browser/test
		// automation overhead (see the HoverCard hover-travel fix for that class
		// of flakiness) — advancing the clock directly is both deterministic and
		// fast.
		vi.useFakeTimers();
		try {
			render(Toaster);
			toast.message('Bye', { duration: 500 });

			await expect.element(page.getByRole('status')).toBeInTheDocument();

			// 500ms duration + 150ms exit animation buffer
			await vi.advanceTimersByTimeAsync(700);

			await expect.element(page.getByRole('status')).not.toBeInTheDocument();
		} finally {
			vi.useRealTimers();
		}
	});

	it('never auto-dismisses when duration is 0', async () => {
		vi.useFakeTimers();
		try {
			render(Toaster);
			toast.message('Sticky', { duration: 0 });

			await expect.element(page.getByRole('status')).toBeInTheDocument();

			await vi.advanceTimersByTimeAsync(60_000);

			await expect.element(page.getByRole('status')).toBeInTheDocument();
		} finally {
			vi.useRealTimers();
		}
	});

	it('pauses the auto-dismiss timer while hovered', async () => {
		vi.useFakeTimers();
		try {
			render(Toaster);
			toast.message('Hover me', { duration: 500 });

			const toastEl = page.getByRole('status');
			await expect.element(toastEl).toBeInTheDocument();

			// `userEvent.hover()` drives a real coordinate-based pointer path,
			// which is unreliable here for the same reason Dialog's
			// overlay-click test dispatches directly instead: this browser test
			// project loads no stylesheet, so the toast's actual layout box
			// doesn't match what real pointer travel would land on. Dispatch
			// the pointer events straight at the node instead.
			const toastNode = toastEl.element();
			toastNode.dispatchEvent(new PointerEvent('pointerenter'));

			await vi.advanceTimersByTimeAsync(500);
			await expect.element(toastEl).toBeInTheDocument();

			toastNode.dispatchEvent(new PointerEvent('pointerleave'));
			await vi.advanceTimersByTimeAsync(500);

			await expect.element(toastEl).not.toBeInTheDocument();
		} finally {
			vi.useRealTimers();
		}
	});

	it('caps the number of rendered toasts at max', async () => {
		render(Toaster, { max: 2 });
		toast.message('One');
		toast.message('Two');
		toast.message('Three');

		await expect.element(page.getByText('Three')).toBeInTheDocument();
		expect(document.querySelectorAll('[data-slot="toast"]').length).toBe(2);
	});

	it('lets a consumer override the viewport and item classes', async () => {
		render(Toaster, { classes: { viewport: 'viewport-test', item: 'item-test' } });
		toast.message('Styled');

		const viewport = document.querySelector('[role="region"]');
		expect(viewport?.className).toContain('viewport-test');

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		const item = document.querySelector('[data-slot="toast"]');
		expect(item?.className).toContain('item-test');
	});

	it('lets a consumer override the close button label', async () => {
		render(Toaster, { labels: { close: 'Dismiss' } });
		toast.message('Labeled');

		await expect.element(page.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
	});

	it('exposes the viewport as a labelled region', async () => {
		render(Toaster);

		await expect.element(page.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
	});

	it('positions the viewport in the bottom-right corner by default', async () => {
		render(Toaster);

		const viewport = document.querySelector('[role="region"]')!;
		expect(viewport.className).toContain('bottom-0');
		expect(viewport.className).toContain('right-0');
	});

	it('supports repositioning the viewport via the position prop', async () => {
		render(Toaster, { position: 'top-left' });

		const viewport = document.querySelector('[role="region"]')!;
		expect(viewport.className).toContain('top-0');
		expect(viewport.className).toContain('left-0');
	});

	it('exposes the data-slot hook the default animation is keyed on, kept out of the class attribute', async () => {
		render(Toaster);
		toast.message('Animated');

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		const item = document.querySelector('[data-slot="toast"]')!;
		expect(item.getAttribute('data-state')).toBe('open');
		expect(item.className).not.toContain('animate-');
	});

	it('renders default message without icon by default', async () => {
		render(Toaster);
		toast.message('Plain');

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="toast-icon"]')).toBeNull();
	});

	it('renders info toast with info icon and info tone', async () => {
		render(Toaster);
		toast.info('Info message');

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		const iconEl = document.querySelector('[data-slot="toast-icon"]')!;
		expect(iconEl).not.toBeNull();
		expect(iconEl.className).toContain('text-info');
	});

	it('renders success toast with success icon and success tone', async () => {
		render(Toaster);
		toast.success('Done');

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		const iconEl = document.querySelector('[data-slot="toast-icon"]')!;
		expect(iconEl).not.toBeNull();
		expect(iconEl.className).toContain('text-success');
	});

	it('renders warning toast with warning icon and warning tone', async () => {
		render(Toaster);
		toast.warning('Watch out');

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		const iconEl = document.querySelector('[data-slot="toast-icon"]')!;
		expect(iconEl).not.toBeNull();
		expect(iconEl.className).toContain('text-warning');
	});

	it('renders danger toast with danger icon and danger tone', async () => {
		render(Toaster);
		toast.danger('Failed');

		await expect.element(page.getByRole('alert')).toBeInTheDocument();
		const iconEl = document.querySelector('[data-slot="toast-icon"]')!;
		expect(iconEl).not.toBeNull();
		expect(iconEl.className).toContain('text-danger');
	});

	it('renders a custom icon snippet when provided', async () => {
		render(Toaster);
		const customIcon = createRawSnippet(() => ({
			render: () => '<span data-testid="my-icon">★</span>'
		}));
		toast.message('Favorited', { icon: customIcon });

		await expect.element(page.getByTestId('my-icon')).toBeInTheDocument();
	});

	it('hides the icon when icon is false', async () => {
		render(Toaster);
		toast.success('No icon here', { icon: false });

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="toast-icon"]')).toBeNull();
	});

	it('lets a consumer override the icon class via classes.icon', async () => {
		render(Toaster, { classes: { icon: 'custom-icon-class' } });
		toast.success('Styled icon');

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		const iconEl = document.querySelector('[data-slot="toast-icon"]')!;
		expect(iconEl.className).toContain('custom-icon-class');
	});

	it('exposes data-slot="toaster" and data-position on viewport element', async () => {
		render(Toaster, { position: 'top-center' });

		const viewport = document.querySelector('[role="region"]');
		expect(viewport?.getAttribute('data-slot')).toBe('toaster');
		expect(viewport?.getAttribute('data-position')).toBe('top-center');
	});

	it('binds element ref and forwards unrecognized attributes on the viewport', async () => {
		render(ToasterHarness);

		await expect.element(page.getByTestId('has-toaster-ref')).toHaveTextContent('true');
		await expect.element(page.getByTestId('custom-toaster-root')).toBeInTheDocument();
	});

	it('exposes data-variant and structured data-slots on toast item elements', async () => {
		render(Toaster);
		toast.danger('Failed transaction', { description: 'Insufficient balance' });

		await expect.element(page.getByRole('alert')).toBeInTheDocument();
		const item = document.querySelector('[data-slot="toast"]')!;
		expect(item.getAttribute('data-variant')).toBe('danger');

		expect(document.querySelector('[data-slot="toast-content"]')).not.toBeNull();
		expect(document.querySelector('[data-slot="toast-title"]')).toHaveTextContent('Failed transaction');
		expect(document.querySelector('[data-slot="toast-description"]')).toHaveTextContent('Insufficient balance');
		expect(document.querySelector('[data-slot="toast-close"]')).not.toBeNull();
	});

	it('renders an interactive action button and triggers onClick when clicked', async () => {
		render(Toaster);
		const onClick = vi.fn();
		toast.message('File deleted', {
			action: { label: 'Undo', onClick }
		});

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		const actionBtn = page.getByRole('button', { name: 'Undo' });
		await expect.element(actionBtn).toBeInTheDocument();
		expect(actionBtn.element().getAttribute('data-slot')).toBe('toast-action');

		await actionBtn.click();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('invokes onDismiss callback when toast is closed', async () => {
		render(Toaster);
		const onDismiss = vi.fn();
		const id = toast.message('Dismissible', { duration: 0, onDismiss });

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		await page.getByRole('button', { name: 'Close' }).click();

		await expect.element(page.getByRole('status')).not.toBeInTheDocument();
		expect(onDismiss).toHaveBeenCalledWith(id);
	});

	it('supports custom item snippet rendering via item prop', async () => {
		render(ToasterHarness, { useCustomItem: true });
		toast.message('Custom Layout');

		await expect.element(page.getByTestId('custom-toast-item')).toBeInTheDocument();
		await expect.element(page.getByText('Custom: Custom Layout')).toBeInTheDocument();

		await page.getByTestId('custom-dismiss-btn').click();
		await expect.element(page.getByTestId('custom-toast-item')).not.toBeInTheDocument();
	});
});

