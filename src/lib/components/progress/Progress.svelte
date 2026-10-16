<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { progressVariants } from './Progress.variants.js';
	import type { ProgressProps } from './Progress.types.js';

	let {
		size,
		class: className,
		classes,
		value = 0,
		max = 100,
		indeterminate = false,
		animated = false,
		ref = $bindable(null),
		fillRef = $bindable(null),
		indicator,
		children,
		...restProps
	}: ProgressProps = $props();

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

	const effectiveValue = $derived(animated && !mounted ? 0 : value);
	const percentage = $derived(Math.min(100, Math.max(0, (effectiveValue / max) * 100)));
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
	data-slot="progress"
	data-state={progressState}
	data-value={indeterminate ? undefined : value}
	data-max={max}
	data-indeterminate={indeterminate ? '' : undefined}
	data-animated={animated ? '' : undefined}
	class={cn(progressVariants({ size }), className, classes?.root)}
	{...restProps}
>
	{#if indicator}
		{@render indicator(snippetPayload)}
	{:else}
		<div
			bind:this={fillRef}
			data-slot="progress-fill"
			data-state={progressState}
			class={cn(
				'h-full rounded-full bg-primary transition-[width] duration-700 ease-out',
				indeterminate && 'w-1/3 animate-progress-indeterminate',
				classes?.indicator,
				classes?.fill
			)}
			style={indeterminate ? undefined : `width: ${percentage}%`}
		></div>
	{/if}
	{#if children}
		{@render children(snippetPayload)}
	{/if}
</div>
