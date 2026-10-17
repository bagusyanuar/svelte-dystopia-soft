<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { SkeletonProps } from './Skeleton.types.js';

	let { class: className, ref = $bindable(null), ...restProps }: SkeletonProps = $props();
</script>

<div
	bind:this={ref}
	aria-hidden="true"
	data-slot="skeleton"
	class={cn('animate-pulse rounded-md bg-border', className)}
	{...restProps}
></div>
