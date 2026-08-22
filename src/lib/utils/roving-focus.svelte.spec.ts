import { describe, it, expect, afterEach, vi } from 'vitest';
import { createRovingFocus } from './roving-focus.js';

let container: HTMLElement | undefined;

function mountItems(labels: string[]) {
	container = document.createElement('div');
	container.innerHTML = labels.map((label) => `<button role="menuitem">${label}</button>`).join('');
	document.body.append(container);
	return createRovingFocus({
		getContainer: () => container ?? null,
		selector: '[role="menuitem"]'
	});
}

afterEach(() => {
	container?.remove();
	container = undefined;
	vi.useRealTimers();
});

describe('createRovingFocus', () => {
	it('focuses the first and last item', () => {
		const roving = mountItems(['Apple', 'Banana', 'Cherry']);

		roving.focusFirst();
		expect(document.activeElement?.textContent).toBe('Apple');

		roving.focusLast();
		expect(document.activeElement?.textContent).toBe('Cherry');
	});

	it('moves focus forward and wraps past the last item', () => {
		const roving = mountItems(['Apple', 'Banana', 'Cherry']);

		roving.focusLast();
		roving.focusAdjacent(1);

		expect(document.activeElement?.textContent).toBe('Apple');
	});

	it('moves focus backward and wraps past the first item', () => {
		const roving = mountItems(['Apple', 'Banana', 'Cherry']);

		roving.focusFirst();
		roving.focusAdjacent(-1);

		expect(document.activeElement?.textContent).toBe('Cherry');
	});

	it('does nothing when there are no items', () => {
		container = document.createElement('div');
		document.body.append(container);
		const roving = createRovingFocus({
			getContainer: () => container ?? null,
			selector: '[role="menuitem"]'
		});

		expect(() => roving.focusAdjacent(1)).not.toThrow();
	});

	it('jumps to the item matching the typed characters', () => {
		const roving = mountItems(['Apple', 'Banana', 'Cherry']);
		roving.focusFirst();

		roving.typeahead('c');

		expect(document.activeElement?.textContent).toBe('Cherry');
	});

	it('accumulates typeahead characters within the buffer window', () => {
		vi.useFakeTimers();
		const roving = mountItems(['Apple', 'Apricot', 'Banana']);
		roving.focusFirst();

		roving.typeahead('a');
		roving.typeahead('p');
		roving.typeahead('r');

		expect(document.activeElement?.textContent).toBe('Apricot');
	});

	it('resets the typeahead buffer after the timeout elapses', () => {
		vi.useFakeTimers();
		const roving = mountItems(['Apple', 'Banana', 'Cherry']);
		roving.focusFirst();

		roving.typeahead('b');
		vi.advanceTimersByTime(600);
		roving.typeahead('a');

		expect(document.activeElement?.textContent).toBe('Apple');
	});
});
