import type { CalendarDate } from '@internationalized/date';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { CalendarClasses, CalendarDaySnippetProps, CalendarRangeValue } from '../calendar/index.js';
import type { Snippet } from 'svelte';

/** All user-facing strings, structured so a consumer can fully localize — never hardcode English here. */
export interface DatePickerLabels {
	/** Trigger text when no date is selected yet. */
	placeholder?: string;
	/** Accessible name for the clear button when clearable is enabled. */
	clear?: string;
	previousMonth?: string;
	nextMonth?: string;
	previousYear?: string;
	nextYear?: string;
	previousYears?: string;
	nextYears?: string;
}

export interface DatePickerClasses {
	trigger?: string;
	content?: string;
	icon?: string;
	value?: string;
	clearButton?: string;
	calendar?: CalendarClasses;
}

interface DatePickerBaseProps extends Omit<HTMLButtonAttributes, 'children' | 'value' | 'type'> {
	class?: string;
	/** Bindable reference to the root wrapper <div> element. */
	ref?: HTMLDivElement | null;
	/** Bindable reference to the interactive trigger <button> element. */
	triggerRef?: HTMLButtonElement | null;
	/** Bindable reference to the floating content <div> element. */
	contentRef?: HTMLDivElement | null;
	classes?: DatePickerClasses;
	/**
	 * Shows an '✕' clear button on the trigger when a date is selected,
	 * allowing the user to reset the value back to undefined.
	 * Defaults to `false`.
	 */
	clearable?: boolean;
	/** Custom snippet to replace the trigger calendar icon. */
	icon?: Snippet;
	/** Overrides the rendering of day cells in the popover Calendar. */
	day?: Snippet<[CalendarDaySnippetProps]>;
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
