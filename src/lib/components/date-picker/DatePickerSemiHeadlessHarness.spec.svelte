<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import DatePicker from './DatePicker.svelte';
	import type { DatePickerClasses } from './DatePicker.types.js';

	let {
		value = $bindable(new CalendarDate(2024, 3, 15)),
		classes,
		disabled = false,
		invalid = false
	}: {
		value?: CalendarDate;
		classes?: DatePickerClasses;
		disabled?: boolean;
		invalid?: boolean;
	} = $props();

	let rootRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef ? 'true' : 'false'}
	data-has-trigger={triggerRef ? 'true' : 'false'}
	data-has-content={contentRef ? 'true' : 'false'}
></div>

<DatePicker
	bind:ref={rootRef}
	bind:triggerRef
	bind:contentRef
	bind:value
	{classes}
	{disabled}
	{invalid}
>
	{#snippet icon()}
		<span data-testid="custom-date-icon">📅</span>
	{/snippet}
	{#snippet day({ date, selected })}
		<span data-testid="custom-day-cell" data-date={date.toString()} data-selected={selected}>
			{date.day}*
		</span>
	{/snippet}
</DatePicker>
