import { page } from 'vitest/browser';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Toaster from './Toaster.svelte';
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

			await vi.advanceTimersByTimeAsync(500);

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
});
