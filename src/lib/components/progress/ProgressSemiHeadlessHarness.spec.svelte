<script lang="ts">
	import Progress from './Progress.svelte';
	import type { ProgressClasses, ProgressSnippetPayload } from './Progress.types.js';

	interface Props {
		value?: number;
		max?: number;
		indeterminate?: boolean;
		classes?: ProgressClasses;
		class?: string;
		customIndicator?: boolean;
		customChildren?: boolean;
		[key: string]: unknown;
	}

	let {
		value = 40,
		max = 100,
		indeterminate = false,
		classes,
		class: className,
		customIndicator = false,
		customChildren = false,
		...restProps
	}: Props = $props();

	let rootRef = $state<HTMLDivElement | null>(null);
	let fillRef = $state<HTMLDivElement | null>(null);
</script>

{#snippet customIndicatorSnippet(payload: ProgressSnippetPayload)}
	<div
		data-testid="custom-indicator"
		data-pct={payload.percentage}
		data-val={payload.value}
		data-max={payload.max}
		data-indet={payload.indeterminate}
	>
		Custom Indicator: {payload.percentage}%
	</div>
{/snippet}

{#snippet customChildrenSnippet(payload: ProgressSnippetPayload)}
	<span data-testid="custom-children" data-percentage={payload.percentage}>
		Progress: {payload.percentage}%
	</span>
{/snippet}

<div data-testid="ref-status" data-has-root={rootRef !== null} data-has-fill={fillRef !== null}>
	<Progress
		bind:ref={rootRef}
		bind:fillRef
		{value}
		{max}
		{indeterminate}
		{classes}
		class={className}
		aria-label="Progress harness"
		indicator={customIndicator ? customIndicatorSnippet : undefined}
		children={customChildren ? customChildrenSnippet : undefined}
		{...restProps}
	/>
</div>
