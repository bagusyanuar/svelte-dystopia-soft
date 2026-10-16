<script lang="ts">
	import ProgressCircle from './ProgressCircle.svelte';
	import type { ProgressCircleClasses, ProgressCircleSize } from './ProgressCircle.types.js';

	interface Props {
		value?: number;
		max?: number;
		size?: ProgressCircleSize | number;
		strokeWidth?: number;
		indeterminate?: boolean;
		classes?: ProgressCircleClasses;
		class?: string;
		customChildren?: boolean;
		[key: string]: unknown;
	}

	let {
		value = 40,
		max = 100,
		size = 'md',
		strokeWidth,
		indeterminate = false,
		classes,
		class: className,
		customChildren = false,
		...restProps
	}: Props = $props();

	let rootRef = $state<HTMLDivElement | null>(null);
	let svgRef = $state<SVGSVGElement | null>(null);
	let trackRef = $state<SVGCircleElement | null>(null);
	let indicatorRef = $state<SVGCircleElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef !== null}
	data-has-svg={svgRef !== null}
	data-has-track={trackRef !== null}
	data-has-indicator={indicatorRef !== null}
>
	<ProgressCircle
		bind:ref={rootRef}
		bind:svgRef
		bind:trackRef
		bind:indicatorRef
		{value}
		{max}
		{size}
		{strokeWidth}
		{indeterminate}
		{classes}
		class={className}
		aria-label="Circle harness"
		{...restProps}
	>
		{#snippet children(payload)}
			{#if customChildren}
				<span data-testid="custom-center-text">
					{payload.percentage}%
				</span>
			{/if}
		{/snippet}
	</ProgressCircle>
</div>
