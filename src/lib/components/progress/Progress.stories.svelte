<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Progress from './Progress.svelte';
	import type { ProgressProps } from './Progress.types.js';

	type ProgressStoryArgs = Pick<ProgressProps, 'value' | 'max' | 'size' | 'indeterminate'>;

	const componentDescription = [
		'Komponen indikator kemajuan (Progress bar) dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memvisualisasikan kemajuan proses deterministik (persentase) maupun indeterministik (animasi berulang).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Multi DOM Element Refs**: Mendukung `bind:ref` (kontainer track) serta `bind:fillRef` (bar pengisi visual di dalam).',
		'- **Granular Styling (`classes`)**: Mendukung kustomisasi sub-bagian `classes.root` dan `classes.fill` (atau `classes.indicator`), serta prop utama `class`.',
		'- **State via Data-Attributes**: Mengekspos hook styling `data-slot="progress"`, `data-slot="progress-fill"`, `data-state="loading" | "complete" | "indeterminate"`, `data-value`, `data-max`, dan `data-indeterminate`.',
		'- **Custom Indicator Snippet**: Mendukung snippet `indicator` untuk menggantikan bar bawaan dengan visual kustom (misal: segmented progress, striped gradient) dengan payload lengkap `{ value, max, percentage, indeterminate }`.',
		'- **Aksesibilitas Teruji**: Mengikuti spesifikasi WAI-ARIA `role="progressbar"` dengan penanganan dinamis `aria-valuenow`, `aria-valuemin`, dan `aria-valuemax`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Progress',
		component: Progress,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		args: { 'aria-label': 'Upload progress' },
		argTypes: {
			value: { control: { type: 'range', min: 0, max: 100 } },
			max: { control: 'number' },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
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

<Story name="Default" args={{ value: 40 }}>
	{#snippet template(args: ProgressStoryArgs)}
		<div class="w-72">
			<Progress {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Complete" args={{ value: 100 }}>
	{#snippet template(args: ProgressStoryArgs)}
		<div class="w-72">
			<Progress {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Indeterminate" args={{ indeterminate: true }}>
	{#snippet template(args: ProgressStoryArgs)}
		<div class="w-72">
			<Progress {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-4">
		<Progress size="sm" value={40} aria-label="Small" />
		<Progress size="md" value={40} aria-label="Medium" />
		<Progress size="lg" value={40} aria-label="Large" />
	</div>
</Story>

<Story name="With a label" asChild>
	<div class="flex w-72 flex-col gap-1.5">
		<div class="flex items-center justify-between text-sm text-foreground-soft">
			<span>Uploading…</span>
			<span>66%</span>
		</div>
		<Progress value={66} aria-label="Upload progress" />
	</div>
</Story>

<Story name="Custom sub-parts styling" asChild>
	<div class="flex w-72 flex-col gap-4">
		<div class="space-y-1.5">
			<span class="text-xs font-medium text-foreground-muted">Emerald Gradient Fill</span>
			<Progress
				value={78}
				aria-label="Storage quota"
				classes={{
					root: 'bg-surface-subtle border border-border shadow-inner',
					fill: 'bg-gradient-to-r from-emerald-500 to-teal-400'
				}}
			/>
		</div>
		<div class="space-y-1.5">
			<span class="text-xs font-medium text-foreground-muted">Amber Alert Fill</span>
			<Progress
				value={92}
				aria-label="Memory limit"
				classes={{
					root: 'bg-amber-950/20',
					fill: 'bg-amber-500'
				}}
			/>
		</div>
	</div>
</Story>

<Story name="Custom indicator snippet (Segmented)" asChild>
	<div class="flex w-80 flex-col gap-2">
		<div class="flex items-center justify-between text-xs text-foreground-muted">
			<span>Segmented Step Progress (Step 3/5)</span>
			<span class="font-mono">60%</span>
		</div>
		<Progress value={3} max={5} class="h-2.5 bg-transparent" aria-label="Step progress">
			{#snippet indicator({ value, max })}
				<div class="flex h-full w-full gap-1.5">
					{#each Array.from({ length: max }, (_, index) => index) as idx (idx)}
						<div
							class="h-full flex-1 rounded-sm transition-colors duration-200 {idx < value
								? 'bg-primary'
								: 'bg-border'}"
						></div>
					{/each}
				</div>
			{/snippet}
		</Progress>
	</div>
</Story>

<Story name="Animated on mount" asChild>
	<div class="flex w-80 flex-col items-center gap-6 p-8">
		{#key animKey}
			<div class="w-full space-y-4">
				<div class="space-y-1.5">
					<div class="flex justify-between text-xs text-foreground-muted">
						<span>Upload Progress</span>
						<span class="font-mono">75%</span>
					</div>
					<Progress animated value={75} aria-label="Upload animated" />
				</div>

				<div class="space-y-1.5">
					<div class="flex justify-between text-xs text-foreground-muted">
						<span>Storage Synced</span>
						<span class="font-mono">100%</span>
					</div>
					<Progress
						animated
						value={100}
						aria-label="Synced animated"
						classes={{ fill: 'bg-emerald-500' }}
					/>
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
