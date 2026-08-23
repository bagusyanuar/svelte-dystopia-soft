<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { CalendarDate } from '@internationalized/date';
	import Calendar from './Calendar.svelte';

	const { Story } = defineMeta({
		title: 'Components/Calendar',
		component: Calendar,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<Calendar value={new CalendarDate(2024, 3, 15)} />
</Story>

<Story name="No initial selection" asChild>
	<Calendar defaultMonth={new CalendarDate(2024, 3, 1)} />
</Story>

<Story name="Disabled dates" asChild>
	<Calendar
		value={new CalendarDate(2024, 3, 15)}
		minValue={new CalendarDate(2024, 3, 10)}
		maxValue={new CalendarDate(2024, 3, 25)}
	/>
</Story>

<Story name="Range" asChild>
	<Calendar
		type="range"
		value={{ start: new CalendarDate(2024, 3, 10), end: new CalendarDate(2024, 3, 18) }}
	/>
</Story>

<Story name="Custom day content" asChild>
	<Calendar defaultMonth={new CalendarDate(2024, 3, 1)}>
		{#snippet day({ date, selected, disabled })}
			<div
				role="gridcell"
				aria-selected={selected}
				class="relative inline-flex size-8 items-center justify-center rounded-md text-sm leading-snug text-foreground-soft"
			>
				{date.day}
				{#if date.day % 5 === 0 && !disabled}
					<span class="absolute bottom-1 size-1 rounded-full bg-primary"></span>
				{/if}
			</div>
		{/snippet}
	</Calendar>
</Story>

<Story name="Localized labels" asChild>
	<Calendar
		value={new CalendarDate(2024, 3, 15)}
		locale="id-ID"
		labels={{ previousMonth: 'Bulan sebelumnya', nextMonth: 'Bulan berikutnya' }}
	/>
</Story>
