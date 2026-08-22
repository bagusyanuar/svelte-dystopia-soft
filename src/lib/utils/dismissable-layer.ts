export interface DismissableLayerOptions {
	onPointerDownOutside?: (event: PointerEvent) => void;
	onEscapeKeydown?: (event: KeyboardEvent) => void;
}

// Stack of currently open layers (popovers, dropdowns, dialogs, ...), topmost
// last. Only the topmost layer reacts, so a popover opened from inside a
// dialog doesn't also close the dialog underneath on the same Escape press.
const layers: symbol[] = [];

/**
 * Registers `node`'s consumer as a dismissable layer: Escape and
 * pointerdown-outside are reported via the callbacks, scoped to elements
 * outside `getExcluded()` (typically the trigger and the content itself) and
 * only while this layer is topmost. Call from a component's `$effect` and
 * return (or call) the returned teardown on cleanup.
 */
export function createDismissableLayer(
	getExcluded: () => (HTMLElement | null | undefined)[],
	options: DismissableLayerOptions
) {
	const id = Symbol();

	function isTopmost() {
		return layers[layers.length - 1] === id;
	}

	function handlePointerDown(event: PointerEvent) {
		if (!isTopmost()) return;

		const target = event.target as Node;
		if (getExcluded().some((el) => el?.contains(target))) return;

		options.onPointerDownOutside?.(event);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !isTopmost()) return;

		options.onEscapeKeydown?.(event);
	}

	layers.push(id);
	document.addEventListener('pointerdown', handlePointerDown);
	document.addEventListener('keydown', handleKeydown);

	let destroyed = false;
	return function destroy() {
		if (destroyed) return;
		destroyed = true;

		const index = layers.indexOf(id);
		if (index !== -1) layers.splice(index, 1);
		document.removeEventListener('pointerdown', handlePointerDown);
		document.removeEventListener('keydown', handleKeydown);
	};
}
