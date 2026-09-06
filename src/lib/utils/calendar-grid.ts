import {
	type CalendarDate,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	isSameMonth
} from '@internationalized/date';

export interface CalendarGridOptions {
	/** Any date within the month to render. */
	date: CalendarDate;
	locale: string;
}

export interface CalendarCell {
	date: CalendarDate;
	outsideMonth: boolean;
}

export interface CalendarYearCell {
	year: number;
	/** Jan 1 of `year` — the value a year-granularity selection resolves to. */
	date: CalendarDate;
}

export interface CalendarMonthCell {
	/** 1-12 */
	month: number;
	/** Day 1 of `month`, in the same year as the input date — the value a month-granularity selection resolves to. */
	date: CalendarDate;
}

/**
 * Computes the full weeks grid for a month, including the leading/trailing
 * days from adjacent months needed to fill complete weeks — e.g. late Feb
 * days appearing on the first row of a March grid. Delegates all calendar
 * math (leap years, locale-aware week boundaries) to `@internationalized/date`
 * rather than hand-rolling it, then just walks day-by-day chunking into rows
 * of 7 — the same "compute the hard part once, walk it linearly" shape as
 * `pagination-range.ts`.
 */
export function getCalendarGrid({ date, locale }: CalendarGridOptions): CalendarCell[][] {
	const firstCell = startOfWeek(startOfMonth(date), locale);
	const lastCell = endOfWeek(endOfMonth(date), locale);

	const weeks: CalendarCell[][] = [];
	let week: CalendarCell[] = [];
	let cursor = firstCell;

	while (cursor.compare(lastCell) <= 0) {
		week.push({ date: cursor, outsideMonth: !isSameMonth(cursor, date) });
		if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
		cursor = cursor.add({ days: 1 });
	}

	return weeks;
}

/** Number of years shown per year-grid page — a 4-column x 3-row grid. */
export const YEAR_GRID_PAGE_SIZE = 12;

/**
 * Computes one page of a year grid: `YEAR_GRID_PAGE_SIZE` consecutive years
 * aligned to a fixed page boundary (e.g. 2020-2031), so paging always lands
 * on the same decade-like boundary regardless of which year within it was
 * focused — mirrors `getCalendarGrid`'s "compute once, walk it linearly"
 * shape but for years instead of days.
 */
export function getYearGrid(date: CalendarDate): CalendarYearCell[] {
	const startYear = Math.floor(date.year / YEAR_GRID_PAGE_SIZE) * YEAR_GRID_PAGE_SIZE;

	const years: CalendarYearCell[] = [];
	for (let i = 0; i < YEAR_GRID_PAGE_SIZE; i++) {
		const year = startYear + i;
		years.push({ year, date: date.set({ year, month: 1, day: 1 }) });
	}
	return years;
}

/**
 * Computes the 12 months of the year containing `date`, each resolved to
 * day 1 of that month — the month-grid analogue of `getYearGrid`.
 */
export function getMonthGrid(date: CalendarDate): CalendarMonthCell[] {
	const months: CalendarMonthCell[] = [];
	for (let month = 1; month <= 12; month++) {
		months.push({ month, date: date.set({ month, day: 1 }) });
	}
	return months;
}
