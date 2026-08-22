import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ButtonGroup from './ButtonGroup.svelte';
import ChildrenHarness from './ChildrenHarness.spec.svelte';

const buttons = createRawSnippet(() => ({
	render: () => `<button>Left</button>`
}));

describe('ButtonGroup.svelte', () => {
	it('renders its children', async () => {
		render(ChildrenHarness);

		await expect.element(page.getByRole('button', { name: 'Left' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Center' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Right' })).toBeInTheDocument();
	});

	it('exposes a group role', async () => {
		render(ButtonGroup, { children: buttons });

		await expect.element(page.getByRole('group')).toBeInTheDocument();
	});

	it('applies outer-corner rounding rules for the first and last child', async () => {
		render(ButtonGroup, { children: buttons });

		const root = page.getByRole('group').element();

		expect(root.className).toContain('rounded-r-none');
		expect(root.className).toContain('rounded-l-none');
		expect(root.className).toContain('[&>*:not(:first-child):not(:last-child)]:rounded-none');
	});

	it('switches to vertical stacking classes when orientation is vertical', async () => {
		render(ButtonGroup, { children: buttons, orientation: 'vertical' });

		const root = page.getByRole('group').element();

		expect(root.className).toContain('flex-col');
		expect(root.className).not.toContain('flex-row');
	});

	it('lets a consumer class override an internal one', async () => {
		render(ButtonGroup, { children: buttons, class: 'flex-col' });

		const root = page.getByRole('group').element();

		expect(root.className).toContain('flex-col');
		expect(root.className).not.toContain('flex-row');
	});

	it('forwards unrecognized attributes', async () => {
		render(ButtonGroup, { children: buttons, 'aria-label': 'Text alignment' });

		await expect.element(page.getByRole('group', { name: 'Text alignment' })).toBeInTheDocument();
	});
});
