export interface RovingFocusOptions {
	getContainer: () => HTMLElement | null;
	/** Selector matching the navigable items within the container, e.g. `'[role="menuitem"]:not(:disabled)'`. */
	selector: string;
}

/**
 * Arrow-key/typeahead navigation among a live-queried set of items inside a
 * container — the composite-widget half of the WAI-ARIA menu/listbox/tablist
 * pattern. Doesn't manage `tabindex`: a menu keeps its items permanently out
 * of the tab order (focus only ever arrives here programmatically), while a
 * tablist needs exactly one item tabbable at a time — that bookkeeping is
 * context-specific, so it stays with the caller.
 */
export function createRovingFocus({ getContainer, selector }: RovingFocusOptions) {
	function getItems(): HTMLElement[] {
		const container = getContainer();
		return container ? Array.from(container.querySelectorAll<HTMLElement>(selector)) : [];
	}

	function focusFirst() {
		getItems()[0]?.focus();
	}

	function focusLast() {
		const items = getItems();
		items[items.length - 1]?.focus();
	}

	function focusAdjacent(delta: 1 | -1) {
		const items = getItems();
		if (items.length === 0) return;

		const currentIndex = items.indexOf(document.activeElement as HTMLElement);
		const nextIndex =
			currentIndex === -1 ? 0 : (currentIndex + delta + items.length) % items.length;
		items[nextIndex]?.focus();
	}

	let typeaheadBuffer = '';
	let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

	function typeahead(char: string) {
		clearTimeout(typeaheadTimer);
		typeaheadBuffer += char.toLowerCase();
		typeaheadTimer = setTimeout(() => (typeaheadBuffer = ''), 500);

		const items = getItems();
		if (items.length === 0) return;

		const currentIndex = items.indexOf(document.activeElement as HTMLElement);
		const ordered = [...items.slice(currentIndex + 1), ...items.slice(0, currentIndex + 1)];
		const match = ordered.find((item) =>
			item.textContent?.trim().toLowerCase().startsWith(typeaheadBuffer)
		);
		match?.focus();
	}

	return { getItems, focusFirst, focusLast, focusAdjacent, typeahead };
}
