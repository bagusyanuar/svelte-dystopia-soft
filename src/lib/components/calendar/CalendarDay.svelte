<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { calendarDayVariants } from './CalendarDay.variants.js';
	import type { CalendarDayProps } from './CalendarDay.types.js';

	let {
		ref = $bindable(null),
		class: className,
		selected = false,
		today = false,
		outsideMonth = false,
		inRange = false,
		disabled = false,
		tabIndex = -1,
		children,
		...restProps
	}: CalendarDayProps = $props();
</script>

<button
	bind:this={ref}
	type="button"
	role="gridcell"
	tabindex={tabIndex}
	aria-selected={selected}
	aria-disabled={disabled || undefined}
	data-slot="calendar-day"
	data-selected={selected ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	data-outside-month={outsideMonth ? '' : undefined}
	data-in-range={inRange ? '' : undefined}
	data-today={today ? '' : undefined}
	class={cn(calendarDayVariants({ selected, today, outsideMonth, inRange }), className)}
	{...restProps}
>
	{@render children()}
</button>
