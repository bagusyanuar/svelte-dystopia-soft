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
	import {
		getCalendarGrid,
		getMonthGrid,
		getYearGrid,
		YEAR_GRID_PAGE_SIZE
	} from '../../utils/calendar-grid.js';
	import CalendarDay from './CalendarDay.svelte';
	import type { CalendarProps, CalendarRangeValue } from './Calendar.types.js';

	let {
		type = 'single',
		value = $bindable(),
		class: className,
		classes,
		locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US',
		granularity = 'day',
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
	const monthGrid = $derived(getMonthGrid(focusedDate));
	const yearGrid = $derived(getYearGrid(focusedDate));
	const weekdayFormatter = $derived(new DateFormatter(locale, { weekday: 'short' }));
	const weekdayLongFormatter = $derived(new DateFormatter(locale, { weekday: 'long' }));
	const headingFormatter = $derived(new DateFormatter(locale, { month: 'long', year: 'numeric' }));
	const yearOnlyFormatter = $derived(new DateFormatter(locale, { year: 'numeric' }));
	const monthShortFormatter = $derived(new DateFormatter(locale, { month: 'short' }));
	const monthLongFormatter = $derived(new DateFormatter(locale, { month: 'long' }));
	const heading = $derived(
		granularity === 'year'
			? `${yearGrid[0].year} – ${yearGrid[yearGrid.length - 1].year}`
			: granularity === 'month'
				? yearOnlyFormatter.format(focusedDate.toDate(getLocalTimeZone()))
				: headingFormatter.format(focusedDate.toDate(getLocalTimeZone()))
	);
	// A bare day-of-month ("15") is an ambiguous accessible name — the grid
	// always has a couple of adjacent-month cells sharing the same number
	// (e.g. Feb 29 and Mar 29 in the same row). Full-date `aria-label`
	// disambiguates for AT users and, as a side effect, for the day-cell
	// selector too.
	const fullDateFormatter = $derived(new DateFormatter(locale, { dateStyle: 'full' }));

	/** Year*12+month, so a single numeric compare captures "before/after" across a year boundary. */
	function monthIndex(date: CalendarDate): number {
		return date.year * 12 + date.month;
	}

	function isDisabled(date: CalendarDate): boolean {
		// In month/year granularity a cell represents the whole month or year
		// (day 1), so a minValue/maxValue that falls mid-unit must not disable
		// the unit it falls in — compare by month/year instead of the exact day.
		if (granularity === 'year') {
			if (minValue && date.year < minValue.year) return true;
			if (maxValue && date.year > maxValue.year) return true;
			return isDateDisabled?.(date) ?? false;
		}
		if (granularity === 'month') {
			if (minValue && monthIndex(date) < monthIndex(minValue)) return true;
			if (maxValue && monthIndex(date) > monthIndex(maxValue)) return true;
			return isDateDisabled?.(date) ?? false;
		}
		if (minValue && date.compare(minValue) < 0) return true;
		if (maxValue && date.compare(maxValue) > 0) return true;
		return isDateDisabled?.(date) ?? false;
	}

	function sameUnit(a: CalendarDate, b: CalendarDate): boolean {
		if (granularity === 'year') return a.year === b.year;
		if (granularity === 'month') return a.year === b.year && a.month === b.month;
		return isSameDay(a, b);
	}

	function isSelected(date: CalendarDate): boolean {
		if (type === 'range') {
			const current = value as CalendarRangeValue | undefined;
			return (
				(!!current?.start && sameUnit(date, current.start)) ||
				(!!current?.end && sameUnit(date, current.end))
			);
		}
		return !!value && sameUnit(date, value as CalendarDate);
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

	function changeYearPage(delta: number): void {
		focusedDate = focusedDate.add({ years: delta * YEAR_GRID_PAGE_SIZE });
	}

	function changeYear(delta: number): void {
		focusedDate = focusedDate.add({ years: delta });
	}

	async function focusCell(date: CalendarDate): Promise<void> {
		await tick();
		gridEl?.querySelector<HTMLElement>(`[data-date="${date.toString()}"]`)?.focus();
	}

	/** Columns in the year grid — a 4x3 layout of `YEAR_GRID_PAGE_SIZE` (12) years. */
	const YEAR_GRID_COLUMNS = 4;

	async function handleYearGridKeydown(event: KeyboardEvent): Promise<void> {
		let next: CalendarDate | undefined;
		switch (event.key) {
			case 'ArrowLeft':
				next = focusedDate.subtract({ years: 1 });
				break;
			case 'ArrowRight':
				next = focusedDate.add({ years: 1 });
				break;
			case 'ArrowUp':
				next = focusedDate.subtract({ years: YEAR_GRID_COLUMNS });
				break;
			case 'ArrowDown':
				next = focusedDate.add({ years: YEAR_GRID_COLUMNS });
				break;
			case 'Home':
				next = yearGrid[0].date;
				break;
			case 'End':
				next = yearGrid[yearGrid.length - 1].date;
				break;
			case 'PageUp':
				next = focusedDate.subtract({ years: YEAR_GRID_PAGE_SIZE });
				break;
			case 'PageDown':
				next = focusedDate.add({ years: YEAR_GRID_PAGE_SIZE });
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

	/** Columns in the month grid — a 4x3 layout of the year's 12 months. */
	const MONTH_GRID_COLUMNS = 4;

	async function handleMonthGridKeydown(event: KeyboardEvent): Promise<void> {
		let next: CalendarDate | undefined;
		switch (event.key) {
			case 'ArrowLeft':
				next = focusedDate.subtract({ months: 1 });
				break;
			case 'ArrowRight':
				next = focusedDate.add({ months: 1 });
				break;
			case 'ArrowUp':
				next = focusedDate.subtract({ months: MONTH_GRID_COLUMNS });
				break;
			case 'ArrowDown':
				next = focusedDate.add({ months: MONTH_GRID_COLUMNS });
				break;
			case 'Home':
				next = monthGrid[0].date;
				break;
			case 'End':
				next = monthGrid[monthGrid.length - 1].date;
				break;
			case 'PageUp':
				next = focusedDate.subtract({ years: 1 });
				break;
			case 'PageDown':
				next = focusedDate.add({ years: 1 });
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

	async function handleDayGridKeydown(event: KeyboardEvent): Promise<void> {
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

	function handleGridKeydown(event: KeyboardEvent): Promise<void> {
		if (granularity === 'year') return handleYearGridKeydown(event);
		if (granularity === 'month') return handleMonthGridKeydown(event);
		return handleDayGridKeydown(event);
	}
</script>

<div class={cn('w-fit', className)} {...restProps}>
	<div class={cn('flex items-center justify-between gap-cozy pb-compact', classes?.header)}>
		<button
			type="button"
			aria-label={granularity === 'year'
				? (labels?.previousYears ?? `Previous ${YEAR_GRID_PAGE_SIZE} years`)
				: granularity === 'month'
					? (labels?.previousYear ?? 'Previous year')
					: (labels?.previousMonth ?? 'Previous month')}
			onclick={() => {
				if (granularity === 'year') changeYearPage(-1);
				else if (granularity === 'month') changeYear(-1);
				else changeMonth(-1);
			}}
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
			aria-label={granularity === 'year'
				? (labels?.nextYears ?? `Next ${YEAR_GRID_PAGE_SIZE} years`)
				: granularity === 'month'
					? (labels?.nextYear ?? 'Next year')
					: (labels?.nextMonth ?? 'Next month')}
			onclick={() => {
				if (granularity === 'year') changeYearPage(1);
				else if (granularity === 'month') changeYear(1);
				else changeMonth(1);
			}}
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
		{#if granularity === 'year'}
			{#each [0, 1, 2] as row (row)}
				<div role="row" class="grid grid-cols-4 justify-items-center">
					{#each yearGrid.slice(row * YEAR_GRID_COLUMNS, row * YEAR_GRID_COLUMNS + YEAR_GRID_COLUMNS) as cell (cell.year)}
						{@const selected = isSelected(cell.date)}
						{@const isCellCurrentYear = cell.year === today(getLocalTimeZone()).year}
						{@const disabled = isDisabled(cell.date)}
						{@const inRange = isInRange(cell.date)}
						<CalendarDay
							data-date={cell.date.toString()}
							aria-label={String(cell.year)}
							{selected}
							today={isCellCurrentYear}
							{disabled}
							{inRange}
							tabIndex={cell.year === focusedDate.year ? 0 : -1}
							class={cn('w-16', classes?.day)}
							onclick={() => selectDate(cell.date)}
						>
							{cell.year}
						</CalendarDay>
					{/each}
				</div>
			{/each}
		{:else if granularity === 'month'}
			{#each [0, 1, 2] as row (row)}
				<div role="row" class="grid grid-cols-4 justify-items-center">
					{#each monthGrid.slice(row * MONTH_GRID_COLUMNS, row * MONTH_GRID_COLUMNS + MONTH_GRID_COLUMNS) as cell (cell.month)}
						{@const selected = isSelected(cell.date)}
						{@const isCellCurrentMonth = sameUnit(cell.date, today(getLocalTimeZone()))}
						{@const disabled = isDisabled(cell.date)}
						{@const inRange = isInRange(cell.date)}
						<CalendarDay
							data-date={cell.date.toString()}
							aria-label={monthLongFormatter.format(cell.date.toDate(getLocalTimeZone()))}
							{selected}
							today={isCellCurrentMonth}
							{disabled}
							{inRange}
							tabIndex={cell.month === focusedDate.month ? 0 : -1}
							class={cn('w-16', classes?.day)}
							onclick={() => selectDate(cell.date)}
						>
							{monthShortFormatter.format(cell.date.toDate(getLocalTimeZone()))}
						</CalendarDay>
					{/each}
				</div>
			{/each}
		{:else}
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
		{/if}
	</div>
</div>
