<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { badgeVariants } from './Badge.variants.js';
	import type { BadgeProps, BadgeVariant } from './Badge.types.js';

	let {
		variant = 'default',
		size = 'md',
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: BadgeProps = $props();

	let resolvedVariant = $derived<BadgeVariant>(variant ?? 'default');
</script>

<span
	bind:this={ref}
	data-variant={resolvedVariant}
	data-size={size ?? 'md'}
	class={cn(badgeVariants({ variant: resolvedVariant, size }), className)}
	{...restProps}
>
	{@render children?.({ variant: resolvedVariant })}
</span>
