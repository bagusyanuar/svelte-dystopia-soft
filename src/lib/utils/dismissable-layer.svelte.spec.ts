import { describe, it, expect, vi, afterEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createDismissableLayer } from './dismissable-layer.js';

let cleanups: (() => void)[] = [];
let nodes: HTMLElement[] = [];

function makeButton(label: string) {
	const el = document.createElement('button');
	el.textContent = label;
	document.body.append(el);
	nodes.push(el);
	return el;
}

afterEach(() => {
	cleanups.forEach((fn) => fn());
	cleanups = [];
	nodes.forEach((el) => el.remove());
	nodes = [];
});

describe('createDismissableLayer', () => {
	it('calls onPointerDownOutside when clicking outside the excluded elements', async () => {
		const inside = makeButton('Inside');
		const outside = makeButton('Outside');
		const onPointerDownOutside = vi.fn();

		cleanups.push(createDismissableLayer(() => [inside], { onPointerDownOutside }));

		await userEvent.click(outside);

		expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
	});

	it('does not call onPointerDownOutside when clicking an excluded element', async () => {
		const inside = makeButton('Inside');
		const onPointerDownOutside = vi.fn();

		cleanups.push(createDismissableLayer(() => [inside], { onPointerDownOutside }));

		await userEvent.click(inside);

		expect(onPointerDownOutside).not.toHaveBeenCalled();
	});

	it('calls onEscapeKeydown on Escape', async () => {
		const onEscapeKeydown = vi.fn();

		cleanups.push(createDismissableLayer(() => [], { onEscapeKeydown }));

		await userEvent.keyboard('{Escape}');

		expect(onEscapeKeydown).toHaveBeenCalledTimes(1);
	});

	it('only reacts on the topmost layer, leaving lower layers alone', async () => {
		const outerEscape = vi.fn();
		const innerEscape = vi.fn();

		cleanups.push(createDismissableLayer(() => [], { onEscapeKeydown: outerEscape }));
		cleanups.push(createDismissableLayer(() => [], { onEscapeKeydown: innerEscape }));

		await userEvent.keyboard('{Escape}');

		expect(innerEscape).toHaveBeenCalledTimes(1);
		expect(outerEscape).not.toHaveBeenCalled();
	});

	it('resumes reacting once the layer above it is destroyed', async () => {
		const outerEscape = vi.fn();
		const innerEscape = vi.fn();

		const destroyOuter = createDismissableLayer(() => [], { onEscapeKeydown: outerEscape });
		const destroyInner = createDismissableLayer(() => [], { onEscapeKeydown: innerEscape });
		cleanups.push(destroyOuter);

		destroyInner();
		await userEvent.keyboard('{Escape}');

		expect(outerEscape).toHaveBeenCalledTimes(1);
	});

	it('stops listening once destroyed', async () => {
		const onEscapeKeydown = vi.fn();

		const destroy = createDismissableLayer(() => [], { onEscapeKeydown });
		destroy();

		await userEvent.keyboard('{Escape}');

		expect(onEscapeKeydown).not.toHaveBeenCalled();
	});
});
