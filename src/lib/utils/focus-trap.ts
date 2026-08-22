import type { Action } from 'svelte/action';

export interface FocusTrapOptions {
	enabled?: boolean;
	/** Element (or a getter for one) to focus when the trap activates. Defaults to the first focusable descendant. */
	initialFocus?: HTMLElement | (() => HTMLElement | null) | null;
}

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
	'[contenteditable="true"]'
].join(',');

/**
 * Cycles Tab/Shift+Tab focus within `node` while enabled — Esc handling and
 * outside-click dismissal are the `dismissable-layer` util's job, kept
 * separate so a consumer can compose either without the other.
 */
export const focusTrap: Action<HTMLElement, FocusTrapOptions | undefined> = (node, options) => {
	let cleanup: (() => void) | undefined;

	function getFocusable(): HTMLElement[] {
		return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const focusable = getFocusable();
		if (focusable.length === 0) {
			event.preventDefault();
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	function setup(opts: FocusTrapOptions | undefined) {
		cleanup?.();
		if (opts?.enabled === false) return;

		const target =
			typeof opts?.initialFocus === 'function' ? opts.initialFocus() : opts?.initialFocus;
		(target ?? getFocusable()[0] ?? node).focus({ preventScroll: true });

		document.addEventListener('keydown', handleKeydown);
		cleanup = () => document.removeEventListener('keydown', handleKeydown);
	}

	setup(options);

	return {
		update: setup,
		destroy() {
			cleanup?.();
		}
	};
};
