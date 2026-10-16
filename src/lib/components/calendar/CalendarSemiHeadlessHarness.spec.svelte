<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import Calendar from './Calendar.svelte';
	import type { CalendarClasses } from './Calendar.types.js';

	let {
		value = $bindable(new CalendarDate(2024, 3, 15)),
		classes
	}: {
		value?: CalendarDate;
		classes?: CalendarClasses;
	} = $props();

	let rootRef = $state<HTMLDivElement | null>(null);
	let gridRef = $state<HTMLDivElement | null>(null);
</script>

<div data-testid="ref-status" data-has-root={rootRef ? 'true' : 'false'} data-has-grid={gridRef ? 'true' : 'false'}></div>

<Calendar
	bind:ref={rootRef}
	bind:gridRef
	bind:value
	{classes}
>
	{#snippet previousIcon()}
		<span data-testid="custom-prev-icon">&lt;</span>
	{/snippet}
	{#snippet nextIcon()}
		<span data-testid="custom-next-icon">&gt;</span>
	{/snippet}
	{#snippet headingSnippet({ heading, granularity })}
		<span data-testid="custom-heading">{granularity}: {heading}</span>
	{/snippet}
</Calendar>
