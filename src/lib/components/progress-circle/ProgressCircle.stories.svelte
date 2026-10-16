<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProgressCircle from './ProgressCircle.svelte';
	import type { ProgressCircleProps } from './ProgressCircle.types.js';

	type ProgressCircleStoryArgs = Pick<
		ProgressCircleProps,
		'value' | 'max' | 'size' | 'strokeWidth' | 'indeterminate'
	>;

	const componentDescription = [
		'Komponen indikator kemajuan melingkar (Circular Progress / Progress Ring) berbasis SVG dengan estetika **SaaS Compact Minimalist** (Linear-inspired). Sangat ideal untuk status persentase ringkas, kuota dashboard, ring pengukur skor, atau spinning ring loader.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Multi DOM Element Refs**: Mendukung `bind:ref` (root wrapper `<div>`), `bind:svgRef` (`<svg>`), `bind:trackRef` (cincin latar belakang), dan `bind:indicatorRef` (cincin pengisi progres).',
		'- **Granular Styling (`classes`)**: Mendukung kustomisasi sub-bagian `classes.root`, `classes.svg`, `classes.track`, `classes.indicator` (atau `classes.fill`), dan `classes.content`.',
		'- **State via Data-Attributes**: Mengekspos hook styling `data-slot="progress-circle"`, `data-slot="progress-circle-track"`, `data-slot="progress-circle-indicator"`, `data-state="loading" | "complete" | "indeterminate"`, `data-value`, `data-max`, dan `data-indeterminate`.',
		'- **Center Content Snippet**: Mendukung snippet `children` yang terpusat di tengah lingkaran dengan payload `{ value, max, percentage, indeterminate }`.',
		'- **Aksesibilitas Teruji**: Mengikuti spesifikasi WAI-ARIA `role="progressbar"` dengan penanganan dinamis `aria-valuenow`, `aria-valuemin`, dan `aria-valuemax`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/ProgressCircle',
		component: ProgressCircle,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		args: { 'aria-label': 'Progress ring' },
		argTypes: {
			value: { control: { type: 'range', min: 0, max: 100 } },
			max: { control: 'number' },
			size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
			strokeWidth: { control: 'number' },
			indeterminate: { control: 'boolean' }
		}
	});
</script>

<script lang="ts">
	import Button from '../button/Button.svelte';

	let animKey = $state(0);
	function replayInitAnimation() {
		animKey += 1;
	}
</script>

