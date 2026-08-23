<script lang="ts">
	import { tick } from 'svelte';
	import {
		type CalendarDate,
		isSameDay,
		isToday,
		today,
		getLocalTimeZone,
		startOfWeek,
		endOfWeek,
		DateFormatter
	} from '@internationalized/date';
	import { cn } from '../../utils/cn.js';
	import { createIds } from '../../utils/id.js';
	import { getCalendarGrid } from '../../utils/calendar-grid.js';
	import CalendarDay from './CalendarDay.svelte';
	import type { CalendarProps, CalendarRangeValue } from './Calendar.types.js';

	let {
		type = 'single',
		value = $bindable(),
		class: className,
		classes,
		locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US',
		defaultMonth,
		minValue,
		maxValue,
		isDateDisabled,
		labels,
		day,
		onValueChange,
		...restProps
	}: CalendarProps = $props();

	const baseId = $props.id();
	const ids = createIds(baseId, 'heading');

	function initialFocusDate(): CalendarDate {
		if (type === 'range') {
			return (
				(value as CalendarRangeValue | undefined)?.start ??
				defaultMonth ??
				today(getLocalTimeZone())
			);
		}
		return (value as CalendarDate | undefined) ?? defaultMonth ?? today(getLocalTimeZone());
	}

	let focusedDate = $state<CalendarDate>(initialFocusDate());
	let gridEl = $state<HTMLDivElement | null>(null);

	const weeks = $derived(getCalendarGrid({ date: focusedDate, locale }));
	const weekdayFormatter = $derived(new DateFormatter(locale, { weekday: 'short' }));
	const weekdayLongFormatter = $derived(new DateFormatter(locale, { weekday: 'long' }));
	const headingFormatter = $derived(new DateFormatter(locale, { month: 'long', year: 'numeric' }));
	const heading = $derived(headingFormatter.format(focusedDate.toDate(getLocalTimeZone())));
	// A bare day-of-month ("15") is an ambiguous accessible name — the grid
	// always has a couple of adjacent-month cells sharing the same number
	// (e.g. Feb 29 and Mar 29 in the same row). Full-date `aria-label`
	// disambiguates for AT users and, as a side effect, for the day-cell
	// selector too.
	const fullDateFormatter = $derived(new DateFormatter(locale, { dateStyle: 'full' }));

	function isDisabled(date: CalendarDate): boolean {
		if (minValue && date.compare(minValue) < 0) return true;
		if (maxValue && date.compare(maxValue) > 0) return true;
		return isDateDisabled?.(date) ?? false;
	}

	function isSelected(date: CalendarDate): boolean {
		if (type === 'range') {
			const current = value as CalendarRangeValue | undefined;
			return (
				(!!current?.start && isSameDay(date, current.start)) ||
				(!!current?.end && isSameDay(date, current.end))
			);
		}
		return !!value && isSameDay(date, value as CalendarDate);
	}

	function isInRange(date: CalendarDate): boolean {
		if (type !== 'range') return false;
		const current = value as CalendarRangeValue | undefined;
		if (!current?.start || !current?.end) return false;
		return date.compare(current.start) > 0 && date.compare(current.end) < 0;
	}

	/**
	 * Range picking is a two-click state machine: the first click after a
	 * complete (or empty) range starts a new one, the second click completes
	 * it — swapping start/end if the second date lands before the first so
	 * `start` is always the earlier date regardless of click order.
	 */
	function selectDate(date: CalendarDate): void {
		if (isDisabled(date)) return;
		focusedDate = date;

		if (type === 'range') {
			const current = value as CalendarRangeValue | undefined;
			const next: CalendarRangeValue =
				!current?.start || (current.start && current.end)
					? { start: date, end: undefined }
					: date.compare(current.start) < 0
						? { start: date, end: current.start }
						: { start: current.start, end: date };
			value = next;
			(onValueChange as ((value: CalendarRangeValue) => void) | undefined)?.(next);
		} else {
			value = date;
			(onValueChange as ((value: CalendarDate | undefined) => void) | undefined)?.(date);
		}
	}

	function changeMonth(delta: number): void {
		focusedDate = focusedDate.add({ months: delta });
	}

	async function focusCell(date: CalendarDate): Promise<void> {
		await tick();
		gridEl?.querySelector<HTMLElement>(`[data-date="${date.toString()}"]`)?.focus();
	}

	async function handleGridKeydown(event: KeyboardEvent): Promise<void> {
		let next: CalendarDate | undefined;
		switch (event.key) {
			case 'ArrowLeft':
				next = focusedDate.subtract({ days: 1 });
				break;
			case 'ArrowRight':
				next = focusedDate.add({ days: 1 });
				break;
			case 'ArrowUp':
				next = focusedDate.subtract({ days: 7 });
				break;
			case 'ArrowDown':
				next = focusedDate.add({ days: 7 });
				break;
			case 'Home':
				next = startOfWeek(focusedDate, locale);
				break;
			case 'End':
				next = endOfWeek(focusedDate, locale);
				break;
			case 'PageUp':
				next = focusedDate.subtract({ months: 1 });
				break;
			case 'PageDown':
				next = focusedDate.add({ months: 1 });
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				selectDate(focusedDate);
				return;
			default:
				return;
		}
		event.preventDefault();
		focusedDate = next;
		await focusCell(next);
	}
