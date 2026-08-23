<!-- RangeHarness.spec.svelte -->
<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import Calendar from './Calendar.svelte';
	import type { CalendarRangeValue } from './Calendar.types.js';

	let value = $state<CalendarRangeValue | undefined>(undefined);
</script>

<Calendar type="range" defaultMonth={new CalendarDate(2024, 3, 1)} bind:value />
<output data-testid="outer-start">{value?.start?.toString() ?? ''}</output>
<output data-testid="outer-end">{value?.end?.toString() ?? ''}</output>
