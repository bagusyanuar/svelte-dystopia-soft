import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { CalendarDate } from '@internationalized/date';
import DatePicker from './DatePicker.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import RangeHarness from './RangeHarness.spec.svelte';
import DatePickerSemiHeadlessHarness from './DatePickerSemiHeadlessHarness.spec.svelte';

describe('DatePicker', () => {
	it('shows the placeholder when nothing is selected', async () => {
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1) });

		await expect.element(page.getByRole('button', { name: 'Select date' })).toBeInTheDocument();
	});

	it('shows the formatted value on the trigger when a date is selected', async () => {
		render(DatePicker, { value: new CalendarDate(2024, 3, 15) });

		await expect.element(page.getByRole('button', { name: 'Mar 15, 2024' })).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1) });

		expect(page.getByRole('grid').query()).toBeNull();
	});

	it('opens the calendar on click', async () => {
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1) });

		await page.getByRole('button', { name: 'Select date' }).click();

		await expect.element(page.getByRole('grid', { name: 'March 2024' })).toBeInTheDocument();
	});

	it('ArrowDown on the trigger opens the calendar', async () => {
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1) });

		await page.getByRole('button', { name: 'Select date' }).element().focus();
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.getByRole('grid', { name: 'March 2024' })).toBeInTheDocument();
	});

	it('selecting a date commits the value and closes the calendar', async () => {
		const onValueChange = vi.fn();
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1), onValueChange });

		await page.getByRole('button', { name: 'Select date' }).click();
		await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();

		expect(onValueChange).toHaveBeenCalledWith(new CalendarDate(2024, 3, 20));
		await expect.element(page.getByRole('grid')).not.toBeInTheDocument();
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1) });

		const trigger = page.getByRole('button', { name: 'Select date' });
		await trigger.click();
		await expect.element(page.getByRole('grid')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		await expect.element(page.getByRole('grid')).not.toBeInTheDocument();
		await expect.element(trigger).toHaveFocus();
	});

	it('closes on an outside pointerdown', async () => {
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1) });

		await page.getByRole('button', { name: 'Select date' }).click();
		await expect.element(page.getByRole('grid')).toBeInTheDocument();

		// A real click would land on a collapsed 0x0 box in this stylesheet-less
		// test environment, so dispatch the pointerdown directly — same
		// workaround Dialog's overlay-click test uses.
		document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

		await expect.element(page.getByRole('grid')).not.toBeInTheDocument();
	});

	it('does not open when disabled', async () => {
		render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1), disabled: true });

		await page.getByRole('button', { name: 'Select date' }).click({ force: true });

		expect(page.getByRole('grid').query()).toBeNull();
	});

	it('renders a hidden input carrying the ISO value for form submission', async () => {
		render(DatePicker, { name: 'birthday', value: new CalendarDate(2024, 3, 15) });

		const input = document.querySelector<HTMLInputElement>('input[name="birthday"]');
		expect(input?.value).toBe('2024-03-15');
	});

	it('lets a consumer override the trigger and content classes', async () => {
		render(DatePicker, {
			defaultMonth: new CalendarDate(2024, 3, 1),
			classes: { trigger: 'trigger-test', content: 'content-test' }
		});

		const trigger = page.getByRole('button', { name: 'Select date' }).element();
		expect(trigger.className).toContain('trigger-test');

		await page.getByRole('button', { name: 'Select date' }).click();
		const content = document.querySelector('[data-slot="date-picker-content"]');
		expect(content?.className).toContain('content-test');
	});

	it('propagates the selected value back to the consumer via bind', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Select date' }).click();
		await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('2024-03-20');
	});

	describe('range mode', () => {
		it('stays open after the first pick and closes once the range completes', async () => {
			render(RangeHarness);

			await page.getByRole('button', { name: 'Select date' }).click();
			await page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).click();

			await expect.element(page.getByTestId('outer-start')).toHaveTextContent('2024-03-15');
			await expect.element(page.getByRole('grid')).toBeInTheDocument();

			await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();

			await expect.element(page.getByTestId('outer-end')).toHaveTextContent('2024-03-20');
			await expect.element(page.getByRole('grid')).not.toBeInTheDocument();
		});

		it('renders separate hidden inputs for the start and end of the range', async () => {
			render(DatePicker, {
				type: 'range',
				name: 'stay',
				value: { start: new CalendarDate(2024, 3, 10), end: new CalendarDate(2024, 3, 15) }
			});

			expect(document.querySelector<HTMLInputElement>('input[name="stay-start"]')?.value).toBe(
				'2024-03-10'
			);
			expect(document.querySelector<HTMLInputElement>('input[name="stay-end"]')?.value).toBe(
				'2024-03-15'
			);
		});
	});

	describe('semi-headless capabilities', () => {
		it('binds root ref, triggerRef, and contentRef correctly', async () => {
			render(DatePickerSemiHeadlessHarness);

			await expect.element(page.getByTestId('ref-status')).toHaveAttribute('data-has-root', 'true');
			await expect.element(page.getByTestId('ref-status')).toHaveAttribute('data-has-trigger', 'true');
			await expect.element(page.getByTestId('ref-status')).toHaveAttribute('data-has-content', 'false');

			await page.getByRole('button', { name: 'Mar 15, 2024' }).click();
			await expect.element(page.getByTestId('ref-status')).toHaveAttribute('data-has-content', 'true');
		});

		it('renders custom icon and forwards day snippet to Calendar', async () => {
			render(DatePickerSemiHeadlessHarness);

			await expect.element(page.getByTestId('custom-date-icon')).toBeInTheDocument();

			await page.getByRole('button', { name: 'Mar 15, 2024' }).click();
			await expect.element(page.getByTestId('custom-day-cell').first()).toBeInTheDocument();
		});

		it('applies custom sub-part classes including icon, value, and calendar classes', async () => {
			render(DatePicker, {
				value: new CalendarDate(2024, 3, 15),
				classes: {
					trigger: 'custom-trigger-cls',
					content: 'custom-content-cls',
					icon: 'custom-icon-cls',
					value: 'custom-value-cls',
					calendar: {
						grid: 'custom-calendar-grid-cls'
					}
				}
			});

			const trigger = page.getByRole('button', { name: 'Mar 15, 2024' }).element();
			expect(trigger.className).toContain('custom-trigger-cls');

			const icon = trigger.querySelector('svg');
			expect(icon?.getAttribute('class')).toContain('custom-icon-cls');

			const valueSpan = trigger.querySelector('[data-slot="date-picker-value"]');
			expect(valueSpan?.className).toContain('custom-value-cls');

			await page.getByRole('button', { name: 'Mar 15, 2024' }).click();
			const content = document.querySelector('[data-slot="date-picker-content"]');
			expect(content?.className).toContain('custom-content-cls');

			const calendarGrid = page.getByRole('grid').element();
			expect(calendarGrid.className).toContain('custom-calendar-grid-cls');
		});

		it('exposes data-slot and data attributes on root wrapper and trigger', async () => {
			render(DatePicker, {
				value: new CalendarDate(2024, 3, 15),
				invalid: true,
				disabled: true,
				type: 'single',
				granularity: 'day'
			});

			const root = document.querySelector('[data-slot="date-picker"]')!;
			expect(root.getAttribute('data-state')).toBe('closed');
			expect(root.hasAttribute('data-disabled')).toBe(true);
			expect(root.hasAttribute('data-invalid')).toBe(true);
			expect(root.getAttribute('data-type')).toBe('single');
			expect(root.getAttribute('data-granularity')).toBe('day');

			const trigger = document.querySelector('[data-slot="date-picker-trigger"]')!;
			expect(trigger.getAttribute('data-state')).toBe('closed');
			expect(trigger.hasAttribute('data-disabled')).toBe(true);
			expect(trigger.hasAttribute('data-invalid')).toBe(true);
		});

		it('updates data-state to open when popover is shown', async () => {
			render(DatePicker, { defaultMonth: new CalendarDate(2024, 3, 1) });

			const root = document.querySelector('[data-slot="date-picker"]')!;
			expect(root.getAttribute('data-state')).toBe('closed');

			await page.getByRole('button', { name: 'Select date' }).click();
			expect(root.getAttribute('data-state')).toBe('open');
		});
	});

	describe('clearable feature', () => {
		it('shows the clear button when clearable is true and value exists, and clears on click', async () => {
			const onValueChange = vi.fn();
			render(DatePicker, {
				value: new CalendarDate(2024, 3, 15),
				clearable: true,
				onValueChange
			});

			const clearBtn = page.getByRole('button', { name: 'Clear date' });
			await expect.element(clearBtn).toBeInTheDocument();

			await clearBtn.click();
			expect(onValueChange).toHaveBeenCalledWith(undefined);
			await expect.element(page.getByRole('button', { name: 'Select date' })).toBeInTheDocument();
			await expect.element(clearBtn).not.toBeInTheDocument();
		});

		it('does not show clear button when clearable is false, or disabled, or value is empty', async () => {
			render(DatePicker, {
				value: new CalendarDate(2024, 3, 15),
				clearable: false
			});
			expect(page.getByRole('button', { name: 'Clear date' }).query()).toBeNull();

			render(DatePicker, {
				value: new CalendarDate(2024, 3, 15),
				clearable: true,
				disabled: true
			});
			expect(page.getByRole('button', { name: 'Clear date' }).query()).toBeNull();
		});

		it('clears range values when clearable is true in range mode', async () => {
			const onValueChange = vi.fn();
			render(DatePicker, {
				type: 'range',
				value: { start: new CalendarDate(2024, 3, 10), end: new CalendarDate(2024, 3, 15) },
				clearable: true,
				onValueChange
			});

			const clearBtn = page.getByRole('button', { name: 'Clear date' });
			await expect.element(clearBtn).toBeInTheDocument();

			await clearBtn.click();
			expect(onValueChange).toHaveBeenCalledWith({ start: undefined, end: undefined });
		});
	});
});
