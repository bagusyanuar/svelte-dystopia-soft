<script lang="ts">
	import { tick } from 'svelte';
	import { type CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import { createDismissableLayer } from '../../utils/dismissable-layer.js';
	import { createIds } from '../../utils/id.js';
	import { Calendar, type CalendarRangeValue } from '../calendar/index.js';
	import type { DatePickerProps } from './DatePicker.types.js';

	let {
		type = 'single',
		value = $bindable(),
		name,
		class: className,
		ref = $bindable(null),
		triggerRef = $bindable(null),
		contentRef = $bindable(null),
		classes,
		icon,
		day,
		locale,
		granularity = 'day',
		defaultMonth,
		minValue,
		maxValue,
		isDateDisabled,
		labels,
		clearable = false,
		disabled = false,
		invalid = false,
		portalTarget,
		onValueChange,
		...restProps
	}: DatePickerProps = $props();

	const baseId = $props.id();
	const ids = createIds(baseId, 'content');

	let open = $state(false);

	const presence = createPresence(
		() => open,
		() => contentRef
	);

	const resolvedLocale = $derived(
		locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
	);
	const formatter = $derived(
		granularity === 'year'
			? new DateFormatter(resolvedLocale, { year: 'numeric' })
			: granularity === 'month'
				? new DateFormatter(resolvedLocale, { month: 'long', year: 'numeric' })
				: new DateFormatter(resolvedLocale, { dateStyle: 'medium' })
	);

	const formattedValue = $derived.by(() => {
		if (type === 'range') {
			const current = value as CalendarRangeValue | undefined;
			if (!current?.start) return undefined;
			const start = formatter.format(current.start.toDate(getLocalTimeZone()));
			if (!current.end) return start;
			return `${start} – ${formatter.format(current.end.toDate(getLocalTimeZone()))}`;
		}
		const current = value as CalendarDate | undefined;
		return current ? formatter.format(current.toDate(getLocalTimeZone())) : undefined;
	});

	const showClear = $derived(Boolean(clearable && !disabled && formattedValue));

	function close(): void {
		open = false;
	}

	function closeAndFocusTrigger(): void {
		close();
		triggerRef?.focus();
	}

	function toggleOpen(): void {
		if (!disabled) open = !open;
	}

	function handleClear(event: MouseEvent): void {
		event.stopPropagation();
		if (type === 'range') {
			const next: CalendarRangeValue = { start: undefined, end: undefined };
			value = next;
			(onValueChange as ((value: CalendarRangeValue) => void) | undefined)?.(next);
		} else {
			value = undefined;
			(onValueChange as ((value: CalendarDate | undefined) => void) | undefined)?.(undefined);
		}
	}

	// Enter/Space need no handling here — the trigger is a real `<button>`, so
	// the browser already synthesizes a `click` (→ `toggleOpen`) for both.
	// Duplicating that in keydown would toggle twice and immediately re-close.
	function handleTriggerKeydown(event: KeyboardEvent): void {
		if (!disabled && event.key === 'ArrowDown') {
			event.preventDefault();
			open = true;
		}
	}

	function handleSingleValueChange(next: CalendarDate | undefined): void {
		value = next;
		(onValueChange as ((value: CalendarDate | undefined) => void) | undefined)?.(next);
		closeAndFocusTrigger();
	}

	function handleRangeValueChange(next: CalendarRangeValue): void {
		value = next;
		(onValueChange as ((value: CalendarRangeValue) => void) | undefined)?.(next);
		if (next.end) closeAndFocusTrigger();
	}

	$effect(() => {
		if (!open) return;

		// `contentRef` is itself tracked $state, so reading it makes this effect
		// re-run once the portalled panel actually mounts — see Combobox.svelte
		// for the same pattern.
		if (!contentRef) return;

		tick().then(() => {
			contentRef?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus();
		});

		return createDismissableLayer(() => [ref, contentRef], {
			onPointerDownOutside: close,
			onEscapeKeydown: (event) => {
				event.preventDefault();
				closeAndFocusTrigger();
			}
		});
	});

	const triggerProps = $derived({
		...restProps,
		type: 'button' as const,
		disabled,
		'aria-haspopup': 'grid' as const,
		'aria-expanded': open,
		'aria-controls': ids.content,
		'aria-invalid': invalid || undefined,
		'data-state': open ? 'open' : 'closed',
		'data-invalid': invalid ? '' : undefined,
		'data-disabled': disabled ? '' : undefined,
		onclick: toggleOpen,
		onkeydown: handleTriggerKeydown
	});
</script>

<div
	bind:this={ref}
	data-slot="date-picker"
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? '' : undefined}
	data-invalid={invalid ? '' : undefined}
	data-type={type}
	data-granularity={granularity}
	class={cn('relative inline-block', className)}