</script>

<div class={cn('w-fit', className)} {...restProps}>
	<div class={cn('flex items-center justify-between gap-cozy pb-compact', classes?.header)}>
		<button
			type="button"
			aria-label={labels?.previousMonth ?? 'Previous month'}
			onclick={() => changeMonth(-1)}
			class={cn(
				'inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
				classes?.previousButton
			)}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-4"
			>
				<path d="m15 18-6-6 6-6" />
			</svg>
		</button>
		<span
			id={ids.heading}
			aria-live="polite"
			class={cn('text-sm leading-snug font-medium text-foreground', classes?.heading)}
		>
			{heading}
		</span>
		<button
			type="button"
			aria-label={labels?.nextMonth ?? 'Next month'}
			onclick={() => changeMonth(1)}
			class={cn(
				'inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
				classes?.nextButton
			)}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-4"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
		</button>
	</div>

	<div
		bind:this={gridEl}
		role="grid"
		tabindex="-1"
		aria-labelledby={ids.heading}
		onkeydown={handleGridKeydown}
		class="flex flex-col gap-1 outline-none"
	>
		<div role="row" class={cn('grid grid-cols-7 justify-items-center', classes?.weekdays)}>
			{#each weeks[0] as cell (cell.date.toString())}
				<span
					role="columnheader"
					aria-label={weekdayLongFormatter.format(cell.date.toDate(getLocalTimeZone()))}
					class="flex size-8 items-center justify-center text-xs font-medium text-foreground-subtle"
				>
					{weekdayFormatter.format(cell.date.toDate(getLocalTimeZone()))}
				</span>
			{/each}
		</div>

		{#each weeks as week (week[0].date.toString())}
			<div role="row" class="grid grid-cols-7 justify-items-center">
				{#each week as cell (cell.date.toString())}
					{@const selected = isSelected(cell.date)}
					{@const isCellToday = isToday(cell.date, getLocalTimeZone())}
					{@const disabled = isDisabled(cell.date)}
					{@const inRange = isInRange(cell.date)}
					{#if day}
						<!-- Fully custom cell — consumer owns click wiring, same escape-hatch shape as `Pagination`'s `item` snippet. -->
						{@render day({
							date: cell.date,
							selected,
							today: isCellToday,
							outsideMonth: cell.outsideMonth,
							disabled,
							inRange
						})}
					{:else}
						<CalendarDay
							data-date={cell.date.toString()}
							aria-label={fullDateFormatter.format(cell.date.toDate(getLocalTimeZone()))}
							{selected}
							today={isCellToday}
							outsideMonth={cell.outsideMonth}
							{disabled}
							{inRange}
							tabIndex={isSameDay(cell.date, focusedDate) ? 0 : -1}
							class={classes?.day}
							onclick={() => selectDate(cell.date)}
						>
							{cell.date.day}
						</CalendarDay>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
