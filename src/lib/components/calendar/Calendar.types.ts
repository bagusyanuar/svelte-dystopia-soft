import type { CalendarDate } from '@internationalized/date';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CalendarRangeValue {
	start: CalendarDate | undefined;
	end: CalendarDate | undefined;
}

/** All user-facing strings, structured so a consumer can fully localize — never hardcode English here. */
export interface CalendarLabels {
	previousMonth?: string;
	nextMonth?: string;
	previousYear?: string;
	nextYear?: string;
	previousYears?: string;
	nextYears?: string;
}

export interface CalendarDaySnippetProps {
	date: CalendarDate;
	selected: boolean;
	today: boolean;
	outsideMonth: boolean;
	disabled: boolean;
	inRange: boolean;
}

export interface CalendarHeadingSnippetProps {
	heading: string;
	focusedDate: CalendarDate;
	granularity: 'day' | 'month' | 'year';
}

export interface CalendarClasses {
	header?: string;
	previousButton?: string;
	nextButton?: string;
	heading?: string;
	weekdays?: string;
	weekday?: string;
	row?: string;
	grid?: string;
	day?: string;
}

interface CalendarBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	/** Bindable reference to the root wrapper element. */
	ref?: HTMLDivElement | null;
	/** Bindable reference to the grid element. */
	gridRef?: HTMLDivElement | null;
	classes?: CalendarClasses;
	/** BCP 47 locale used for week-start day and month/weekday formatting. Defaults to the browser locale. */
	locale?: string;
	/**
	 * `'month'` renders a 12-month grid for one year — selecting a month resolves `value` to day 1 of that month.
	 * `'year'` renders a year-only grid (paged 12 years at a time) — selecting a year resolves `value` to Jan 1 of that year.
	 * Defaults to `'day'`.
	 */
	granularity?: 'day' | 'month' | 'year';
	/** Month shown initially when there's no `value` (or, in range mode, no `value.start`) to derive it from. Defaults to the current month. */
	defaultMonth?: CalendarDate;
	minValue?: CalendarDate;
	maxValue?: CalendarDate;
	isDateDisabled?: (date: CalendarDate) => boolean;
	labels?: CalendarLabels;
	/** Custom snippet to replace the previous button icon. */
	previousIcon?: Snippet;
	/** Custom snippet to replace the next button icon. */
	nextIcon?: Snippet;
	/** Custom snippet to customize the heading display. */
	headingSnippet?: Snippet<[CalendarHeadingSnippetProps]>;
	/** Overrides the default rendering of a day cell. The rendered element is responsible for its own selection handling — see `Pagination`'s `item` snippet for the same escape-hatch shape. */
	day?: Snippet<[CalendarDaySnippetProps]>;
}

export type CalendarProps = CalendarBaseProps &
	(
		| {
				type?: 'single';
				value?: CalendarDate;
				onValueChange?: (value: CalendarDate | undefined) => void;
		  }
		| {
				type: 'range';
				value?: CalendarRangeValue;
				onValueChange?: (value: CalendarRangeValue) => void;
		  }
	);