<Story name="Default" args={{ value: 65, size: 'md' }}>
	{#snippet template(args: ProgressCircleStoryArgs)}
		<div class="flex items-center justify-center p-8">
			<ProgressCircle {...args} />
		</div>
	{/snippet}
</Story>

<Story name="With a label" asChild>
	<div class="flex items-center justify-center gap-8 p-8">
		<ProgressCircle value={45} size="md" aria-label="Upload progress">
			{#snippet children({ percentage })}
				<span class="text-xs font-semibold text-foreground tabular-nums">{percentage}%</span>
			{/snippet}
		</ProgressCircle>

		<ProgressCircle value={82} size="lg" aria-label="Storage capacity">
			{#snippet children({ percentage })}
				<span class="text-sm font-semibold text-foreground tabular-nums">{percentage}%</span>
			{/snippet}
		</ProgressCircle>
	</div>
</Story>

<Story name="Sizes" asChild>
	<div class="flex flex-wrap items-center justify-center gap-6 p-8">
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle size="xs" value={75} aria-label="Extra small" />
			<span class="text-xs text-foreground-muted">xs (24px)</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle size="sm" value={75} aria-label="Small" />
			<span class="text-xs text-foreground-muted">sm (32px)</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle size="md" value={75} aria-label="Medium" />
			<span class="text-xs text-foreground-muted">md (48px)</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle size="lg" value={75} aria-label="Large" />
			<span class="text-xs text-foreground-muted">lg (64px)</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle size="xl" value={75} aria-label="Extra large" />
			<span class="text-xs text-foreground-muted">xl (80px)</span>
		</div>
	</div>
</Story>

<Story name="Indeterminate" asChild>
	<div class="flex items-center justify-center gap-8 p-8">
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle indeterminate size="sm" aria-label="Loading small" />
			<span class="text-xs text-foreground-muted">Spinner sm</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle indeterminate size="md" aria-label="Loading medium" />
			<span class="text-xs text-foreground-muted">Spinner md</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle indeterminate size="lg" aria-label="Loading large" />
			<span class="text-xs text-foreground-muted">Spinner lg</span>
		</div>
	</div>
</Story>

<Story name="Semantic Colors" asChild>
	<div class="flex items-center justify-center gap-8 p-8">
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle
				value={100}
				size="lg"
				aria-label="Success status"
				classes={{
					track: 'stroke-emerald-950/20',
					indicator: 'stroke-emerald-500'
				}}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5 text-emerald-500"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</ProgressCircle>
			<span class="text-xs font-medium text-foreground">Selesai (100%)</span>
		</div>

		<div class="flex flex-col items-center gap-2">
			<ProgressCircle
				value={88}
				size="lg"
				aria-label="Warning status"
				classes={{
					track: 'stroke-amber-950/20',
					indicator: 'stroke-amber-500'
				}}
			>
				{#snippet children({ percentage })}
					<span class="text-xs font-bold text-foreground tabular-nums">{percentage}%</span>
				{/snippet}
			</ProgressCircle>
			<span class="text-xs font-medium text-foreground">Peringatan (88%)</span>
		</div>

		<div class="flex flex-col items-center gap-2">
			<ProgressCircle
				value={24}
				size="lg"
				aria-label="Danger status"
				classes={{
					track: 'stroke-danger/20',
					indicator: 'stroke-danger'
				}}
			>
				{#snippet children({ percentage })}
					<span class="text-xs font-bold text-foreground tabular-nums">{percentage}%</span>
				{/snippet}
			</ProgressCircle>
			<span class="text-xs font-medium text-foreground">Kritis (24%)</span>
		</div>
	</div>
</Story>

<Story name="Custom Thickness & Size" asChild>
	<div class="flex items-center justify-center gap-8 p-8">
		<div class="flex flex-col items-center gap-2">
			<ProgressCircle value={70} size={100} strokeWidth={3} aria-label="Thin minimalist ring">
				{#snippet children({ percentage })}
					<span class="text-base font-light text-foreground tabular-nums">{percentage}%</span>
				{/snippet}
			</ProgressCircle>
			<span class="text-xs text-foreground-muted">Thin Minimal (100px, 3px stroke)</span>
		</div>

		<div class="flex flex-col items-center gap-2">
			<ProgressCircle value={70} size={100} strokeWidth={10} aria-label="Bold ring">
				{#snippet children({ percentage })}
					<span class="text-base font-bold text-foreground tabular-nums">{percentage}%</span>
				{/snippet}
			</ProgressCircle>
			<span class="text-xs text-foreground-muted">Bold Ring (100px, 10px stroke)</span>
		</div>
	</div>
</Story>

<Story name="Animated on mount" asChild>
	<div class="flex flex-col items-center justify-center gap-6 p-8">
		{#key animKey}
			<div class="flex flex-wrap items-center justify-center gap-8">
				<div class="flex flex-col items-center gap-2">
					<ProgressCircle animated value={75} size="md" aria-label="Animated medium ring">
						{#snippet children({ percentage })}
							<span class="text-xs font-semibold text-foreground tabular-nums">{percentage}%</span>
						{/snippet}
					</ProgressCircle>
					<span class="text-xs text-foreground-muted">Medium (75%)</span>
				</div>

				<div class="flex flex-col items-center gap-2">
					<ProgressCircle
						animated
						value={92}
						size="lg"
						aria-label="Animated large ring"
						classes={{ indicator: 'stroke-emerald-500' }}
					>
						{#snippet children({ percentage })}
							<span class="text-sm font-semibold text-foreground tabular-nums">{percentage}%</span>
						{/snippet}
					</ProgressCircle>
					<span class="text-xs text-foreground-muted">Large Emerald (92%)</span>
				</div>

				<div class="flex flex-col items-center gap-2">
					<ProgressCircle
						animated
						value={100}
						size={80}
						strokeWidth={6}
						aria-label="Animated custom ring"
					>
						{#snippet children({ percentage })}
							<span class="text-sm font-bold text-foreground tabular-nums">{percentage}%</span>
						{/snippet}
					</ProgressCircle>
					<span class="text-xs text-foreground-muted">Complete (100%)</span>
				</div>
			</div>
		{/key}

		<Button variant="outline" size="sm" onclick={replayInitAnimation}>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-1.5 size-3.5"
			>
				<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
				<path d="M21 3v5h-5" />
				<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
				<path d="M8 16H3v5" />
			</svg>
			Putar Ulang Animasi (Replay)
		</Button>
	</div>
</Story>
