import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { tick } from 'svelte';
import Combobox from './Combobox.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import ComboboxSemiHeadlessHarness from './ComboboxSemiHeadlessHarness.spec.svelte';
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
			await tick();
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

	it('forwards restProps, applies root and sub-part classes, binds DOM refs, and renders custom snippets', async () => {
		render(ComboboxSemiHeadlessHarness);

		const root = page.getByTestId('combobox-root');
		await expect.element(root).toBeInTheDocument();
		await expect.element(root).toHaveClass('custom-root-class');
		await expect.element(root).toHaveAttribute('data-slot', 'combobox');
		await expect.element(root).toHaveAttribute('data-state', 'closed');
		await expect.element(root).toHaveAttribute('data-size', 'md');

		// Check ref bindings on mount
		await expect.element(page.getByTestId('has-root-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-trigger-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-input-ref')).toHaveTextContent('no');
		await expect.element(page.getByTestId('has-content-ref')).toHaveTextContent('no');

		// Check custom indicator snippet when closed
		const customIndicator = page.getByTestId('custom-indicator');
		await expect.element(customIndicator).toBeInTheDocument();
		await expect.element(customIndicator).toHaveAttribute('data-open', 'false');

		// Click to open
		await page.getByRole('combobox').click();

		// Root flips state
		await expect.element(root).toHaveAttribute('data-state', 'open');
		await expect.element(customIndicator).toHaveAttribute('data-open', 'true');

		// Floating panel and input refs are now bound
		await expect.element(page.getByTestId('has-input-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-content-ref')).toHaveTextContent('yes');

		// Check sub-part classes
		const listbox = page.getByRole('listbox');
		await expect.element(listbox).toHaveClass('custom-listbox-class');
		await expect.element(listbox).toHaveAttribute('data-slot', 'combobox-listbox');

		const groupHeader = page.getByText('Fruits');
		await expect.element(groupHeader).toHaveClass('custom-group-header');
		await expect.element(groupHeader).toHaveAttribute('data-slot', 'combobox-group-header');

		// Test empty snippet with query
		const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
		input.value = 'xyz';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		const emptyEl = page.getByTestId('custom-empty');
		await expect.element(emptyEl).toBeInTheDocument();
		await expect.element(emptyEl).toHaveTextContent('Kosong: xyz');
	});

	it('scales popover search input, options, and container to match small size', async () => {
		render(Combobox, { options: fruitOptions, size: 'sm' });

		await page.getByRole('combobox').click();

		const content = page.getByRole('listbox').element().closest('[data-slot="combobox-content"]');
		expect(content?.getAttribute('data-size')).toBe('sm');

		const input = page.getByRole('textbox', { name: 'Search…' });
		await expect.element(input).toHaveClass('h-8');
		await expect.element(input).toHaveClass('text-xs');

		const option = page.getByRole('option', { name: 'Apple' });
		await expect.element(option).toHaveClass('px-2');
		await expect.element(option).toHaveClass('text-xs');
	});

	it('applies classes.chip, classes.chipRemove, and classes.chipCounter in multiple mode', async () => {
		render(Combobox, {
			options: fruitOptions,
			multiple: true,
			value: ['apple', 'banana', 'cherry'],
			maxChips: 1,
			classes: {
				chip: 'custom-chip',
				chipRemove: 'custom-chip-remove',
				chipCounter: 'custom-chip-counter'
			}
		});

		const chip = page.getByRole('combobox').element().querySelector('[data-slot="combobox-chip"]');
		expect(chip?.classList.contains('custom-chip')).toBe(true);

		const removeBtn = page.getByRole('combobox').element().querySelector('[data-slot="combobox-chip-remove"]');
		expect(removeBtn?.classList.contains('custom-chip-remove')).toBe(true);

		const counter = page.getByRole('combobox').element().querySelector('[data-slot="combobox-chip-counter"]');
		expect(counter?.classList.contains('custom-chip-counter')).toBe(true);
		expect(counter?.textContent?.trim()).toBe('+2');
	});

	it('shows create option when creatable is true and query has no match, and triggers onCreate on Enter', async () => {
		const onCreate = vi.fn();
		render(Combobox, {
			options: fruitOptions,
			creatable: true,
			onCreate
		});

		await page.getByRole('combobox').click();
		const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
		input.value = 'Papaya';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		const createOpt = page.getByRole('option', { name: 'Create "Papaya"' });
		await expect.element(createOpt).toBeInTheDocument();
		expect(createOpt.element().getAttribute('data-slot')).toBe('combobox-create-option');

		// Press enter to trigger creation
		await userEvent.keyboard('{Enter}');
		expect(onCreate).toHaveBeenCalledWith('Papaya');
	});

	it('clears search input after creating in multiple creatable mode', async () => {
		const onCreate = vi.fn();
		render(Combobox, {
			options: fruitOptions,
			multiple: true,
			creatable: true,
			onCreate
		});

		await page.getByRole('combobox').click();
		const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
		input.value = 'Grape';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		await userEvent.keyboard('{Enter}');
		expect(onCreate).toHaveBeenCalledWith('Grape');
		expect(input.value).toBe('');
		// Menu stays open in multiple mode
		await expect.element(page.getByRole('listbox')).toBeInTheDocument();
	});

	it('does not show create option if query exactly matches an existing option', async () => {
		render(Combobox, {
			options: fruitOptions,
			creatable: true
		});

		await page.getByRole('combobox').click();
		const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
		input.value = 'apple';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		const createOpt = page.getByRole('listbox').element().querySelector('[data-slot="combobox-create-option"]');
		expect(createOpt).toBeNull();
	});

	it('appends create option at bottom when partial matches exist and allows keyboard navigation to it', async () => {
		const onCreate = vi.fn();
		render(Combobox, {
			options: fruitOptions,
			creatable: true,
			onCreate
		});

		await page.getByRole('combobox').click();
		const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
		// "an" matches Banana
		input.value = 'an';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		// Banana is at index 0, create "an" is at index 1
		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
		const createOpt = page.getByRole('option', { name: 'Create "an"' });
		await expect.element(createOpt).toBeInTheDocument();

		// Navigate down to create option
		await userEvent.keyboard('{ArrowDown}');
		expect(input.getAttribute('aria-activedescendant')).toBe(createOpt.element().id);

		// Press enter on create option
		await userEvent.keyboard('{Enter}');
		expect(onCreate).toHaveBeenCalledWith('an');
	});

	it('supports custom create label and classes.createOption', async () => {
		render(Combobox, {
			options: fruitOptions,
			creatable: true,
			labels: {
				create: (q) => `Tambah item: ${q}`
			},
			classes: {
				createOption: 'custom-create-btn'
			}
		});

		await page.getByRole('combobox').click();
		const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
		input.value = 'Melon';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		const createOpt = page.getByRole('option', { name: 'Tambah item: Melon' });
		await expect.element(createOpt).toBeInTheDocument();
		expect(createOpt.element().classList.contains('custom-create-btn')).toBe(true);
	});

	it('handles async onCreate by showing creating state, disabling re-triggers, and clearing input on resolve', async () => {
		let resolveCreate!: () => void;
		const onCreate = vi.fn().mockImplementation(() => {
			return new Promise<void>((resolve) => {
				resolveCreate = resolve;
			});
		});

		render(Combobox, {
			options: fruitOptions,
			multiple: true,
			creatable: true,
			onCreate,
			labels: {
				creating: (q) => `Menyimpan "${q}"…`
			}
		});

		await page.getByRole('combobox').click();
		const input = page.getByRole('textbox', { name: 'Search…' }).element() as HTMLInputElement;
		input.value = 'Dragonfruit';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		// Trigger create
		await userEvent.keyboard('{Enter}');
		expect(onCreate).toHaveBeenCalledTimes(1);

		// While in flight: shows pending text and disabled input
		await tick();
		await expect.element(page.getByText('Menyimpan "Dragonfruit"…')).toBeInTheDocument();
		expect(input.disabled).toBe(true);

		// Pressing Enter again while creating must NOT trigger onCreate again
		await userEvent.keyboard('{Enter}');
		expect(onCreate).toHaveBeenCalledTimes(1);

		// Resolve async action
		resolveCreate();
		await tick();

		// After resolution: input is enabled again and cleared
		expect(input.disabled).toBe(false);
		expect(input.value).toBe('');
	});
});



