import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Combobox from './Combobox.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import { defaultFilter, splitMatch } from './combobox-state.svelte.js';
import type { ComboboxOption } from './Combobox.types.js';

const fruitOptions: ComboboxOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry', disabled: true },
	{ value: 'date', label: 'Date' }
];

describe('defaultFilter', () => {
	it('matches on label substring, case- and diacritic-insensitive', () => {
		expect(defaultFilter({ value: 1, label: 'Café' }, 'cafe')).toBe(true);
		expect(defaultFilter({ value: 1, label: 'Café' }, 'zzz')).toBe(false);
	});

	it('matches on keywords in addition to the label', () => {
		expect(defaultFilter({ value: 1, label: 'Apple', keywords: ['fruit'] }, 'fruit')).toBe(true);
	});

	it('matches everything for an empty query', () => {
		expect(defaultFilter({ value: 1, label: 'Apple' }, '')).toBe(true);
	});
});

describe('splitMatch', () => {
	it('splits the label around the first case-insensitive match', () => {
		expect(splitMatch('Banana', 'an')).toEqual([
			{ text: 'B', match: false },
			{ text: 'an', match: true },
			{ text: 'ana', match: false }
		]);
	});

	it('returns the whole label unmatched when the query is empty or absent', () => {
		expect(splitMatch('Banana', '')).toEqual([{ text: 'Banana', match: false }]);
		expect(splitMatch('Banana', 'zzz')).toEqual([{ text: 'Banana', match: false }]);
	});
});

