<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { progressCircleVariants } from './ProgressCircle.variants.js';
	import type { ProgressCircleProps, ProgressCircleSize } from './ProgressCircle.types.js';

	const SIZE_MAP: Record<ProgressCircleSize, { diameter: number; strokeWidth: number }> = {
		xs: { diameter: 24, strokeWidth: 2.5 },
		sm: { diameter: 32, strokeWidth: 3 },
		md: { diameter: 48, strokeWidth: 4 },
		lg: { diameter: 64, strokeWidth: 5 },
		xl: { diameter: 80, strokeWidth: 6 }
	};

	let {
		size = 'md',
		strokeWidth: customStrokeWidth,
		class: className,
		classes,
		value = 0,
		max = 100,
		indeterminate = false,
		animated = false,
		ref = $bindable(null),
		svgRef = $bindable(null),
		trackRef = $bindable(null),
		indicatorRef = $bindable(null),
		children,
		...restProps
	}: ProgressCircleProps = $props();

	let mounted = $state(false);

	$effect(() => {
		if (!animated) {
			mounted = true;
			return;
		}
		const raf = requestAnimationFrame(() => {
			mounted = true;
		});
		return () => cancelAnimationFrame(raf);
	});

	const isPredefinedSize = $derived(typeof size === 'string' && size in SIZE_MAP);
	const diameter = $derived(
		isPredefinedSize
			? SIZE_MAP[size as ProgressCircleSize].diameter
			: typeof size === 'number'
				? size
				: 48
	);

	const computedStrokeWidth = $derived(
		customStrokeWidth !== undefined
			? customStrokeWidth
			: isPredefinedSize
				? SIZE_MAP[size as ProgressCircleSize].strokeWidth
				: Math.max(2, Math.round(diameter / 12))
	);

	const radius = $derived((diameter - computedStrokeWidth) / 2);
	const center = $derived(diameter / 2);
	const circumference = $derived(2 * Math.PI * radius);

	const effectiveValue = $derived(animated && !mounted ? 0 : value);
	const percentage = $derived(Math.min(100, Math.max(0, (effectiveValue / max) * 100)));
	const strokeDashoffset = $derived(
		indeterminate ? circumference * 0.75 : circumference - (percentage / 100) * circumference
	);

	const progressState = $derived(
		indeterminate ? 'indeterminate' : percentage >= 100 ? 'complete' : 'loading'
	);
	const snippetPayload = $derived({ value, max, percentage, indeterminate });
</script>

<div
	bind:this={ref}
	role="progressbar"
	aria-valuenow={indeterminate ? undefined : value}
	aria-valuemin={0}
	aria-valuemax={max}
	data-slot="progress-circle"
	data-state={progressState}
	data-value={indeterminate ? undefined : value}
	data-max={max}
	data-indeterminate={indeterminate ? '' : undefined}
	data-animated={animated ? '' : undefined}
	class={cn(
		isPredefinedSize ? progressCircleVariants({ size: size as ProgressCircleSize }) : '',
		className,
		classes?.root
	)}
	style={!isPredefinedSize ? `width: ${diameter}px; height: ${diameter}px;` : undefined}
	{...restProps}
>
	<svg
		bind:this={svgRef}
		viewBox="0 0 {diameter} {diameter}"
		width={diameter}
		height={diameter}
		aria-hidden="true"
		class={cn('size-full', indeterminate && 'animate-spin [animation-duration:1s]', classes?.svg)}
	>
		<!-- Background track circle -->
		<circle
			bind:this={trackRef}
			data-slot="progress-circle-track"
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke-width={computedStrokeWidth}
			class={cn('stroke-border transition-colors', classes?.track)}
		/>

		<!-- Foreground progress indicator circle -->
		<circle
			bind:this={indicatorRef}
			data-slot="progress-circle-indicator"
			data-state={progressState}
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke-width={computedStrokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={strokeDashoffset}
			transform="rotate(-90 {center} {center})"
			class={cn(
				'stroke-primary transition-[stroke-dashoffset] duration-700 ease-out',
				classes?.indicator,
				classes?.fill
			)}
		/>
	</svg>

	{#if children}
		<div
			data-slot="progress-circle-content"
			class={cn(
				'pointer-events-none absolute inset-0 flex items-center justify-center',
				classes?.content
			)}
		>
			{@render children(snippetPayload)}
		</div>
	{/if}
</div>
