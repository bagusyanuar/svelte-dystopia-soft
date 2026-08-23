import { describe, it, expect } from 'vitest';
import { CalendarDate } from '@internationalized/date';
import { getCalendarGrid } from './calendar-grid.js';

describe('getCalendarGrid', () => {
	it('fills leading days from the previous month to start the grid on a week boundary', () => {
		// March 1 2024 is a Friday, so the first row needs Feb 25-29 to fill the week.
		const weeks = getCalendarGrid({ date: new CalendarDate(2024, 3, 15), locale: 'en-US' });
		expect(weeks[0].map((cell) => cell.date.toString())).toEqual([
			'2024-02-25',
			'2024-02-26',
			'2024-02-27',
			'2024-02-28',
			'2024-02-29',
			'2024-03-01',
			'2024-03-02'
		]);
		expect(weeks[0].map((cell) => cell.outsideMonth)).toEqual([
			true,
			true,
			true,
			true,
			true,
			false,
			false
		]);
	});

	it('fills trailing days from the next month to end the grid on a week boundary', () => {
		// March 31 2024 is a Sunday, so the last row needs April 1-6 to fill the week.
		const weeks = getCalendarGrid({ date: new CalendarDate(2024, 3, 15), locale: 'en-US' });
		const lastWeek = weeks[weeks.length - 1];
		expect(lastWeek.map((cell) => cell.date.toString())).toEqual([
			'2024-03-31',
			'2024-04-01',
			'2024-04-02',
			'2024-04-03',
			'2024-04-04',
			'2024-04-05',
			'2024-04-06'
		]);
		expect(lastWeek.map((cell) => cell.outsideMonth)).toEqual([
			false,
			true,
			true,
			true,
			true,
			true,
			true
		]);
	});

	it('handles a leap-year February correctly (29 days)', () => {
		const weeks = getCalendarGrid({ date: new CalendarDate(2024, 2, 1), locale: 'en-US' });
		const allDates = weeks.flat().map((cell) => cell.date.toString());
		expect(allDates).toContain('2024-02-29');
		expect(allDates).not.toContain('2024-03-01');
	});

	it('handles a non-leap-year February correctly (28 days)', () => {
		const weeks = getCalendarGrid({ date: new CalendarDate(2023, 2, 1), locale: 'en-US' });
		const allDates = weeks.flat().map((cell) => cell.date.toString());
		expect(allDates).toContain('2023-02-28');
		expect(allDates).not.toContain('2023-02-29');
	});

	it('produces only complete weeks of 7 days each', () => {
		const weeks = getCalendarGrid({ date: new CalendarDate(2024, 3, 15), locale: 'en-US' });
		for (const week of weeks) {
			expect(week).toHaveLength(7);
		}
	});

	it('every cell in a full week grid is exactly one day after the previous', () => {
		const weeks = getCalendarGrid({ date: new CalendarDate(2024, 3, 15), locale: 'en-US' });
		const flat = weeks.flat();
		for (let i = 1; i < flat.length; i++) {
			expect(flat[i].date.compare(flat[i - 1].date.add({ days: 1 }))).toBe(0);
		}
	});

	it('respects a locale with a Monday week start', () => {
		// March 1 2024 is a Friday; with a Monday-start locale the first row
		// starts on Feb 26, not Feb 25.
		const weeks = getCalendarGrid({ date: new CalendarDate(2024, 3, 15), locale: 'en-GB' });
		expect(weeks[0][0].date.toString()).toBe('2024-02-26');
	});
});
