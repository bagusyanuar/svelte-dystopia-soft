<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { CalendarDate } from '@internationalized/date';
	import DatePicker from './DatePicker.svelte';

	const { Story } = defineMeta({
		title: 'Components/DatePicker',
		component: DatePicker,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="w-72">
		<DatePicker defaultMonth={new CalendarDate(2024, 3, 1)} />
	</div>
</Story>

<Story name="With initial value" asChild>
	<div class="w-72">
		<DatePicker value={new CalendarDate(2024, 3, 15)} />
	</div>
</Story>

<Story name="Range" asChild>
	<div class="w-72">
		<DatePicker
			type="range"
			value={{ start: new CalendarDate(2024, 3, 10), end: new CalendarDate(2024, 3, 18) }}
		/>
	</div>
</Story>

<Story name="Disabled dates" asChild>
	<div class="w-72">
		<DatePicker
			defaultMonth={new CalendarDate(2024, 3, 1)}
			minValue={new CalendarDate(2024, 3, 10)}
			maxValue={new CalendarDate(2024, 3, 25)}
		/>
	</div>
</Story>

<Story name="Invalid" asChild>
	<div class="w-72">
		<DatePicker defaultMonth={new CalendarDate(2024, 3, 1)} invalid />
	</div>
</Story>

<Story name="Disabled" asChild>
	<div class="w-72">
		<DatePicker value={new CalendarDate(2024, 3, 15)} disabled />
	</div>
</Story>

<Story name="Localized labels" asChild>
	<div class="w-72">
		<DatePicker
			defaultMonth={new CalendarDate(2024, 3, 1)}
			locale="id-ID"
			labels={{
				placeholder: 'Pilih tanggal',
				previousMonth: 'Bulan sebelumnya',
				nextMonth: 'Bulan berikutnya'
			}}
		/>
	</div>
</Story>
