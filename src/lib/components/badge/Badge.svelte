<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { badgeVariants } from './Badge.variants.js';
	import type { BadgeProps } from './Badge.types.js';

	let { variant, class: className, children, ...restProps }: BadgeProps = $props();
</script>

<span class={cn(badgeVariants({ variant }), className)} {...restProps}>
	{@render children()}
</span>
