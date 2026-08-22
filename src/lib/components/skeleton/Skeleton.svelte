<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { SkeletonProps } from './Skeleton.types.js';

	let { class: className, ...restProps }: SkeletonProps = $props();
</script>

<div
	aria-hidden="true"
	class={cn('animate-pulse rounded-md bg-border', className)}
	{...restProps}
></div>
