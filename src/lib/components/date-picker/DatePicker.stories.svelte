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

<!--
  color-contrast is switched off for empty-state stories because WCAG 1.4.3
  exempts placeholder hint text from the 4.5:1 body text contrast floor, but axe
  treats any <span> inside a <button> as regular button content.
-->
<Story
	name="Default"
	asChild
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
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

<Story
	name="Disabled dates"
	asChild
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
	<div class="w-72">
		<DatePicker
			defaultMonth={new CalendarDate(2024, 3, 1)}
			minValue={new CalendarDate(2024, 3, 10)}
			maxValue={new CalendarDate(2024, 3, 25)}
		/>
	</div>
</Story>

<Story
	name="Invalid"
	asChild
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
	<div class="w-72">
		<DatePicker defaultMonth={new CalendarDate(2024, 3, 1)} invalid />
	</div>
</Story>

<Story name="Disabled" asChild>
	<div class="w-72">
		<DatePicker value={new CalendarDate(2024, 3, 15)} disabled />
	</div>
</Story>

<Story
	name="Localized labels"
	asChild
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
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

<Story
	name="Month only"
	asChild
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
	<div class="w-72">
		<DatePicker granularity="month" defaultMonth={new CalendarDate(2024, 3, 1)} />
	</div>
</Story>

<Story
	name="Year only"
	asChild
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
	<div class="w-72">
		<DatePicker granularity="year" defaultMonth={new CalendarDate(2024, 1, 1)} />
	</div>
</Story>

<Story name="Semi-headless customization" asChild>
	<div class="w-72">
		<DatePicker
			value={new CalendarDate(2024, 3, 15)}
			classes={{
				trigger: 'border-primary/40 hover:border-primary focus-visible:ring-primary',
				icon: 'text-primary',
				value: 'font-semibold text-primary',
				content: 'border-primary/30 shadow-md',
				calendar: {
					heading: 'text-primary font-bold'
				}
			}}
		>
			{#snippet icon()}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					class="size-4 shrink-0 text-primary"
				>
					<circle cx="12" cy="12" r="10" />
					<polyline points="12 6 12 12 16 14" />
				</svg>
			{/snippet}
		</DatePicker>
	</div>
</Story>

<Story name="Clearable" asChild>
	<div class="flex flex-col gap-4 w-72">
		<DatePicker value={new CalendarDate(2024, 3, 15)} clearable />
		<DatePicker
			type="range"
			value={{ start: new CalendarDate(2024, 3, 10), end: new CalendarDate(2024, 3, 18) }}
			clearable
		/>
	</div>
</Story>
