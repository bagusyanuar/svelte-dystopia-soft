<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { paginationLinkVariants } from './PaginationLink.variants.js';
	import type { PaginationLinkProps } from './PaginationLink.types.js';

	let {
		class: className,
		active = false,
		child,
		children,
		...restProps
	}: PaginationLinkProps = $props();

	const mergedProps = $derived({
		...restProps,
		type: 'button' as const,
		'aria-current': active ? ('page' as const) : undefined,
		'data-active': active ? '' : undefined,
		class: cn(paginationLinkVariants({ active }), className)
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children()}
	</button>
{/if}
