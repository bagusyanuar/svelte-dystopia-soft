<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { CalendarDate } from '@internationalized/date';
	import Calendar from './Calendar.svelte';

	const componentDescription = [
		'Komponen kalender interaktif dengan arsitektur **Semi-Headless** dan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Mendukung pemilihan tanggal tunggal (*single*) maupun rentang (*range*), navigasi keyboard 2D (roving tabindex), serta 3 mode granularitas (*day*, *month*, *year*).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Dual DOM Refs (`ref` & `gridRef`)**: Mendukung binding `ref = $bindable(null)` ke elemen root wrapper `<div>` dan `gridRef = $bindable(null)` ke container grid ber-role `grid` untuk kontrol fokus atau pengukuran layout.',
		'- **Data Attributes & State Introspection**: Mengekspos `data-slot` pada seluruh sub-bagian (`calendar`, `calendar-header`, `calendar-prev-button`, `calendar-next-button`, `calendar-heading`, `calendar-grid`, `calendar-weekdays`, `calendar-weekday`, `calendar-row`, `calendar-day`), serta state introspeksi seperti `data-type="single|range"`, `data-granularity="day|month|year"`, `data-selected`, `data-disabled`, `data-outside-month`, `data-in-range`, dan `data-today`.',
		'- **Styling Sub-bagian Fleksibel (`classes`)**: Mendukung prop terstruktur `classes` untuk mengkustomisasi setiap bagian: `header`, `previousButton`, `nextButton`, `heading`, `weekdays`, `weekday`, `row`, `grid`, dan `day`.',
		'- **Snippet Dekoratif & Konten**: Menyediakan snippet `previousIcon`, `nextIcon`, dan `headingSnippet` untuk mengganti ikon navigasi dan tata letak judul kalender, serta snippet `day` untuk kustomisasi total sel tanggal.',
		'- **Aksesibilitas Standar WAI-ARIA Grid**: Grid 2D dengan role `grid`, `row`, `columnheader`, dan `gridcell`, mendukung navigasi panah keyboard dan pembaca layar.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Calendar',
		component: Calendar,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		}
	});
</script>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { isSameDay } from '@internationalized/date';

	let scheduleMonth = $state(new CalendarDate(2026, 10, 1));
	let scheduleSelectedDate = $state<CalendarDate | undefined>(new CalendarDate(2026, 10, 12));
	const scheduleTabs = ['Day', 'Week', 'Month', 'Year'] as const;
	type ScheduleTab = (typeof scheduleTabs)[number];
	let scheduleTab = $state<ScheduleTab>('Month');

	const monthShortNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const monthFullNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const scheduleEvents: Record<string, Array<{ title: string }>> = {
		'10-1': [{ title: 'Hari Kesaktian Pancasila' }],
		'10-2': [{ title: 'Hari Batik Nasional' }],
		'10-28': [{ title: 'Hari Sumpah Pemuda' }]
	};
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

<Story name="Month only" asChild>
	<Calendar granularity="month" value={new CalendarDate(2024, 3, 1)} />
</Story>

<Story name="Year only" asChild>
	<Calendar granularity="year" value={new CalendarDate(2024, 1, 1)} />
</Story>

