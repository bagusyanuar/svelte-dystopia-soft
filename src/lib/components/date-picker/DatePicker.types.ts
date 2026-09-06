import type { CalendarDate } from '@internationalized/date';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { CalendarRangeValue } from '../calendar/index.js';

/** All user-facing strings, structured so a consumer can fully localize — never hardcode English here. */
export interface DatePickerLabels {
	/** Trigger text when no date is selected yet. */
	placeholder?: string;
	previousMonth?: string;
	nextMonth?: string;
	previousYear?: string;
	nextYear?: string;
	previousYears?: string;
	nextYears?: string;
}

interface DatePickerBaseProps extends Omit<HTMLButtonAttributes, 'children' | 'value' | 'type'> {
	class?: string;
	classes?: {
		trigger?: string;
		content?: string;
	};
	/** BCP 47 locale used for week-start day, month/weekday, and trigger-value formatting. Defaults to the browser locale. */
	locale?: string;
	/**
	 * `'month'` renders a month-only picker — trigger and popover show month + year, no day step.
	 * `'year'` renders a year-only picker — trigger and popover show just the year.
	 * Defaults to `'day'`.
	 */
	granularity?: 'day' | 'month' | 'year';
	/** Month shown initially when there's no value to derive it from. Defaults to the current month. */
	defaultMonth?: CalendarDate;
	minValue?: CalendarDate;
	maxValue?: CalendarDate;
	isDateDisabled?: (date: CalendarDate) => boolean;
	labels?: DatePickerLabels;
	/** Renders a hidden input under this name for native form submission. */
	name?: string;
	disabled?: boolean;
	invalid?: boolean;
	portalTarget?: HTMLElement | string;
}

export type DatePickerProps = DatePickerBaseProps &
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
