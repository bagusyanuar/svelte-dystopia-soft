<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import DatePicker from './DatePicker.svelte';

	let value = $state<CalendarDate | undefined>(undefined);
</script>

<DatePicker defaultMonth={new CalendarDate(2024, 3, 1)} bind:value />
<output data-testid="outer-value">{value?.toString() ?? ''}</output>