<Story name="Semi-headless customization" asChild>
	<div class="max-w-xs rounded-xl border border-border bg-surface p-4 shadow-xs">
		<Calendar
			class="w-full"
			value={new CalendarDate(2024, 3, 15)}
			classes={{
				header: 'bg-surface-subtle p-2 rounded-lg border border-border-subtle mb-3',
				heading: 'font-semibold text-primary',
				previousButton: 'hover:bg-primary/10 hover:text-primary rounded-md transition-colors',
				nextButton: 'hover:bg-primary/10 hover:text-primary rounded-md transition-colors',
				grid: 'gap-2',
				weekday: 'text-foreground-soft font-semibold uppercase text-[10px]'
			}}
		>
			{#snippet previousIcon()}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					class="size-3.5"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
			{/snippet}
			{#snippet nextIcon()}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					class="size-3.5"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			{/snippet}
			{#snippet headingSnippet({ heading })}
				<span class="text-xs font-bold tracking-wider text-primary uppercase">
					{heading}
				</span>
			{/snippet}
		</Calendar>
	</div>
</Story>

<Story name="Full-month schedule view" asChild>
	<div
		class="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-lg"
	>
		<!-- macOS window toolbar -->
		<div
			class="flex items-center justify-between border-b border-border bg-surface-subtle/50 px-4 py-3"
		>
			<!-- Traffic light buttons & action icons -->
			<div class="flex items-center gap-2">
				<div class="size-3 rounded-full bg-[#FF5F56]"></div>
				<div class="size-3 rounded-full bg-[#FFBD2E]"></div>
				<div class="size-3 rounded-full bg-[#27C93F]"></div>

				<div class="ml-4 flex items-center gap-1 text-foreground-soft">
					<button
						type="button"
						class="rounded p-1 transition-colors hover:bg-surface-subtle hover:text-foreground"
						aria-label="Calendar view"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
						>
							<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
							<line x1="16" x2="16" y1="2" y2="6" />
							<line x1="8" x2="8" y1="2" y2="6" />
							<line x1="3" x2="21" y1="10" y2="10" />
						</svg>
					</button>
					<button
						type="button"
						class="rounded p-1 transition-colors hover:bg-surface-subtle hover:text-foreground"
						aria-label="Inbox"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
						>
							<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
							<path
								d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
							/>
						</svg>
					</button>
					<button
						type="button"
						class="rounded p-1 transition-colors hover:bg-surface-subtle hover:text-foreground"
						aria-label="Add event"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Center segmented control: Day | Week | Month | Year -->
			<div
				class="flex items-center rounded-lg border border-border bg-surface p-0.5 text-xs font-medium"
			>
				{#each scheduleTabs as tab (tab)}
					<button
						type="button"
						class={cn(
							'rounded-md px-2.5 py-1 transition-colors',
							scheduleTab === tab
								? 'bg-surface-subtle font-semibold text-foreground shadow-xs'
								: 'text-foreground-subtle hover:text-foreground'
						)}
						onclick={() => (scheduleTab = tab)}
					>
						{tab}
					</button>
				{/each}
			</div>

			<!-- Search icon -->
			<div class="flex items-center">
				<button
					type="button"
					class="rounded-md p-1.5 text-foreground-soft transition-colors hover:bg-surface-subtle hover:text-foreground"
					aria-label="Search"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-4"
					>
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Sub-header bar -->
		<div class="flex items-center justify-between px-6 py-4">
			<h2 class="text-2xl font-bold tracking-tight text-foreground">
				{monthFullNames[scheduleMonth.month - 1]}
				<span class="font-normal text-foreground-soft">{scheduleMonth.year}</span>
			</h2>

			<div class="flex items-center gap-1.5">
				<button
					type="button"
					class="inline-flex size-7 items-center justify-center rounded-md text-foreground-soft transition-colors hover:bg-surface-subtle hover:text-foreground"
					onclick={() => (scheduleMonth = scheduleMonth.subtract({ months: 1 }))}
					aria-label="Previous month"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-4"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>
				<button
					type="button"
					class="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-surface-subtle"
					onclick={() => (scheduleMonth = new CalendarDate(2026, 10, 1))}
				>
					Today
				</button>
				<button
					type="button"
					class="inline-flex size-7 items-center justify-center rounded-md text-foreground-soft transition-colors hover:bg-surface-subtle hover:text-foreground"
					onclick={() => (scheduleMonth = scheduleMonth.add({ months: 1 }))}
					aria-label="Next month"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-4"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Calendar schedule table -->
		{#key scheduleMonth.toString()}
			<Calendar
				class="w-full"
				defaultMonth={scheduleMonth}
				classes={{
					header: 'hidden',
					grid: 'w-full outline-none border-t border-border',
					weekdays:
						'grid-cols-7 justify-items-stretch divide-x divide-border border-b border-border bg-surface',
					weekday: 'w-full h-auto py-2.5 text-center text-xs font-medium text-foreground-subtle',
					row: 'grid-cols-7 justify-items-stretch divide-x divide-border border-b border-border last:border-b-0'
				}}
			>
				{#snippet day({ date, outsideMonth })}
					{@const isTargetToday = date.year === 2026 && date.month === 10 && date.day === 12}
					{@const dateKey = `${date.month}-${date.day}`}
					{@const cellEvents = scheduleEvents[dateKey] ?? []}
					{@const isSelectedDate = scheduleSelectedDate && isSameDay(date, scheduleSelectedDate)}
					<button
						type="button"
						role="gridcell"
						tabindex={0}
						aria-selected={isSelectedDate}
						class={cn(
							'group relative flex min-h-23 w-full flex-col justify-between p-2 text-left transition-colors outline-none',
							outsideMonth
								? 'bg-surface-subtle/30 text-foreground-muted'
								: 'bg-surface text-foreground hover:bg-surface-subtle/50',
							isSelectedDate && 'ring-1 ring-primary ring-inset'
						)}
						onclick={() => (scheduleSelectedDate = date)}
					>
						<div class="flex w-full items-center justify-end gap-1">
							{#if date.day === 1}
								<span
									class={cn(
										'text-xs font-semibold',
										outsideMonth ? 'text-foreground-muted' : 'text-foreground'
									)}
								>
									1 {monthShortNames[date.month - 1]}
								</span>
							{:else if isTargetToday}
								<span
									class="flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow-xs"
								>
									{date.day}
								</span>
							{:else}
								<span
									class={cn(
										'text-xs font-medium',
										outsideMonth
											? 'text-foreground-muted'
											: 'text-foreground-soft group-hover:text-foreground'
									)}
								>
									{date.day}
								</span>
							{/if}
						</div>

						<div class="mt-1 flex w-full flex-col gap-1 overflow-hidden">
							{#each cellEvents as event (event.title)}
								<div
									class="flex items-center gap-1 truncate rounded border border-fuchsia-300 bg-fuchsia-100 px-1.5 py-0.5 text-[11px] font-medium text-fuchsia-900 shadow-xs dark:border-fuchsia-800/60 dark:bg-fuchsia-950/80 dark:text-fuchsia-100"
								>
									<span class="text-[9px] text-fuchsia-700 dark:text-fuchsia-300">★</span>
									<span class="truncate">{event.title}</span>
								</div>
							{/each}
						</div>
					</button>
				{/snippet}
			</Calendar>
		{/key}
	</div>
</Story>
