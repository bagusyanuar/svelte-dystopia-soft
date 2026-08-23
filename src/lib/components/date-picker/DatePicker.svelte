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
		classes,
		locale,
		defaultMonth,
		minValue,
		maxValue,
		isDateDisabled,
		labels,
		disabled = false,
		invalid = false,
		portalTarget,
		onValueChange,
		...restProps
	}: DatePickerProps = $props();

	const baseId = $props.id();
	const ids = createIds(baseId, 'content');

	let open = $state(false);
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);

	const presence = createPresence(
		() => open,
		() => contentEl
	);

	const resolvedLocale = $derived(
		locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
	);
	const formatter = $derived(new DateFormatter(resolvedLocale, { dateStyle: 'medium' }));

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

	function close(): void {
		open = false;
	}

	function closeAndFocusTrigger(): void {
		close();
		triggerEl?.focus();
	}

	function toggleOpen(): void {
		if (!disabled) open = !open;
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

		// `contentEl` is itself tracked $state, so reading it makes this effect
		// re-run once the portalled panel actually mounts — see Combobox.svelte
		// for the same pattern.
		if (!contentEl) return;

		tick().then(() => {
			contentEl?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus();
		});

		return createDismissableLayer(() => [triggerEl, contentEl], {
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
		'data-invalid': invalid ? '' : undefined,
		'data-disabled': disabled ? '' : undefined,
		onclick: toggleOpen,
		onkeydown: handleTriggerKeydown
	});
</script>

<div class={cn('inline-block', className)}>
	<button
		bind:this={triggerEl}
		{...triggerProps}
		class={cn(
			'flex h-10 w-full cursor-pointer items-center gap-tight rounded-md border border-border bg-surface px-3 text-left text-sm leading-snug text-foreground-soft transition-colors duration-150 hover:border-border-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[invalid]:border-danger-border data-[invalid]:focus-visible:ring-danger',
			classes?.trigger
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
			class="size-4 shrink-0 text-foreground-faint"
		>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" />
		</svg>
		<span class={cn('flex-1 truncate', !formattedValue && 'text-foreground-faint')}>
			{formattedValue ?? labels?.placeholder ?? 'Select date'}
		</span>
	</button>

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
		bind:this={contentEl}
		id={ids.content}
		data-slot="date-picker-content"
		data-state={open ? 'open' : 'closed'}
		inert={!open}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerEl, placement: 'bottom-start', offset: 6 }}
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
				{defaultMonth}
				{minValue}
				{maxValue}
				{isDateDisabled}
				labels={{ previousMonth: labels?.previousMonth, nextMonth: labels?.nextMonth }}
				onValueChange={handleRangeValueChange}
			/>
		{:else}
			<Calendar
				value={value as CalendarDate | undefined}
				locale={resolvedLocale}
				{defaultMonth}
				{minValue}
				{maxValue}
				{isDateDisabled}
				labels={{ previousMonth: labels?.previousMonth, nextMonth: labels?.nextMonth }}
				onValueChange={handleSingleValueChange}
			/>
		{/if}
	</div>
{/if}
