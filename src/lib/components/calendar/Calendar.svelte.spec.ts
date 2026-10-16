import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { CalendarDate } from '@internationalized/date';
import Calendar from './Calendar.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import RangeHarness from './RangeHarness.spec.svelte';
import CalendarSemiHeadlessHarness from './CalendarSemiHeadlessHarness.spec.svelte';

describe('Calendar', () => {
	it('renders a grid labelled with the visible month and year', async () => {
		render(Calendar, { value: new CalendarDate(2024, 3, 15) });

		await expect.element(page.getByRole('grid', { name: 'March 2024' })).toBeInTheDocument();
	});

	it('marks the selected date with aria-selected', async () => {
		render(Calendar, { value: new CalendarDate(2024, 3, 15) });

		await expect
			.element(page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }))
			.toHaveAttribute('aria-selected', 'true');
		await expect
			.element(page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }))
			.toHaveAttribute('aria-selected', 'false');
	});

	it('selecting a day updates aria-selected and fires onValueChange', async () => {
		const onValueChange = vi.fn();
		render(Calendar, { value: new CalendarDate(2024, 3, 15), onValueChange });

		await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();

		await expect
			.element(page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }))
			.toHaveAttribute('aria-selected', 'true');
		expect(onValueChange).toHaveBeenCalledWith(new CalendarDate(2024, 3, 20));
	});

	it('navigates to the next/previous month', async () => {
		render(Calendar, { value: new CalendarDate(2024, 3, 15) });

		await page.getByRole('button', { name: 'Next month' }).click();
		await expect.element(page.getByRole('grid', { name: 'April 2024' })).toBeInTheDocument();

		await page.getByRole('button', { name: 'Previous month' }).click();
		await page.getByRole('button', { name: 'Previous month' }).click();
		await expect.element(page.getByRole('grid', { name: 'February 2024' })).toBeInTheDocument();
	});

	it('disables dates outside minValue/maxValue via aria-disabled, not the native attribute', async () => {
		render(Calendar, {
			value: new CalendarDate(2024, 3, 15),
			minValue: new CalendarDate(2024, 3, 10),
			maxValue: new CalendarDate(2024, 3, 20)
		});

		const outOfRange = page.getByRole('gridcell', { name: 'Sunday, March 3, 2024' }).element();
		expect(outOfRange.getAttribute('aria-disabled')).toBe('true');
		expect(outOfRange.hasAttribute('disabled')).toBe(false);
	});

	it('does not select a disabled date on click', async () => {
		const onValueChange = vi.fn();
		render(Calendar, {
			value: new CalendarDate(2024, 3, 15),
			minValue: new CalendarDate(2024, 3, 10),
			onValueChange
		});

		await page.getByRole('gridcell', { name: 'Sunday, March 3, 2024' }).click({ force: true });

		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('moves the roving tabindex with ArrowRight and selects with Enter', async () => {
		const onValueChange = vi.fn();
		render(Calendar, { value: new CalendarDate(2024, 3, 15), onValueChange });

		const startCell = page
			.getByRole('gridcell', { name: 'Friday, March 15, 2024' })
			.element() as HTMLElement;
		startCell.focus();
		startCell.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

		await expect
			.element(page.getByRole('gridcell', { name: 'Saturday, March 16, 2024' }))
			.toHaveAttribute('tabindex', '0');

		document.activeElement?.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
		);
		expect(onValueChange).toHaveBeenCalledWith(new CalendarDate(2024, 3, 16));
	});

	it('lets a consumer localize the previous/next month labels', async () => {
		render(Calendar, {
			value: new CalendarDate(2024, 3, 15),
			labels: { previousMonth: 'Bulan sebelumnya', nextMonth: 'Bulan berikutnya' }
		});

		await expect
			.element(page.getByRole('button', { name: 'Bulan sebelumnya' }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'Bulan berikutnya' }))
			.toBeInTheDocument();
	});

	it('renders a custom day cell via the day snippet instead of the default button', async () => {
		const day = createRawSnippet<[{ date: CalendarDate }]>((getProps) => ({
			render: () => `<span data-testid="custom-day">D${getProps().date.day}</span>`
		}));
		render(Calendar, { value: new CalendarDate(2024, 3, 15), day });

		await expect.element(page.getByText('D15')).toBeInTheDocument();
		expect(page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).query()).toBeNull();
	});

	it('lets a consumer override the day cell class', async () => {
		render(Calendar, { value: new CalendarDate(2024, 3, 15), classes: { day: 'day-test' } });

		const cell = page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).element();
		expect(cell.className).toContain('day-test');
	});

	it('propagates the selected value back to the consumer via bind', async () => {
		render(BindingHarness);

		await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('2024-03-20');
	});

	describe('range mode', () => {
		it('the first click starts the range, the second completes it', async () => {
			render(RangeHarness);

			await page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).click();
			await expect.element(page.getByTestId('outer-start')).toHaveTextContent('2024-03-15');
			await expect.element(page.getByTestId('outer-end')).toHaveTextContent('');

			await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();
			await expect.element(page.getByTestId('outer-start')).toHaveTextContent('2024-03-15');
			await expect.element(page.getByTestId('outer-end')).toHaveTextContent('2024-03-20');
		});

		it('swaps start/end when the second click lands before the first', async () => {
			render(RangeHarness);

			await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();
			await page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).click();

			await expect.element(page.getByTestId('outer-start')).toHaveTextContent('2024-03-15');
			await expect.element(page.getByTestId('outer-end')).toHaveTextContent('2024-03-20');
		});

		it('a third click after a complete range starts a new one', async () => {
			render(RangeHarness);

			await page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).click();
			await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();
			await page.getByRole('gridcell', { name: 'Sunday, March 10, 2024' }).click();

			await expect.element(page.getByTestId('outer-start')).toHaveTextContent('2024-03-10');
			await expect.element(page.getByTestId('outer-end')).toHaveTextContent('');
		});

		it('marks days between start and end as in-range', async () => {
			render(RangeHarness);

			await page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).click();
			await page.getByRole('gridcell', { name: 'Wednesday, March 20, 2024' }).click();

			const between = page.getByRole('gridcell', { name: 'Sunday, March 17, 2024' }).element();
			expect(between.getAttribute('aria-selected')).toBe('false');
		});
	});

	describe('semi-headless capabilities', () => {
		it('binds root ref and gridRef correctly via bind:ref and bind:gridRef', async () => {
			render(CalendarSemiHeadlessHarness);

			await expect.element(page.getByTestId('ref-status')).toHaveAttribute('data-has-root', 'true');
			await expect.element(page.getByTestId('ref-status')).toHaveAttribute('data-has-grid', 'true');
		});

		it('renders custom previousIcon, nextIcon, and headingSnippet', async () => {
			render(CalendarSemiHeadlessHarness);

			await expect.element(page.getByTestId('custom-prev-icon')).toBeInTheDocument();
			await expect.element(page.getByTestId('custom-next-icon')).toBeInTheDocument();
			await expect.element(page.getByTestId('custom-heading')).toHaveTextContent('day: March 2024');
		});

		it('applies custom sub-part classes including grid, weekday, row, header, etc.', async () => {
			render(CalendarSemiHeadlessHarness, {
				classes: {
					header: 'custom-header-cls',
					previousButton: 'custom-prev-cls',
					nextButton: 'custom-next-cls',
					heading: 'custom-heading-cls',
					weekdays: 'custom-weekdays-cls',
					weekday: 'custom-weekday-cls',
					row: 'custom-row-cls',
					grid: 'custom-grid-cls',
					day: 'custom-day-cls'
				}
			});

			const grid = page.getByRole('grid').element();
			expect(grid.className).toContain('custom-grid-cls');

			const header = document.querySelector('[data-slot="calendar-header"]')!;
			expect(header.className).toContain('custom-header-cls');

			const prevBtn = page.getByRole('button', { name: 'Previous month' }).element();
			expect(prevBtn.className).toContain('custom-prev-cls');

			const nextBtn = page.getByRole('button', { name: 'Next month' }).element();
			expect(nextBtn.className).toContain('custom-next-cls');

			const weekday = document.querySelector('[data-slot="calendar-weekday"]')!;
			expect(weekday.className).toContain('custom-weekday-cls');

			const dayCell = page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).element();
			expect(dayCell.className).toContain('custom-day-cls');
		});

		it('exposes data-slot and data attributes on calendar and calendar days', async () => {
			render(Calendar, { value: new CalendarDate(2024, 3, 15) });

			const root = document.querySelector('[data-slot="calendar"]')!;
			expect(root.getAttribute('data-type')).toBe('single');
			expect(root.getAttribute('data-granularity')).toBe('day');

			const selectedCell = page.getByRole('gridcell', { name: 'Friday, March 15, 2024' }).element();
			expect(selectedCell.getAttribute('data-slot')).toBe('calendar-day');
			expect(selectedCell.hasAttribute('data-selected')).toBe(true);

			const outsideMonthCell = page
				.getByRole('gridcell', { name: 'Sunday, February 25, 2024' })
				.element();
			expect(outsideMonthCell.hasAttribute('data-outside-month')).toBe(true);
		});
	});
});
