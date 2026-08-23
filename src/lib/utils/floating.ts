import {
	autoUpdate,
	computePosition,
	flip,
	offset,
	shift,
	arrow,
	size,
	type Placement,
	type Strategy,
	type Middleware
} from '@floating-ui/dom';
import type { Action } from 'svelte/action';

export interface FloatingOptions {
	reference: HTMLElement | null;
	placement?: Placement;
	strategy?: Strategy;
	offset?: number;
	arrowEl?: HTMLElement | null;
	/** Pins the floating element's min-width to the reference's width (e.g. a combobox popup matching its trigger). */
	matchReferenceWidth?: boolean;
	/** Caps the floating element's max-height to the lesser of this and the space actually available in the viewport. */
	maxHeight?: number;
	onComputed?: (position: { x: number; y: number }) => void;
}

export const floating: Action<HTMLElement, FloatingOptions> = (node, options) => {
	let cleanup: (() => void) | undefined;

	function setup(opts: FloatingOptions) {
		cleanup?.();

		if (!opts.reference) return;

		const strategy = opts.strategy ?? 'fixed';

		// Take the node out of normal flow *synchronously*. `computePosition` is
		// async, so without this the node spends a beat laid out at the end of its
		// (portalled) parent — which lets a focus() call scroll the page to the
		// bottom before the real coordinates ever land.
		node.style.position = strategy;
		node.style.left = '0';
		node.style.top = '0';

		const middleware: Middleware[] = [offset(opts.offset ?? 8), flip(), shift({ padding: 8 })];

		if (opts.arrowEl) {
			// Keeps the arrow off the content box's rounded corners on small bubbles.
			middleware.push(arrow({ element: opts.arrowEl, padding: 4 }));
		}

		if (opts.matchReferenceWidth || opts.maxHeight != null) {
			middleware.push(
				size({
					padding: 8,
					apply({ rects, availableHeight, elements }) {
						if (opts.matchReferenceWidth) {
							elements.floating.style.minWidth = `${rects.reference.width}px`;
						}
						if (opts.maxHeight != null) {
							elements.floating.style.maxHeight = `${Math.min(availableHeight, opts.maxHeight)}px`;
						}
					}
				})
			);
		}

		async function update() {
			if (!opts.reference) return;

			const { x, y, placement, middlewareData } = await computePosition(opts.reference, node, {
				placement: opts.placement ?? 'bottom',
				strategy,
				middleware
			});

			node.style.left = `${x}px`;
			node.style.top = `${y}px`;
			node.setAttribute('data-placement', placement);

			if (opts.arrowEl && middlewareData.arrow) {
				const { x: arrowX, y: arrowY } = middlewareData.arrow;
				opts.arrowEl.style.left = arrowX != null ? `${arrowX}px` : '';
				opts.arrowEl.style.top = arrowY != null ? `${arrowY}px` : '';
			}

			opts.onComputed?.({ x, y });
		}

		cleanup = autoUpdate(opts.reference, node, update);
	}

	setup(options);

	return {
		update: setup,
		destroy() {
			cleanup?.();
		}
	};
};