describe('Combobox.svelte', () => {
	it('shows the placeholder when nothing is selected', async () => {
		render(Combobox, { options: fruitOptions });

		await expect.element(page.getByText('Select…')).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(Combobox, { options: fruitOptions });

		await expect.element(page.getByRole('listbox')).not.toBeInTheDocument();
	});

	it('opens on click and focuses the search input', async () => {
		render(Combobox, { options: fruitOptions });

		await page.getByRole('combobox').click();

		await expect.element(page.getByRole('listbox')).toBeInTheDocument();
		await expect.element(page.getByRole('textbox', { name: 'Search…' })).toHaveFocus();
	});

	it('ArrowDown on the trigger opens the menu', async () => {
		render(Combobox, { options: fruitOptions });

		await page.getByRole('combobox').element().focus();
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.getByRole('listbox')).toBeInTheDocument();
	});

	it('highlights the first option on open and skips disabled options moving down', async () => {
		render(Combobox, { options: fruitOptions });

		await page.getByRole('combobox').click();
		const input = page.getByRole('textbox', { name: 'Search…' }).element();

		expect(input.getAttribute('aria-activedescendant')).toBe(
			page.getByRole('option', { name: 'Apple' }).element().id
		);

		await userEvent.keyboard('{ArrowDown}');
		expect(input.getAttribute('aria-activedescendant')).toBe(
			page.getByRole('option', { name: 'Banana' }).element().id
		);

		// Cherry is disabled — moving down again must skip straight to Date.
		await userEvent.keyboard('{ArrowDown}');
		expect(input.getAttribute('aria-activedescendant')).toBe(
			page.getByRole('option', { name: 'Date' }).element().id
		);
	});

	it('selects an option on click, commits the value, and closes the menu', async () => {
		const onValueChange = vi.fn();
		render(Combobox, { options: fruitOptions, onValueChange });

		await page.getByRole('combobox').click();
		await page.getByRole('option', { name: 'Banana' }).click();

		expect(onValueChange).toHaveBeenCalledWith('banana');
		await expect.element(page.getByRole('listbox')).not.toBeInTheDocument();
	});

	it('Enter commits the highlighted option', async () => {
		const onValueChange = vi.fn();
		render(Combobox, { options: fruitOptions, onValueChange });

		await page.getByRole('combobox').click();
		await userEvent.keyboard('{Enter}');

		expect(onValueChange).toHaveBeenCalledWith('apple');
	});

	it('does not select a disabled option', async () => {
		const onValueChange = vi.fn();
		render(Combobox, { options: fruitOptions, onValueChange });

		await page.getByRole('combobox').click();
		await page.getByRole('option', { name: 'Cherry' }).click({ force: true });

		expect(onValueChange).not.toHaveBeenCalled();
		await expect.element(page.getByRole('listbox')).toBeInTheDocument();
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		render(Combobox, { options: fruitOptions });

		const trigger = page.getByRole('combobox');
		await trigger.click();
		await expect.element(page.getByRole('listbox')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('listbox')).not.toBeInTheDocument();
		await expect.element(trigger).toHaveFocus();
	});

	it('multi-select keeps the menu open after picking and calls onValueChange with an array', async () => {
		const onValueChange = vi.fn();
		render(Combobox, { options: fruitOptions, multiple: true, onValueChange });

		await page.getByRole('combobox').click();
		await page.getByRole('option', { name: 'Apple' }).click();

		expect(onValueChange).toHaveBeenCalledWith(['apple']);
		await expect.element(page.getByRole('listbox')).toBeInTheDocument();
	});

	it('Backspace on an empty query pops the last chip', async () => {
		const onValueChange = vi.fn();
		render(Combobox, {
			options: fruitOptions,
			multiple: true,
			value: ['apple', 'banana'],
			onValueChange
		});

		await page.getByRole('combobox').click();
		await userEvent.keyboard('{Backspace}');

		expect(onValueChange).toHaveBeenCalledWith(['apple']);
	});

	it('the clear button resets the value', async () => {
		const onValueChange = vi.fn();
		render(Combobox, { options: fruitOptions, value: 'apple', clearable: true, onValueChange });

		await page.getByRole('button', { name: 'Clear selection' }).click();

		expect(onValueChange).toHaveBeenCalledWith(undefined);
	});

	it('debounces onSearchChange', async () => {
		vi.useFakeTimers();
		try {
			const onSearchChange = vi.fn();
			render(Combobox, { options: fruitOptions, onSearchChange, searchDebounce: 300 });

			// Raw DOM dispatch, not userEvent — userEvent's internal per-key delay
			// does not play well with fake timers (see Toaster's hover test for the
			// same reasoning applied to pointer events).
			(page.getByRole('combobox').element() as HTMLElement).click();
			const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
			input.value = 'an';
			input.dispatchEvent(new Event('input', { bubbles: true }));

			expect(onSearchChange).not.toHaveBeenCalled();

			await vi.advanceTimersByTimeAsync(300);

			expect(onSearchChange).toHaveBeenCalledWith('an');
		} finally {
			vi.useRealTimers();
		}
	});

	function mockScrollNearBottom(el: HTMLElement): void {
		Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 500 });
		Object.defineProperty(el, 'clientHeight', { configurable: true, value: 200 });
		Object.defineProperty(el, 'scrollTop', { configurable: true, value: 290 }); // 500 - 290 - 200 = 10, within the 48px threshold
	}

	it('calls onEndReached when the listbox is scrolled near the bottom', async () => {
		const onEndReached = vi.fn();
		render(Combobox, { options: fruitOptions, onEndReached });

		await page.getByRole('combobox').click();
		const list = page.getByRole('listbox').element() as HTMLElement;
		mockScrollNearBottom(list);
		list.dispatchEvent(new Event('scroll'));

		expect(onEndReached).toHaveBeenCalledOnce();
	});

	it('does not call onEndReached again for repeated scroll ticks until options or loading changes', async () => {
		const onEndReached = vi.fn();
		render(Combobox, { options: fruitOptions, onEndReached });

		await page.getByRole('combobox').click();
		const list = page.getByRole('listbox').element() as HTMLElement;
		mockScrollNearBottom(list);

		list.dispatchEvent(new Event('scroll'));
		list.dispatchEvent(new Event('scroll'));
		list.dispatchEvent(new Event('scroll'));

		expect(onEndReached).toHaveBeenCalledOnce();
	});

	it('does not call onEndReached while loading', async () => {
		const onEndReached = vi.fn();
		render(Combobox, { options: fruitOptions, onEndReached, loading: true });

		await page.getByRole('combobox').click();
		const list = page.getByRole('listbox').element() as HTMLElement;
		mockScrollNearBottom(list);
		list.dispatchEvent(new Event('scroll'));

		expect(onEndReached).not.toHaveBeenCalled();
	});

	it('propagates value and search back to the consumer via bind', async () => {
		render(BindingHarness);

		await page.getByRole('combobox').click();
		await page.getByRole('option', { name: 'Banana' }).click();

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('banana');
	});
});
