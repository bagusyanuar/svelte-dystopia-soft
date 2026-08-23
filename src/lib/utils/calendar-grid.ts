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
