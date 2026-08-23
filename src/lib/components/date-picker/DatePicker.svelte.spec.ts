import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { CalendarDate } from '@internationalized/date';
import DatePicker from './DatePicker.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import RangeHarness from './RangeHarness.spec.svelte';

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
		await page.getByRole('button', { name: 'Wednesday, March 20, 2024' }).click();

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
		await page.getByRole('button', { name: 'Wednesday, March 20, 2024' }).click();

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('2024-03-20');
	});

	describe('range mode', () => {
		it('stays open after the first pick and closes once the range completes', async () => {
			render(RangeHarness);

			await page.getByRole('button', { name: 'Select date' }).click();
			await page.getByRole('button', { name: 'Friday, March 15, 2024' }).click();

			await expect.element(page.getByTestId('outer-start')).toHaveTextContent('2024-03-15');
			await expect.element(page.getByRole('grid')).toBeInTheDocument();

			await page.getByRole('button', { name: 'Wednesday, March 20, 2024' }).click();

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
});
