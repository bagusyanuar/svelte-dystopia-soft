import { describe, it, expect, afterEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import { focusTrap } from './focus-trap.js';

let container: HTMLElement | undefined;

function mountTrap(html: string, options?: Parameters<typeof focusTrap>[1]) {
	container = document.createElement('div');
	container.innerHTML = html;
	document.body.append(container);

	const action = focusTrap(container, options) as { destroy: () => void };
	return { container, action };
}

afterEach(() => {
	container?.remove();
	container = undefined;
});

describe('focusTrap', () => {
	it('focuses the first focusable descendant by default', () => {
		const { container } = mountTrap(
			`<button id="first">First</button><button id="second">Second</button>`
		);

		expect(document.activeElement).toBe(container.querySelector('#first'));
	});

	it('focuses the given initialFocus element instead of the first one', () => {
		const { container } = mountTrap(
			`<button id="first">First</button><button id="second">Second</button>`,
			{ initialFocus: null }
		);
		const second = container.querySelector<HTMLButtonElement>('#second')!;

		// Re-run setup with an explicit target, as a consumer's $effect would on update.
		focusTrap(container, { initialFocus: second });

		expect(document.activeElement).toBe(second);
	});

	it('wraps focus from the last element back to the first on Tab', async () => {
		const { container } = mountTrap(
			`<button id="first">First</button><button id="second">Second</button>`
		);
		container.querySelector<HTMLButtonElement>('#second')!.focus();

		await userEvent.tab();

		expect(document.activeElement).toBe(container.querySelector('#first'));
	});

	it('wraps focus from the first element back to the last on Shift+Tab', async () => {
		const { container } = mountTrap(
			`<button id="first">First</button><button id="second">Second</button>`
		);

		expect(document.activeElement).toBe(container.querySelector('#first'));

		await userEvent.tab({ shift: true });

		expect(document.activeElement).toBe(container.querySelector('#second'));
	});

	it('does nothing when disabled', () => {
		const outside = document.createElement('button');
		outside.textContent = 'Outside';
		document.body.append(outside);
		outside.focus();

		mountTrap(`<button id="first">First</button>`, { enabled: false });

		expect(document.activeElement).toBe(outside);

		outside.remove();
	});

	it('stops trapping once destroyed', async () => {
		const { container, action } = mountTrap(
			`<button id="first">First</button><button id="second">Second</button>`
		);
		action.destroy?.();
		container.querySelector<HTMLButtonElement>('#second')!.focus();

		await userEvent.tab();

		expect(document.activeElement).not.toBe(container.querySelector('#first'));
	});
});
