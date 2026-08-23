<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import Calendar from './Calendar.svelte';

	let value = $state<CalendarDate | undefined>(new CalendarDate(2024, 3, 1));
</script>

<Calendar bind:value />
<output data-testid="outer-value">{value?.toString() ?? ''}</output>
