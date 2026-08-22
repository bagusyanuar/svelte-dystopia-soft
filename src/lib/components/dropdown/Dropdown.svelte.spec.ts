import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Dropdown from './Dropdown.svelte';
import DropdownItem from './DropdownItem.svelte';
import MenuHarness from './MenuHarness.spec.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

const trigger = createRawSnippet(() => ({
	render: () => `<span>Actions</span>`
}));
const noItems = createRawSnippet(() => ({ render: () => `<div></div>` }));

describe('Dropdown.svelte', () => {
	it('renders the trigger', async () => {
		render(Dropdown, { trigger, children: noItems });

		await expect.element(page.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(Dropdown, { trigger, children: noItems });

		await expect
			.element(page.getByRole('button', { name: 'Actions' }))
			.toHaveAttribute('aria-expanded', 'false');
		await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
	});

	it('associates the trigger with the menu it controls via aria-controls', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).click();

		const button = page.getByRole('button', { name: 'Actions' }).element();
		const controlsId = button.getAttribute('aria-controls');

		expect(controlsId).toBeTruthy();
		expect(document.getElementById(controlsId!)?.getAttribute('role')).toBe('menu');
	});

	it('opens on click and moves focus to the first item', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).click();

		await expect.element(page.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
	});

	it('ArrowDown on the trigger opens the menu and focuses the first item', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).element().focus();
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
	});

	it('ArrowUp on the trigger opens the menu and focuses the last item', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).element().focus();
		await userEvent.keyboard('{ArrowUp}');

		await expect.element(page.getByRole('menuitem', { name: 'Remove' })).toHaveFocus();
	});

	it('ArrowDown moves focus to the next item, skipping disabled items', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).click();
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.getByRole('menuitem', { name: 'Remove' })).toHaveFocus();
	});

	it('ArrowUp from the first item wraps to the last item', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).click();
		await userEvent.keyboard('{ArrowUp}');

		await expect.element(page.getByRole('menuitem', { name: 'Remove' })).toHaveFocus();
	});

	it('Home and End jump to the first and last item', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).click();
		await userEvent.keyboard('{End}');
		await expect.element(page.getByRole('menuitem', { name: 'Remove' })).toHaveFocus();

		await userEvent.keyboard('{Home}');
		await expect.element(page.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
	});

	it('typeahead jumps focus to the item starting with the typed letter', async () => {
		render(MenuHarness);

		await page.getByRole('button', { name: 'Actions' }).click();
		await userEvent.keyboard('r');

		await expect.element(page.getByRole('menuitem', { name: 'Remove' })).toHaveFocus();
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		render(MenuHarness);

		const menuButton = page.getByRole('button', { name: 'Actions' });
		await menuButton.click();
		await expect.element(page.getByRole('menu')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
		await expect.element(menuButton).toHaveFocus();
	});

	it('closes when clicking outside the trigger and menu', async () => {
		const { container } = render(MenuHarness);
		const outside = document.createElement('button');
		outside.textContent = 'Outside';
		container.append(outside);

		await page.getByRole('button', { name: 'Actions' }).click();
		await expect.element(page.getByRole('menu')).toBeInTheDocument();

		await userEvent.click(outside);

		await expect.element(page.getByRole('menu')).not.toBeInTheDocument();

		outside.remove();
	});

	it('selecting an item calls onSelect, closes the menu, and returns focus to the trigger', async () => {
		const onEditSelect = vi.fn();
		render(MenuHarness, { onEditSelect });

		const menuButton = page.getByRole('button', { name: 'Actions' });
		await menuButton.click();
		await page.getByRole('menuitem', { name: 'Edit' }).click();

		expect(onEditSelect).toHaveBeenCalledOnce();
		await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
		await expect.element(menuButton).toHaveFocus();
	});

	it('does not call onSelect or close the menu when a disabled item is clicked', async () => {
		const onArchiveSelect = vi.fn();
		render(MenuHarness, { onArchiveSelect });

		await page.getByRole('button', { name: 'Actions' }).click();
		await page.getByRole('menuitem', { name: 'Archive' }).click({ force: true });

		expect(onArchiveSelect).not.toHaveBeenCalled();
		await expect.element(page.getByRole('menu')).toBeInTheDocument();
	});

	it('propagates the open state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Actions' }).click();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override the internal trigger class', async () => {
		render(Dropdown, {
			trigger,
			children: noItems,
			classes: { trigger: 'rounded-md' }
		});

		const button = page.getByRole('button', { name: 'Actions' }).element();

		expect(button.className).toContain('rounded-md');
		expect(button.className).not.toContain('rounded-lg');
	});
});

describe('DropdownItem.svelte', () => {
	const content = createRawSnippet(() => ({ render: () => `<span>Edit</span>` }));

	it('renders as a menuitem', async () => {
		render(DropdownItem, { children: content });

		await expect.element(page.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
	});

	it('calls onSelect when clicked', async () => {
		const onSelect = vi.fn();
		render(DropdownItem, { children: content, onSelect });

		await page.getByRole('menuitem', { name: 'Edit' }).click();

		expect(onSelect).toHaveBeenCalledOnce();
	});

	it('is disabled when the disabled prop is set', async () => {
		render(DropdownItem, { children: content, disabled: true });

		await expect.element(page.getByRole('menuitem', { name: 'Edit' })).toBeDisabled();
	});

	it('lets a consumer class override the internal class', async () => {
		render(DropdownItem, { children: content, class: 'rounded-lg' });

		const item = page.getByRole('menuitem', { name: 'Edit' }).element();

		expect(item.className).toContain('rounded-lg');
		expect(item.className).not.toContain('rounded-md');
	});
});
