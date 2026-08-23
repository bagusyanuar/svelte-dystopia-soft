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
}

export interface CalendarDaySnippetProps {
	date: CalendarDate;
	selected: boolean;
	today: boolean;
	outsideMonth: boolean;
	disabled: boolean;
	inRange: boolean;
}

interface CalendarBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	classes?: {
		header?: string;
		previousButton?: string;
		nextButton?: string;
		heading?: string;
		weekdays?: string;
		grid?: string;
		day?: string;
	};
	/** BCP 47 locale used for week-start day and month/weekday formatting. Defaults to the browser locale. */
	locale?: string;
	/** Month shown initially when there's no `value` (or, in range mode, no `value.start`) to derive it from. Defaults to the current month. */
	defaultMonth?: CalendarDate;
	minValue?: CalendarDate;
	maxValue?: CalendarDate;
	isDateDisabled?: (date: CalendarDate) => boolean;
	labels?: CalendarLabels;
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