>
	<button
		bind:this={triggerRef}
		{...triggerProps}
		data-slot="date-picker-trigger"
		class={cn(
			'flex h-10 w-full cursor-pointer items-center gap-tight rounded-md border border-border bg-surface px-3 text-left text-sm leading-snug text-foreground-soft transition-all duration-150 hover:border-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:hover:border-primary dark:focus-visible:ring-[3px] dark:focus-visible:ring-primary/20 data-[state=open]:border-primary data-[state=open]:ring-0 data-[state=open]:hover:border-primary dark:data-[state=open]:ring-[3px] dark:data-[state=open]:ring-primary/20 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger data-invalid:hover:border-danger data-invalid:focus-visible:border-danger dark:data-invalid:focus-visible:ring-[3px] dark:data-invalid:focus-visible:ring-danger/25 data-invalid:data-[state=open]:border-danger dark:data-invalid:data-[state=open]:ring-[3px] dark:data-invalid:data-[state=open]:ring-danger/25',
			showClear && 'pr-9',
			classes?.trigger
		)}
	>
		{#if icon}
			{@render icon()}
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class={cn('size-4 shrink-0 text-foreground-faint', classes?.icon)}
			>
				<rect x="3" y="4" width="18" height="18" rx="2" />
				<path d="M16 2v4M8 2v4M3 10h18" />
			</svg>
		{/if}
		<span
			data-slot="date-picker-value"
			class={cn(
				'flex-1 truncate',
				!formattedValue ? 'text-foreground-faint' : 'text-foreground',
				classes?.value
			)}
		>
			{formattedValue ?? labels?.placeholder ?? 'Select date'}
		</span>
	</button>

	{#if showClear}
		<button
			type="button"
			tabindex="-1"
			data-slot="date-picker-clear"
			aria-label={labels?.clear ?? 'Clear date'}
			class={cn(
				'absolute top-1/2 right-2.5 -translate-y-1/2 flex size-5 items-center justify-center rounded text-foreground-faint transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-muted focus-visible:outline-none',
				classes?.clearButton
			)}
			onclick={handleClear}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-3.5"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>
	{/if}

	{#if name}
		{#if type === 'range'}
			<input
				type="hidden"
				name={`${name}-start`}
				value={(value as CalendarRangeValue | undefined)?.start?.toString() ?? ''}
			/>
			<input
				type="hidden"
				name={`${name}-end`}
				value={(value as CalendarRangeValue | undefined)?.end?.toString() ?? ''}
			/>
		{:else}
			<input type="hidden" {name} value={(value as CalendarDate | undefined)?.toString() ?? ''} />
		{/if}
	{/if}
</div>

{#if presence.current}
	<div
		bind:this={contentRef}
		id={ids.content}
		data-slot="date-picker-content"
		data-state={open ? 'open' : 'closed'}
		inert={!open}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerRef, placement: 'bottom-start', offset: 6 }}
		class={cn(
			'z-50 rounded-lg border border-border bg-surface p-compact shadow-sm',
			classes?.content
		)}
	>
		{#if type === 'range'}
			<Calendar
				type="range"
				value={value as CalendarRangeValue | undefined}
				locale={resolvedLocale}
				{granularity}
				{defaultMonth}
				{minValue}
				{maxValue}
				{isDateDisabled}
				classes={classes?.calendar}
				{day}
				labels={{
					previousMonth: labels?.previousMonth,
					nextMonth: labels?.nextMonth,
					previousYear: labels?.previousYear,
					nextYear: labels?.nextYear,
					previousYears: labels?.previousYears,
					nextYears: labels?.nextYears
				}}
				onValueChange={handleRangeValueChange}
			/>
		{:else}
			<Calendar
				value={value as CalendarDate | undefined}
				locale={resolvedLocale}
				{granularity}
				{defaultMonth}
				{minValue}
				{maxValue}
				{isDateDisabled}
				classes={classes?.calendar}
				{day}
				labels={{
					previousMonth: labels?.previousMonth,
					nextMonth: labels?.nextMonth,
					previousYear: labels?.previousYear,
					nextYear: labels?.nextYear,
					previousYears: labels?.previousYears,
					nextYears: labels?.nextYears
				}}
				onValueChange={handleSingleValueChange}
			/>
		{/if}
	</div>
{/if}
